# SOP 001: Documentation Protocol — Triple Registry

**Effective Date:** 2026-06-05  
**Author:** Pivo (VP Technology)  
**Status:** Active & Mandatory  
**Applies To:** All structural changes to Liquid Lab

---

## The Rule

> **Every structural decision / change / implementation must be documented in 3 places:**
>
> 1. **Obsidian** (Liquid Lab Brain) — Knowledge base & reference
> 2. **Git** (liquid-lab repo) — Formal versioning & history
> 3. **Local Configs** (~/.nemoclaw, .claude/, ~/.paperclip) — Operational reality

**No partial documentation. All three or nothing.**

---

## Definition: "Structural"

Structural = Changes that affect:
- Architecture (new sandbox, new service)
- Security policies (permissions, isolation)
- Infrastructure (databases, servers, integrations)
- Operational procedures (setup, deployment)
- Configuration standards (env vars, secrets management)
- Decision records (ADRs, design choices)

**NOT Structural:**
- Code commits (unless system-wide impact)
- Bug fixes (unless affecting architecture)
- Minor UI changes
- Temporary troubleshooting

---

## The Three Registries

### 1️⃣ Obsidian (Liquid Lab Brain)

**Purpose:** Personal knowledge base, searchable, linked, brain-like organization  
**Location:** `~/Library/Mobile Documents/iCloud~/Documents/Liquid Lab Brain/`  
**Audience:** Internal reference, decision history, learning

**What Goes Here:**
- ADRs (Architecture Decision Records)
- Policies & guidelines
- Operational procedures
- Meeting notes related to decisions
- Lessons learned
- Dependencies & relationships

**Format:** Markdown with frontmatter (yaml)
```
---
title: [Descriptive Title]
data: YYYY-MM-DD
tipo: [adr/politica/procedimento/decisao]
tags: [relevant, tags, here]
status: [ativo/concluído/suspenso]
---

# Title

Content here...

[[Links]] to related notes
```

**Update Frequency:** Immediately after decision  
**Owner:** Pivo (VP Technology)

---

### 2️⃣ Git (liquid-lab repo)

**Purpose:** Formal, versioned, immutable record  
**Location:** `~/Projects/liquid-lab/docs/`  
**Audience:** Team, external stakeholders, audits

**What Goes Here:**
- ADRs (formal format)
- Operational procedures
- Security policies
- Configuration templates
- Architecture diagrams
- Implementation guides

**Format:** Markdown in `docs/` folder
```
docs/
├── ADR-001-NEMOCLAW-SECURITY.md
├── ADR-002-[Next Decision].md
├── SOP-001-DOCUMENTATION-PROTOCOL.md
└── OPERATIONAL-SECURITY.md
```

**Commit Message Format:**
```
feat: ADR-XXX — [Title]

Description of decision/change.

Key Points:
  • Point 1
  • Point 2

Status: Active | Suspended | Superseded
Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>
```

**Update Frequency:** On commit (immutable)  
**Owner:** Pivo (via git config: operations@liquidlab.ag)

---

### 3️⃣ Local Configs

**Purpose:** Operational reality, immediate reference  
**Location:** `~/.nemoclaw/`, `.claude/`, `~/.paperclip/`  
**Audience:** Day-to-day operations, scripts, automation

**What Goes Here:**
- Setup scripts (`setup-[app-name].sh`)
- Configuration templates (`[app-name]-config.env`)
- Quick reference guides (`QUICK-REFERENCE.txt`)
- Checklists (`*-CHECKLIST.md`)
- Security policies (`SECURITY-POLICY.md`)
- Emergency procedures

**Format:** Shell scripts, env files, text/markdown
```
~/.nemoclaw/
├── SECURITY-POLICY.md
├── QUICK-REFERENCE.txt
├── setup-[app-name].sh
├── [app-name]-config.env
└── NOVA-INSTALACAO-CHECKLIST.md
```

**Update Frequency:** Immediately, operational priority  
**Owner:** Pivo (for security), whoever maintains the service

---

## When to Document

### Immediately (same day)

- [ ] Architecture decision made
- [ ] Security policy set
- [ ] New sandbox/service planned

### During Implementation

- [ ] Setup scripts created
- [ ] Config files templated
- [ ] Operational procedures refined

### After Completion

- [ ] Obsidian note finalized
- [ ] Git commit pushed
- [ ] Local configs tested

---

## Documentation Workflow

```
┌─────────────────────────────────────────┐
│  1. DECISION / STRUCTURAL CHANGE        │
│     (Meeting, discussion, planning)     │
└────────────┬────────────────────────────┘
             ↓
┌─────────────────────────────────────────┐
│  2. OBSIDIAN (Immediate)                │
│     • Title, date, status               │
│     • Why? What? How?                   │
│     • Links to related notes            │
└────────────┬────────────────────────────┘
             ↓
┌─────────────────────────────────────────┐
│  3. LOCAL CONFIGS (During impl.)        │
│     • Setup scripts                     │
│     • Config templates                  │
│     • Checklists                        │
│     • Quick refs                        │
└────────────┬────────────────────────────┘
             ↓
┌─────────────────────────────────────────┐
│  4. GIT COMMIT (After impl.)            │
│     • Formal ADR/SOP                    │
│     • Comprehensive docs                │
│     • Referenced in commit msg          │
│     • Signed commit                     │
└────────────┬────────────────────────────┘
             ↓
┌─────────────────────────────────────────┐
│  5. VERIFY (Quality check)              │
│     • All 3 places documented?          │
│     • Consistent across locations?      │
│     • Correct & complete?               │
└─────────────────────────────────────────┘
```

