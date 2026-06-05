# Operational Security — Liquid Lab + Nemoclaw

**Last Updated:** 2026-06-05  
**Status:** Active & Enforced  
**Author:** Pivo (VP Technology)

---

## 🔐 Core Principle

```
All applications and services supported by Nemoclaw
must run inside Nemoclaw sandboxes.

Host = clean. Sandboxes = isolated and secure.
```

---

## Security Architecture

```
┌─────────────────────────────────────────────────────┐
│                   macOS Host (Clean)                │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Essential Only:                                     │
│  ✅ ZSH Shell                                        │
│  ✅ Git                                              │
│  ✅ Homebrew                                         │
│  ✅ Claude Code IDE                                  │
│  ✅ Web Browsers                                     │
│                                                      │
└──────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────┐
│            Nemoclaw Sandbox Management              │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Sandbox 1: paperclip-main                           │
│  ├── Paperclip (Node.js)     [Isolated]             │
│  ├── PostgreSQL              [Isolated]             │
│  └── Policies: npm, pypi, network                   │
│                                                      │
│  Sandbox 2: [app-name]                               │
│  ├── [Service 1]             [Isolated]             │
│  ├── [Service 2]             [Isolated]             │
│  └── Policies: [list]                               │
│                                                      │
│  ... (more sandboxes as needed)                      │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## Installation Guidelines

### Before Installing Anything New

1. **Ask:** Does Nemoclaw support this?
   - YES → Goes in a sandbox
   - NO → Exception (document why)

2. **Plan:** What does it need?
   - Type: Node.js? Python? Go? Docker?
   - Port: What port will it use?
   - DB: Does it need a database?
   - Policies: What policies does it need?

3. **Create:** Build the sandbox
   ```bash
   nemoclaw sandbox create [name] --gpu --policies [list]
   ```

4. **Setup:** Configure everything inside
   ```bash
   nemoclaw sandbox sync [name] --source [local] --target [remote]
   nemoclaw sandbox exec [name] [setup-commands]
   ```

5. **Document:** Required for all sandboxes
   - Setup script
   - README
   - Security policy
   - Config template

---

## Current Production Sandboxes

### paperclip-main

**Purpose:** AI Agent Orchestration  
**Services:**
- Paperclip Server (Node.js, port 3100)
- PostgreSQL (port 5432)

**Policies:** npm, pypi, network  
**Status:** ✅ Active  
**Setup:** `bash ~/setup-paperclip-nemoclaw.sh`  

**Access:**
```bash
# Web UI
curl http://localhost:3100

# SSH into sandbox
nemoclaw sandbox exec paperclip-main bash

# View logs
nemoclaw sandbox exec paperclip-main tail -f /tmp/paperclip.log
```

### nemoclawtest (default)

**Purpose:** Testing & Experimentation  
**Services:**
- Ollama (Local LLMs)
- Python environment

**Policies:** pypi, npm  
**Status:** ✅ Active  

---

## Policy Checklist for New Applications

When installing a new app, ensure:

- [ ] Sandbox created with appropriate name
- [ ] Code synchronized to sandbox
- [ ] Dependencies installed inside sandbox
- [ ] Database (if needed) initialized inside sandbox
- [ ] Environment variables configured
- [ ] Setup script documented: `~/.nemoclaw/setup-[name].sh`
- [ ] README created: `~/.nemoclaw/[name]-README.md`
- [ ] Security doc created: `~/.nemoclaw/[name]-SECURITY.md`
- [ ] Config template created: `~/.nemoclaw/[name]-config.env`
- [ ] App tested and working
- [ ] Logs are readable and informative
- [ ] Host remains clean (no files outside sandbox)

---

## Common Commands

```bash
# Create new sandbox
nemoclaw sandbox create myapp --gpu --policies npm,network

# List all sandboxes
nemoclaw sandbox list

# Check sandbox status
nemoclaw sandbox status [name]

# Enter sandbox
nemoclaw sandbox exec [name] bash

# Run command in sandbox
nemoclaw sandbox exec [name] [command]

# View logs
nemoclaw sandbox exec [name] tail -f /tmp/[name].log

# Sync code updates
nemoclaw sandbox sync [name] --source [local] --target [remote]

# Stop sandbox
nemoclaw sandbox stop [name]

# Restart sandbox
nemoclaw sandbox restart [name]

