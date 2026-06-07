---
title: Brain Capture GitHub Actions Workflow
date: 2026-06-07
status: Standards
author: Liquid Lab Operations
---

# Brain Capture Workflow — GitHub Actions Automation

**Como o `brain-capture.yml` funciona e captura neurônios automaticamente todos os dias.**

---

## 📋 Overview

O arquivo `.github/workflows/brain-capture.yml` é um **GitHub Actions workflow** que roda automaticamente:

- **Quando:** Diariamente às 6 PM UTC
- **O que faz:** Parse commits, PRs, issues e cria/atualiza neurônios
- **Onde salva:** `brain/_neurônios/[tipo]/`
- **Sincroniza:** Automaticamente para Obsidian (10 min via Obsidian Git plugin)

---

## 🔄 Fluxo de Execução

```
┌──────────────────────────────────────┐
│ 6 PM UTC — brain-capture.yml starts  │
└────────────┬─────────────────────────┘
             │
    ┌────────┴────────┬─────────────┬──────────────┐
    │                 │             │              │
    ▼                 ▼             ▼              ▼
┌────────┐      ┌────────┐    ┌─────────┐   ┌─────────────┐
│ Commits│      │   PRs  │    │ Issues  │   │ Labels/Tags │
│(24h)   │      │ Merged │    │ Closed  │   │ Analysis    │
└────────┘      └────────┘    └─────────┘   └─────────────┘
    │                 │             │              │
    └────────┬────────┴─────────────┴──────────────┘
             │
             ▼
    ┌──────────────────────────┐
    │ Extract Information:     │
    ├──────────────────────────┤
    │ • Commit messages        │
    │ • PR titles/descriptions │
    │ • Issue titles           │
    │ • Labels & tags          │
    └──────────────────────────┘
             │
             ▼
    ┌──────────────────────────┐
    │ Categorize by type:      │
    ├──────────────────────────┤
    │ decision:  → DEC-XXX     │
    │ feature:   → PRJ-XXX     │
    │ fix:       → Link DEC    │
    │ docs:      → SYS-XXX     │
    │ issue:     → CTX-XXX     │
    └──────────────────────────┘
             │
             ▼
    ┌──────────────────────────────────┐
    │ Create Neurônios:                │
    ├──────────────────────────────────┤
    │ • Generate frontmatter            │
    │ • Create content sections        │
    │ • Add tags automatically         │
    │ • Generate backlinks             │
    └──────────────────────────────────┘
             │
             ▼
    ┌────────────────────────────────────┐
    │ Commit to brain/:                  │
    ├────────────────────────────────────┤
    │ git add brain/_neurônios/...       │
    │ git commit "automation: brain-*"   │
    │ git push                           │
    └────────────────────────────────────┘
             │
             ▼
    ┌───────────────────────────────┐
    │ Obsidian Git Plugin (10 min)  │
    ├───────────────────────────────┤
    │ Auto-pull from GitHub         │
    │ Reload vault                  │
    │ Update graph view             │
    │ Sync backlinks                │
    └───────────────────────────────┘
             │
             ▼
    ┌──────────────────────────────┐
    │ Slack Notification:          │
    ├──────────────────────────────┤
    │ "#liquid-lab: 3 neurônios    │
    │  capturados em 24h"          │
    └──────────────────────────────┘
```

---

## 📝 Commit Patterns

O workflow reconhece padrões específicos em mensagens de commit:

### **decision: [description]**
- **Tipo:** Decisão arquitetural
- **Neurônio:** `DEC-XXX`
- **Exemplo:** `decision: implement model router with taskprofile routing`
- **Resultado:**
  ```markdown
  brain/_neurônios/dec/DEC-XXX_Model_Router_With_TaskProfile.md
  
  ---
  title: DEC-XXX Model Router With TaskProfile
  tipo: decisão
  tags: [arquitetura, routing, decisão]
  status: ativo
  ---
  ```

### **feature: [description]**
- **Tipo:** Nova funcionalidade
- **Neurônio:** `PRJ-XXX`
- **Exemplo:** `feature: add health check endpoint`
- **Resultado:**
  ```markdown
  brain/_neurônios/prj/PRJ-XXX_Health_Check_Endpoint.md
  
  ---
  title: PRJ-XXX Health Check Endpoint
  tipo: projeto
  tags: [feature, endpoint, health-check]
  status: ativo
  ---
  ```

### **fix: [description]**
- **Tipo:** Bug fix
- **Neurônio:** Link a `DEC` relacionada (não cria novo)
- **Exemplo:** `fix: handle null pointer in model router`
- **Resultado:**
  ```markdown
  Atualiza DEC existente com comentário:
  "Fixed: null pointer handling (commit abc123)"
  ```

