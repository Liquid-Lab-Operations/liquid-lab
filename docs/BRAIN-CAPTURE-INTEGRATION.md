---
title: Brain Capture — Integração Completa
date: 2026-06-07
status: Standards
author: Liquid Lab Operations
---

# Brain Capture — Integração Completa

**Como todos os componentes da automação de neurônios trabalham juntos na prática.**

---

## 🎯 Visão Geral

```
┌──────────────────────────────────────────────────────────────────┐
│                     BRAIN CAPTURE SYSTEM                         │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  LOCAL (Seu Laptop)          REMOTE (GitHub)     OBSIDIAN        │
│  ┌─────────────────────┐    ┌──────────────┐   ┌────────────┐  │
│  │ Your Work           │    │ GitHub Push  │   │ Vault      │  │
│  ├─────────────────────┤    ├──────────────┤   ├────────────┤  │
│  │ • git commit        │───→│ brain-*.yml  │─→ │ Auto-sync  │  │
│  │ • /compact          │    │ (6 PM daily) │   │ (10 min)   │  │
│  │ • PRs/Issues        │    └──────────────┘   └────────────┘  │
│  └─────────────────────┘           ↓                    ↑       │
│          ↓                    Creates neurônios         │       │
│  ┌─────────────────────┐           ↓                    │       │
│  │ post-compact.sh     │    ┌──────────────┐            │       │
│  │ (local hook)        │    │ brain/       │            │       │
│  │ Cria CTX neurônios  │    │ _neurônios/  │            │       │
│  └─────────────────────┘    │ [dec/prj..]  │────────────┘       │
│                             └──────────────┘                     │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

Fluxo:
1. Você commita ("decision: ...")
2. brain-capture.yml (GitHub) parse commit
3. Cria DEC-XXX neurônio em brain/
4. Obsidian sincroniza automaticamente (10 min)
5. Você vê em Obsidian em tempo quase real

Ao mesmo tempo:
1. Você faz /compact (fim de sessão)
2. post-compact.sh (local) roda
3. Cria CTX-XXX neurônio em _conversas-claude/
4. Obsidian sincroniza
5. Links bidirecionais criados
```

---

## 🔄 Componentes & Responsabilidades

### **1. GitHub Actions: brain-capture.yml**

**Arquivo:** `.github/workflows/brain-capture.yml`

**Responsável por:**
- Rodar todos os dias às 6 PM UTC
- Parse commits das últimas 24h
- Capturar PRs merged
- Capturar issues fechadas
- Categorizar por tipo (decision, feature, fix, docs)
- Gerar neurônios (DEC, PRJ, SYS, CTX)
- Criar backlinks automáticos
- Commit e push para `main`
- Notificar Slack

**Trigger:** Cron `0 18 * * *` (6 PM UTC)

**Tempo:** ~2-3 minutos

---

### **2. Local Hook: post-compact.sh**

**Arquivo:** `.claude/hooks/post-compact.sh`

**Responsável por:**
- Executar quando você faz `/compact`
- Detectar contexto (corporate/personal)
- Extrair insights da sessão
- Gerar neurônio em `_conversas-claude/`
- Commit automático
- Git push (se online)

**Trigger:** `/compact` no final da sessão

**Tempo:** ~10 segundos

---

### **3. Obsidian Git Plugin**

**Integração:** Obsidian + Git plugin

**Responsável por:**
- Auto-pull a cada 10 minutos
- Auto-commit a cada 10 minutos
- Auto-push contínuo
- Recarregar vault automaticamente
- Manter `brain/` em sync com GitHub

**Config:**
```
Settings → Obsidian Git:
✓ Auto pull: 10 minutes
✓ Auto commit: enabled
✓ Commit interval: 10 minutes
✓ Auto push: enabled
```

---

### **4. Git Hooks: pre-commit**

**Arquivo:** `.husky/pre-commit`

**Responsável por:**
- Lint (prettier, eslint)
- Type check
- Tests
- Garantir código limpo antes de commit

**Trigger:** `git commit`

---

### **5. Regras de Neurônios: VAULT-NEURON-RULES.md**

**Documento:** `docs/VAULT-NEURON-RULES.md`

**Define:**
- 4 tipos de neurônios (CTX, PRJ, DEC, SYS)
- Frontmatter obrigatório
- Nomenclatura de arquivo
- Estrutura de conteúdo
- Links e tags

---

## 🌊 Fluxo Completo Por Dia

### **Morning (9 AM)**
```
┌─ Marcelo: git pull (pega mudanças da noite)
│
├─ Marina: watch-sync puxa automaticamente (a cada 5 min)
│
└─ Obsidian: sincroniza automaticamente (10 min)
   └─ Você vê neurônios da sessão anterior de Marcelo
```

