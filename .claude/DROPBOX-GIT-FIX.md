# Configurar Dropbox para Trabalhar com Git - Guia Prático

**Para:** Liquid Lab monorepo em Dropbox + GitHub  
**Data:** 2026-06-07  
**Status:** Ação recomendada para Marcelo + Marina

---

## 🎯 O Problema Atual

```
❌ .git/ na pasta do Dropbox
❌ Dropbox sincroniza enquanto Git escreve locks
❌ Resultado: index.lock, HEAD.lock travados permanentemente
❌ Impossível fazer commits
```

---

## ✅ SOLUÇÃO RECOMENDADA: Repositório Bare em Dropbox

**Como funciona:**
- GitHub = remoto principal (code)
- Dropbox bare repo = backup remoto seguro
- .git local = protegido, fora de sincronização Dropbox

---

## 🔧 Implementação (Para Você Fazer)

### Passo 1: Criar Repositório Bare em Dropbox

```bash
# No seu terminal (macOS)
mkdir -p ~/Dropbox/git-backup
git init --bare ~/Dropbox/git-backup/liquid-lab.git
```

### Passo 2: Adicionar como Remote no Seu Projeto Local

```bash
cd ~/Claude/Projects/liquid-lab

# Adicionar remoto Dropbox
git remote add dropbox ~/Dropbox/git-backup/liquid-lab.git

# Verificar
git remote -v
# Deve mostrar:
# origin    https://github.com/Operations-Liquid-Lab/liquid-lab.git (fetch)
# origin    https://github.com/Operations-Liquid-Lab/liquid-lab.git (push)
# dropbox   ~/Dropbox/git-backup/liquid-lab.git (fetch)
# dropbox   ~/Dropbox/git-backup/liquid-lab.git (push)
```

### Passo 3: Push para Ambos Remotes

```bash
# Push para GitHub (principal)
git push origin main

# Push para Dropbox backup (simultâneo, sincronização automática)
git push dropbox main

# Verificar backups
ls -lah ~/Dropbox/git-backup/liquid-lab.git/
```

### Passo 4: Marina - Sync do Backup

```bash
# Marina no seu computador
cd ~/Claude/Projects/liquid-lab

# Adicionar remoto Dropbox (mesmo path)
git remote add dropbox ~/Dropbox/git-backup/liquid-lab.git

# Puxar do backup Dropbox
git pull dropbox main

# Ou confirmar com GitHub
git pull origin main
```

---

## 📋 Configuração Alternativa: Separar `.git` Localmente

Se você quer manter código sincronizado via Dropbox mas `.git` local:

### Passo 1: Mover .git para fora do Dropbox

```bash
# LOCAL (não sincronizado)
mkdir -p ~/git-local
mv ~/Dropbox/Obsidian/Liquid.Lab.Brain/.git ~/git-local/liquid-lab.git

# Configura o worktree remoto
cd ~/Dropbox/Obsidian/Liquid.Lab.Brain
git --git-dir=~/git-local/liquid-lab/.git config core.worktree $(pwd)
```

### Passo 2: Adicione ao Shell Profile

```bash
# Adicione ao ~/.zshrc ou ~/.bash_profile
alias ll-git='git --git-dir=~/git-local/liquid-lab/.git'

# Depois use:
ll-git status
ll-git commit -m "message"
ll-git push origin main
```

### Passo 3: Configure Dropbox Selective Sync

**No macOS:**
1. Abra Dropbox → **Preferências** → **Sincronização Seletiva**
2. Desmarque pastas grandes que não precisa sincronizar
3. Mantenha apenas `/Obsidian/Liquid.Lab.Brain/` (código)
4. O `.git` local não é tocado pelo Dropbox

---

## 🚨 CHECKLIST: Fix Imediato para Seu Caso

```bash
# 1. Parar Dropbox (liberta locks)
killall Dropbox
sleep 5

# 2. Limpar locks Git
cd ~/Claude/Projects/liquid-lab
find .git -name "*.lock" -delete
find .git -name "*.pid" -delete

# 3. Limpar index corrompido (se necessário)
rm -f .git/index

# 4. Reabrir Dropbox
open -a Dropbox

# 5. Refazer o repositório
git reset --hard HEAD

# 6. Testar commit
git commit -m "test: fix dropbox sync" --allow-empty

# 7. Push ambos remotes
git push origin main
git push dropbox main  # Se configurado
```

---

## 🔒 Configuração Final Recomendada para Liquid Lab

```
Repositório Principal: GitHub
├── Remote: origin → https://github.com/Operations-Liquid-Lab/liquid-lab

Backup Remoto: Dropbox (Bare Repo)
├── Remote: dropbox → ~/Dropbox/git-backup/liquid-lab.git
├── Sincronização: Automática via Dropbox
└── Vantagem: Sem corrupção de .git

Código Sincronizado: Dropbox (Obsidian Vaults)
├── Pasta: ~/Dropbox/Obsidian/Liquid.Lab.Brain/
├── Pasta: ~/Dropbox/Obsidian/Pivo.Brain/
├── Sincronização: Automática via Dropbox
└── .git: FORA de Dropbox (local)

Local Protegido:
└── ~/git-local/liquid-lab/.git (se usar separate .git)
```

