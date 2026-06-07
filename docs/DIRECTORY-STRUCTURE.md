---
title: Estrutura de Diretórios — Local e Remoto
date: 2026-06-07
status: Reference
---

# Estrutura de Diretórios — Local vs Remoto

**Onde fica tudo: local, remoto, e sincronização.**

---

## 🎯 Visão Geral

```
LOCAL (Marcelo laptop)          REMOTO (GitHub)              LOCAL (Marina laptop)
┌──────────────────────┐       ┌──────────────┐            ┌──────────────────────┐
│ ~/liquid-lab/        │◄─────→│ origin/main  │◄───────────→│ ~/liquid-lab/        │
│ ├─ code/             │   git │              │   git pull  │ ├─ code/             │
│ ├─ brain/            │ push/ │ + workflows  │   auto      │ ├─ brain/            │
│ ├─ docs/             │ pull  │              │ (daemon)    │ ├─ docs/             │
│ └─ ...               │       └──────────────┘             │ └─ ...               │
└──────────────────────┘                                    └──────────────────────┘
     Marcelo                                                        Marina
   (primary)                                                    (watch-sync)
```

---

## 📁 LOCAL — Cada Laptop

### Marcelo's MacBook

```
/Users/marcelopivovar/
├── Claude/
│   └── Projects/
│       └── liquid-lab/                    # ← Repository root
│           │
│           ├── code/                      ✅ PUSH to Git
│           │   ├── src/
│           │   │   ├── app/
│           │   │   ├── components/
│           │   │   ├── utils/
│           │   │   └── types/
│           │   ├── package.json
│           │   ├── tsconfig.json
│           │   └── next.config.js
│           │
│           ├── brain/                     ✅ PUSH to Git (Obsidian vault)
│           │   ├── DEC/                   (Decisions)
│           │   │   ├── DEC-20260607-001.md
│           │   │   └── ...
│           │   ├── PRJ/                   (Projects)
│           │   │   ├── PRJ-2026-06-07-*.md
│           │   │   └── ...
│           │   ├── CTX/                   (Context)
│           │   │   ├── CTX-*.md
│           │   │   └── ...
│           │   ├── SYS/                   (Systems)
│           │   │   └── SYS-*.md
│           │   ├── _conversas-claude/     (Sessions)
│           │   │   ├── 2026-06-07-*.md
│           │   │   └── ...
│           │   └── .obsidian/             ✅ PUSH (Obsidian config)
│           │
│           ├── infra/                     ✅ PUSH to Git
│           │   ├── k8s/
│           │   │   ├── deployment.yaml
│           │   │   ├── service.yaml
│           │   │   └── configmap.yaml
│           │   ├── docker-compose.yml
│           │   └── Dockerfile
│           │
│           ├── mcp/                       ✅ PUSH to Git
│           │   ├── whatsapp/
│           │   │   ├── index.ts
│           │   │   └── handlers.ts
│           │   └── slack/
│           │       ├── index.ts
│           │       └── handlers.ts
│           │
│           ├── scripts/                   ✅ PUSH to Git
│           │   ├── brain-sync.sh
│           │   ├── setup-sync.sh
│           │   ├── deploy.sh
│           │   └── backup.sh
│           │
│           ├── docs/                      ✅ PUSH to Git
│           │   ├── ADR-001-*.md
│           │   ├── ARCHITECTURE-*.md
│           │   ├── INDEX.md
│           │   ├── SYNC-AND-DEPLOY-STRATEGY.md
│           │   └── ...
│           │
│           ├── config/                    ✅ PUSH to Git
│           │   ├── SYNC-POLICY.md
│           │   ├── SYNC-MANIFEST.json
│           │   └── shared.env
│           │
│           ├── assets/                    ✅ PUSH to Git
│           │   ├── liquid-lab/
│           │   │   ├── logos/
│           │   │   ├── brand-guidelines.pptx
│           │   │   └── colors.md
│           │   └── ...
│           │
│           ├── .github/                   ✅ PUSH to Git
│           │   └── workflows/
│           │       ├── ci-test.yml
│           │       ├── cd-deploy.yml
│           │       ├── operations.yml
│           │       └── brain-capture.yml
│           │
│           ├── .claude/                   ✅ PUSH to Git (except .local)
│           │   ├── CLAUDE.md              ✅ PUSH
│           │   ├── SOP-*.md               ✅ PUSH
│           │   ├── hooks/                 ✅ PUSH
│           │   │   ├── post-message.sh
│           │   │   ├── post-chapter.sh
│           │   │   ├── post-compact.sh
│           │   │   └── post-merge.sh
│           │   ├── scripts/               ✅ PUSH
│           │   │   └── session-health-check.js
│           │   ├── workflows/             ✅ PUSH
│           │   │   └── auto-session-monitor.js
│           │   ├── settings.shared.json   ✅ PUSH
│           │   └── settings.local.json    ❌ LOCAL ONLY (.gitignore)
│           │
│           ├── .husky/                    ✅ PUSH to Git
│           │   └── pre-commit
│           │
│           ├── .gitignore                 ✅ PUSH to Git
│           ├── .env.example               ✅ PUSH to Git
│           ├── .env.local                 ❌ LOCAL ONLY (.gitignore)
│           ├── package.json               ✅ PUSH to Git
│           ├── package-lock.json          ✅ PUSH to Git
│           ├── tsconfig.json              ✅ PUSH to Git
│           ├── README.md                  ✅ PUSH to Git
│           ├── CONTRIBUTING.md            ✅ PUSH to Git
│           ├── SYNC-DAILY-WORKFLOW.md     ✅ PUSH to Git
│           │
│           ├── node_modules/              ❌ LOCAL ONLY (.gitignore)
│           ├── dist/                      ❌ LOCAL ONLY (.gitignore)
│           ├── .next/                     ❌ LOCAL ONLY (.gitignore)
│           ├── .logs/                     ❌ LOCAL ONLY (.gitignore)
│           ├── .DS_Store                  ❌ LOCAL ONLY (.gitignore)
│           └── .vscode/                   ❌ LOCAL ONLY (.gitignore)
│
└── .claude/
    ├── projects/
    │   └── liquid-lab/
    │       └── memory/                    ✅ PUSH to Git
    │           ├── MEMORY.md
    │           ├── liquid_lab_startup_context.md
    │           ├── liquid_lab_session_status.md
    │           ├── liquid_lab_patterns_and_decisions.md
    │           ├── founders_marcelo_marina.md
    │           └── context_optimization_system.md
    │
    └── scripts/
        ├── watch-sync.sh                  (Marina's background daemon)
        └── ...
```

