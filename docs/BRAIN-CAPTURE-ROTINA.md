---
title: Brain Capture Rotina — Automação de Neurônios
date: 2026-06-07
status: Standards
author: Liquid Lab Operations
---

# Brain Capture Rotina — Automação de Neurônios

**Como tudo que você faz é automaticamente capturado em neurônios no Obsidian vault.**

---

## 📋 Visão Geral

Cada ação — commit, PR, decisão, sessão — gera um **neurônio** automático no `brain/` da Liquid Lab:

```
┌─────────────────────────────────┐
│ Seu trabalho em qualquer lugar   │
├─────────────────────────────────┤
│ • Commit no git                  │
│ • PR merged                      │
│ • Decisão arquitetural           │
│ • Sessão Claude encerrada        │
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│ GitHub Actions + Hooks                  │
│ Captura automaticamente                 │
└────────────────┬────────────────────────┘
                 │
      ┌──────────┼──────────┐
      ▼          ▼          ▼
   ┌─────┐  ┌─────┐  ┌────────────────┐
   │ DEC │  │ PRJ │  │ CTX            │
   │ (arch)  │(feat)   │(contexto)      │
   └─────┘  └─────┘  └────────────────┘
      │          │          │
      └──────────┼──────────┘
                 ▼
         ┌──────────────────┐
         │ brain/_neurônios/│
         │ (Git auto-sync)  │
         └──────────────────┘
                 │
      ┌──────────┴──────────┐
      ▼                     ▼
   LOCAL              GITHUB
   Obsidian           (10 min)
   (vê em tempo real)
```

---

## 🔄 Triggers de Captura

### 1. **Commit (Código)**
**Quando:** `git commit` é feito

**Captura:** Analisa mensagem do commit
- Se `decision:` → cria `DEC-XXX`
- Se `feature:` → cria `PRJ-XXX`
- Se `fix:` → vincula a `DEC` existente
- Se `docs:` → cria `SYS-XXX`

**Exemplo:**
```bash
git commit -m "decision: implement model router for task profiling"
```

**Resultado:** Cria `brain/_neurônios/dec/DEC-XXX_Model_Router_Decision.md`

---

### 2. **Pull Request (Feature)**
**Quando:** PR é merged para `main`

**Captura:** Título + descrição da PR
- Cria `PRJ-XXX_Feature_Name.md`
- Links para commits relacionados
- Status: `ativo`
- Tags: `[feature, merged, main]`

**Exemplo:** PR #42 "Add Model Router task profiling"
→ `PRJ-XXX_Model_Router_Task_Profiling.md`

---

### 3. **Issue/Context (Corporativo)**
**Quando:** Issue é criada ou resolvida

**Captura:** Título + descrição
- Cria `CTX-XXX_Issue_Title.md`
- Vincula a decisões relacionadas
- Status: `rascunho` (até resolver)

**Exemplo:** Issue "Ollama connectivity"
→ `CTX-XXX_Ollama_Connectivity.md`

---

### 4. **Sessão Claude (Pessoal/Decisões)**
**Quando:** Você faz `/compact` no final da sessão

**Captura:** Automático via `post-compact.sh` hook
- Cria `brain/_conversas-claude/YYYY-MM-DD_Session_Summary.md`
- Extrai decisões principais (se houver)
- Vincula a neurônios relacionados
- Tags automáticas baseadas em conteúdo

**Exemplo:**
```
brain/_conversas-claude/2026-06-07_Brain_Capture_Setup.md
```

---

## 🔧 Componentes da Automação

### GitHub Actions Workflows

#### **brain-capture.yml** (Diário 6 PM)
```yaml
name: Brain Capture Daily
on:
  schedule:
    - cron: '0 18 * * *'  # 6 PM UTC
  
jobs:
  capture:
    runs-on: ubuntu-latest
    steps:
      1. Parse commits (últimas 24h)
         └─ Procura por prefixos: decision:, feature:, fix:, docs:
      
      2. Capture merged PRs
         └─ Extract title + description + labels
      
      3. Analyze issues
         └─ Closed issues → contexto updated
      
      4. Create neurons
         └─ Gera DEC, PRJ, CTX, SYS automaticamente
      
      5. Link neurons
         └─ Cria referências cruzadas (backlinks)
      
      6. Commit to git
         └─ "automation: brain capture [date]"
      
      7. Slack notification
         └─ "#liquid-lab: 3 neurônios criados"
```

---

### Local Hook: post-compact.sh

**Localização:** `.claude/hooks/post-compact.sh`

**Executado:** Quando você faz `/compact` no final da sessão

**O que faz:**
```bash
1. Detecta email da sessão (operations@liquidlab.ag)
   └─ Se corporate → usa brain da Liquid Lab

2. Extrai do transcript:
   └─ Decisões principais
   └─ Problemas resolvidos
   └─ Próximos passos

3. Cria neurônio de sessão:
   └─ brain/_conversas-claude/YYYY-MM-DD_HHmm_Title.md
   └─ Frontmatter completo (title, data, tipo, tags, status)
   └─ Links para neurônios relacionados

4. Git commit automático:
   └─ "session: [date] [title]"
   
5. Git push (se online)
```