### **docs: [description]**
- **Tipo:** Documentação/Configuração
- **Neurônio:** `SYS-XXX`
- **Exemplo:** `docs: update sync and deploy strategy`
- **Resultado:**
  ```markdown
  brain/_neurônios/sys/SYS-XXX_Update_Sync_Deploy_Strategy.md
  ```

### **refactor: [description]**
- **Tipo:** Refatoração
- **Neurônio:** Link a `DEC` relacionada
- **Exemplo:** `refactor: simplify model router logic`
- **Resultado:** Atualiza `DEC` com nota de refatoração

### **chore: [description]**
- **Tipo:** Manutenção/CI
- **Neurônio:** Ignorado (não cria)
- **Exemplo:** `chore: update dependencies`
- **Resultado:** Nenhum neurônio (não afeta brain)

---

## 🔗 Links Automáticos

O workflow cria links automáticos entre neurônios:

### **Backlinks Bidirecionais**
```
DEC-005 (Model Router)
├── Links para PRJ-003 (que implementou)
├── Links para SYS-001 (documentação)
└── Referenced by commits abc, def, ghi

PRJ-003 (Health Check)
├── Links para DEC-005 (decisão base)
└── Referenced by commit xyz
```

### **Links por Tags**
```
Todos os neurônios com tag [arquitetura]:
├── DEC-001 (Cache Strategy)
├── DEC-005 (Model Router)
├── SYS-002 (Database Configuration)
└── Visible em graph view
```

---

## 📊 Exemplo de Execução Completa

### **Cenário: Última 24h teve 3 commits**

```bash
# Commit 1 (22:15)
git commit -m "decision: implement model router with taskprofile routing"

# Commit 2 (10:30)
git commit -m "feature: add health check endpoint to api"

# Commit 3 (14:45)
git commit -m "fix: handle null pointer in model router logic"
```

### **Execução do workflow (6 PM)**

```
┌─ brain-capture.yml starts
│
├─ Step 1: Fetch latest commits
│  ├─ Commit 1: decision: model router
│  ├─ Commit 2: feature: health check
│  └─ Commit 3: fix: null pointer
│
├─ Step 2: Categorize
│  ├─ decision → DEC (create)
│  ├─ feature → PRJ (create)
│  └─ fix → DEC (update)
│
├─ Step 3: Generate neurônios
│  ├─ DEC-005_Model_Router_TaskProfile.md
│  │  ├─ Frontmatter
│  │  ├─ Content (from commit message)
│  │  └─ Links: [[PRJ-003]], [[SYS-001]]
│  │
│  ├─ PRJ-003_Health_Check_Endpoint.md
│  │  ├─ Frontmatter
│  │  ├─ Content (from commit message)
│  │  └─ Links: [[DEC-005]]
│  │
│  └─ Update DEC-005 with fix note
│     └─ "Fixed: null pointer handling"
│
├─ Step 4: Commit neurônios
│  └─ git commit "automation: brain capture 2026-06-07"
│
├─ Step 5: Push to GitHub
│  └─ git push origin main
│
├─ Step 6: Slack notification
│  └─ "#liquid-lab: 2 neurônios criados, 1 atualizado"
│
└─ Done (took ~2-3 min)
```

### **Resultado em Obsidian (próximos 10 min)**

```
brain/
├── _neurônios/
│   ├── dec/
│   │   └── DEC-005_Model_Router_TaskProfile.md  ✅ NOVO
│   ├── prj/
│   │   └── PRJ-003_Health_Check_Endpoint.md     ✅ NOVO
│   └── sys/
│       └── SYS-001_...                           (unchanged)
│
└── GitHub commit visible:
    "automation: brain capture 2026-06-07"
```

**Você vê em Obsidian:**
- 2 neurônios novos aparecem na sidebar
- Graph view mostra conexão: PRJ-003 → DEC-005
- Backlinks criados automaticamente
- Searchable por tags `[arquitetura, routing, endpoint]`

---

## 🔧 Implementação do Workflow

### **Localização**
```
.github/workflows/brain-capture.yml
```

### **Trigger**
```yaml
on:
  schedule:
    - cron: '0 18 * * *'  # 6 PM UTC = 3 PM São Paulo (horário de verão)
```

**Converter para seu timezone:**
- UTC 6 PM = São Paulo 3 PM (horário de verão)
- UTC 6 PM = São Paulo 2 PM (horário padrão)

