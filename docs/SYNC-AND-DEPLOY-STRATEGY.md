---
title: Sincronização & Deploy Rápido — Multi-Laptop Strategy
date: 2026-06-07
status: Architecture
---

# Sincronização & Deploy Rápido — Múltiplos Laptops

**Objetivo:** Marcelo e Marina trabalham em laptops diferentes, tudo sincronizado e deploy rápido.

---

## 🎯 O Problema

```
Marcelo laptop:                Marina laptop:              Git:
┌──────────────────┐         ┌──────────────────┐       ┌────────┐
│ /liquid-lab/     │         │ /liquid-lab/     │       │ Remote │
│ ├─ code/         │         │ ├─ code/         │       │        │
│ ├─ brain/        │         │ ├─ brain/        │   →   │ main   │
│ ├─ infra/        │         │ ├─ infra/        │   →   │        │
│ └─ config/       │         │ └─ config/       │       │        │
└────────┬─────────┘         └────────┬─────────┘       └────────┘
         │                            │
         └─ Sincronizar? ─────────────┘
         
    Como manter em sincronia?
    Como fazer deploy rápido de ambas?
```

---

## ✅ A Solução (4 Camadas)

### Camada 1: Git como Source of Truth

```
Git (origin) = Source de verdade única
    ↑
    │ git pull/push
    │
Marcelo laptop + Marina laptop
    ↓
    │ trabalham aqui
    │
    ↑ commit + push
    │
Git atualizado
```

**Regra:** Tudo commitado no Git é versão "official".

---

### Camada 2: Automação Local (Husky Hooks)

```
Marcelo faz: git commit
    ↓
pre-commit hook executa:
  ✓ Prettier (format)
  ✓ ESLint (lint)
  ✓ TypeScript (type-check)
  ✓ Tests
    ↓
Código limpo, testado, pronto para push
```

**Resultado:** Código nunca sai "sujo" do laptop.

---

### Camada 3: Sincronização Contínua (Watch-Sync)

**Para Marina's MacBook especialmente:**

```bash
# Rodando em background (daemon)
watch-sync.sh "Marina" 300

Fluxo:
├─ A cada 5 minutos:
│  ├─ git pull (atualizar de Git)
│  ├─ Verificar conflitos
│  ├─ Notificar se houver mudanças
│  └─ Sincronizar brain/ (Obsidian)
│
└─ Quando Marina faz git push:
   ├─ Automático: CI testa
   ├─ Automático: Brain captura
   └─ Automático: Deploy (se tag v*)
```

**Resultado:** Marina sempre tem versão atualizada.

---

### Camada 4: Deploy Rápido (GitHub Actions)

```
Marcelo push → Tag v1.2.3
    ↓
GitHub Actions dispara:
  ├─ Build Docker
  ├─ Push registry
  ├─ Deploy staging (health check)
  ├─ Deploy production (if ok)
  └─ Rollback automático (if fail)
    ↓
Tudo em produção em < 5 minutos
```

**Resultado:** Deploy automático, sem intervenção manual.

---

## 🔄 Fluxo Dia-a-Dia

### Marcelo (Laptop 1)

```
Morning:
  git pull                          # Pega últimas mudanças de Marina
  npm install                       # Sincroniza dependências
  npm run dev                       # Desenvolve

Durante o dia:
  git commit -m "feature: ..."      # Pre-commit hook roda
  git push                          # CI automático

Fim do dia:
  git tag v1.2.3                    # Deploy automático
  git push --tags                   # Tudo em produção
```

### Marina (Laptop 2 + watch-sync daemon)

```
watch-sync.sh roda em background:
  A cada 5 min:
    git pull                        # Pega mudanças de Marcelo
    Verifica conflitos
    Notifica se houver mudanças

Quando quer trabalhar:
  git checkout -b feature/x
  npm run dev                       # Desenvolve

Quando termina:
  git commit -m "feature: ..."      # Pre-commit hook roda
  git push                          # CI automático
  
Conflito com Marcelo?
  Resolvido automaticamente ou notificado
```

---

## 📁 O Que Sincroniza

### ✅ Sincroniza (Bidirecional)

```
code/                    ← Código fonte (sempre sincronizado)
brain/                   ← Obsidian neurons (always in sync)
config/                  ← Configurações (commit tudo)
docs/                    ← Documentação (commit tudo)
.github/workflows/       ← CI/CD (pull de Git)
scripts/                 ← Automação scripts (pull de Git)
```

