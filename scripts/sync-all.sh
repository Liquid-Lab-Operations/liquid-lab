#!/bin/bash
# Liquid Lab — Complete Sync Script
# Sincroniza local <-> Git
# Uso: ./scripts/sync-all.sh

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "🔄 Liquid Lab — Sincronização Completa"
echo "========================================"
echo ""

# 1. Verificar status
echo "1️⃣ Verificando status..."
if [ -n "$(git status --porcelain)" ]; then
    echo "   ⚠️  Mudanças detectadas"
    git status --short
else
    echo "   ✅ Área de trabalho limpa"
fi
echo ""

# 2. Buscar atualizações remotas
echo "2️⃣ Buscando atualizações remotas..."
git fetch origin
if [ "$(git rev-parse HEAD)" != "$(git rev-parse origin/main)" ]; then
    echo "   ⚠️  Branch remota diferente"
else
    echo "   ✅ Local sincronizado com remoto"
fi
echo ""

# 3. Adicionar mudanças não rastreadas
echo "3️⃣ Adicionando mudanças não rastreadas..."
UNTRACKED=$(git ls-files --others --exclude-standard)
if [ -n "$UNTRACKED" ]; then
    echo "$UNTRACKED" | grep -v "\.DS_Store" | xargs -r git add
    echo "   ✅ Arquivos adicionados"
else
    echo "   ✅ Nenhuma mudança"
fi
echo ""

# 4. Verificar se há mudanças para commitar
echo "4️⃣ Verificando mudanças..."
if [ -n "$(git diff --cached --quiet; echo $?)" ] || [ -n "$(git status --porcelain)" ]; then
    echo "   ⚠️  Mudanças pendentes"
    git status --short
    
    echo ""
    echo "   Deseja fazer commit? (S/n)"
    read -r RESPONSE
    
    if [[ "$RESPONSE" != "n" && "$RESPONSE" != "N" ]]; then
        echo "   Mensagem de commit:"
        read -r COMMIT_MSG
        if [ -z "$COMMIT_MSG" ]; then
            COMMIT_MSG="chore: sync all changes $(date +%Y-%m-%d)"
        fi
        git commit -m "$COMMIT_MSG"
        echo "   ✅ Commit criado"
    fi
else
    echo "   ✅ Nada para commitar"
fi
echo ""

# 5. Fazer push para origin
echo "5️⃣ Fazendo push para origin..."
if [ "$(git rev-parse HEAD)" != "$(git rev-parse origin/main 2>/dev/null || echo '')" ]; then
    git push origin main
    echo "   ✅ Push realizado"
else
    echo "   ✅ Já sincronizado"
fi
echo ""

# 6. Resumo final
echo "📊 Resumo Final"
echo "=============="
echo "Branch: $(git rev-parse --abbrev-ref HEAD)"
echo "Commits à frente: $(git rev-list --count origin/main..HEAD 2>/dev/null || echo '0')"
echo "Último commit: $(git log -1 --oneline)"
echo ""
echo "✅ Sincronização completa!"
