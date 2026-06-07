---
title: Brain Capture Documentation Index
date: 2026-06-07
status: Standards
author: Liquid Lab Operations
---

# Brain Capture — Documentation Index

**Complete guide to the Liquid Lab automated neurônio capture system.**

---

## 📚 Documentation Structure

### **Start Here**

1. **[BRAIN-CAPTURE-INTEGRATION.md](BRAIN-CAPTURE-INTEGRATION.md)** (10 min read)
   - Visão geral de como tudo funciona
   - Fluxo completo por dia
   - Exemplos reais
   - Setup checklist
   - **Para:** Entender o sistema inteiro

### **Deep Dives by Topic**

2. **[VAULT-NEURON-RULES.md](VAULT-NEURON-RULES.md)** (15 min read)
   - 4 tipos de neurônios (CTX, PRJ, DEC, SYS)
   - Frontmatter obrigatório
   - Nomenclatura de arquivo
   - Estrutura de conteúdo
   - **Para:** Criar neurônios manualmente ou entender formato

3. **[BRAIN-CAPTURE-ROTINA.md](BRAIN-CAPTURE-ROTINA.md)** (20 min read)
   - Triggers de captura (commit, PR, issue, /compact)
   - Componentes da automação
   - Fluxo completo por dia
   - Padrões de commit
   - Monitoramento
   - **Para:** Entender triggers e como usar a automação

4. **[BRAIN-CAPTURE-WORKFLOW.md](BRAIN-CAPTURE-WORKFLOW.md)** (25 min read)
   - GitHub Actions workflow técnico
   - Commit patterns e categorização
   - Links automáticos
   - Logs e troubleshooting
   - Próximas melhorias
   - **Para:** Implementar/debugar o GitHub Actions workflow

### **Supporting Documentation**

5. **[SYNC-AND-DEPLOY-STRATEGY.md](SYNC-AND-DEPLOY-STRATEGY.md)**
   - Contexto maior: sync + deploy + brain capture integrado
   - **Para:** Entender como brain capture se integra com CI/CD

6. **[SYNC-DAILY-WORKFLOW.md](../SYNC-DAILY-WORKFLOW.md)**
   - Workflow diário prático para Marcelo e Marina
   - Comandos rápidos
   - **Para:** Saber o que fazer dia a dia

7. **[VAULT-NEURON-RULES.md](VAULT-NEURON-RULES.md)**
   - Já linkado acima, mas essencial

---

## 🚀 Quick Start (5 min)

### **For Developers**
```bash
# 1. Entender o sistema
Read: BRAIN-CAPTURE-INTEGRATION.md

# 2. Fazer commits com padrão correto
git commit -m "decision: describe your decision"
git commit -m "feature: describe your feature"

# 3. Commits serão automáticamente capturados
# Próximas 6 PM: neurônios criados em brain/

# 4. /compact ao fim da sessão
# → post-compact.sh cria CTX neurônio
```

### **For Obsidian Users**
```
1. Abra Obsidian
2. Vault: ~/liquid-lab/brain/
3. Plugins: Obsidian Git (auto-sync 10 min)
4. Ver neurônios aparecendo em tempo real
5. Graph view mostra conexões
```

### **For DevOps/Automation**
```
1. Verify: .github/workflows/brain-capture.yml
2. Check: cron job "0 18 * * *" (6 PM UTC)
3. Monitor: gh run list -L 5
4. Slack: #liquid-lab notifications
```

---

## 🔄 Component Map

```
┌──────────────────────────────────────────────────────────┐
│                    BRAIN CAPTURE SYSTEM                  │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  LOCAL WORK              AUTOMATION        OBSIDIAN      │
│  ┌────────────────┐     ┌────────────┐   ┌──────────┐  │
│  │ git commit     │────→│ GitHub A.  │──→│ Auto-    │  │
│  │ PR merge       │     │ Actions    │   │ sync     │  │
│  │ /compact       │────→│ (6 PM)     │   │ (10 min) │  │
│  └────────────────┘     │            │   └──────────┘  │
│           │             │ post-      │         ↑        │
│           ▼             │ compact.sh │         │        │
│  ┌────────────────┐     │ (instant)  │         │        │
│  │ post-compact.  │────→│            │─────────┘        │
│  │ sh (local)     │     └────────────┘                  │
│  └────────────────┘             │                       │
│                                 ▼                       │
│                      ┌──────────────────┐               │
│                      │ brain/           │               │
│                      │ _neurônios/      │               │
│                      │ [DEC/PRJ/SYS]    │               │
│                      └──────────────────┘               │
│                                                          │
└──────────────────────────────────────────────────────────┘

Each component has its own doc:
- post-compact.sh: .claude/hooks/post-compact.sh (source code)
- GitHub Actions: BRAIN-CAPTURE-WORKFLOW.md
- Obsidian Config: VAULT-NEURON-RULES.md (Git plugin section)
- Overall flow: BRAIN-CAPTURE-INTEGRATION.md
```

