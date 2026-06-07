# Mapa de Diretórios — Visual Quick Reference

**Onde fica cada coisa: local e remoto**

---

## 🏠 LOCAL (Cada Laptop)

### Marcelo MacBook

```
/Users/marcelopivovar/Claude/Projects/
│
└── liquid-lab/                              (GIT REPO ROOT)
    │
    ├── 📝 README.md                         ✅ Git
    ├── 📝 CONTRIBUTING.md                   ✅ Git
    ├── 📝 SYNC-DAILY-WORKFLOW.md            ✅ Git
    ├── 📝 AUTOMACAO-LIQUID-LAB-SUMMARY.md   ✅ Git
    │
    ├── 📁 code/                             ✅ Git → npm run dev
    │   ├── src/
    │   ├── package.json
    │   └── tsconfig.json
    │
    ├── 📁 brain/                            ✅ Git (Obsidian Vault)
    │   ├── DEC/        (Decisions)
    │   ├── PRJ/        (Projects)
    │   ├── CTX/        (Context)
    │   ├── SYS/        (Systems)
    │   └── _conversas-claude/
    │
    ├── 📁 docs/                             ✅ Git
    │   ├── INDEX.md
    │   ├── DIRECTORY-STRUCTURE.md
    │   ├── SYNC-AND-DEPLOY-STRATEGY.md
    │   ├── ADR-001-NEMOCLAW-SECURITY.md
    │   └── ...
    │
    ├── 📁 infra/                            ✅ Git
    │   ├── k8s/
    │   ├── docker-compose.yml
    │   └── Dockerfile
    │
    ├── 📁 mcp/                              ✅ Git
    │   ├── whatsapp/
    │   └── slack/
    │
    ├── 📁 scripts/                          ✅ Git
    │   ├── brain-sync.sh
    │   ├── setup-sync.sh
    │   └── deploy.sh
    │
    ├── 📁 config/                           ✅ Git
    │   ├── SYNC-POLICY.md
    │   └── shared.env
    │
    ├── 📁 assets/                           ✅ Git
    │   └── liquid-lab/
    │
    ├── 📁 .github/                          ✅ Git
    │   └── workflows/
    │       ├── ci-test.yml
    │       ├── cd-deploy.yml
    │       ├── operations.yml
    │       └── brain-capture.yml
    │
    ├── 📁 .claude/                          ✅ Git (except .local)
    │   ├── CLAUDE.md
    │   ├── SOP-002-*.md
    │   ├── hooks/
    │   │   ├── post-message.sh
    │   │   ├── post-chapter.sh
    │   │   ├── post-compact.sh
    │   │   └── post-merge.sh
    │   ├── scripts/
    │   │   └── session-health-check.js
    │   ├── workflows/
    │   │   └── auto-session-monitor.js
    │   ├── settings.shared.json             ✅ Git
    │   └── settings.local.json              ❌ LOCAL ONLY
    │
    ├── 📁 .husky/                           ✅ Git
    │   └── pre-commit
    │
    ├── 🔒 .env.local                        ❌ LOCAL ONLY (secrets)
    ├── 📝 .env.example                      ✅ Git (template)
    ├── 📝 .gitignore                        ✅ Git
    │
    ├── 📁 node_modules/                     ❌ LOCAL ONLY (npm install)
    ├── 📁 dist/                             ❌ LOCAL ONLY (build)
    ├── 📁 .next/                            ❌ LOCAL ONLY (Next.js cache)
    ├── 📁 .logs/                            ❌ LOCAL ONLY
    └── 📁 .DS_Store                         ❌ LOCAL ONLY
```

### Marina MacBook (Watch-Sync)

```
/Users/marina/Code/
│
└── liquid-lab/                              (GIT REPO ROOT)
    │
    ├── [SAME AS MARCELO - via git pull]
    │   ├── code/
    │   ├── brain/                           (Obsidian auto-sync)
    │   ├── docs/
    │   └── ...
    │
    ├── 📁 node_modules/                     ❌ LOCAL (npm install)
    ├── 📁 dist/                             ❌ LOCAL
    ├── 🔒 .env.local                        ❌ LOCAL (secrets)
    └── 📁 .logs/                            ❌ LOCAL
    
Watch-Sync Daemon:
    └── ~/.logs/watch-sync.log               ❌ LOCAL (daemon logs)
```