**Exemplo de neurônio gerado:**
```markdown
---
title: CTX-008 Brain Capture Setup Session
data: 2026-06-07
tipo: contexto
tags: [sessão, brain-capture, automação, decisão]
status: ativo
---

# CTX-008 — Brain Capture Setup Session

**Data:** 2026-06-07  
**Duração:** 2h 30min  
**Resultado:** 3 neurônios criados, rotina documentada

---

## 🎯 Decisões Principais

- Implementar automação de captura em 4 triggers (commit, PR, issue, /compact)
- Usar pattern DEC- para decisões arquiteturais
- Links bidirecionais para rastreabilidade

---

## 🔗 Relacionado

[[DEC-005_Brain_Capture_Architecture]]
[[PRJ-001_Liquid_Lab]]
[[SYS-001_Obsidian_Git_Configuration]]
```

---

## 📊 Fluxo Completo por Dia

### **Morning (9 AM)**
```
Marcelo: git pull
  ↓
Marina: watch-sync puxa automaticamente (a cada 5 min)
  ↓
Obsidian recarrega brain/ (git auto-sync)
```

### **Durante o Dia (9 AM - 5 PM)**
```
Marcelo:
  1. Codifica
  2. git commit -m "decision: ..."  ← Captura automática noturna
  3. git push                        ← Triggers GitHub Actions CI
  
Marina:
  watch-sync sincroniza automaticamente (a cada 5 min)
```

### **Final do Dia (5 PM)**
```
Marcelo: git tag v1.2.3 && git push --tags
  ↓
GitHub Actions: cd-deploy.yml roda (Docker build, deploy)
  ↓
Slack notification: deploy success/fail
```

### **Sessão Claude Termina**
```
Marcelo: /compact
  ↓
post-compact.sh hook executa:
  ├─ Extrai decisões da sessão
  ├─ Cria neurônio em brain/_conversas-claude/
  ├─ Commit automático
  └─ Push (se online)
  ↓
Obsidian Git: auto-sync (10 min)
  ↓
GitHub: commit aparece em main
```

### **Diário às 6 PM**
```
brain-capture.yml executa (GitHub Actions):
  ├─ Parse commits das últimas 24h
  ├─ Capture PRs merged
  ├─ Analyze issues
  ├─ Create/update neurônios
  ├─ Link them together
  ├─ Commit to main
  └─ Slack notification
```

---

## 🎯 Padrões de Commit para Automação

Para que a captura funcione bem, use prefixos padronizados:

| Prefixo | Tipo | Neurônio | Exemplo |
|---------|------|----------|---------|
| `decision:` | Decisão arquitetural | `DEC-XXX` | `decision: implement model router` |
| `feature:` | Nova funcionalidade | `PRJ-XXX` | `feature: add task profiling` |
| `fix:` | Bug fix | Link `DEC` | `fix: ollama connection timeout` |
| `docs:` | Documentação | `SYS-XXX` | `docs: update sync strategy` |
| `refactor:` | Refatoração | Link `DEC` | `refactor: simplify model router logic` |
| `chore:` | Manutenção | Ignore | `chore: update dependencies` |

---

## 📝 Exemplo: Fluxo Completo

### **1. Você toma uma decisão**
```
Marcelo: "Vou implementar Model Router com TaskProfile-based routing"
```

### **2. Você codifica e commita**
```bash
git commit -m "decision: implement model router with taskprofile-based routing"
git push
```

### **3. Noturna (6 PM) - brain-capture.yml roda**
```
GitHub Actions:
✓ Parse commit message
✓ Detecta "decision: implement model router..."
✓ Cria DEC-005_Model_Router_TaskProfile.md
✓ Adiciona tags: [arquitetura, routing, modelo]
✓ Commit: "automation: brain capture 2026-06-07"
✓ Slack: "#liquid-lab: 1 decisão capturada"
```

### **4. Você faz /compact no final da sessão**
```
post-compact.sh:
✓ Detecta email: operations@liquidlab.ag
✓ Extrai decisões da sessão
✓ Cria CTX-008_Model_Router_Setup_Session.md
✓ Vincula: [[DEC-005_Model_Router_TaskProfile]]
✓ Commit + Push automático
```

### **5. Obsidian sincroniza (10 min)**
```
brain/
├── _neurônios/
│   ├── dec/
│   │   └── DEC-005_Model_Router_TaskProfile.md  ✅ NOVO
│   └── ctx/
│       └── CTX-008_Model_Router_Setup_Session.md ✅ NOVO
├── _conversas-claude/
│   └── 2026-06-07_Model_Router_Decision.md      ✅ NOVO
└── .obsidian/
    └── (auto-sync config)
```

### **6. Você vê no Obsidian**
- Neurônios aparecem em tempo real
- Backlinks automáticos criados
- Graph view mostra conexões
- Tags facilitam busca

---

## 🚀 Setup da Automação

