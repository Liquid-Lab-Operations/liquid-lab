---
title: ARCHITECTURE — Liquid Lab Nemoclaw-First
date: 2026-06-06
version: 1.0
status: draft
---

# ARCHITECTURE — Liquid Lab Nemoclaw-First

**Versão:** 1.0  
**Data:** 2026-06-06  
**Princípio:** Security by Isolation + Guardrails

---

## Vision

**Tudo roda em Nemoclaw** para:
- ✓ Isolamento total (cada serviço em seu sandbox)
- ✓ Guardrails de segurança (policies por sandbox)
- ✓ Controle granular (quem acessa o quê)
- ✓ Auditabilidade (logs de tudo)
- ✓ Escalabilidade (adiciona sandbox quando precisa)

---

## Architecture: Nemoclaw Sandboxes

```
HOST (Minimal)
├── Git (versionamento)
├── Nemoclaw CLI (orquestrador)
└── Docker daemon (para sandboxes)

NEMOCLAW SANDBOXES (Isolados com policies)
│
├── [liquid-lab-api]                    Port: 3000
│   ├── Type: Node.js
│   ├── Stack: Next.js + Anthropic SDK
│   ├── Policies: npm, network, postgres
│   ├── Role: API server + model router
│   └── Config: .env + config.json
│
├── [hermes-agent]                      Port: 3001
│   ├── Type: Node.js (ou Python)
│   ├── Stack: Hermes Agent framework
│   ├── Policies: npm, network, postgres, claude-api
│   ├── Role: Agent execution + tool use
│   └── Config: .env + agent-config.json
│
├── [claude-api]                        (Internal)
│   ├── Type: Node.js
│   ├── Stack: Anthropic SDK wrapper
│   ├── Policies: network (only Claude endpoint)
│   ├── Role: Centralized Claude API calls
│   ├── Features: Caching, routing, fallback
│   └── Config: API key management
│
├── [data-layer]                        Port: 5432 (internal)
│   ├── Type: Docker
│   ├── Stack: PostgreSQL + Redis
│   ├── Policies: postgres, network (internal only)
│   ├── Role: Persistent storage + cache
│   └── Config: credentials.env (encrypted)
│
├── [observability]                     Port: 9090/3100
│   ├── Type: Node.js
│   ├── Stack: Prometheus + Grafana + Logs
│   ├── Policies: network, file
│   ├── Role: Metrics, logging, tracing
│   └── Config: telemetry.json
│
└── [knowledge-base]                    (Optional, now)
    ├── Type: Python
    ├── Stack: Vector DB + Embeddings
    ├── Policies: network, postgres, pypi
    └── (To be added in Phase 2)
```

---

## Sandbox Definitions

### 1. liquid-lab-api

**Purpose:** Main API server, model router, orchestrator

**Dockerfile/Setup:**
```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY liquid-lab/code .
RUN npm install
CMD ["npm", "run", "dev"]
```

**Policies:**
```json
{
  "npm": true,
  "network": true,
  "postgres": true,
  "file-read": ["/app"],
  "file-write": ["/app/.next", "/tmp"]
}
```

**Environment:**
```env
PORT=3000
NODE_ENV=production
CLAUDE_API_URL=http://claude-api:3000
DATABASE_URL=postgresql://user:pass@data-layer:5432/liquid_lab
REDIS_URL=redis://data-layer:6379
LOG_LEVEL=info
```

**Startup:**
```bash
npm install
npm run build
npm start
```

**Health Check:**
```bash
curl http://localhost:3000/health
```

---

### 2. hermes-agent

**Purpose:** Hermes Agent runtime, tool execution

**Dockerfile/Setup:**
```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY hermes-agent .
RUN npm install @hermes-ai/core @anthropic-ai/sdk
CMD ["node", "src/agent.js"]
```

**Policies:**
```json
{
  "npm": true,
  "network": true,
  "postgres": true,
  "claude-api": "internal:claude-api:3000",
  "file-read": ["/app"],
  "file-write": ["/app/logs", "/tmp"],
  "tools": ["http", "database", "filesystem-limited"]
}
```

**Environment:**
```env
PORT=3001
AGENT_NAME=hermes-primary
AGENT_SKILLS=knowledge-search,model-call,decision-making
CLAUDE_ENDPOINT=http://claude-api:3000/v1
DATABASE_URL=postgresql://user:pass@data-layer:5432/liquid_lab
LOG_LEVEL=debug
AGENT_LOG_PATH=/app/logs
```

**Startup:**
```bash
npm install
node src/agent.js
```

**Monitoring:**
```bash
curl http://localhost:3001/agent/status
```

---

### 3. claude-api

**Purpose:** Centralized Claude API access with guardrails

**Dockerfile/Setup:**
```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY claude-api .
RUN npm install @anthropic-ai/sdk express
CMD ["npm", "start"]
```

**Policies:**
```json
{
  "npm": true,
  "network": "external-only:api.anthropic.com",
  "file-read": ["/app", "/app/config"],
  "file-write": ["/app/logs"],
  "env": ["ANTHROPIC_API_KEY"]
}
```

**Environment:**
```env
PORT=3000
ANTHROPIC_API_KEY=sk-ant-...
CACHE_ENABLED=true
CACHE_TTL=3600
RATE_LIMIT=100/minute
LOG_LEVEL=info
```

**Features:**
- Prompt caching
- Request throttling
- Response validation
- Error handling
- Logging/audit trail

**Startup:**
```bash
npm install
npm start
```

---

### 4. data-layer

**Purpose:** PostgreSQL + Redis for persistent storage + cache

**Dockerfile/Setup:**
```yaml
version: '3.9'
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: liquid_lab
      POSTGRES_USER: app
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
  
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
```

