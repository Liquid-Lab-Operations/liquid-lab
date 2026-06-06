# ADR 002: Graphify in Nemoclaw — Knowledge Graph Integration

**Status:** Accepted  
**Date:** 2026-06-06  
**Author:** Marcelo Pivovar (Pivo)  
**Related:** ADR-001 (Nemoclaw Security), ISSUE-001 (Graphify Architecture)

---

## Context

Graphify is a powerful knowledge graph tool that analyzes documentation, code, and content to build semantic networks. Previously it was:
- Running directly on host (security risk)
- Creating sub-folders in Obsidian vaults (violates philosophy)
- Not following documentation standards

**Decision:** Graphify moves to Nemoclaw sandbox + integrate cleanly with Obsidian.

---

## Decision

### ✅ Graphify runs in Nemoclaw sandbox (not on host)

**Sandbox:** `graphify-analyzer`  
**Policies:** pypi, network (for downloading models/dependencies)  
**Port:** 7000 (internal, output via file sync)

### ✅ Graphify outputs stored cleanly

**Location:** `~/.nemoclaw/graphify-out/`  
**NEVER in Obsidian vault** (respects Liquid Lab Brain philosophy)

### ✅ Obsidian integration via links only

**Rule:** Graphify data linked from notes, not stored in vault

**Pattern:**
```markdown
# My Note

[[graphify-analysis-2026-06-06]] — Knowledge graph for this topic
```

Then link to: `~/.nemoclaw/graphify-out/graph-2026-06-06.html`

---

## Rationale

| Benefit | Why |
|---------|-----|
| **Security** | Isolated in Nemoclaw sandbox (ADR-001) |
| **Clean Obsidian** | No sub-folders, respects Links > Pastas philosophy |
| **Auditability** | Logs in Nemoclaw, tracked execution |
| **Scalability** | Easy to run parallel analyses without host pollution |
| **Standards** | Follows SOP-001 (Documentation Protocol) |

---

## Implementation

### 1. Create Nemoclaw Sandbox

```bash
nemoclaw sandbox create graphify-analyzer \
  --gpu \
  --policies pypi,network
```

### 2. Install Graphify in Sandbox

```bash
nemoclaw sandbox exec graphify-analyzer bash << 'EOF'
  apt-get update
  apt-get install -y python3-pip
  pip install graphifyy
EOF
```

### 3. Setup Output Directory

```bash
mkdir -p ~/.nemoclaw/graphify-out
```

### 4. Create Analysis Script

```bash
~/.nemoclaw/graphify-runner.sh
```

### 5. Integration with Obsidian

Add to Liquid Lab Brain notes:

```markdown
---
graphify-analysis: 2026-06-06
graphify-output: ~/.nemoclaw/graphify-out/graph-2026-06-06.html
---

# Note Title

Content...

[[graphify-analysis-2026-06-06]] — See knowledge graph
```

---

## Obsidian Integration Pattern

### ✅ Correct Way

**In Obsidian note frontmatter:**
```yaml
---
title: My Research
graphify: graph-2026-06-06
---

# Content

[[graphify-2026-06-06]] — Knowledge graph analysis
```

**Output stored:**
```
~/.nemoclaw/graphify-out/
├── graph-2026-06-06.html
├── graph-2026-06-06.json
└── manifest.json
```

### ❌ Wrong Way (Old pattern)

```
Obsidian Vault/
├── graphify-out/           ← NO!
│   ├── graph.html
│   └── cache/              ← NO!
```

---

## Execution

### Manual Analysis

```bash
nemoclaw sandbox exec graphify-analyzer bash << 'EOF'
  cd ~/.nemoclaw/graphify-out
  graphify analyze [source] --output graph-$(date +%Y-%m-%d).html
EOF
```

### Scheduled Analysis (Weekly)

Via Nemoclaw scheduled tasks (to be configured in future).

### Access Results

```bash
# View HTML in browser
open ~/.nemoclaw/graphify-out/graph-2026-06-06.html

# Or link from Obsidian
[[graphify-2026-06-06]]
```

---

## Configuration

### ~/.nemoclaw/graphify-config.env

```env
GRAPHIFY_OUTPUT_DIR=~/.nemoclaw/graphify-out
GRAPHIFY_SANDBOX=graphify-analyzer
GRAPHIFY_POLICIES=pypi,network
GRAPHIFY_MODELS=all
GRAPHIFY_MAX_DEPTH=3
```

### ~/.nemoclaw/setup-graphify-nemoclaw.sh

Automated setup script (see local configs).

---

## Obsidian Rules for Graphify

**From Bem-vindo.md (updated):**

1. **Graphify outputs never in vault** → Always in `~/.nemoclaw/graphify-out/`
2. **Link via frontmatter** → Reference in note metadata
3. **Use consistent naming** → `graph-YYYY-MM-DD.html`
4. **Tag for discovery** → `#graphify-analysis`
5. **Document the query** → Note what you analyzed

---

## File Structure

```
~/.nemoclaw/
├── graphify-analyzer/           (Nemoclaw sandbox)
│   └── [graphify installed]
├── graphify-out/                (Outputs)
│   ├── graph-2026-06-06.html
│   ├── graph-2026-06-06.json
│   └── manifest.json
├── graphify-config.env          (Configuration)
└── setup-graphify-nemoclaw.sh   (Setup script)
```

---

## Migration Plan

1. **Today:** Create Nemoclaw sandbox
2. **Today:** Move outputs from Obsidian → `~/.nemoclaw/graphify-out/`
3. **Today:** Remove graphify-out folders from Obsidian
4. **This week:** Update Bem-vindo.md with Graphify rules
5. **This week:** Document in Obsidian + Local + Git (SOP-001)
6. **Next:** Schedule weekly analyses

---

## Benefits vs. Before

| Aspect | Before | After |
|--------|--------|-------|
| **Location** | Host | Nemoclaw sandbox |
| **Obsidian** | Polluted with folders | Clean (links only) |
| **Security** | Host exposed | Isolated & auditable |
| **Scalability** | Hard to run multiple | Easy, parallel execution |
| **Documentation** | None | Full (ADR + SOP + Local) |

---

## Related Documents

- **ADR-001:** Nemoclaw Security Policy
- **SOP-001:** Documentation Protocol
- **ISSUE-001:** Graphify Architecture (now resolved)
- **Bem-vindo.md:** Updated with Graphify rules

---

**Status:** ✅ Accepted & Ready for Implementation  
**Owner:** Pivo (VP Technology)  
**Implementation Date:** 2026-06-06  
**Review Date:** 2027-06-06
