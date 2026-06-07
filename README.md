# Liquid Lab — Monorepo Corporativo

**Status:** ✅ 100% Automated (June 2026)

Monorepo com automação end-to-end:
- **code/** — Next.js core app + Model Router
- **brain/** — Obsidian knowledge vault (auto-captured)
- **infra/** — DevOps (Docker, K8s, Monitoring)
- **mcp/** — MCP servers (WhatsApp, Slack)
- **.claude/** — Automação, hooks, documentação

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

## Security Architecture

🔐 **All applications run inside Nemoclaw sandboxes** (not on host).

- **Policy:** [ADR-001: Nemoclaw Security](docs/ADR-001-NEMOCLAW-SECURITY.md)
- **Operations:** [Operational Security Guide](docs/OPERATIONAL-SECURITY.md)
- **Sandboxes:** Isolated, auditable, secure
- **Host:** Clean (only essentials: Git, Homebrew, Shell, IDE)

See [ADR-001](docs/ADR-001-NEMOCLAW-SECURITY.md) for details.

## Documentation

- **Architecture Decisions:** `docs/ADR-001-NEMOCLAW-SECURITY.md`
- **Operations Guide:** `docs/OPERATIONAL-SECURITY.md`
- **Technical Details:** `.claude/CLAUDE.md`
- **Knowledge Base:** `brain/` (Obsidian vault)

---

*Liquid Lab — Knowledge Team Infrastructure*  
*Nemoclaw-secured, sandbox-based, enterprise-ready.*
