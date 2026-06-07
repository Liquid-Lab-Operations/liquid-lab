# SYS-001: Monorepo Git Configuration

**Status:** ✅ Documentado e padronizado  
**Data:** 2026-06-06  
**Autor:** Liquid Lab Operations

---

## 📋 Resumo

Liquid Lab é um **monorepo único** (single `.git` root) com múltiplas subpastas componentes. Todos os commits refletem a identidade corporativa `operations@liquidlab.ag`.

---

## 🏗️ Estrutura

```
liquid-lab/
├── .git/                    ← UM repositório Git único
├── code/                    → Next.js + Model Router (core app)
├── brain/                   → Obsidian Vault (knowledge base)
├── infra/                   → DevOps (Docker, K8s, Prometheus)
├── mcp/
│   ├── whatsapp/            → MCP Server: Meta WhatsApp API
│   └── slack/               → MCP Server: Slack SDK
├── docs/                    → Documentation & ADRs
└── docker-compose.yml
```

---

## 🔐 Configuração Git

### Identidade Corporativa
```bash
user.email  = operations@liquidlab.ag
user.name   = Liquid Lab Operations
```

### Remote
```
origin  → https://github.com/Liquid-Lab-Operations/liquid-lab.git
```

### Segregação de Contas
| Contexto | Conta | Commits aparecem como |
|----------|-------|----------------------|
| Desenvolvimento | MarceloPivovar | operations@liquidlab.ag |
| Futuro (Marina) | Marina Garcia | operations@liquidlab.ag |
| Futuro (Operations) | operations@liquidlab.ag | operations@liquidlab.ag |

---

## 📄 Documentação Complementar

Cada subpasta contém `GIT_CONFIG.md` com:
- Status atual da configuração
- Justificativa do dual-account setup
- Lista padronizada de subprojetos (ordem alfabética)

**Subpastas documentadas:**
1. `code/GIT_CONFIG.md`
2. `brain/GIT_CONFIG.md`
3. `infra/GIT_CONFIG.md`
4. `mcp/whatsapp/GIT_CONFIG.md`
5. `mcp/slack/GIT_CONFIG.md`

### Ordem Padronizada (Alfabética)
- liquid-lab-brain
- liquid-lab-code
- liquid-lab-infra
- liquid-lab-mcp-slack
- liquid-lab-mcp-whatsapp

*(Cada arquivo omite a si mesmo da lista)*

---

## 🔄 Histórico de Alterações

**2026-06-06** — Padronização de listas em GIT_CONFIG.md  
- Commit: `8f1057e`
- Descrição: Standardize repos list order in all GIT_CONFIG.md files
- Mudança: Todos os 5 arquivos agora usam ordem alfabética consistente

---

## ⚙️ Workflow

### Para Marcelo (AtualMente)
```bash
git add . && git commit -m "message"
# ↓ Commit aparece como operations@liquidlab.ag
```

### Quando Marina receber MacBook
```bash
git clone https://github.com/Liquid-Lab-Operations/liquid-lab.git
# Mesma configuração, commits também como operations@liquidlab.ag
```

### Quando operations@liquidlab.ag tiver máquina própria
- Transferência legal de ownership
- Commits continuam como operations@liquidlab.ag
- Auditoria de permissões corporativas

---

## 🎯 Relacionados

- [[CTX-001_Perfil_Marcelo_Pivovar]]
- [[PRJ-001_Liquid_Lab]]
- CLAUDE.md (raiz do monorepo)