### ❌ NÃO Sincroniza (Local Only)

```
node_modules/            ← npm install gera localmente
.env.local               ← Secrets (NEVER commit)
.claude/settings.local.json ← Permissões locais (NEVER commit)
dist/build/              ← Build artifacts (regenerate localmente)
.logs/                   ← Logs locais
.DS_Store, .vscode/      ← IDE configs (gitignore)
```

---

## 🚀 Setup Inicial (30 min)

### 1. Ambos (Marcelo + Marina)

```bash
# Clone repositório
git clone git@github.com:Liquid-Lab-Operations/liquid-lab.git
cd liquid-lab

# Configure git identity
git config user.email "operations@liquidlab.ag"
git config user.name "Liquid Lab Operations"

# Install dependencies
npm install
npx husky install

# Configure GitHub Secrets (one-time, via GitHub UI)
# - DOCKER_USERNAME, DOCKER_PASSWORD
# - KUBE_CONFIG, AWS credentials
# - SLACK_WEBHOOK
```

### 2. Marina (Extra Setup)

```bash
# Copiar watch-sync script
cp scripts/watch-sync.sh ~/scripts/

# Start daemon (background)
nohup ~/scripts/watch-sync.sh "Marina" 300 > ~/.logs/watch-sync.log 2>&1 &

# Verificar que está rodando
ps aux | grep watch-sync.sh

# Logs
tail -f ~/.logs/watch-sync.log
```

---

## 🔄 Sincronização em Ação

### Cenário 1: Marcelo Trabalha

```
Marcelo:
  git checkout -b feature/model-router
  ... code ...
  git commit -m "feature: add model router"
  → Pre-commit: prettier, eslint, tests ✅
  → Code formatado e testado

  git push
  → GitHub Actions: CI testa tudo ✅
  → Brain captura automaticamente ✅

Marina (watch-sync rodando):
  5 minutos depois:
  → watch-sync.sh puxa automaticamente
  → Notifica: "Nova feature de Marcelo"
  → brain/ sincroniza (Obsidian atualiza)
  → Marina pode já usar a feature
```

### Cenário 2: Ambos Trabalham em Paralelo

```
Marcelo:
  Trabalhando em: code/features/auth
  
Marina:
  Trabalhando em: code/features/api

watch-sync.sh (Marina):
  Detecta mudanças de Marcelo
  git pull automático
  Sem conflitos (arquivos diferentes)
  ✅ Sincronizado

Fim do dia:
  Marcelo: git push auth feature
  Marina: git push api feature
  
GitHub Actions:
  ✅ Testa ambas features
  ✅ Brain captura ambas
  ✅ Pronto para merge
```

### Cenário 3: Conflito (Ambos em Mesmo Arquivo)

```
Marcelo:
  git commit -m "fix: auth logic"
  git push
  
Marina (watch-sync):
  git pull
  ⚠️ CONFLITO DETECTADO!
  
  Opções automáticas:
  1. Cowork (Git) = source of truth → Marina pega versão de Git
  2. Ou: Notifica Marina para resolver manualmente
  
Marina:
  git pull --rebase (resolve conflito)
  git push (versão resolvida)
```

---

## 🧠 Brain Sincronização

### Obsidian Auto-Sync

```
Marcelo termina /compact:
  brain/conversas-claude/YYYY-MM-DD-*.md criado
  git commit automático
  git push automático
  
Marina (watch-sync):
  5 min depois:
  git pull automático
  Obsidian recarrega
  brain/ atualizado = novas neurons visíveis
  
Resultado:
  Ambos veem mesma knowledge base
  Sem duplicação
  Sempre atualizado
```

---

## 🚢 Deploy Rápido

### Path to Production

```
Local Development (Qualquer laptop):
  git commit + git push
    ↓
  GitHub Actions (CI):
    ✓ Tests
    ✓ Lint
    ✓ Build
    ✓ Coverage
    ↓
  Tag v1.2.3:
    git tag v1.2.3
    git push --tags
    ↓
  GitHub Actions (CD):
    ✓ Docker build
    ✓ Push registry
    ✓ Deploy staging (5 min)
    ✓ Health checks
    ✓ Deploy prod (if staging ok)
    ✓ Rollback (if fail)
    ↓
  Production ✅ (5-10 min total)
```

### Rollback Automático

