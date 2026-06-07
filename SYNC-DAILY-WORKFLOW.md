# Sync & Deploy — Workflow Diário

**Quick reference para usar tudo no dia a dia.**

---

## ⚡ 2 Minutos — Setup (One Time)

```bash
# Run setup script (escolher Marcelo ou Marina)
bash scripts/setup-sync.sh                    # Marcelo
bash scripts/setup-sync.sh "Marina" 300       # Marina
```

**Done!** Tudo configurado.

---

## 📅 Dia a Dia — Marcelo (Laptop Principal)

### Morning
```bash
# Pega últimas mudanças de Marina
git pull

# Sincroniza node_modules
npm install

# Inicia desenvolvimento
npm run dev
```

### Coding
```bash
# Faz seu trabalho normalmente
# Edita arquivos, testa localmente

# Quando termina uma feature
git add .
git commit -m "feature: description"
# ✅ Pre-commit hook roda automaticamente (prettier, eslint, tests)

# Push para Git
git push
# ✅ GitHub Actions roda CI automaticamente
```

### Deploy
```bash
# Tag a versão
git tag v1.2.3

# Push tag
git push --tags
# ✅ GitHub Actions roda CD automaticamente
#    - Docker build
#    - Deploy staging
#    - Deploy production
#    - Slack notification
```

---

## 📅 Dia a Dia — Marina (Laptop Secundário)

### Setup (One Time)
```bash
bash scripts/setup-sync.sh "Marina" 300
# ✅ watch-sync.sh rodando em background
```

### Monitor Sync
```bash
# Ver logs de sincronização
tail -f ~/.logs/watch-sync.log

# Ver status de watch-sync
ps aux | grep watch-sync.sh

# Se parou, reiniciar
pkill -f watch-sync.sh
nohup ~/scripts/watch-sync.sh "Marina" 300 > ~/.logs/watch-sync.log 2>&1 &
```

### Coding (Automático)
```bash
# watch-sync.sh puxa mudanças a cada 5 minutos automaticamente
# Você vê mudanças de Marcelo aparecendo

# Quando quer trabalhar
git checkout -b feature/my-feature
# ... code ...

# Commit normal
git commit -m "feature: description"
# ✅ Pre-commit hook roda automaticamente

# Push
git push
# ✅ GitHub Actions testa tudo
```

### Deploy (Quando Needed)
```bash
# Tag a versão (Marcelo geralmente faz, mas Marina pode também)
git tag v1.2.3
git push --tags
# ✅ Deploy automático em < 5 min
```

---

## 🧠 Brain Capture (Automático)

### Marcelo — End of Session
```bash
# Quando termina sessão de trabalho
/compact
# ✅ post-compact.sh executa
#    - Cria brain/_conversas-claude/*.md
#    - git commit automático
#    - Memory salva

# git push final
git push
```

### Marina — Automatically
```bash
# watch-sync.sh automaticamente:
# - A cada 5 min: git pull
# - Sincroniza brain/ (Obsidian recarrega)
# - Você vê novas decisions/insights

# Ou manual:
./scripts/brain-sync.sh sync
```

---

## 🚨 Resolver Conflitos (Raro)

### Se houver conflito

```bash
# Git diz qual arquivo tem conflito
git status

# Ver mudanças
git diff

# Opção 1: Usar versão de Git (source of truth)
git checkout --theirs <file>

# Opção 2: Resolver manualmente
# (edit file, remover markers <<<< ==== >>>>)

# Commit resolução
git add .
git commit -m "fix: resolve conflict"
git push
```

---

## 📊 Monitoramento

### Ver Deploy Status
```bash
# GitHub Actions logs
# → GitHub repo → Actions tab → Latest run

# Ou shell
gh run list -L 5
gh run view <run-id> --log
```

### Ver Production
```bash
# Health check
curl http://liquid-lab.production.svc.cluster.local/api/health

# Logs
kubectl logs -f deployment/liquid-lab -n production

# Metrics
# Grafana: http://localhost:3000
# Prometheus: http://localhost:9090
```

### Alerts
```bash
# Slack (#liquid-lab):
# ✅ Deployment succeeded
# ✅ Tests passed
# ✅ Brain capture complete
# 🔴 Deployment failed
# ⚠️ Performance degradation
```

---

## 🎯 Typical Day (Both)

### 9 AM
- Marcelo: `git pull` (pega mudanças da noite)
- Marina: watch-sync rodando (automático)

### 9-5 PM
- Marcelo: Código, commits, pushes
- Marina: watch-sync puxa a cada 5 min (automático)
- GitHub Actions: Testa tudo na CI

### 5 PM
- Marcelo: `git tag v1.2.3 && git push --tags`
- GitHub Actions: Deploy automático (< 5 min)
- Slack: Notificação de sucesso

### 6 PM (Daily)
- Automático: brain-capture.yml roda
  - Extrai decisions de commits
  - Captura PRs merged
  - Sincroniza brain/

### 2 AM (Daily)
- Automático: operations.yml roda
  - Backup database (S3)
  - Rotate secrets
  - Health checks
  - Email report

---

## 🔑 Key Commands

```bash
# Sync (get latest from Git)
git pull

# Commit with auto-format + lint + test
git commit -m "feature: ..."

# Push to CI
git push

# Deploy to production
git tag v1.2.3
git push --tags

# Manual brain sync (if needed)
./scripts/brain-sync.sh sync

# See sync logs (Marina)
tail -f ~/.logs/watch-sync.log

# Check CI/CD status
gh run list
gh run view <run-id> --log

# Health check
curl http://localhost:3000/api/health

# Deploy status (automatic)
# → Slack notifications
# → GitHub Actions
```

---

## ✅ Checklist Daily

### Marcelo
- [ ] Morning: `git pull`
- [ ] During day: commit + push (auto-hooks)
- [ ] End of day: `git tag v*.*.* && git push --tags` (if deploying)

### Marina
- [ ] Morning: Check watch-sync running (`ps aux | grep watch-sync`)
- [ ] During day: Commit + push (auto-hooks)
- [ ] If stuck: Check logs (`tail -f ~/.logs/watch-sync.log`)

### Both
- [ ] Monitor Slack for deploy status
- [ ] Check Grafana if issues (http://localhost:3000)
- [ ] React to alerts

---

## 📖 More Info

- **Full strategy:** `docs/SYNC-AND-DEPLOY-STRATEGY.md`
- **Setup details:** `scripts/setup-sync.sh`
- **GitHub Actions:** `.github/workflows/`
- **Brain capture:** `docs/BRAIN-CAPTURE-SYSTEM.md`

---

**Everything automatic. You just work. 🚀**
