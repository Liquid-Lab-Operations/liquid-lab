# ISSUE-001: Graphify Architecture Mismatch

**Status:** Open  
**Date:** 2026-06-05  
**Severity:** High  
**Assigned To:** Pivo (VP Technology)

---

## Summary

Graphify is currently:
1. **Running on host** (violates ADR-001: Nemoclaw Security)
2. **Creating sub-folders in Obsidian** (violates Liquid Lab Brain philosophy: Links > Pastas)
3. **Not following SOP-001** (Documentation Protocol)

**Action Required:** Decide if Graphify continues → If YES, migrate to Nemoclaw sandbox

---

## Details

### Finding 1: Running on Host ❌

Graphify installed via `uv`:
```
~/.local/share/uv/tools/graphifyy/
```

**Problem:**
- Violates ADR-001 (all supported apps must run in Nemoclaw)
- Host polluted with Python dependencies
- No security isolation
- No centralized auditing

### Finding 2: Polluting Obsidian Structure ❌

Created folders inside vaults:
```
Pivo.Brain/
├── graphify-out/              ← Should not exist in vault
│   ├── .graphify_analysis.json
│   ├── .graphify_labels.json
│   ├── .graphify_root
│   ├── .graphify_semantic_marker
│   ├── 2026-05-23/
│   ├── cache/
│   ├── graph.html
│   ├── graph.json
│   ├── manifest.json
│   └── GRAPH_REPORT.md
│
├── _daily/graphify-out/       ← Sub-folder, violates pattern
├── _conversas-claude/graphify-out/
└── _conversas-manus/graphify-out/
```

**Problem:**
- Obsidian philosophy: mínimum folders, maximum links
- System files mixed with knowledge base
- Cache should not be in vault
- Difficult to sync/version
- Violates Liquid Lab Brain structure

### Finding 3: Not Following SOP-001 ❌

Graphify deployment:
- ❌ Not documented in Obsidian
- ❌ Not in local configs (~/.nemoclaw/)
- ❌ Not in Git
- ❌ No ADR created

Violates [[SOP-001-DOCUMENTATION-PROTOCOL]]

---

## Root Cause

Graphify was installed and executed:
1. Directly on host (not in Nemoclaw sandbox)
2. Without following ADR-001 (Nemoclaw Security)
3. Without following SOP-001 (Documentation Protocol)
4. Outputs placed inside Obsidian vault (wrong location)

---

## Impact Assessment

| Category | Impact | Severity |
|----------|--------|----------|
| **Security** | Host exposed to unknown Python dependencies | High |
| **Organization** | Obsidian structure polluted with system files | Medium |
| **Git** | Cache and build files in repo (should .gitignore) | Medium |
| **iCloud Sync** | Unnecessary cache being synced | Low |
| **Standards** | Violates ADR-001 & SOP-001 | High |

---

## Proposed Solution

### Phase 1: Immediate Isolation

```bash
# 1. Move outputs out of Obsidian
mkdir -p ~/.nemoclaw/graphify-out
cp -r Pivo.Brain/graphify-out/* ~/.nemoclaw/graphify-out/

# 2. Remove from Obsidian
rm -rf Pivo.Brain/graphify-out
rm -rf Pivo.Brain/_daily/graphify-out
rm -rf Pivo.Brain/_conversas-*/graphify-out

# 3. Add to .gitignore
echo "graphify-out/" >> .gitignore
```

### Phase 2: Container Migration (Short-term)

Create Nemoclaw sandbox for Graphify:

```bash
nemoclaw sandbox create graphify-analyzer \
  --gpu \
  --policies pypi,network
```

**Benefits:**
- Security isolation
- Proper Python dependency management
- Controlled execution
- Centralized auditing
- Follows ADR-001

### Phase 3: Documentation (Mandatory)

Create ADR-002: Graphify in Nemoclaw

Contents:
- Why Graphify runs in Nemoclaw
- How it integrates with Obsidian
- Where outputs are stored
- How to use/schedule
- Integration with other services

---

## Decisions Needed

- **Is Graphify still needed?**
  - [ ] YES → Migrate to Nemoclaw
  - [ ] NO → Remove from system

- **If YES, when?**
  - [ ] This week (urgent)
  - [ ] Next sprint
  - [ ] TBD

- **Owner:** Pivo (recommended)

---

## Next Steps

1. **Decision:** Is Graphify core to Liquid Lab?
2. **If YES:** Create ADR-002 (Graphify in Nemoclaw)
3. **If NO:** Remove and cleanup
4. **Either way:** Follow SOP-001 for documentation

---

## Related Documents

- ADR-001: Nemoclaw Security Policy
- SOP-001: Documentation Protocol
- Liquid Lab Brain: Bem-vindo.md (philosophy)

---

**Created:** 2026-06-05  
**Status:** 🔴 OPEN (awaiting decision)  
**Assignee:** Pivo  
**Milestone:** TBD