# Delete sandbox (⚠️ irreversible)
nemoclaw sandbox delete [name]
```

---

## Disaster Recovery

### If a Sandbox is Compromised

1. **Isolate immediately**
   ```bash
   nemoclaw sandbox stop [name]
   ```

2. **Investigate**
   ```bash
   nemoclaw sandbox exec [name] bash
   # Review logs and system state
   ```

3. **Recover**
   ```bash
   # Option A: Restart from last known good state
   nemoclaw sandbox restart [name]

   # Option B: Full rebuild (if compromised)
   nemoclaw sandbox delete [name]
   # Re-run setup script
   bash ~/.nemoclaw/setup-[name].sh
   ```

### If Host is Compromised

- ✅ Sandboxes still protected (isolated)
- ✅ Nemoclaw logs contain audit trail
- ✅ Easy to investigate what happened
- ✅ Quick rollback to clean state

---

## Monitoring & Maintenance

### Weekly

```bash
# Check all sandboxes
nemoclaw sandbox list

# Review logs for errors
for sandbox in $(nemoclaw sandbox list --quiet); do
  echo "Checking $sandbox..."
  nemoclaw sandbox exec $sandbox tail -20 /tmp/$sandbox.log
done
```

### Monthly

```bash
# Full security audit
nemoclaw sandbox list --detailed

# Verify all required docs exist
ls ~/.nemoclaw/setup-*.sh
ls ~/.nemoclaw/*-README.md
ls ~/.nemoclaw/*-SECURITY.md
```

### Annually

- Review this policy (ADR-001)
- Update security procedures
- Audit all sandboxes for compliance
- Document changes

---

## Performance Considerations

### Acceptable Trade-offs

- **Network latency:** Inter-sandbox communication has slight overhead (acceptable)
- **Disk space:** Multiple sandboxes use more disk (use `nemoclaw sandbox list --sizes`)
- **Memory:** Each sandbox has memory allocation (monitor with Prometheus)

### Optimization

```bash
# Monitor Prometheus
curl http://localhost:9090

# View Grafana dashboards
# http://localhost:3000 (if running)

# Check resource usage per sandbox
docker stats | grep nemoclaw
```

---

## Troubleshooting

### Sandbox won't start

```bash
# Check logs
nemoclaw sandbox status [name]

# Try restarting
nemoclaw sandbox restart [name]

# If still failing, delete and recreate
nemoclaw sandbox delete [name]
bash ~/.nemoclaw/setup-[name].sh
```

### Application inside sandbox not responding

```bash
# Check if process is running
nemoclaw sandbox exec [name] ps aux | grep [app-name]

# Check logs
nemoclaw sandbox exec [name] tail -100 /tmp/[name].log

# Verify port is listening
nemoclaw sandbox exec [name] netstat -tulpn | grep :[PORT]
```

### Out of disk space

```bash
# Check sandbox sizes
nemoclaw sandbox list --sizes

# Delete old/unused sandboxes
nemoclaw sandbox delete [old-sandbox]

# Clean up logs
nemoclaw sandbox exec [name] rm -f /tmp/*.log
```

---

## Documentation Requirements

Every sandbox MUST have:

### 1. `~/.nemoclaw/setup-[app-name].sh`
Automated setup script. Should be idempotent and well-commented.

### 2. `~/.nemoclaw/[app-name]-README.md`
How to use, common commands, troubleshooting.

### 3. `~/.nemoclaw/[app-name]-SECURITY.md`
What policies it uses, why, and what access it has.

### 4. `~/.nemoclaw/[app-name]-config.env`
Template of environment variables (with secrets marked as [REDACTED]).

---

## Compliance & Audit

**Policy Authority:** VP Technology (Pivo)  
**Effective Date:** 2026-06-05  
**Review Cycle:** Annually or on major architectural changes  
**Last Audit:** 2026-06-05  

### Audit Checklist

- [ ] All applications running in Nemoclaw (except essentials)
- [ ] All sandboxes documented
- [ ] Logs are readable and informative
- [ ] No unauthorized applications on host
- [ ] All secrets in config files, not in code
- [ ] Network policies enforced per sandbox

---

## References

- **ADR-001:** `docs/ADR-001-NEMOCLAW-SECURITY.md`
- **Security Policy:** `~/.nemoclaw/SECURITY-POLICY.md`
- **Quick Reference:** `~/.nemoclaw/QUICK-REFERENCE.txt`
- **Checklist:** `~/.nemoclaw/NOVA-INSTALACAO-CHECKLIST.md`
- **Obsidian:** Liquid Lab Brain → POLITICA-NEMOCLAW-SEGURANCA

---

**Last Updated:** 2026-06-05  
**Next Review:** 2027-06-05  
**Status:** ✅ Active & Enforced
