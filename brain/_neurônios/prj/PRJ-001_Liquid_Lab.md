---
title: PRJ-001 Liquid Lab
data: 2026-05-27
tipo: projeto
tags: [projetos, infraestrutura, corporativo]
status: ativo
---

# PRJ-001 — Liquid Lab

**Descrição:** Infraestrutura corporativa de IA — modelo router inteligente, Obsidian vault centralizado, DevOps automático

**Repositório:** https://github.com/Liquid-Lab-Operations/liquid-lab  
**Organização:** Liquid-Lab-Operations  
**Equipe:** Marcelo Pivovar + Marina Garcia

---

## 🎯 Objetivo

Criar infraestrutura escalável para Knowledge Team com:
- **Model Router** inteligente (Ollama 8 models + Claude API fallback)
- **Knowledge Base** centralizado (Obsidian vault sincronizado)
- **DevOps** automático (Docker, K8s, Prometheus, backups)
- **Integrations** (WhatsApp, Slack via MCP)

---

## 📁 Arquitetura (Monorepo)

```
liquid-lab/
├── code/        → Next.js + Model Router (core app)
├── brain/       → Obsidian vault (knowledge base)
├── infra/       → DevOps (Docker, K8s, monitoring)
└── mcp/
    ├── whatsapp → MCP Server (Meta WhatsApp API)
    └── slack    → MCP Server (Slack SDK)
```

---

## 🛠 Stack Técnico

| Componente | Tech |
|------------|------|
| **LLM Routing** | Ollama (8 modelos) + Claude API fallback |
| **App** | Next.js 14, Node.js 20, TypeScript |
| **Infrastructure** | Docker, Docker Compose, Kubernetes |
| **Monitoring** | Prometheus + Grafana |
| **Backups** | AWS S3 (daily automated) |
| **Knowledge** | Obsidian vault + Git sync |
| **Integrations** | WhatsApp, Slack (MCP servers) |

---

## 📊 Status

| Item | Status |
|------|--------|
| Monorepo criado | ✅ |
| Git configurado | ✅ |
| Obsidian vault criado | ✅ |
| Docker Compose setup | ⏳ TODO |
| Ollama (8 models) | ⏳ TODO |
| Model Router testing | ⏳ TODO |
| GitHub Actions CI/CD | ⏳ TODO |
| Prometheus + Grafana | ⏳ TODO |
| Daily backups | ⏳ TODO |
| Marina onboarded | ⏳ TODO |

---

## 🔗 Relacionado

[[CTX-001 Perfil Marcelo Pivovar]]  
[[CTX-002 Perfil Marina Garcia]]  
[[SYS-001 Stack Tecnológico Liquid Lab]]  
[[DEC-001 Obsidian como Single Source of Truth]]