### Marina's MacBook

```
/Users/marina/
├── Code/
│   └── liquid-lab/                        # ← Same as Marcelo (via git pull)
│       │
│       ├── code/                          ✅ PUSH to Git
│       ├── brain/                         ✅ PUSH to Git
│       │   └── Obsidian vault (auto-sync from git pull)
│       ├── docs/                          ✅ PUSH to Git
│       ├── infra/                         ✅ PUSH to Git
│       │
│       ├── node_modules/                  ❌ LOCAL (npm install)
│       ├── dist/                          ❌ LOCAL (build output)
│       ├── .logs/                         ❌ LOCAL (watch-sync logs)
│       ├── .env.local                     ❌ LOCAL (.gitignore)
│       └── ...
│
└── .logs/
    └── watch-sync.log                     ❌ LOCAL (daemon logs)
```

---

## 🌐 REMOTO — GitHub Repository

```
github.com/Liquid-Lab-Operations/liquid-lab

main branch (protected):
├── code/                                   (Latest stable code)
├── brain/                                  (Knowledge vault)
│   ├── DEC/
│   ├── PRJ/
│   ├── CTX/
│   ├── SYS/
│   └── _conversas-claude/
├── docs/                                   (All documentation)
├── infra/                                  (DevOps configs)
├── mcp/                                    (Integration servers)
├── scripts/                                (Automation)
├── config/                                 (Shared configs)
├── assets/                                 (Brand assets)
├── .github/                                (CI/CD workflows)
├── .claude/                                (Claude instructions)
├── .husky/                                 (Pre-commit hooks)
├── .gitignore                              (What NOT to push)
├── package.json                            (Dependencies)
├── README.md                               (Project overview)
├── CONTRIBUTING.md                         (Dev guide)
├── SYNC-DAILY-WORKFLOW.md                  (Quick reference)
├── AUTOMACAO-LIQUID-LAB-SUMMARY.md         (Automation summary)
└── .env.example                            (Template, secrets in .local)

protected branches:
  - main: Only PRs, auto-merge after CI passes
  
tags:
  - v1.0.0, v1.0.1, v1.1.0, ... (release versions)
  - Each tag → Deploy automático to production

CI/CD Workflows (in .github/workflows/):
  - ci-test.yml → On push: tests, lint, coverage
  - cd-deploy.yml → On tag: docker build, k8s deploy
  - operations.yml → Daily 2 AM: backups, secrets, health
  - brain-capture.yml → Daily 6 PM: decisions, PRs capture
```

---

## 🔄 Sincronização Fluxo

### Passo 1: Marcelo Trabalha Localmente

