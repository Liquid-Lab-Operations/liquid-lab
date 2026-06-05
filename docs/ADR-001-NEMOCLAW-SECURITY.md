# ADR 001: Nemoclaw Security Policy — Sandbox-First Architecture

**Status:** Accepted  
**Date:** 2026-06-05  
**Author:** Marcelo Pivovar (Pivo)  
**Affected Components:** All new applications and services

---

## Context

The Liquid Lab runs multiple interconnected services (Paperclip, OpenClaw, Claude Code integrations, databases, etc.). As the system grows, security and isolation become critical concerns.

**Problem:**
- Applications running directly on host machine
- Dependencies polluting the system
- Security risk if one service is compromised
- Difficult to scale and manage multiple versions
- No centralized audit trail

---

## Decision

### ✅ **All applications/services supported by Nemoclaw MUST run inside Nemoclaw sandboxes.**

**The Rule:**
```
If Nemoclaw supports it → It runs in Nemoclaw (not on host)
```

### Scope

**Applications that MUST use Nemoclaw:**
- Node.js servers (Express, Next.js, etc)
- Python applications (Django, FastAPI, Flask, etc)
- Databases (PostgreSQL, MongoDB, Redis, etc)
- Background jobs and workers
- API servers
- Microservices
- Docker containers
- Custom bots and scripts
- Paperclip (orchestrator)
- OpenClaw (agents)

**Exceptions (Host only):**
- ZSH/Bash shell
- Git (version control)
- Homebrew (package manager)
- Claude Code (IDE)
- Web browsers
- Essential OS utilities

---

## Rationale

| Benefit | Impact |
|---------|--------|
| **Security** | Complete isolation. Sandboxes contain vulnerabilities. |
| **Auditability** | Centralized logs via Nemoclaw. Clear access trails. |
| **Scalability** | Run multiple versions side-by-side. Easy resource management. |
| **Reproducibility** | Sandboxes are versioned. Easy to recreate environments. |
| **Host Hygiene** | Keep macOS clean. No dependency pollution. |
| **Disaster Recovery** | If host compromised, sandboxes still protected. |

---

## Implementation

### For Each New Application

1. **Create Sandbox**
   ```bash
   nemoclaw sandbox create [app-name] --gpu --policies [list]
   ```

2. **Sync Code**
   ```bash
   nemoclaw sandbox sync [app-name] --source [local] --target [remote]
   ```

3. **Document (Required)**
   - `~/.nemoclaw/setup-[app-name].sh` — Setup script
   - `~/.nemoclaw/[app-name]-README.md` — Usage guide
   - `~/.nemoclaw/[app-name]-SECURITY.md` — Policies & isolation
   - `~/.nemoclaw/[app-name]-config.env` — Environment variables

### Current Sandboxes

| Sandbox | Services | Policies | Status |
|---------|----------|----------|--------|
| `paperclip-main` | Paperclip + PostgreSQL | npm, pypi, network | ✅ Active |
| `nemoclawtest` | Default testing | pypi, npm | ✅ Active |

---

## Consequences

### Positive

✅ Dramatically improved security posture  
✅ Each service isolated in its own container  
✅ Easy to audit and trace access  
✅ Simple to scale horizontally  
✅ Clear separation of concerns  

### Negative (Mitigated)

⚠️ Slight latency for inter-sandbox communication (acceptable)  
⚠️ Learning curve for Nemoclaw CLI (well-documented)  
⚠️ Initial setup takes longer (automated with scripts)  

---

## Compliance

**Review Frequency:** Annually (or on major architectural change)  
**Last Reviewed:** 2026-06-05  
**Next Review:** 2027-06-05  

---

## Related Documents

- [`~/.nemoclaw/SECURITY-POLICY.md`] — Full security policy
- [`~/.nemoclaw/NOVA-INSTALACAO-CHECKLIST.md`] — Setup checklist
- [`~/.nemoclaw/QUICK-REFERENCE.txt`] — Command reference

---

## Quick Reference

```bash
# Create sandbox
nemoclaw sandbox create myapp --gpu --policies npm,network

# Enter sandbox
nemoclaw sandbox exec myapp bash

# View status
nemoclaw sandbox status myapp

# Stop sandbox
nemoclaw sandbox stop myapp

# Delete sandbox
nemoclaw sandbox delete myapp
```

---

## References

- Nemoclaw Documentation: `~/.nemoclaw/source/`
- Liquid Lab Brain (Obsidian): POLITICA-NEMOCLAW-SEGURANCA.md
- Security Policy (detailed): `~/.nemoclaw/SECURITY-POLICY.md`

---

**Decision Made By:** Pivo  
**Approved By:** Self (VP Technology)  
**Effective Date:** 2026-06-05  
**Validity:** Indefinite (until superseded)