```
Se deploy falhar:
  GitHub Actions automático:
    ✓ Detecta erro
    ✓ Rollback para versão anterior
    ✓ Notifica Slack
    ✓ Logs para debug
    
Resultado:
  Produção sempre estável
  Sem downtime
```

---

## 📊 Fluxo Completo (Visual)

```
Dia 1 (Marcelo):
├─ git pull                         (pega baseline)
├─ code feature X
├─ git commit + push
└─ GitHub Actions: tests ✅

Dia 2 (Marina):
├─ watch-sync: git pull (pega feature X)
├─ code feature Y (em paralelo)
├─ git commit + push
└─ GitHub Actions: tests ✅
   (feature X já integrada)

Dia 3 (Ambos):
├─ Marcelo: git tag v1.0.0
├─ git push --tags
└─ GitHub Actions:
   ├─ Build Docker ✅
   ├─ Deploy staging ✅
   ├─ Health checks ✅
   ├─ Deploy production ✅
   ├─ Slack notification ✅
   └─ Pronto para clientes!

Dia 4 (Monitoramento):
├─ 2 AM: Backup automático ✅
├─ 6 PM: Brain capture ✅
├─ 24/7: Prometheus monitoring ✅
└─ Tudo automático
```

---

## 🔐 Garantias de Segurança

### Dados em Repouso
- ✅ Git: Remoto com autenticação SSH
- ✅ Secrets: `.env.local` (nunca commit)
- ✅ Backup: S3 encrypted (daily)

### Em Trânsito
- ✅ Git: SSH (encrypted)
- ✅ GitHub Actions: Secrets Manager
- ✅ Deploy: TLS/HTTPS

### Auditoria
- ✅ Git log: Histórico completo
- ✅ GitHub Actions: Logs detalhados
- ✅ CloudTrail: Prod access logs

---

## 🎯 Checklist Setup

### Setup Inicial
- [ ] Git clonado
- [ ] Git identity configurado
- [ ] npm install
- [ ] husky install
- [ ] GitHub Secrets configurados

### Para Marina Extra
- [ ] watch-sync.sh copiado
- [ ] Daemon iniciado (`nohup ...`)
- [ ] Logs verificados
- [ ] Obsidian sincronizado

### Antes de Primeiro Deploy
- [ ] Docker credentials no GitHub Secrets
- [ ] K8s config no GitHub Secrets
- [ ] Slack webhook configurado
- [ ] Test tag: `git tag v0.0.1 && git push --tags`

---

## 📈 Resultados Esperados

| Métrica | Antes | Depois |
|---------|-------|--------|
| Tempo sync | Manual (horas) | Automático (5 min) |
| Conflitos | Frequentes | Raros (auto-resolved) |
| Deploy time | 2 horas | 5 minutos |
| Downtime | Possível | Auto-rollback |
| Brain sync | Manual | Automático |
| Knowledge loss | Sim | Nunca |

---

## 🚨 Troubleshooting

### Marina não vê mudanças de Marcelo

```bash
# Verificar watch-sync status
ps aux | grep watch-sync.sh

# Se não rodando, reiniciar
nohup ~/scripts/watch-sync.sh "Marina" 300 > ~/.logs/watch-sync.log 2>&1 &

# Ver logs
tail -f ~/.logs/watch-sync.log
```

### Conflito de merge

```bash
# Ver status
git status

# Resolver manualmente
# (Cowork = Git como source of truth)
git checkout --theirs <file>

# Ou usar Cowork UI se disponível
git pull --rebase
```

### Deploy falhou

```bash
# Ver logs em GitHub Actions
# → Repository → Actions → Latest run

# Automático rollback já ativado
# Slack já notificado

# Debug localmente
npm run test
npm run build
```

---

## 🎓 Best Practices

1. **Pull antes de push:** `git pull && git push`
2. **Commit frequente:** Pequenos commits = fácil revert
3. **Sempre em branch:** Nunca direto em `main`
4. **Tag para deploy:** `git tag v*.*.* && git push --tags`
5. **Review em PR:** Antes de merge (automático no GitHub)
6. **Monitor production:** Grafana depois do deploy

---

## 📞 Support

- **Sync issues?** Check `.logs/watch-sync.log`
- **Deploy failed?** Check GitHub Actions logs
- **Conflito?** Git says what to do (follow it)
- **Obsidian sync?** Manual refresh: Cmd+R

---

**Status:** ✅ Ready to use | **Last update:** 2026-06-07

_Multi-laptop, zero-manual-work, always-in-sync, rapid-deploy._
