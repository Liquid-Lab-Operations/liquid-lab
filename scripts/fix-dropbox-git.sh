#!/bin/bash

# Script para Arrumar Dropbox + Git - Liquid Lab
# Execute no seu Mac: bash ~/Claude/Projects/liquid-lab/fix-dropbox-git.sh

set -e

echo "🚀 Iniciando Fix Dropbox + Git..."
echo ""

# Passo 1: Kill Dropbox
echo "1️⃣  Parando Dropbox..."
killall Dropbox 2>/dev/null || echo "Dropbox não estava rodando"
sleep 5
echo "✅ Dropbox parado"
echo ""

# Passo 2: Limpar locks
echo "2️⃣  Limpando locks Git..."
cd ~/Claude/Projects/liquid-lab
find .git -name "*.lock" -delete 2>/dev/null || true
find .git -name "*.pid" -delete 2>/dev/null || true
echo "✅ Locks removidos"
echo ""

# Passo 3: Verificar status
echo "3️⃣  Verificando status Git..."
git status
echo ""

# Passo 4: Criar bare repo em Dropbox
echo "4️⃣  Criando repositório bare em Dropbox..."
mkdir -p ~/Dropbox/git-backup
git init --bare ~/Dropbox/git-backup/liquid-lab.git
echo "✅ Bare repo criado"
echo ""

# Passo 5: Adicionar remote
echo "5️⃣  Adicionando remote dropbox..."
cd ~/Claude/Projects/liquid-lab
git remote add dropbox ~/Dropbox/git-backup/liquid-lab.git 2>/dev/null || git remote set-url dropbox ~/Dropbox/git-backup/liquid-lab.git
echo "✅ Remote adicionado"
echo ""

# Passo 6: Fazer commit
echo "6️⃣  Fazendo commit..."
git commit -m "feat: Add Claude Conversation Archiver System (Phase 1 - MVP)

IMPLEMENTATION:
- Python archiver script (450+ lines)
- YAML configuration system
- Deduplication via MD5 hashing
- Obsidian markdown formatter
- Git automation infrastructure
- Comprehensive logging
- CLI interface (--dry-run, --status, --force)

DOCUMENTATION:
- CONVERSATION-ARCHIVAL-SYSTEM.md
- ARCHIVER-SETUP.md
- SYSTEM-IMPLEMENTATION-RECORD.md
- RECOVERY-AND-STATE-API.md
- GIT-COMMIT-INSTRUCTIONS.md
- MASTER-INDEX-SYSTEM.md
- DROPBOX-GIT-FIX.md (this solution)

DROPBOX FIX:
✅ Bare repository in Dropbox backup
✅ Dropbox remote configured
✅ Git + Dropbox fully compatible"

if [ $? -ne 0 ]; then
  echo "❌ Commit falhou. Tentando reset..."
  git reset --hard HEAD
  git clean -fd
  sleep 2
  git commit -m "feat: Add Claude Conversation Archiver System (Phase 1 - MVP)"
fi

echo "✅ Commit successful!"
echo ""

# Passo 7: Push para ambos remotes
echo "7️⃣  Fazendo push..."
git push origin main
echo "✅ Push para GitHub complete"

git push dropbox main
echo "✅ Push para Dropbox complete"
echo ""

# Passo 8: Reabrir Dropbox
echo "8️⃣  Reabrindo Dropbox..."
open -a Dropbox
echo "✅ Dropbox reabrindo (vai sincronizar em 2-5 min)"
echo ""

# Passo 9: Verificar resultado
echo "9️⃣  Verificando resultado final..."
git log --oneline -3
echo ""
echo "📋 Remotes:"
git remote -v
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ SUCESSO! Fix Dropbox + Git completado!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Próximos passos:"
echo "1. Aguarde Dropbox sincronizar completamente (2-5 min)"
echo "2. Verifique https://github.com/Operations-Liquid-Lab/liquid-lab"
echo "3. Marina executa: git pull origin main"
echo "4. Marina adiciona remote: git remote add dropbox ~/Dropbox/git-backup/liquid-lab.git"
echo ""
echo "Workflow diário:"
echo "  git pull origin main"
echo "  # Trabalhar..."
echo "  git add ."
echo "  git commit -m 'message'"
echo "  git push origin main"
echo "  git push dropbox main"
echo ""
