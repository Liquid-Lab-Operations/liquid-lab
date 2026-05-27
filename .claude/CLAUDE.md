# Liquid Lab — Monorepo Corporativo
**Repositório:** https://github.com/Operations-Liquid-Lab/liquid-lab  
**Última atualização:** 2026-05-27

---

## 📁 Estrutura

```
liquid-lab/
├── code/           → Next.js + Model Router (core application)
├── brain/          → Obsidian Vault (knowledge base & neurônios)
├── infra/          → DevOps (Docker, K8s, Prometheus, backups)
├── mcp/
│   ├── whatsapp/   → MCP Server: Meta WhatsApp Business API
│   └── slack/      → MCP Server: Slack SDK integration
├── docker-compose.yml
└── .claude/        → Documentação do repositório
```

---

## 🚀 Stack Tecnológico

| Componente | Stack |
|------------|-------|
| **Core App** | Next.js 14, Node.js 20, TypeScript |
| **LLM Routing** | Model Router (Ollama + Claude API fallback) |
| **Local LLMs** | Ollama (8 modelos pré-carregados) |
| **Integrations** | MCP servers (WhatsApp, Slack) |
| **Infrastructure** | Docker, Docker Compose, Kubernetes |
| **Monitoring** | Prometheus + Grafana |
| **Backups** | AWS S3, automated daily snapshots |
| **Knowledge** | Obsidian vault with neurônios (CTX/PRJ/DEC/SYS) |

---

## 📋 Componentes Detalhados

### `/code` — Core Application
- **Next.js API routes** para processar tasks
- **Model Router**: TaskProfile-based intelligent routing
- **Endpoints:**
  - `POST /api/process` — submit task for LLM routing
  - `GET /api/health` — system health check
  - `GET /api/models` — list available models
  - `POST /api/fallback` — manual Claude API fallback

**Modelos Ollama (8):**
1. mistral:7b
2. neural-chat:7b
3. orca-mini:3b
4. phi:2.7b
5. tinyllama:1.1b
6. llama2:7b
7. dolphin-mixtral:8x7b
8. zephyr:7b

### `/brain` — Obsidian Knowledge Base
- **Neurônios organizados por tipo:**
  - CTX: Contexto corporativo e decisões contextuais
  - PRJ: Projetos ativos e planejamento
  - DEC: Decisões arquiteturais
  - SYS: Configurações de sistemas
- **Auto-sync com Git** (GitHub plugin)
- **Plugins necessários:** Graphify, Dataview, Git, Templater

### `/infra` — DevOps & Operations
- **Docker Compose** local development stack
- **Kubernetes manifests** para produção
- **Prometheus scraping** para health, memory, requests
- **Grafana dashboards** para visualização
- **Backup automation** para AWS S3
- **Secrets rotation** script (automated via cron)
- **CI/CD workflows** (.github/workflows/)

### `/mcp/whatsapp` — WhatsApp MCP Server
- Meta WhatsApp Business API integration
- Webhook handler para receber mensagens
- SQLite para persistência de histórico
- Real-time message processing

### `/mcp/slack` — Slack MCP Server
- Slack SDK com OAuth scopes
- Channel strategy: #alerts, #deployments, #status
- Rich message formatting
- Event handling para interações

---

## 🔧 Configuração Git

Todos os commits aparecem como **operations@liquidlab.ag** (identidade corporativa):

```bash
cd liquid-lab
git config user.email "operations@liquidlab.ag"
git config user.name "Liquid Lab Operations"
```

Verificar:
```bash
git config user.email    # → operations@liquidlab.ag
git config user.name     # → Liquid Lab Operations
```

---

## 🐳 Local Development

### Iniciar stack completo:
```bash
cd liquid-lab
docker-compose up -d
```

### Verificar Ollama:
```bash
curl http://localhost:11434/api/tags
```

### Testar Model Router:
```bash
curl -X POST http://localhost:3000/api/process \
  -H "Content-Type: application/json" \
  -d '{
    "task": "summarize this text",
    "context": "some document",
    "priority": "standard"
  }'
```

---

## 📊 Monitoramento

- **Prometheus:** http://localhost:9090
- **Grafana:** http://localhost:3000
- **Health check:** `GET /api/health`

---

## 🔐 Secrets & Environment

Secrets são gerenciados via:
- `.env.local` (local development, NOT committed)
- GitHub Secrets (CI/CD)
- AWS Secrets Manager (production)

---

## 📝 Próximas Etapas

- [ ] Initialize Docker Compose local
- [ ] Confirm Ollama running with 8 models
- [ ] Test Model Router routing logic
- [ ] Setup GitHub Actions CI/CD pipelines
- [ ] Configure Prometheus + Grafana dashboards
- [ ] Implement secrets rotation automation
- [ ] Setup daily backup to AWS S3
- [ ] Add Marina as collaborator (quando receber MacBook)
- [ ] Create initial neurônios in brain/ (CTX-001, CTX-002)

---

## 👥 Segregação de Contas

| Contexto | Conta GitHub | Função |
|----------|--------------|--------|
| **Pessoal** | MarceloPivovar | Projetos pessoais (pivo-labs, pivo-brain) |
| **Corporativo** | Operations-Liquid-Lab | Liquid Lab infrastructure (liquid-lab monorepo) |

---

*Infraestrutura corporativa Liquid Lab — Fresh start monorepo.*