---

## 🌐 REMOTO (GitHub)

### Repository: Liquid-Lab-Operations/liquid-lab

```
github.com/Liquid-Lab-Operations/liquid-lab
│
├── main branch (Protected)
│   │
│   ├── 📝 README.md
│   ├── 📝 CONTRIBUTING.md
│   ├── 📝 SYNC-DAILY-WORKFLOW.md
│   ├── 📝 AUTOMACAO-LIQUID-LAB-SUMMARY.md
│   │
│   ├── 📁 code/
│   │   ├── src/
│   │   └── package.json
│   │
│   ├── 📁 brain/
│   │   ├── DEC/
│   │   ├── PRJ/
│   │   ├── CTX/
│   │   ├── SYS/
│   │   └── _conversas-claude/
│   │
│   ├── 📁 docs/
│   │   ├── INDEX.md
│   │   ├── DIRECTORY-STRUCTURE.md
│   │   ├── SYNC-AND-DEPLOY-STRATEGY.md
│   │   └── ...
│   │
│   ├── 📁 infra/, mcp/, scripts/, config/, assets/
│   │
│   ├── 📁 .github/workflows/
│   │   ├── ci-test.yml          → Roda on push (tests, lint)
│   │   ├── cd-deploy.yml        → Roda on tag v* (deploy)
│   │   ├── operations.yml       → Roda daily 2 AM
│   │   └── brain-capture.yml    → Roda daily 6 PM
│   │
│   ├── 📁 .claude/
│   │   ├── CLAUDE.md
│   │   ├── hooks/
│   │   ├── scripts/
│   │   ├── workflows/
│   │   └── settings.shared.json
│   │
│   ├── 📁 .husky/
│   │   └── pre-commit
│   │
│   └── 📝 .gitignore
│
├── Tags (Releases)
│   ├── v1.0.0          → Production release
│   ├── v1.0.1          → Bug fix release
│   ├── v1.1.0          → Feature release
│   └── ...
│
├── GitHub Secrets (Settings → Secrets)
│   ├── DOCKER_USERNAME
│   ├── DOCKER_PASSWORD
│   ├── KUBE_CONFIG
│   ├── AWS_ACCESS_KEY_ID
│   ├── AWS_SECRET_ACCESS_KEY
│   ├── SLACK_WEBHOOK
│   └── MAIL_* (email settings)
│
└── CI/CD Artifacts (Ephemeral)
    ├── Docker images (pushed to registry)
    ├── Build artifacts (uploaded)
    └── Deployment logs
```

---

## 🔄 Sincronização Path

### Fluxo Completo (Passo a Passo)

```
┌─────────────────────────────────────────────────────────────┐
│ LOCAL (Marcelo)                                             │
│ └─ Edit code in ~/liquid-lab/code/                          │
│    └─ git commit "feature: ..."                             │
│       └─ ✅ pre-commit hook: prettier, eslint, tests        │
│          └─ git push                                        │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────────────┐
│ REMOTO (GitHub main)                                       │
│ └─ Recebe commit                                            │
│    └─ CI dispara: ci-test.yml                              │
│       ├─ npm test ✅                                        │
│       ├─ npm lint ✅                                        │
│       └─ coverage ✅                                        │
└────────────────┬────────────────────────────────────────────┘
                 │
         ┌───────┴───────┐
         │               │
         ▼               ▼
    LOCAL (Marina)   BRAIN CAPTURE
    watch-sync.sh    brain-capture.yml
    (5 min)          (daily 6 PM)
    
    git pull         ├─ Parse commits
    automático       │  └─ brain/DEC/*.md
                     │
    ~/liquid-lab/    ├─ Capture PRs
    atualizado       │  └─ brain/PRJ/*.md
                     │
                     ├─ Capture issues
                     │  └─ brain/CTX/*.md
                     │
                     └─ Commit to git
```

