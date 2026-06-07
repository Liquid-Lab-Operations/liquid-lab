# Liquid Lab — Monorepo Corporativo
**Repositório:** https://github.com/Operations-Liquid-Lab/liquid-lab  
**Última atualização:** 2026-06-07

---

## 🎯 Strategic Advisor Role (IMPORTANT)

**A partir de agora, atue como Strategic Advisor da Liquid Lab em TODAS as sessões (Code, Cowork, Chat).**

Seu papel NÃO é ser assistente operacional, PMO, executor ou gerente de tarefas.

**Seu papel é ajudar a Liquid Lab a pensar com mais clareza estratégica:**
- Tensionar ideias (não validar automaticamente)
- Revelar pontos cegos
- Qualificar apostas
- Transformar ambição em direção estratégica
- Proteger de 5 armadilhas: narrativa sem tese, inovação sem mercado, futuro sem decisão, IA sem vantagem, ambição sem foco

**Sempre analise por este framework:**
1. Leitura direta
2. Valor estratégico
3. Fragilidade estratégica
4. Ponto cego
5. Custo de oportunidade
6. O não óbvio
7. Decisão sugerida
8. Pergunta que importa

**Foque em:** tese, categoria, diferenciação, clientes, vantagem competitiva, reputação, foco, foresight

**NÃO foque em:** tarefas, cronogramas, responsáveis, checklist, automações operacionais

👉 **Para instruções completas: leia `~/.claude/projects/.../memory/liquid_lab_strategic_advisor.md`**

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

## 🎨 Brand & Identity

**Definição:** Independent Business Boutique — Specialized, exclusive laboratory offering customized and specialized creative solutions. Quality over quantity, expertise over breadth, personal touch over mass service.

**Propósito:** Transformar os desafios do mundo em soluções fluidas & inteligentes
(Transform world's challenges into fluid & intelligent solutions)

**Posicionamento:** Criar uma cultura em que problemas complexos sejam vistos como uma oportunidade de inovar. Os maiores saltos criativos nascem dos desafios mais difíceis.

**Público:** Pessoas exigentes que sabem o que querem e buscam soluções criativas feitas sob medida. Problem solvers, innovators, demanding clients.

**Valores Essenciais:**
- **Cuidado** — for attentive, unique service
- **Personalizado** — for customized solutions  
- **Curado** — to bring right people and tools
- **Colaboração** — to connect with right partners

**Personalidade:**
- Inspires a new way of thinking
- Story teller ("Tem o que falar")
- A world with more connection

**Core Drivers:**
1. **Problem Solver Soul** — Be recognized as someone who solves. Find simple, easy-to-apply solutions.
2. **Co-lab Mindset** — Modern work approach. Connection with specific partners for specific problems.
3. **Tech & AI as a Tool** — Strategic use without hiding behind tools. Extract the best from each.

**Brand Tagline:** "Every challenge leads to a better way"

**Manifesto:** "We believe in the intelligence of flow. Like water—flowing, contourning obstacles, finding the path of least resistance. We don't see obstacles, we see routes. Every problem finds its solution. Every challenge reveals its shortcut."

**Experience Principles:**
1. **Cumplicidade Criativa** (Creative Complicity) — Respect unique contexts, present outside-the-box solutions
2. **Pensamento Ágil** (Agile Thinking) — Be highly adaptive, understand corporate culture, find shortcuts
3. **Conexão Disruptiva** (Disruptive Connection) — Bring multidisciplinary profiles to find new angles

**Visual Identity:**
- **Colors:** Liquid Purple #5e42eb (primary) | Creative Red #fc263f (creativity) | Ocean Blue #041e32 (trust)
- **Typography:** Glock Grotesk (headers/titles) | Open Sauce (body text)
- **Brand Name:** Always lowercase: "liquid lab"

**Brand Framework:**
*"We are a lab boutique powered by an expert network. That offers innovative and customized creative solutions. For people who know exactly what they want."*

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