Para mudar horário, editar o cron:
```yaml
# 9 AM UTC (6 AM São Paulo)
- cron: '0 9 * * *'

# 3 PM UTC (12 PM São Paulo)
- cron: '0 15 * * *'
```

### **Permissões Necessárias**
```yaml
permissions:
  contents: write        # Pode fazer commit/push
  pull-requests: read    # Pode ler PRs
  issues: read           # Pode ler issues
```

### **Segredos Necessários**
```
GITHUB_TOKEN (automático)
SLACK_WEBHOOK (para notificações)
```

---

## 📊 Logs e Monitoramento

### **Ver execução do workflow**
```bash
# Listar últimas 5 execuções
gh run list -L 5

# Ver logs completos
gh run view <run-id> --log

# Ver se passou/falhou
gh run view <run-id> --json conclusion
```

### **Slack Notifications**
O workflow envia notificações para `#liquid-lab`:

```
✅ Brain capture complete
   2 neurônios criados
   1 neurônio atualizado
   3 commits processados
   #liquid-lab
```

### **GitHub Actions Tab**
```
Repository → Actions → brain-capture.yml
├── Execução de hoje (6 PM)
│   └─ Tempo de execução: ~2-3 min
│   └─ Status: ✅ Success / ❌ Failed
├── Logs detalhados
└─ Próxima execução: Amanhã 6 PM
```

---

## ⚠️ Troubleshooting

### **Problema: Workflow não executou**
```
Solução:
1. Verify cron está correto: 0 18 * * * (6 PM UTC)
2. Verify repository tem permissão para Actions
3. Verificar GitHub Status (github.status.com)
4. Trigger manual: gh workflow run brain-capture.yml
```

### **Problema: Neurônios não foram criados**
```
Solução:
1. Verify commits têm prefixo válido (decision:, feature:, etc)
2. Verificar logs: gh run view <run-id> --log
3. Buscar commits do último dia: git log --since="24 hours ago"
4. Trigger manual com filtro específico
```

### **Problema: Slack notification não apareceu**
```
Solução:
1. Verify SLACK_WEBHOOK secret está correto
2. Verify webhook URL é válida
3. Check Slack #liquid-lab channel existe
4. Ver logs do workflow para erro específico
```

### **Problema: Obsidian não sincronizou**
```
Solução (não é culpa do workflow):
1. Verify Obsidian Git plugin está ativo
2. Verify auto-sync interval: Settings → 10 minutes
3. Verify conexão internet no laptop
4. Manual: abrir Obsidian → Command → Obsidian Git: Pull
```

---

## 📈 Métricas & Análise

### **Neurônios criados por mês**
```bash
# Contar neurônios por tipo
find brain/_neurônios -name "DEC-*.md" | wc -l   # Decisões
find brain/_neurônios -name "PRJ-*.md" | wc -l   # Projetos
find brain/_neurônios -name "CTX-*.md" | wc -l   # Contexto
find brain/_neurônios -name "SYS-*.md" | wc -l   # Sistemas

# Ver growth por mês
git log --oneline brain/_neurônios/ | wc -l
```

### **Commits que geraram neurônios**
```bash
git log --oneline --all --grep="decision:\|feature:\|docs:" | wc -l
```

### **Tempo de execução do workflow**
```bash
# Últimos 10 runs
gh run list --limit 10 -w brain-capture.yml --json durationMinutes
```

---

## 🚀 Próximas Melhorias

- [ ] Implementar análise de NLP para extrair contexto automaticamente
- [ ] Criar neurônios com conteúdo mais rico (não apenas título)
- [ ] Link automático baseado em termos similares
- [ ] Gerar graph view em formato JSON para análise
- [ ] Alertas se neurônios importantes não estão linkados
- [ ] Dashboard de neuron health (orphaned, stale, etc)

---

## 📚 Documentação Relacionada

- **[BRAIN-CAPTURE-ROTINA.md](BRAIN-CAPTURE-ROTINA.md)** — Visão geral da automação
- **[VAULT-NEURON-RULES.md](VAULT-NEURON-RULES.md)** — Regras de neurônios
- **[SYNC-AND-DEPLOY-STRATEGY.md](SYNC-AND-DEPLOY-STRATEGY.md)** — Estratégia de sync completa
- **[.github/workflows/brain-capture.yml](../.github/workflows/brain-capture.yml)** — Código do workflow
- **[.claude/hooks/post-compact.sh](../.claude/hooks/post-compact.sh)** — Local hook para /compact

---

**Status:** ✅ Documentado | **Last update:** 2026-06-07

_Automação que aprende com tudo que você faz._