### **Durante o Dia (9 AM - 5 PM)**
```
Marcelo:
┌─ Trabalha normalmente
│
├─ Faz commits:
│  └─ "decision: implement model router"
│     └─ Será capturado amanhã às 6 PM
│
├─ Abre PRs:
│  └─ "Add health check endpoint"
│     └─ Será capturado quando merged
│
└─ Não precisa fazer nada — automático!

Marina:
┌─ watch-sync puxa a cada 5 min
│
└─ Obsidian sincroniza automaticamente
   └─ Vê mudanças de Marcelo em tempo quase real
```

### **Fim da Sessão**
```
Marcelo faz /compact:
┌─ post-compact.sh executa
│
├─ Detecta email: operations@liquidlab.ag
│
├─ Cria neurônio em _conversas-claude/
│  └─ 2026-06-07_Brain_Capture_Setup.md
│
├─ Commit automático:
│  └─ "session: 2026-06-07 - Brain Capture Setup"
│
├─ Git push (se online)
│
└─ Pronto! Neurônio sincroniuzará em 10 min
```

### **Notturno (6 PM)**
```
brain-capture.yml roda automaticamente:
┌─ Parse commits últimas 24h
│  ├─ "decision: implement model router" ✓
│  ├─ "feature: health check endpoint" ✓
│  └─ "fix: null pointer handling" ✓
│
├─ Parse PRs merged
│  └─ "Add health check endpoint" ✓
│
├─ Categorize:
│  ├─ decision → DEC-005
│  ├─ feature → PRJ-003
│  └─ fix → Update DEC-005
│
├─ Create neurônios com frontmatter completo
│
├─ Commit:
│  └─ "automation: brain capture 2026-06-07"
│
├─ Push para main
│
└─ Slack: "#liquid-lab: 2 neurônios criados"
```

### **Próximos 10 Minutos**
```
Obsidian Git plugin sincroniza:
┌─ Pull de GitHub
│
├─ Neurônios aparecem em tempo real
│  ├─ DEC-005_Model_Router.md
│  └─ PRJ-003_Health_Check.md
│
├─ Graph view atualiza
│  └─ Mostra conexão: PRJ-003 → DEC-005
│
└─ Você pode navegar/editar
```

---

## 📊 Padrão de Commits para Automação

Para que a captura automática funcione bem, use estes prefixos:

```markdown
| Prefixo     | Tipo | Neurônio | Exemplo |
|-------------|------|----------|---------|
| decision:   | DEC  | DEC-XXX  | decision: implement model router |
| feature:    | PRJ  | PRJ-XXX  | feature: add health check |
| fix:        | DEC  | Link     | fix: handle null pointer |
| docs:       | SYS  | SYS-XXX  | docs: update sync strategy |
| refactor:   | DEC  | Link     | refactor: simplify logic |
| chore:      | —    | (ignore) | chore: update dependencies |
```

---

## 🔗 Como Links Funcionam

### **Automático (brain-capture.yml)**
```
Commit: "decision: implement model router"
├─ Cria: DEC-005
│  ├─ Tags: [arquitetura, routing, decisão]
│  └─ Content: "Model Router Implementation"
│
Commit: "feature: add health check endpoint"
├─ Cria: PRJ-003
│  ├─ Tags: [feature, endpoint, health]
│  └─ Content: "Health Check Endpoint"
│
brain-capture.yml detecta relação:
├─ Se PRJ-003 menciona "model router"
│  └─ Adiciona link: [[DEC-005]]
│
└─ Obsidian cria backlink automático
   └─ DEC-005 agora mostra: "Referenced by PRJ-003"
```

### **Manual (você cria)**
```
Você edita DEC-005:
├─ Adiciona na seção "## 🔗 Relacionado"
│
└─ [[PRJ-003_Health_Check_Endpoint]]
   [[SYS-001_API_Configuration]]

Obsidian reconhece e cria:
├─ Backlinks bidirecionais
├─ Graph view mostra conexões
└─ Search funciona em ambas as direções
```

---

## 📈 Exemplos Reais

### **Exemplo 1: Decision → Feature → Fix**

```bash
# Segunda-feira 10:00 AM
git commit -m "decision: implement model router with intelligent routing"
git push
# Capturado: Amanhã 6 PM → DEC-005_Model_Router

# Quarta-feira 2:30 PM
git commit -m "feature: add model router to api routes"
git push
# Capturado: Amanhã 6 PM → PRJ-002_Model_Router_API_Routes

# Quinta-feira 4:45 PM
git commit -m "fix: handle null pointer in model router selector"
git push
# Capturado: Amanhã 6 PM → Update DEC-005 com fix note
```

**Resultado:**
```
brain/_neurônios/
├── dec/
│   └── DEC-005_Model_Router.md
│       ├─ Mentions: null pointer fix
│       └─ Links: [[PRJ-002_Model_Router_API_Routes]]
│
└── prj/
    └── PRJ-002_Model_Router_API_Routes.md
        └─ Links: [[DEC-005_Model_Router]]
```

**Graph View:**
```
     DEC-005
       ↓↑
    PRJ-002
```

---

### **Exemplo 2: Sessão Claude → Decisão → Implementação**