---

## 📖 Reading Guides

### **"I want to understand the whole system" (45 min)**
```
1. BRAIN-CAPTURE-INTEGRATION.md (10 min)
2. VAULT-NEURON-RULES.md (15 min)
3. BRAIN-CAPTURE-ROTINA.md (20 min)
└─ You now understand: what, how, and why
```

### **"I want to implement it" (90 min)**
```
1. BRAIN-CAPTURE-INTEGRATION.md (10 min)
2. VAULT-NEURON-RULES.md (15 min)
3. BRAIN-CAPTURE-ROTINA.md (20 min)
4. BRAIN-CAPTURE-WORKFLOW.md (25 min)
5. Setup checklist + testing (20 min)
└─ System is now running
```

### **"I want to troubleshoot it" (30 min)**
```
1. BRAIN-CAPTURE-INTEGRATION.md → Troubleshooting section
2. BRAIN-CAPTURE-WORKFLOW.md → Troubleshooting section
3. Check logs: gh run list -L 5
4. Check hook: .claude/hooks/post-compact.sh
└─ Problem identified and fixed
```

### **"I want to create neurônios manually" (20 min)**
```
1. VAULT-NEURON-RULES.md (complete read)
2. Example: PRJ-002_Knowledge_Team.md (in the doc)
3. Create: brain/_neurônios/[tipo]/[NAME].md
4. Fill: frontmatter + content + links
5. Save: Obsidian Git auto-syncs in 10 min
└─ Neurônio created and visible to others
```

---

## 📋 Files & Locations

### **Documentation**
```
docs/
├── VAULT-NEURON-RULES.md           ← Neurônio formatting rules
├── BRAIN-CAPTURE-ROTINA.md         ← Automation overview & triggers
├── BRAIN-CAPTURE-WORKFLOW.md       ← GitHub Actions technical details
├── BRAIN-CAPTURE-INTEGRATION.md    ← How everything fits together
├── INDEX-BRAIN-CAPTURE.md          ← This file
├── SYNC-AND-DEPLOY-STRATEGY.md     ← Bigger context
└── SYNC-DAILY-WORKFLOW.md          ← Daily workflow reference
```

### **Code & Configuration**
```
.github/workflows/
└── brain-capture.yml               ← GitHub Actions automation

.claude/hooks/
└── post-compact.sh                 ← Local hook for /compact

brain/
├── _neurônios/
│   ├── ctx/                        ← Context neurons
│   ├── prj/                        ← Project neurons
│   ├── dec/                        ← Decision neurons
│   └── sys/                        ← System neurons
├── _conversas-claude/              ← Session captures
└── .obsidian/                      ← Obsidian config (local)
```

---

## 🎯 Common Tasks

### **"I committed code with decision: prefix"**
```
What happens:
1. Your commit is pushed
2. Tomorrow at 6 PM: brain-capture.yml runs
3. Parses your commit message
4. Creates: brain/_neurônios/dec/DEC-XXX_Your_Decision.md
5. Obsidian syncs (10 min later)
6. You see it in Obsidian

Expected time: 6 PM tomorrow (or ~30 min if triggered manually)
```

### **"I finished a session and did /compact"**
```
What happens:
1. /compact is called
2. post-compact.sh hook runs immediately
3. Creates: brain/_conversas-claude/2026-06-07_Title.md
4. Git commit + push
5. Obsidian syncs (10 min)
6. Links to related neurons created

Expected time: Instant (neurônio appears in 10 min)
```

### **"I want to see all neurons of a type"**
```
In Obsidian:
1. Open: brain/_neurônios/dec/
2. All DEC-*.md files visible
3. Or: search for tag:[decisão]

In terminal:
find brain/_neurônios/dec -name "*.md" | sort
```