---

## Examples

### Example 1: New Sandbox

**Trigger:** Installing Paperclip in Nemoclaw

**Obsidian Entry:**
```markdown
---
title: Paperclip em Nemoclaw
data: 2026-06-05
tipo: decisao
tags: [nemoclaw, paperclip, sandbox, segurança]
status: ativo
---

# Paperclip em Nemoclaw

Decisão: Instalar Paperclip como sandbox isolado no Nemoclaw.

Sandbox: paperclip-main
Serviços: Paperclip (Node.js), PostgreSQL
Porta: 3100

[[POLITICA-NEMOCLAW-SEGURANCA]]
[[MOC Operações Ativas]]
```

**Local Config:**
```bash
~/.nemoclaw/setup-paperclip-nemoclaw.sh
~/.nemoclaw/paperclip-config.env
~/.nemoclaw/PAPERCLIP-NEMOCLAW-SETUP.md
```

**Git Commit:**
```bash
git commit -m "feat: ADR-002 — Paperclip sandbox in Nemoclaw

Sandbox: paperclip-main
Services: Paperclip (Node.js 20) + PostgreSQL 17
Port: 3100
Policies: npm, pypi, network

Includes setup script, config template, and documentation.
Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

### Example 2: Security Policy

**Trigger:** Deciding sandbox-first architecture

**Obsidian Entry:**
- POLITICA-NEMOCLAW-SEGURANCA.md

**Local Config:**
- ~/.nemoclaw/SECURITY-POLICY.md
- ~/.nemoclaw/QUICK-REFERENCE.txt

**Git Commit:**
- docs/ADR-001-NEMOCLAW-SECURITY.md
- docs/OPERATIONAL-SECURITY.md

---

## Checklist: Before Considering "Done"

- [ ] Obsidian note created with title, date, tags, status
- [ ] Obsidian note links to related decisions
- [ ] Local config files created (scripts, templates, refs)
- [ ] Local config tested and working
- [ ] Git ADR/SOP created in `docs/`
- [ ] Git commit message references Obsidian & configs
- [ ] Git commit signed (operations@liquidlab.ag)
- [ ] All 3 locations in sync (same info, consistent)
- [ ] Quality check passed (complete & accurate)

---

## Consistency Rules

**Naming Convention:**
- Obsidian: `TITULO-DESCRITIVO.md`
- Git: `ADR-XXX-descriptive-title.md` or `SOP-XXX-descriptive-title.md`
- Local: `[app-name]-CONFIG.md`, `setup-[app-name].sh`

**Date Format:** `YYYY-MM-DD` everywhere

**Status Values:**
- `ativo` / `active` / `✅`
- `suspenso` / `suspended` / `⏸️`
- `concluído` / `completed` / `✅`
- `superseded` (ADR only)

**Cross-references:**
- Obsidian → Git commits (by hash)
- Git → Obsidian (by note title)
- Local configs → both above

---

## Ownership & Maintenance

**Policy Owner:** Pivo (VP Technology)  
**Documentation Owner:** Whoever makes the structural decision  
**Git Owner:** operations@liquidlab.ag (corporate identity)  
**Obsidian Owner:** Pivo (personal brain)  

**Review Cycle:**
- Obsidian: Real-time (as decisions happen)
- Git: On commit (immutable history)
- Local: Real-time (operational)

---

## Enforcement

**This is mandatory.** Structural changes without full triple documentation:

- ❌ Will not be merged to main branch
- ❌ Will not be considered "done"
- ❌ Will not be put into production
- ❌ Will cause technical debt

**No partial documentation.**

---

## Tools & Workflow

### Obsidian
```bash
# Quick access
cmd+O (Quick Switcher)
cmd+P (Command Palette)
cmd+Shift+G (Graph View)
```

### Git
```bash
cd ~/Projects/liquid-lab
git add docs/ADR-XXX.md
git commit -m "feat: ADR-XXX — Title..."
git push
```

### Local Configs
```bash
nano ~/.nemoclaw/setup-[app].sh
nano ~/.nemoclaw/[app]-config.env
```

---

## FAQ

**Q: What if it's urgent?**  
A: Still document all three. Urgent ≠ skip documentation. Documenting takes 30 min.

**Q: What if I only need to update Obsidian?**  
A: Then it's not a structural change. If it's structural, all three.

**Q: What if Git and Obsidian say different things?**  
A: Sync them immediately. Git is source of truth for code, Obsidian for context.

**Q: What if local configs become outdated?**  
A: Update all three. Use git history to track changes.

---

## Related Documents

- **ADR-001:** `docs/ADR-001-NEMOCLAW-SECURITY.md`
- **SOP-001:** This document
- **Obsidian:** `Liquid Lab Brain → POLITICA-NEMOCLAW-SEGURANCA.md`

---

**Status:** ✅ Active & Mandatory  
**Effective:** 2026-06-05  
**Last Updated:** 2026-06-05  
**Next Review:** 2027-06-05
