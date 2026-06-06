---
title: ARCHITECTURE — Liquid Lab on Nemoclaw (Security-First)
date: 2026-06-06
version: 2.0
status: active
---

# ARCHITECTURE — Liquid Lab on Nemoclaw

**Versão:** 2.0 (Correto e Seguro)  
**Data:** 2026-06-06  
**Infraestrutura:** NVIDIA OpenShell K3s Cluster  
**Princípio:** Security by Design, Isolation by Default

---

## Visão Geral

**Liquid Lab roda como workloads nativos dentro de `liquidlab-cluster-nemoclaw`** — um Kubernetes cluster (K3s) com policies de segurança, isolamento de rede, e audit logging automático.

```
┌─ liquidlab-cluster-nemoclaw ────────────────────────┐
│  (NVIDIA OpenShell K3s — Verdadeiro Nemoclaw)       │
│                                                      │
│  ✓ Policies enforcement                             │
│  ✓ Network isolation (CNI)                          │
│  ✓ RBAC (Role-Based Access Control)                │
│  ✓ Resource limits (CPU, memory, disk)             │
│  ✓ Audit logging (all operations)                  │
│  ✓ Security contexts (capabilities dropped)        │
│                                                      │
│  Namespaces:                                        │
│  ├── liquid-lab (production)                        │
│  │   ├── liquid-lab-api (Next.js)                  │
│  │   ├── claude-api (Express.js wrapper)           │
│  │   ├── hermes-agent (Agent runtime)              │
│  │   └── observability (Prometheus+Grafana+Loki)   │
│  │                                                  │
│  ├── data-layer (storage tier)                      │
│  │   ├── PostgreSQL (stateful)                     │
│  │   └── Redis (cache)                             │
│  │                                                  │
│  └── kube-system (Nemoclaw internals)              │
│      ├── apiserver                                 │
│      ├── kubelet                                   │
│      └── CNI networking                            │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## Camadas de Segurança

### 1. Container Isolation
```
Cada pod tem seu próprio:
✓ Network namespace (isolado)
✓ IPC namespace (processos não veem uns aos outros)
✓ PID namespace (pid 1 local)
✓ Filesystem (rootfs + volumes)
✓ User/group (capabilities dropped)
```

### 2. Network Policies
```
Padrão: DENY ALL por default
✓ liquid-lab namespace → pode alcançar data-layer namespace
✓ data-layer namespace → pode alcançar sistema de armazenamento
✓ Nada pode sair da cluster sem policy explícita
```

### 3. RBAC (Acesso)
```
Service Accounts por microserviço:
✓ liquid-lab-api: pode ler secrets, chamar Claude API
✓ claude-api: pode ler ANTHROPIC_API_KEY
✓ hermes-agent: pode ler/write dados, chamar APIs
✓ Nenhum pode deletar ou modificar policies
```

### 4. Resource Limits
```
Cgroups automático:
✓ liquid-lab-api: 500m CPU, 512Mi RAM
✓ hermes-agent: 1 CPU, 1Gi RAM
✓ claude-api: 250m CPU, 256Mi RAM
✓ PostgreSQL: 2 CPU, 2Gi RAM
✓ Redis: 500m CPU, 512Mi RAM
```

### 5. Audit Logging
```
Cada operação logged:
✓ API calls (quem, quando, o quê)
✓ Network connections
✓ File access
✓ Secret access (ANTHROPIC_API_KEY reads)
✓ Policy violations (alertas em tempo real)
```

---

## Componentes (Kubernetes Manifests)

### liquid-lab Namespace (Workloads)

```yaml
# liquid-lab-api deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: liquid-lab-api
  namespace: liquid-lab
spec:
  replicas: 1
  template:
    spec:
      serviceAccountName: liquid-lab-api
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        fsReadOnlyRootFilesystem: true
      containers:
      - name: api
        image: liquid-lab-liquid-lab-api:latest
        ports:
        - containerPort: 3000
        env:
        - name: ANTHROPIC_API_KEY
          valueFrom:
            secretKeyRef:
              name: claude-credentials
              key: api-key
        resources:
          requests:
            cpu: 250m
            memory: 256Mi
          limits:
            cpu: 500m
            memory: 512Mi
        volumeMounts:
        - name: tmp
          mountPath: /tmp
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10

# claude-api deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: claude-api
  namespace: liquid-lab
spec:
  replicas: 1
  template:
    spec:
      serviceAccountName: claude-api
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
      containers:
      - name: wrapper
        image: liquid-lab-claude-api:latest
        ports:
        - containerPort: 3000
        env:
        - name: ANTHROPIC_API_KEY
          valueFrom:
            secretKeyRef:
              name: claude-credentials
              key: api-key
        resources:
          requests:
            cpu: 100m
            memory: 128Mi
          limits:
            cpu: 250m
            memory: 256Mi

# hermes-agent deployment (Phase 2)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hermes-agent
  namespace: liquid-lab
spec:
  replicas: 1
  template:
    spec:
      serviceAccountName: hermes-agent
      containers:
      - name: agent
        image: liquid-lab-hermes-agent:latest
        resources:
          requests:
            cpu: 500m
            memory: 512Mi
          limits:
            cpu: 1000m
            memory: 1Gi
```

### data-layer Namespace (Storage)

```yaml
# PostgreSQL StatefulSet
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
  namespace: data-layer