### Tag e Deploy

```
┌──────────────────────┐
│ git tag v1.2.3       │
│ git push --tags      │
└──────────┬───────────┘
           │
           ▼
┌────────────────────────────────────────┐
│ GitHub Actions: cd-deploy.yml          │
│ ├─ Docker build v1.2.3                 │
│ ├─ Push to registry                    │
│ ├─ Deploy staging                      │
│ │  └─ Health checks ✅                 │
│ ├─ Deploy production                   │
│ │  └─ Health checks ✅                 │
│ ├─ Slack notification                  │
│ └─ OR: Rollback automático if fail     │
└────────────┬───────────────────────────┘
             │
             ▼
    ┌─────────────────────┐
    │ Production           │
    │ v1.2.3 rodando ✅   │
    └─────────────────────┘
```

---

## 📊 Matriz Rápida

### O Que Fica Onde

```
╔════════════════════════╦═════════════════╦═══════════════╦═════════════════╗
║ Item                   ║ Marcelo Local   ║ Marina Local  ║ GitHub Remoto   ║
╠════════════════════════╬═════════════════╬═══════════════╬═════════════════╣
║ code/                  ║ ✅ Local Git    ║ git pull      ║ ✅ REPO ROOT    ║
║ brain/                 ║ ✅ Obsidian     ║ auto-sync     ║ ✅ REPO ROOT    ║
║ docs/                  ║ ✅ Local Git    ║ git pull      ║ ✅ REPO ROOT    ║
║ .github/workflows/     ║ ✅ Local Git    ║ git pull      ║ ✅ REPO ROOT    ║
║ .env.local (secrets)   ║ ❌ LOCAL ONLY   ║ LOCAL ONLY    ║ ❌ NEVER PUSH   ║
║ node_modules/          ║ ❌ LOCAL        ║ LOCAL         ║ ❌ .gitignore   ║
║ dist/, .next/          ║ ❌ LOCAL        ║ LOCAL         ║ ❌ .gitignore   ║
║ .DS_Store              ║ ❌ LOCAL        ║ LOCAL         ║ ❌ .gitignore   ║
║ watch-sync.log         ║ ❌ N/A          ║ ❌ LOCAL      ║ ❌ NEVER        ║
║ GitHub Secrets         ║ ❌ N/A          ║ ❌ N/A        ║ ✅ Settings     ║
╚════════════════════════╩═════════════════╩═══════════════╩═════════════════╝
```

---

## 🔍 Find Anything

| Preciso Achar... | Onde Está |
|------------------|-----------|
| Código-fonte | `~/liquid-lab/code/src/` |
| Decisões (ADRs) | `~/liquid-lab/brain/DEC/` e `~/liquid-lab/docs/ADR-*.md` |
| Features | `~/liquid-lab/brain/PRJ/` e GitHub PRs |
| Documentação | `~/liquid-lab/docs/` e `README.md` |
| CI/CD workflows | `~/liquid-lab/.github/workflows/` |
| Automação | `~/liquid-lab/scripts/` |
| Secrets | `~/.env.local` (LOCAL ONLY) |
| Brain capture | `~/liquid-lab/brain/_conversas-claude/` |
| Obsidian config | `~/liquid-lab/brain/.obsidian/` |
| Git hooks | `~/liquid-lab/.husky/` |

---

## ✅ Checklist: Dirs Setup

- [ ] Clone: `git clone git@github...`
- [ ] Config: `git config user.email "operations@liquidlab.ag"`
- [ ] Dependencies: `npm install`
- [ ] Hooks: `npx husky install`
- [ ] Secrets: Create `.env.local` (NEVER commit!)
- [ ] GitHub: Add Secrets in repo Settings
- [ ] Brain: Open `brain/` in Obsidian
- [ ] Marina: Run `bash scripts/setup-sync.sh "Marina" 300`

---

**Status:** ✅ Estrutura mapeada | **Last update:** 2026-06-07

_Todo arquivo tem seu lugar. Nada fica perdido._