```
Marcelo MacBook:
  ~/liquid-lab/code/
    └─ Edita arquivo
    └─ npm run dev (testa localmente)
    └─ git commit (pre-commit hook: prettier, eslint, tests)
    └─ git push
         ↓
GitHub (main):
    └─ Recebe commit
    └─ CI roda: ci-test.yml
    └─ Tests, lint, coverage ✅
         ↓
Marina MacBook:
    └─ watch-sync.sh detecta mudança
    └─ 5 min depois: git pull automático
    └─ ~/liquid-lab/ atualizado com código de Marcelo
```

### Passo 2: Marina Trabalha

```
Marina MacBook:
  ~/liquid-lab/code/
    └─ Edita arquivo (em arquivo diferente de Marcelo)
    └─ npm run dev (testa)
    └─ git commit (pre-commit hook roda)
    └─ git push
         ↓
GitHub (main):
    └─ Recebe commit
    └─ CI roda: ci-test.yml
    └─ Sem conflitos! ✅
         ↓
Marcelo MacBook:
    └─ git pull (pega mudanças de Marina)
    └─ ~/liquid-lab/ atualizado
```

### Passo 3: Deploy

```
Marcelo (ou Marina) MacBook:
  git tag v1.2.3
  git push --tags
         ↓
GitHub:
    └─ Tag v1.2.3 criada
    └─ cd-deploy.yml dispara
         ├─ Docker build
         ├─ Push to registry
         ├─ Deploy staging
         ├─ Health checks ✅
         ├─ Deploy production ✅
         └─ Slack notification
         ↓
Production:
    └─ v1.2.3 rodando ✅
    └─ Ambos (Marcelo + Marina) podem usar
```

### Passo 4: Brain Capture

```
Marcelo:
  /compact (end of session)
         ↓
Local:
  post-compact.sh executa:
    ├─ brain/_conversas-claude/YYYY-MM-DD-*.md criado
    ├─ git commit automático
    └─ git push automático
         ↓
GitHub:
  brain-capture.yml dispara (daily 6 PM):
    ├─ Parse commits → brain/DEC/DEC-*.md
    ├─ Capture PRs → brain/PRJ/PRJ-*.md
    ├─ Capture issues → brain/CTX/CTX-*.md
    └─ Sync to git
         ↓
Marina (watch-sync):
  5 min depois:
    ├─ git pull automático
    ├─ brain/ atualizado em Obsidian
    └─ Novas decisions/insights visíveis
```

---

## 📊 Matriz: O Que Sincroniza