spec:
  serviceName: postgres
  replicas: 1
  template:
    spec:
      containers:
      - name: postgres
        image: postgres:16-alpine
        env:
        - name: POSTGRES_DB
          value: liquid_lab
        - name: POSTGRES_USER
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: username
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: password
        ports:
        - containerPort: 5432
        resources:
          requests:
            cpu: 500m
            memory: 512Mi
          limits:
            cpu: 2000m
            memory: 2Gi
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:
  - metadata:
      name: postgres-storage
    spec:
      accessModes: [ "ReadWriteOnce" ]
      resources:
        requests:
          storage: 10Gi

# Redis StatefulSet
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: redis
  namespace: data-layer
spec:
  serviceName: redis
  replicas: 1
  template:
    spec:
      containers:
      - name: redis
        image: redis:7-alpine
        ports:
        - containerPort: 6379
        resources:
          requests:
            cpu: 250m
            memory: 256Mi
          limits:
            cpu: 500m
            memory: 512Mi
        volumeMounts:
        - name: redis-storage
          mountPath: /data
  volumeClaimTemplates:
  - metadata:
      name: redis-storage
    spec:
      accessModes: [ "ReadWriteOnce" ]
      resources:
        requests:
          storage: 5Gi
```

### Network Policies

```yaml
# Default: Deny all ingress
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
  namespace: liquid-lab
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress

# Allow: liquid-lab → data-layer
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-to-data-layer
  namespace: liquid-lab
spec:
  podSelector: {}
  policyTypes:
  - Egress
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          name: data-layer
    ports:
    - protocol: TCP
      port: 5432
    - protocol: TCP
      port: 6379

# Allow: Ingress to API (port 3000)
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-api-ingress
  namespace: liquid-lab
spec:
  podSelector:
    matchLabels:
      app: liquid-lab-api
  policyTypes:
  - Ingress
  ingress:
  - from:
    - namespaceSelector: {}
    ports:
    - protocol: TCP
      port: 3000
```

---

## Deployment & Operations

### Start liquidlab-cluster-nemoclaw

```bash
# Container já está rodando, usar kubectl para gerenciar
docker exec liquidlab-cluster-nemoclaw kubectl get nodes

# Ver clusters info
docker exec liquidlab-cluster-nemoclaw kubectl cluster-info
```

### Deploy Workloads

```bash
# Criar namespaces
kubectl create namespace liquid-lab
kubectl create namespace data-layer

# Label para policies
kubectl label namespace data-layer name=data-layer

# Deploy secrets
kubectl create secret generic claude-credentials \
  --from-literal=api-key=$ANTHROPIC_API_KEY \
  -n liquid-lab

kubectl create secret generic db-credentials \
  --from-literal=username=liquid \
  --from-literal=password=$DB_PASSWORD \
  -n data-layer

# Deploy apps
kubectl apply -f manifests/liquid-lab/
kubectl apply -f manifests/data-layer/
kubectl apply -f manifests/network-policies/
```

### Monitor & Audit

```bash
# Ver pods rodando
kubectl get pods -n liquid-lab
kubectl get pods -n data-layer

# Ver logs
kubectl logs -f liquid-lab-api-xxx -n liquid-lab

# Ver audit logs
docker exec liquidlab-cluster-nemoclaw \
  tail -f /var/log/kubernetes/audit.log

# Verify policies
kubectl get networkpolicy -n liquid-lab
kubectl describe np allow-to-data-layer -n liquid-lab
```

---

## Roadmap: Transição do Docker Compose

**Docker-compose.nemoclaw.yml** (Phase 1 prototype) → **liquidlab-cluster-nemoclaw** (verdadeiro)

| Fase | Status | Serviço | Infraestrutura |
|------|--------|---------|---|
| Phase 1 | ✓ Prototipado | Docker Compose | Prototype (sem policies) |
| **Phase 1 Correto** | **→ Migração agora** | Kubernetes | **liquidlab-cluster-nemoclaw (seguro)** |
| Phase 2 | ⏳ Próximo | Hermes Agent | K3s + Policies |
| Phase 3 | ⏳ Semana 2 | Knowledge Base | K3s + RAG |

---

## Por que Nemoclaw (K3s) é a forma correta

✅ **Segurança desde o dia 1**
- Network policies by default
- RBAC automático
- Security contexts
- Audit logging

✅ **Isolamento real**
- Cada workload em seu próprio pod
- Namespaces separam dados/workloads
- Sem acesso cruzado

✅ **Escalável**
- Adiciona replicas facilmente
- Load balancing automático
- Health checks built-in

✅ **Observável**
- Metrics nativas
- Logs centralizados
- Events de toda operação

✅ **Pronto para produção**
- Deployment, scaling, updates automáticos
- Rollback zero-downtime
- Self-healing

---

## Referências

- Kubernetes Docs: https://kubernetes.io/docs/
- K3s: https://k3s.io/
- NVIDIA OpenShell: https://github.com/NVIDIA/open-shell
- Network Policies: https://kubernetes.io/docs/concepts/services-networking/network-policies/
- Security Contexts: https://kubernetes.io/docs/tasks/configure-pod-container/security-context/
- RBAC: https://kubernetes.io/docs/reference/access-authn-authz/rbac/

---

**Status:** ✓ Ativo (liquidlab-cluster-nemoclaw)  
**Próximo:** Deploy workloads para Phase 1 em K3s  
**Mantém:** Security-first, isolation-first, audit-logged