**Policies:**
```json
{
  "network": "internal-only",
  "postgres": true,
  "file-write": ["/var/lib/postgresql/data"],
  "backup": "daily"
}
```

**Initialization:**
```bash
# Initialize database schema
psql -f /app/schema.sql

# Create indexes
psql -f /app/indexes.sql

# Seed data (if needed)
psql -f /app/seed.sql
```

---

### 5. observability

**Purpose:** Logs, metrics, distributed tracing

**Dockerfile/Setup:**
```dockerfile
FROM node:22-alpine
WORKDIR /app
RUN npm install -g prom-client winston loki-logger
COPY observability .
CMD ["npm", "start"]
```

**Policies:**
```json
{
  "npm": true,
  "network": true,
  "file-read": ["/var/log", "/app/config"],
  "file-write": ["/var/log/app"]
}
```

**Components:**
- **Prometheus** (metrics) → port 9090
- **Grafana** (dashboards) → port 3100
- **Loki** (logs) → aggregates from all sandboxes
- **Jaeger** (traces) → optional

**Startup:**
```bash
npm install
docker-compose -f observability/docker-compose.yml up
```

---

## Security Model

### Per-Sandbox Isolation

```
Sandbox A                          Sandbox B
├── FS: /sandbox-a/*       (isolated from B)
├── Network: internal      (can't reach external)
├── Env: secrets.env       (encrypted)
├── Processes: namespaced
├── Capabilities: dropped (no root, no syscalls)
└── Resource: limited (CPU, memory, disk)

Communication:
A → B: HTTP/gRPC (authenticated)
Both → data-layer: TCP (connection pooling)
All → observability: telemetry endpoint
```

### Policy Enforcement

```json
{
  "sandboxes": {
    "liquid-lab-api": {
      "network": ["outbound:data-layer:5432", "outbound:claude-api:3000"],
      "filesystem": ["read:/app", "write:/app/.next"],
      "env": ["DATABASE_URL", "CLAUDE_API_URL"],
      "capabilities": ["CAP_NET_BIND_SERVICE"]
    },
    "hermes-agent": {
      "network": ["outbound:data-layer:5432", "outbound:claude-api:3000"],
      "env": ["DATABASE_URL"],
      "tools": ["limited-syscalls"],
      "memory": "1Gi",
      "cpu": "500m"
    }
  }
}
```

---

## Deployment Flow

### Local Development

```bash
# 1. Start all sandboxes
cd ~/Claude/projects/liquid-lab
nemoclaw start-all

# 2. Each sandbox starts via its setup script
~/.nemoclaw/setup-liquid-lab-api.sh
~/.nemoclaw/setup-hermes-agent.sh
~/.nemoclaw/setup-data-layer.sh

# 3. Verify health
curl http://localhost:3000/health
curl http://localhost:3001/agent/status

# 4. View logs
nemoclaw logs liquid-lab-api --follow
```

### Production Deployment

```bash
# 1. Build all images
./build-all.sh

# 2. Deploy to Nemoclaw cluster
nemoclaw deploy --config production.yml

# 3. Verify observability
open http://observability:3100 (Grafana)
open http://observability:9090 (Prometheus)
```

---

## Configuration Management

### .env Strategy

**Per-Sandbox:**
```
~/.nemoclaw/liquid-lab-api.env
~/.nemoclaw/hermes-agent.env
~/.nemoclaw/claude-api.env
~/.nemoclaw/data-layer.env
```

**Never in Git:**
```gitignore
*.env
*.env.local
.env.*.local
credentials.json
```

**Template (committed):**
```
.env.example
.env.production.example
```

---

## Monitoring & Observability

### Logs (Centralized)

```
All sandboxes → Loki
├── liquid-lab-api: HTTP logs + app logs
├── hermes-agent: agent execution logs
├── claude-api: request/response logs
├── data-layer: query logs
└── observability: system logs
```

### Metrics (Prometheus)

```
Scrape endpoints:
- liquid-lab-api:3000/metrics
- hermes-agent:3001/metrics
- claude-api:3000/metrics
- data-layer:9187/metrics (postgres_exporter)
```

### Alerts

```yaml
groups:
  - name: liquid-lab
    rules:
      - alert: APIHighErrorRate
        expr: rate(http_requests_total{job="liquid-lab-api",status=~"5.."}[5m]) > 0.05
      - alert: HermesAgentDown
        expr: up{job="hermes-agent"} == 0
      - alert: DatabaseConnectionPoolExhausted
        expr: db_connections_used / db_connections_max > 0.9
```

---

## Next Steps (Roadmap)

### Phase 1 (NOW)
- [ ] Set up liquid-lab-api sandbox
- [ ] Set up data-layer sandbox
- [ ] Set up claude-api sandbox
- [ ] Create monitoring dashboard

### Phase 2 (Week 1)
- [ ] Integrate Hermes Agent
- [ ] Add hermes-agent sandbox
- [ ] Tool integration (database, knowledge search)
- [ ] Agent testing

### Phase 3 (Week 2)
- [ ] Knowledge base sandbox
- [ ] Vector DB integration
- [ ] RAG pipeline
- [ ] Production readiness

### Phase 4 (Week 3+)
- [ ] Multi-agent orchestration
- [ ] Advanced guardrails
- [ ] Performance optimization
- [ ] Scale to production

---

## References

- [[SETUP-BOX Liquid Lab Vault Architecture]]
- [[STANDARDS-Claude-Installations]]
- [[POLICY-HOST-EXCEPTIONS]]
- Nemoclaw: https://github.com/NVIDIA/nemoclaw
- Hermes: https://docs.hermes-ai.com

---

**Status:** Draft (ready for implementation)  
**Next Review:** After Phase 1 implementation  
**Maintainer:** Knowledge Team