---

## 📝 .gitignore Para Dropbox

Adicione ao seu `.gitignore`:

```gitignore
# Dropbox files
.dropbox
.dropbox.attr
*.dropbox
.dropboxignore
.dropbox.cache

# Dropbox conflicted files
*\ (conflicted\ copy\ *).md
*\ (conflicted\ copy\ *).py
*\ (conflicted\ copy\ *).js
```

---

## 🔄 Workflow Diário (Marcelo + Marina)

### Marcelo (Computador Principal)

```bash
# Morning: Pull latest
git pull origin main          # GitHub
git pull dropbox main 2>/dev/null || true  # Dropbox backup

# Work...
# Edit files in Obsidian vault (auto-synced to Dropbox)

# Commit locally
git add .
git commit -m "feat: description"

# Push BOTH
git push origin main
git push dropbox main
```

### Marina (Computador Secundário)

```bash
# Morning: Sync
git pull origin main          # GitHub
git pull dropbox main         # Dropbox backup

# Work with Obsidian (code syncs via Dropbox)

# Commit
git add .
git commit -m "feat: description"

# Push BOTH
git push origin main
git push dropbox main
```

---

## 🚀 Git Hooks para Auto-Backup

Adicione ao `.git/hooks/post-commit`:

```bash
#!/bin/bash
# Auto-backup to Dropbox after every commit

# Dar uns segundos para Dropbox sincronizar
sleep 2

# Push automático para Dropbox
git push dropbox main -f 2>/dev/null || echo "⚠️  Dropbox push failed"
```

```bash
chmod +x .git/hooks/post-commit
```

---

## ⚠️ Sinais de Alerta

Se ver algo assim, **PARE**:

```
❌ "conflicted copy" files no Dropbox
❌ .git/ tamanho anormalmente grande
❌ "fatal: Unable to create index.lock"
❌ "Ambiguous HEAD" error
```

**Ação corretiva:**

```bash
# 1. Killall Dropbox
killall Dropbox

# 2. Backup atual
cp -r ~/Claude/Projects/liquid-lab ~/Claude/Projects/liquid-lab.backup

# 3. Reset força
cd ~/Claude/Projects/liquid-lab
git reset --hard HEAD
git clean -fd

# 4. Reabrir Dropbox
open -a Dropbox

# 5. Teste
git status
```

---

## 📊 Comparação de Métodos

| Método | Segurança | Facilidade | Performance | Backup |
|--------|-----------|-----------|-------------|--------|
| **Bare Repo (Recomendado)** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ✅ GitHub + Dropbox |
| **Separate .git** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ GitHub + Local |
| **GitHub Desktop** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ✅ GitHub |
| Direct Dropbox (Atual) | ⭐ | ⭐ | ⭐⭐ | ❌ Corrompido |

---

## 🎯 RESUMO EXECUTIVO

**Faça isso AGORA:**

```bash
# 1. Kill Dropbox
killall Dropbox && sleep 5

# 2. Fix locks
cd ~/Claude/Projects/liquid-lab
find .git -name "*.lock" -delete

# 3. Reopen Dropbox
open -a Dropbox

# 4. Setup bare backup repo
mkdir -p ~/Dropbox/git-backup
git init --bare ~/Dropbox/git-backup/liquid-lab.git

# 5. Add remote
git remote add dropbox ~/Dropbox/git-backup/liquid-lab.git

# 6. Push both
git push origin main
git push dropbox main

# 7. Test workflow
git commit -m "test: dropbox sync fix" --allow-empty
git push origin main
git push dropbox main
```

**Depois:**
- Marina executa: `git pull dropbox main` para sincronizar
- Ambos: Push para `origin` e `dropbox` em cada commit
- Dropbox auto-sincroniza o bare repo
- GitHub é principal, Dropbox é backup

---

**Status:** 🟢 Ready to implement  
**Time to fix:** ~5 minutes  
**Impact:** 100% reliable Git + Dropbox sync

---

## 📚 Referências

- [Dropbox + Git Best Practices](https://brianbuccola.com/how-to-use-git-and-dropbox-together/)
- [Git Remote Dropbox Tool](https://github.com/anishathalye/git-remote-dropbox)
- [GitHub - Bare Repository](https://git-scm.com/book/en/v2/Git-on-the-Server-Getting-Git-on-a-Server)
- [SparkleShare - Git Sync](https://sparkleshare.org/)

**Documento criado:** 2026-06-07  
**Para:** Liquid Lab Operations  
**Status:** Ready to implement