| Diretório | Local | Remoto | Sincroniza | Notas |
|-----------|-------|--------|-----------|-------|
| **code/** | ✅ | ✅ | Sim | Código-fonte principal |
| **brain/** | ✅ | ✅ | Sim | Obsidian vault (auto-commit) |
| **docs/** | ✅ | ✅ | Sim | Documentação (sempre atualizada) |
| **infra/** | ✅ | ✅ | Sim | DevOps configs (K8s, Docker) |
| **mcp/** | ✅ | ✅ | Sim | Integration servers |
| **scripts/** | ✅ | ✅ | Sim | Automação scripts |
| **config/** | ✅ | ✅ | Sim | Shared configurations |
| **assets/** | ✅ | ✅ | Sim | Brand assets |
| **.github/** | ✅ | ✅ | Sim | CI/CD workflows |
| **.claude/** | ✅ | ✅ (exceto .local) | Parcial | shared.json sim, settings.local não |
| **.husky/** | ✅ | ✅ | Sim | Pre-commit hooks |
| **.gitignore** | ✅ | ✅ | Sim | Define o que NOT push |
| **node_modules/** | ✅ | ❌ | Não | npm install regenera |
| **dist/, .next/** | ✅ | ❌ | Não | Build artifacts (regenerate) |
| **.env.local** | ✅ | ❌ | Não | Secrets (NEVER push) |
| **.claude/settings.local.json** | ✅ | ❌ | Não | Permissions (local only) |
| **.logs/** | ✅ | ❌ | Não | Logs locais |
| **.DS_Store** | ✅ | ❌ | Não | macOS metadata |
| **.vscode/** | ✅ | ❌ | Não | IDE configs |

---

## 🚀 Exemplo: Um Dia Real

### Morning (9 AM)

```
Marcelo:
  ~/liquid-lab/
  $ git pull                        (pega mudanças da noite)
  $ npm install                     (atualiza deps)
  $ npm run dev                     (inicia dev server)
  
Marina (watch-sync rodando em background):
  5 minutos depois:
  $ git pull (automático via daemon)
  ~/liquid-lab/ sincronizado com últimas mudanças
```

### Mid-Day (11 AM)

```
Marcelo:
  $ git commit -m "feature: add auth"
  # ✅ pre-commit hook: prettier, eslint, tests
  
  $ git push
  # ✅ GitHub Actions CI roda
  
Marina (watch-sync):
  5 minutos depois:
  $ git pull (automático)
  ~/liquid-lab/ tem nova feature de Marcelo
```

### Afternoon (3 PM)

```
Marina:
  $ git commit -m "feature: add dashboard"
  # ✅ pre-commit hook executa
  
  $ git push
  # ✅ GitHub Actions CI testa (nenhum conflito)
  
Marcelo (manual pull):
  $ git pull
  ~/liquid-lab/ tem nova feature de Marina
```

### Evening (5 PM)

```
Marcelo:
  $ git tag v1.0.0
  $ git push --tags
  
GitHub Actions (cd-deploy.yml):
  ├─ Docker build: v1.0.0
  ├─ Push to registry
  ├─ Deploy staging: tests ✅
  ├─ Deploy production ✅
  └─ Slack: "v1.0.0 deployed!"
  
Production:
  v1.0.0 rodando (Marcelo + Marina features)
```

### Night (6 PM)

```
GitHub (brain-capture.yml):
  ├─ Parse commits Marcelo + Marina
  ├─ Create brain/DEC/DEC-*.md (decisions)
  ├─ Create brain/PRJ/PRJ-*.md (features)
  └─ Commit to git
  
Marina (watch-sync):
  5 min depois:
  git pull automático
  brain/ atualizado em Obsidian
```

---

## 🔐 Segurança: O Que NÃO Sincroniza

### Sempre LOCAL (Never Commit)

```
.env.local
  └─ DB_PASSWORD=xxx
  └─ API_KEY=yyy
  └─ AWS_SECRET=zzz

.claude/settings.local.json
  └─ Local permissions (not shared)

Personal configs:
  └─ .vscode/
  └─ .idea/
  └─ Obsidian local settings
```

### Secrets no Git (Se Necessário)

```
GitHub Secrets (repo settings):
  └─ DOCKER_PASSWORD
  └─ AWS_SECRET_ACCESS_KEY
  └─ SLACK_WEBHOOK
  └─ (usado apenas em CI/CD via GitHub Actions)

AWS Secrets Manager (prod):
  └─ Database credentials
  └─ API keys
  └─ TLS certificates
```

---

## 📋 Checklist: Setup Diretorios

### Inicial (One Time)

```bash
# Clone repositório
git clone git@github.com:Liquid-Lab-Operations/liquid-lab.git
cd liquid-lab

# Criar .env.local (NEVER commit)
cat > .env.local << EOF
DB_PASSWORD=xxx
API_KEY=yyy
AWS_SECRET=zzz
EOF

# npm setup
npm install
npx husky install

# brain/ (Obsidian)
# - Abrir em Obsidian app
# - Autorizar Git sync plugin
```

### Marina Extra

```bash
# Setup watch-sync daemon
bash scripts/setup-sync.sh "Marina" 300

# Verify
ps aux | grep watch-sync.sh
tail -f ~/.logs/watch-sync.log
```

---

## 🎯 Quick Reference: Where is Everything?

| O Quê | Onde Local | Onde Remoto | Sincroniza |
|-------|-----------|-----------|-----------|
| Código-fonte | ~/liquid-lab/code/ | origin/main/code/ | ✅ Sim |
| Neurônios | ~/liquid-lab/brain/ | origin/main/brain/ | ✅ Sim |
| Documentação | ~/liquid-lab/docs/ | origin/main/docs/ | ✅ Sim |
| Workflows CI/CD | ~/liquid-lab/.github/ | origin/main/.github/ | ✅ Sim |
| Automação | ~/liquid-lab/scripts/ | origin/main/scripts/ | ✅ Sim |
| Secrets | ~/.env.local | GitHub Secrets | ❌ Não |
| Build output | ~/liquid-lab/dist/ | ❌ | ❌ Não |
| Dependencies | ~/liquid-lab/node_modules/ | ❌ | ❌ Não |
| IDE config | ~/liquid-lab/.vscode/ | ❌ | ❌ Não |

---

## 📞 Troubleshooting

### Arquivo não sincroniza
```bash
# Verificar .gitignore
cat .gitignore | grep <file>

# Se quer sincronizar, remover de .gitignore
# Se não quer, adicionar a .gitignore
```

### Sincronização travada (Marina)
```bash
# Ver status
ps aux | grep watch-sync.sh

# Se não rodando, reiniciar
bash scripts/setup-sync.sh "Marina" 300

# Ver logs
tail -f ~/.logs/watch-sync.log
```

### Conflito de merge
```bash
git status                    # mostra qual arquivo
git diff                      # mostra mudanças
git checkout --theirs <file>  # usa versão remota
git commit -m "resolve conflict"
git push
```

---

**Status:** ✅ Estrutura completa mapeada | **Last update:** 2026-06-07

_Tudo sincronizado, nada perdido, sempre em sincronia._