### **Step 1: Verificar GitHub Actions**
```bash
# Verify workflows estão ativas
ls -la .github/workflows/
# Deve ter: ci-test.yml, cd-deploy.yml, operations.yml, brain-capture.yml
```

### **Step 2: Verificar Obsidian Git Plugin**
```
Obsidian Settings → Obsidian Git:
✓ Auto pull interval: 10 minutes
✓ Auto push: enabled
✓ Auto commit: enabled
✓ Commit interval: 10 minutes
```

### **Step 3: Verificar post-compact Hook**
```bash
# Check hook exists
ls -la .claude/hooks/post-compact.sh

# Deve estar executable
chmod +x .claude/hooks/post-compact.sh
```

### **Step 4: Test**
```bash
# Faça um commit de teste
git commit -m "decision: test brain capture automation"
git push

# Veja GitHub Actions rodando
gh run list -L 5

# Às 6 PM, brain-capture.yml cria neurônio automaticamente
```

---

## 🔍 Monitoramento

### **Ver Neurônios Criados Automaticamente**
```bash
# List neurons por tipo
find brain/_neurônios -name "*.md" -type f | sort

# Buscar neurônios criados hoje
find brain/_neurônios -name "*.md" -mtime -1
```

### **Ver Logs de Automação**
```bash
# GitHub Actions logs
gh run list -L 5
gh run view <run-id> --log

# Post-compact hook logs
cat .logs/post-compact.log
```

### **Verificar Sincronização**
```bash
# Status do git
git status

# Ver commits recentes
git log --oneline -10

# Verify Obsidian sync
tail -f ~/.logs/obsidian-git.log  # Se existir
```

---

## 🤔 FAQ

**P: Meu commit não criou um neurônio. Por quê?**  
R: Verifique se o prefixo estava correto (`decision:`, `feature:`, etc.). Neurônios são criados durante brain-capture.yml (6 PM UTC). Se passou das 6 PM, pode clicar manualmente no GitHub Actions ou aguardar até amanhã.

**P: Posso editar um neurônio criado automaticamente?**  
R: Sim. A automação só cria, não sobrescreve. Você pode editar livremente. Próximas automações não vão sobrescrever suas edições.

**P: E se eu quiser criar um neurônio manualmente?**  
R: Crie normalmente em `brain/_neurônios/[tipo]/`. A automação não entra em conflito com criação manual.

**P: Obsidian Git não está sincronizando. O que fazer?**  
R: 1) Verify plugin está ativo (Settings → Obsidian Git). 2) Manual: `cd brain && git push`. 3) Obsidian pode estar offline — verifique conexão.

**P: Quantos neurônios a automação cria por dia?**  
R: Depende de commits. Mínimo 1 (se houver 1 `decision:` commit). Máximo: todos os commits que tenham prefixo válido.

---

## 📚 Documentação Relacionada

- **[VAULT-NEURON-RULES.md](VAULT-NEURON-RULES.md)** — Regras de formatação de neurônios
- **[SYNC-DAILY-WORKFLOW.md](../SYNC-DAILY-WORKFLOW.md)** — Workflow diário para Marcelo e Marina
- **[SYNC-AND-DEPLOY-STRATEGY.md](SYNC-AND-DEPLOY-STRATEGY.md)** — Estratégia completa de sync
- **[.github/workflows/brain-capture.yml](../.github/workflows/brain-capture.yml)** — GitHub Actions workflow
- **[.claude/hooks/post-compact.sh](../.claude/hooks/post-compact.sh)** — Local hook para /compact

---

## ✅ Checklist: Activate Brain Capture

- [ ] Verificar `.github/workflows/brain-capture.yml` existe
- [ ] Verificar Obsidian Git plugin instalado e configurado (10 min auto-sync)
- [ ] Verificar `.claude/hooks/post-compact.sh` existe e é executável
- [ ] Fazer um commit de teste com prefixo `decision:`
- [ ] Aguardar brain-capture.yml rodar (próximas 6 PM ou manual em GitHub Actions)
- [ ] Verificar neurônio foi criado em `brain/_neurônios/dec/`
- [ ] Testar `/compact` e verificar se neurônio de sessão foi criado
- [ ] Verificar Obsidian sincronizou automaticamente

---

## 🎯 Sumário

| Ação | Trigger | Resultado | Local |
|------|---------|-----------|-------|
| Commit com `decision:` | Push para git | `DEC-XXX` criado | `_neurônios/dec/` |
| Commit com `feature:` | Push para git | `PRJ-XXX` criado | `_neurônios/prj/` |
| PR merged | Merge para main | `PRJ-XXX` atualizado | `_neurônios/prj/` |
| Issue criada/resolvida | Create/close | `CTX-XXX` criado | `_neurônios/ctx/` |
| `/compact` no final | End of session | Sessão capturada | `_conversas-claude/` |
| brain-capture.yml | 6 PM UTC diário | Tudo acima processado | `brain/` (git sync) |

---

**Status:** ✅ Rotina implementada | **Last update:** 2026-06-07

_Tudo automatizado. Você trabalha, o cérebro aprende._
