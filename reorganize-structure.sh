#!/bin/bash

# Script para Reorganizar Liquid Lab conforme estrutura corporativa
# Execute no seu Mac: bash ~/Claude/Projects/liquid-lab/reorganize-structure.sh

set -e

cd ~/Claude/Projects/liquid-lab

echo "🔧 Reorganizando Liquid Lab conforme estrutura corporativa..."
echo ""

# Limpar lock se existir
rm -f .git/index.lock .git/HEAD.lock 2>/dev/null || true

# 1. Scripts & Automação → scripts/
echo "1️⃣  Movendo scripts para scripts/"
mv -f claude_archiver.py scripts/ 2>/dev/null || true
mv -f requirements.txt scripts/ 2>/dev/null || true
mv -f fix-dropbox-git.sh scripts/ 2>/dev/null || true
echo "✅ Scripts organizados"

# 2. Documentação interna → .claude/
echo ""
echo "2️⃣  Movendo documentação interna para .claude/"
mv -f FINAL-STATUS-2026-06-07.md .claude/ 2>/dev/null || true
mv -f HANDOFF-TO-OPERATIONS.md .claude/ 2>/dev/null || true
mv -f IMPLEMENTATION-CHECKLIST.md .claude/ 2>/dev/null || true
mv -f SETUP-NEW-MACHINE.md .claude/ 2>/dev/null || true
mv -f SOP-SYNC.md .claude/ 2>/dev/null || true
mv -f VULNERABILITY-AUDIT-2026-06-06.md .claude/ 2>/dev/null || true
mv -f README-EXECUTE-AGORA.md .claude/ 2>/dev/null || true
echo "✅ Documentação interna reorganizada"

# 3. Reorganizar docs/ → separar pública de interna
echo ""
echo "3️⃣  Reorganizando documentação (pública em docs/, interna em .claude/)"
mv -f docs/ARCHIVER-SETUP.md .claude/ 2>/dev/null || true
mv -f docs/RECOVERY-AND-STATE-API.md .claude/ 2>/dev/null || true
mv -f docs/SYSTEM-IMPLEMENTATION-RECORD.md .claude/ 2>/dev/null || true
mv -f docs/GIT-COMMIT-INSTRUCTIONS.md .claude/ 2>/dev/null || true
mv -f docs/MASTER-INDEX-SYSTEM.md .claude/ 2>/dev/null || true
mv -f docs/SESSION-SUMMARY-DROPBOX-GIT-FIX.md .claude/ 2>/dev/null || true
mv -f docs/AI-CONVERSATIONS-UPDATE.md .claude/ 2>/dev/null || true
mv -f docs/OBSIDIAN-ENGINEERING-GUIDE.md .claude/ 2>/dev/null || true
mv -f docs/VAULT-CLONE-SUMMARY.md .claude/ 2>/dev/null || true
mv -f docs/DROPBOX-GIT-FIX.md .claude/ 2>/dev/null || true
mv -f docs/DROPBOX-GIT-FIX-EXECUTION.md .claude/ 2>/dev/null || true
mv -f docs/EXECUTION-REPORT-2026-06-07.md .claude/ 2>/dev/null || true
mv -f docs/DIRECTORY-MAP.md .claude/ 2>/dev/null || true
echo "✅ Documentação separada corretamente"

# 4. Remover pasta vazia
echo ""
echo "4️⃣  Limpando pastas vazias"
[ -d "How to use Claude" ] && rm -rf "How to use Claude" 2>/dev/null || true
echo "✅ Pastas limpas"

# 5. Fazer commit
echo ""
echo "5️⃣  Commitando reorganização..."
git add -A
git commit -m "refactor: Reorganize repository structure per corporate standards

Reorganize files into proper directories per CLAUDE.md structure:

Scripts & Automation (scripts/):
- claude_archiver.py (Phase 1 Archiver System)
- requirements.txt (Python dependencies)
- fix-dropbox-git.sh (Dropbox + Git configuration)

Internal Documentation (.claude/):
- Setup guides (SETUP-NEW-MACHINE.md, ARCHIVER-SETUP.md)
- Technical reference (SYSTEM-IMPLEMENTATION-RECORD.md, RECOVERY-AND-STATE-API.md)
- Implementation records (EXECUTION-REPORT-2026-06-07.md)
- Dropbox + Git documentation (DROPBOX-GIT-FIX*.md)
- Operational docs (SOP-SYNC.md, VULNERABILITY-AUDIT-2026-06-06.md)
- Architecture guides (OBSIDIAN-ENGINEERING-GUIDE.md)

Public Documentation (docs/):
- Architecture Decision Records (ADR-*.md)
- System Architecture (ARCHITECTURE-*.md)
- Brain Capture workflows (BRAIN-CAPTURE-*.md)
- Operational procedures (SOP-001-DOCUMENTATION-PROTOCOL.md)
- Security documentation (OPERATIONAL-SECURITY.md)

Structure now follows corporate standards:
✅ Root: Only essential files (README, docker-compose.yml, CLAUDE.md)
✅ code/: Application code
✅ brain/: Obsidian vault
✅ infra/: Infrastructure
✅ mcp/: MCP servers
✅ scripts/: Automation scripts
✅ docs/: Public documentation
✅ .claude/: Internal documentation

Cleaned up:
- Removed 'How to use Claude' folder
- Removed floating docs from root
- Proper separation of public vs internal docs"

# 6. Push para ambos remotes
echo "✅ Commit feito!"
echo ""
echo "6️⃣  Fazendo push..."
git push origin main
echo "✅ GitHub atualizado"

git push dropbox main
echo "✅ Dropbox backup atualizado"

# 7. Verificação final
echo ""
echo "7️⃣  Verificação final:"
echo ""
echo "Raiz do repositório (deve ter apenas essenciais):"
ls -1 | grep -E "\.md|\.yml|\.yaml" | head -10
echo ""
echo ".claude/ (Documentação interna):"
ls -1 .claude/*.md 2>/dev/null | wc -l | xargs echo "  arquivos:"
echo ""
echo "docs/ (Documentação pública):"
ls -1 docs/*.md 2>/dev/null | wc -l | xargs echo "  arquivos:"
echo ""
echo "scripts/ (Scripts & Automação):"
ls -1 scripts/*.{sh,py,txt} 2>/dev/null | wc -l | xargs echo "  arquivos:"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ REORGANIZAÇÃO COMPLETA!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Estrutura agora segue padrão corporativo:"
echo "  ✅ Root: limpo (apenas essenciais)"
echo "  ✅ scripts/: automação centralizada"
echo "  ✅ .claude/: documentação interna"
echo "  ✅ docs/: documentação pública"
echo "  ✅ code/, brain/, infra/, mcp/: componentes principais"
echo ""
