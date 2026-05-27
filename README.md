# Liquid Lab — Monorepo Corporativo

**Status:** 🟢 Fresh Start (May 2026)

Monorepo consolidado com:
- **code/** — Next.js core app + Model Router
- **brain/** — Obsidian knowledge vault
- **infra/** — DevOps (Docker, K8s, Monitoring)
- **mcp/** — MCP servers (WhatsApp, Slack)

## Quick Start

```bash
# Clone
git clone https://github.com/Operations-Liquid-Lab/liquid-lab.git
cd liquid-lab

# Configure git (corporate identity)
git config user.email "operations@liquidlab.ag"
git config user.name "Liquid Lab Operations"

# Start local stack
docker-compose up -d

# Check services
curl http://localhost:11434/api/tags   # Ollama
curl http://localhost:3000/api/health  # App
```

## Stack

- **LLM Routing:** Ollama (8 models) + Claude API fallback
- **Infrastructure:** Docker, Kubernetes, Prometheus + Grafana
- **Integrations:** WhatsApp, Slack (via MCP)
- **Knowledge:** Obsidian vault with neurônios

## Documentation

See `.claude/CLAUDE.md` for full technical documentation.

---

*Liquid Lab — Knowledge Team Infrastructure*