```
Sexta-feira 2 PM:
┌─ Sessão Claude: Discute estratégia
│  └─ /compact ao fim
│  └─ post-compact.sh cria CTX-008_Brain_Capture_Strategy
│
Sexta-feira 3 PM:
├─ Implementa o discutido
│  └─ git commit "decision: implement brain capture rotina"
│
Sábado 6 PM:
├─ brain-capture.yml roda
│  ├─ Parse commit
│  ├─ Cria DEC-006_Brain_Capture_Rotina
│  ├─ Detecta relação com CTX-008
│  └─ Auto-links criados
│
Domingo (você abre Obsidian):
├─ CTX-008 agora mostra:
│  └─ "Referenced by DEC-006"
├─ DEC-006 mostra:
│  └─ "Based on CTX-008"
└─ Graph mostra conexão visual
```

---

## 🚀 Setup Checklist

- [ ] `.github/workflows/brain-capture.yml` existe
- [ ] `.claude/hooks/post-compact.sh` existe e é executável
  ```bash
  chmod +x .claude/hooks/post-compact.sh
  ```
- [ ] Obsidian Git plugin instalado
  ```
  Obsidian → Settings → Community Plugins → Install → "Obsidian Git"
  ```
- [ ] Obsidian Git configurado
  ```
  Settings → Obsidian Git:
  ✓ Auto pull interval: 10 minutes
  ✓ Auto commit: enabled
  ✓ Auto push: enabled
  ```
- [ ] Cron job ativo (6 PM UTC)
  ```bash
  # Verify no repo settings
  gh api repos/Operations-Liquid-Lab/liquid-lab/actions/workflows
  ```
- [ ] Slack webhook configurada (GitHub Secrets)
- [ ] Brain directory sincronizado
  ```bash
  cd brain && git status
  ```
- [ ] Teste completo feito
  ```bash
  # Fazer commit de teste
  git commit -m "decision: test brain capture automation"
  git push
  
  # Ver GitHub Actions rodando
  gh run list -L 5
  
  # Aguardar próximas 6 PM ou trigger manual
  ```

---

## 🔍 Monitoramento

### **Daily Check**
```bash
# Ver quantos neurônios foram criados hoje
find brain/_neurônios -type f -mtime -1 | wc -l

# Ver últimos commits
git log --oneline brain/_neurônios | head -10

# Ver se algum neurônio está orphaned (sem links)
# (use Obsidian Graph view)
```

### **Weekly Review**
```bash
# Neurônios por tipo
echo "DEC: $(find brain/_neurônios/dec -name "*.md" | wc -l)"
echo "PRJ: $(find brain/_neurônios/prj -name "*.md" | wc -l)"
echo "CTX: $(find brain/_neurônios/ctx -name "*.md" | wc -l)"
echo "SYS: $(find brain/_neurônios/sys -name "*.md" | wc -l)"

# Decisões mais linkadas
# (use Obsidian para visualizar)
```

---

## 🆘 Troubleshooting Rápido

| Problema | Solução |
|----------|---------|
| Neurônios não aparecem em Obsidian | Obsidian Git configurado? Auto-pull 10min ativo? |
| Commits não viram neurônios | Prefixo correto? (decision:, feature:, etc) |
| /compact não criou neurônio | post-compact.sh executável? Email correto? |
| brain-capture.yml não rodou | Cron job ativo? Verify Settings → Actions |
| Slack não notificou | SLACK_WEBHOOK secret configurada? |
| Git push falhou | Verifique conexão internet |

---

## 📚 Documentação Relacionada

**Leia nesta ordem:**

1. **[VAULT-NEURON-RULES.md](VAULT-NEURON-RULES.md)** — Regras e padrões de neurônios
2. **[BRAIN-CAPTURE-ROTINA.md](BRAIN-CAPTURE-ROTINA.md)** — Overview de triggers e fluxos
3. **[BRAIN-CAPTURE-WORKFLOW.md](BRAIN-CAPTURE-WORKFLOW.md)** — Detalhes técnicos do GitHub Actions
4. **[SYNC-AND-DEPLOY-STRATEGY.md](SYNC-AND-DEPLOY-STRATEGY.md)** — Contexto maior (sync + deploy)
5. **[SYNC-DAILY-WORKFLOW.md](../SYNC-DAILY-WORKFLOW.md)** — Workflow diário prático

---

## 🎯 Sumário Executivo

```
Tudo é automático:

✅ Commit com "decision:" → DEC criado (6 PM)
✅ PR merged → PRJ criado (6 PM)
✅ /compact → CTX criado (instantâneo)
✅ Obsidian sincroniza (10 min)
✅ Links criados automaticamente
✅ Graph atualiza em tempo real

Resultado:
├─ Brain nunca fica desatualizado
├─ Decisões rastreáveis
├─ Contexto sempre disponível
└─ Zero trabalho manual
```

---

**Status:** ✅ Integração completa | **Last update:** 2026-06-07

_Automação que nunca dorme — seu cérebro corporativo sempre aprendendo._