### **"I want to link two neurons"**
```
In Obsidian:
1. Open first neuron
2. Scroll to "## 🔗 Relacionado"
3. Add: [[DEC-005_Model_Router]]
4. Save (Obsidian Git auto-syncs)
5. Backlink created automatically
```

### **"I want to see the graph view"**
```
In Obsidian:
1. Open: Command Palette (Cmd+P)
2. Type: "graph"
3. Select: "Open graph view"
4. See: All neurons and connections
5. Click: Any neuron to zoom
```

---

## 🔐 Secrets & Permissions

### **GitHub Secrets (Required)**
```
SLACK_WEBHOOK     ← For #liquid-lab notifications
GITHUB_TOKEN      ← Automatic (for commits)
```

### **Permissions (Automatic)**
```
.github/workflows/brain-capture.yml has:
├─ contents: write      (can commit/push)
├─ pull-requests: read  (can read PRs)
└─ issues: read         (can read issues)
```

---

## 📊 Metrics & Monitoring

### **Daily**
```bash
# How many neurons were created today?
find brain/_neurônios -type f -mtime -1 | wc -l

# Were they linked correctly?
# (use Obsidian Graph view)

# Did post-compact work?
find brain/_conversas-claude -name "*.md" -mtime -1
```

### **Weekly**
```bash
# Total neurons by type
echo "DEC: $(find brain/_neurônios/dec -name "*.md" | wc -l)"
echo "PRJ: $(find brain/_neurônios/prj -name "*.md" | wc -l)"
echo "CTX: $(find brain/_neurônios/ctx -name "*.md" | wc -l)"
echo "SYS: $(find brain/_neurônios/sys -name "*.md" | wc -l)"

# Most connected neurons
# (use Obsidian: View → Show graph view)
```

### **Workflow Health**
```bash
# Check if brain-capture.yml is running
gh run list -w brain-capture.yml -L 5

# Check recent failures
gh run list -w brain-capture.yml --json conclusion

# See latest logs
gh run view $(gh run list -w brain-capture.yml -L 1 | cut -f1) --log
```

---

## ❓ FAQ

**Q: How long does a neuron take to appear?**  
A: Depends on trigger:
- Commit: 6 PM UTC next day (or ~12 hours)
- /compact: 10 minutes (Obsidian Git sync)
- Manual: Instant (if you create in Obsidian)

**Q: Can I edit auto-created neurons?**  
A: Yes. They won't be overwritten. Auto-creation only happens once.

**Q: What if I make a typo in commit message?**  
A: Either:
1. Create a new commit with correct message
2. Or manually edit the created neuron in Obsidian

**Q: Can I use brain-capture system for Pivo.Brain too?**  
A: Not yet. Currently only works for Liquid Lab Brain (operations@liquidlab.ag email).

**Q: How do I manually trigger brain-capture.yml?**  
A: In GitHub:
```bash
gh workflow run brain-capture.yml
```

**Q: What if Obsidian Git fails to sync?**  
A: Not a brain-capture issue. Check:
1. Obsidian Git plugin installed
2. Config: auto-sync 10 min enabled
3. Internet connection
4. Manual pull: Command → Obsidian Git: Pull

---

## 🚀 Next Steps

1. ✅ Read: **BRAIN-CAPTURE-INTEGRATION.md**
2. ✅ Setup: Follow checklist in BRAIN-CAPTURE-ROTINA.md
3. ✅ Test: Make a commit with `decision:` prefix
4. ✅ Monitor: Check `gh run list` at 6 PM
5. ✅ Use: Make `/compact` at end of sessions

---

## 📞 Support

**Problem?** Check:
1. Relevant doc (BRAIN-CAPTURE-WORKFLOW.md for GitHub issues)
2. Troubleshooting section in that doc
3. Logs: `gh run list -L 5`
4. Local: `.logs/post-compact.log`

---

## 📋 Document Versions

| Doc | Version | Date | Status |
|-----|---------|------|--------|
| VAULT-NEURON-RULES.md | 1.0 | 2026-06-07 | ✅ Current |
| BRAIN-CAPTURE-ROTINA.md | 1.0 | 2026-06-07 | ✅ Current |
| BRAIN-CAPTURE-WORKFLOW.md | 1.0 | 2026-06-07 | ✅ Current |
| BRAIN-CAPTURE-INTEGRATION.md | 1.0 | 2026-06-07 | ✅ Current |

---

**Status:** ✅ Complete | **Last update:** 2026-06-07

_One central index for all brain capture documentation._
