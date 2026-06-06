---
title: Setup Liquid Lab em Nova Máquina
date: 2026-06-06
author: Pivo
---

# Setup Liquid Lab em Nova Máquina

**Tempo estimado:** 5-10 minutos  
**Requisitos:** Docker Desktop, Node.js 18+, ~8GB RAM, ~20GB disco

---

## 🚀 Início Rápido (3 passos)

### 1. Executar Setup Script

```bash
cd ~/Claude/projects/liquid-lab
chmod +x scripts/setup-new-machine.sh
./scripts/setup-new-machine.sh
```

**O que faz:**
- ✅ Verifica pré-requisitos (Docker, Node.js, Git)
- ✅ Cria `.env.local` com credenciais seguras
- ✅ Instala dependências npm de todos os serviços
- ✅ Constrói Docker images (claude-api, hermes-agent, embeddings, liquid-lab-api)
- ⏱️ Tempo: ~2 minutos

### 2. Iniciar K3s Cluster (se necessário)

```bash
docker run --name liquidlab-cluster-nemoclaw \
  -d \
  -p 8080:30051 \
  ghcr.io/nvidia/openshell/cluster:0.0.16
```

**Verificar:**
```bash
docker ps | grep liquidlab-cluster-nemoclaw
```

### 3. Deploy Services

```bash
chmod +x scripts/deploy-to-k3s.sh
./scripts/deploy-to-k3s.sh
```

**O que faz:**
- ✅ Carrega Docker images no K3s
- ✅ Copia Kubernetes manifests
- ✅ Deploy de secrets, database, services
- ✅ Aguarda pods ficarem ready (1/1)
- ⏱️ Tempo: ~2-3 minutos

---

## 🎯 Verificar Status

```bash
# Ver todos os pods
docker exec liquidlab-cluster-nemoclaw kubectl get pods -A

# Ver liquid-lab namespace
docker exec liquidlab-cluster-nemoclaw kubectl get pods -n liquid-lab

# Ver data-layer namespace
docker exec liquidlab-cluster-nemoclaw kubectl get pods -n data-layer

# Ver logs de um serviço
docker exec liquidlab-cluster-nemoclaw kubectl logs -f -n liquid-lab deployment/hermes-agent
```

---

## 📊 Infraestrutura Resultante

```
liquidlab-cluster-nemoclaw (K3s)
│
├─ liquid-lab namespace (4 pods)
│  ├─ liquid-lab-api (Next.js API)
│  ├─ claude-api (Claude API wrapper)
│  ├─ hermes-agent (Agent runtime)
│  └─ embeddings (RAG service)
│
└─ data-layer namespace (2 pods)
   ├─ postgres-0 (Database)
   └─ redis-0 (Cache)
```

---

## 🔧 Troubleshooting

### Docker daemon não está rodando
```bash
# Inicie Docker Desktop ou:
open /Applications/Docker.app
```

### K3s cluster não encontrado
```bash
# Verifique se está rodando:
docker ps | grep liquidlab-cluster-nemoclaw

# Se não estiver, crie um novo:
docker run --name liquidlab-cluster-nemoclaw \
  -d -p 8080:30051 \
  ghcr.io/nvidia/openshell/cluster:0.0.16
```

### Pods não iniciam
```bash
# Ver detalhes do erro:
docker exec liquidlab-cluster-nemoclaw \
  kubectl describe pod <pod-name> -n liquid-lab

# Ver logs:
docker exec liquidlab-cluster-nemoclaw \
  kubectl logs <pod-name> -n liquid-lab
```

### Node.js dependencies falha
```bash
# Limpe e tente novamente:
rm -rf services/*/node_modules
./scripts/setup-new-machine.sh
```

---

## 🌐 Acessar Services

Após deploy completo:

| Serviço | URL | Porta |
|---------|-----|-------|
| Liquid Lab API | http://localhost:3000 | 3000 |
| Grafana (Dashboards) | http://localhost:3100 | 3100 |
| Prometheus (Metrics) | http://localhost:9090 | 9090 |
| K3s API | https://localhost:6443 | 6443 |

---

## 📝 Environment Variables

O script cria `.env.local` automaticamente com:

```env
NODE_ENV=development
DB_USER=liquid
DB_PASSWORD=<random-generated>
DB_NAME=liquid_lab
ANTHROPIC_API_KEY=sk-ant-...
GRAFANA_PASSWORD=admin
LOG_LEVEL=info
```

**Para adicionar sua própria ANTHROPIC_API_KEY:**

```bash
# Edit .env.local
nano .env.local

# Procure por ANTHROPIC_API_KEY e substitua
ANTHROPIC_API_KEY=sk-ant-seu-chave-aqui
```

---

## 🧹 Limpeza

### Remover tudo e começar do zero

```bash
# Remover K3s cluster
docker rm -f liquidlab-cluster-nemoclaw

# Limpar images Docker
docker image rm -f liquid-lab-*:latest

# Limpar node_modules
find . -name node_modules -type d -exec rm -rf {} +

# Remover arquivo de ambiente
rm .env.local
```

---

## 📚 Próximas Etapas

### 1. Verificar se tudo está rodando
```bash
docker exec liquidlab-cluster-nemoclaw kubectl get pods -n liquid-lab
```

### 2. Ler documentação
```bash
# Arquitetura
cat docs/ARCHITECTURE-LIQUIDLAB-NEMOCLAW.md

# README geral
cat README.md
```

### 3. Testar serviços
```bash
# Health check da API
curl http://localhost:3000/health

# Health check do Agent
docker exec liquidlab-cluster-nemoclaw \
  kubectl exec -it -n liquid-lab deployment/hermes-agent \
  -- curl http://localhost:3001/health
```

---

## ✅ Checklist de Setup

- [ ] Docker Desktop instalado e rodando
- [ ] Node.js 18+ instalado
- [ ] Git instalado
- [ ] `./scripts/setup-new-machine.sh` executado com sucesso
- [ ] K3s cluster rodando (`docker ps | grep liquidlab`)
- [ ] `./scripts/deploy-to-k3s.sh` executado com sucesso
- [ ] Todos os 4 pods em liquid-lab estão 1/1 READY
- [ ] Todos os 2 pods em data-layer estão 1/1 READY
- [ ] Conseguir acessar http://localhost:3000
- [ ] Conseguir acessar http://localhost:3100

---

## 🎊 Pronto!

Você agora tem uma cópia completa de **Liquid Lab rodando localmente**.

**Para Marina (ou qualquer pessoa):**
1. Clonar o repositório
2. Rodar os 3 passos acima
3. Pronto — tudo funcionando

---

**Documentação Relacionada:**
- [ARCHITECTURE-LIQUIDLAB-NEMOCLAW.md](docs/ARCHITECTURE-LIQUIDLAB-NEMOCLAW.md) — Detalhes da arquitetura
- [README.md](README.md) — Overview do projeto
- [IMPLEMENTATION-CHECKLIST.md](IMPLEMENTATION-CHECKLIST.md) — Roadmap das próximas fases
