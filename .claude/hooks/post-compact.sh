#!/bin/bash

# ============================================================================
# post-compact.sh — Brain Capture Hook
# Executes when /compact is called to end a Claude session
# Captura decisões e contexto da sessão em neurônios automáticos
# ============================================================================

set -e

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
BRAIN_DIR="$REPO_DIR/brain"
CONVERSAS_DIR="$BRAIN_DIR/_conversas-claude"
LOGS_DIR="$REPO_DIR/.logs"

# Create directories if needed
mkdir -p "$CONVERSAS_DIR"
mkdir -p "$LOGS_DIR"

# Timestamp
TIMESTAMP=$(date +%Y-%m-%d_%H%M)
DATE=$(date +%Y-%m-%d)
SESSION_LOG="$LOGS_DIR/post-compact.log"

# ============================================================================
# Log Function
# ============================================================================

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$SESSION_LOG"
}

log "🧠 Starting brain capture for session..."
log "Timestamp: $TIMESTAMP"
log "Brain dir: $BRAIN_DIR"

# ============================================================================
# Step 1: Detect Context (Corporate vs Personal)
# ============================================================================

log "Step 1: Detecting session context..."

# Email detection via git config or environment
SESSION_EMAIL="${CLAUDE_USER_EMAIL:-$(git config user.email)}"

if [[ "$SESSION_EMAIL" == *"operations@liquidlab.ag"* ]]; then
  CONTEXT="corporate"
  BRAIN_TYPE="Liquid Lab"
  log "✓ Corporate context detected (operations@liquidlab.ag)"
else
  CONTEXT="personal"
  BRAIN_TYPE="Pivo.Brain"
  log "ℹ Personal context detected ($SESSION_EMAIL)"
  log "⚠️  Personal brain capture not yet configured"
  exit 0  # Skip for now, only capture corporate
fi

# ============================================================================
# Step 2: Detect Session Title & Content
# ============================================================================

log "Step 2: Analyzing session content..."

# This would normally come from Claude's session transcript
# For now, we use a placeholder that the post-compact hook can fill in
SESSION_TITLE="${CLAUDE_SESSION_TITLE:-Brain Capture Setup}"
SESSION_SUMMARY="${CLAUDE_SESSION_SUMMARY:-Automated capture from session}"

log "Session title: $SESSION_TITLE"

# ============================================================================
# Step 3: Extract Key Information
# ============================================================================

log "Step 3: Extracting key information..."

# Would normally parse the transcript for:
# - Decisions made (keywords: "decide", "decision", "implement")
# - Problems solved (keywords: "fix", "solved", "resolved")
# - Next steps (keywords: "next", "todo", "will")
# For now, we document the session itself

# ============================================================================
# Step 4: Find Next Available ID
# ============================================================================

log "Step 4: Generating neurônio ID..."

NEXT_ID=$(find "$BRAIN_DIR/_neurônios/ctx" -name "CTX-*.md" -type f 2>/dev/null | \
  sed 's/.*CTX-\([0-9]*\).*/\1/' | sort -n | tail -1 || echo "0")
NEXT_ID=$((NEXT_ID + 1))
ID=$(printf "%03d" $NEXT_ID)

log "Next ID: CTX-$ID"

# ============================================================================
# Step 5: Create Session Neurônio
# ============================================================================

log "Step 5: Creating session neurônio..."

# Clean title for filename (spaces to underscore)
FILENAME=$(echo "$SESSION_TITLE" | \
  tr ' ' '_' | \
  sed 's/[^A-Za-z0-9_-]//g' | \
  head -c 50)

NEURON_PATH="$CONVERSAS_DIR/${DATE}_${FILENAME}.md"

# Create the neurônio content
cat > "$NEURON_PATH" << EOF
---
title: CTX-$ID $SESSION_TITLE
data: $DATE
tipo: contexto
tags: [sessão, brain-capture, automação, $(date +%B | tr '[:upper:]' '[:lower:]')]
status: ativo
---

# CTX-$ID — $SESSION_TITLE

**Data:** $DATE
**Hora:** $(date +%H:%M)
**Contexto:** $BRAIN_TYPE

---

## 🎯 Resumo da Sessão

$SESSION_SUMMARY

---

## 📋 O Que Foi Feito

- Documentação criada/atualizada
- Processos automatizados
- Brain capture configurado

---

## ✅ Próximas Etapas

- Verificar se neurônios estão sincronizando (Obsidian Git)
- Monitorar brain-capture.yml (6 PM diário)
- Testar integração com commits

---

## 🔗 Relacionado

[[PRJ-001_Liquid_Lab]]
[[SYS-001_Obsidian_Git_Configuration]]

---

_Neurônio criado automaticamente pelo post-compact hook._
EOF

log "✓ Neurônio created: $NEURON_PATH"

# ============================================================================
# Step 6: Commit to Git
# ============================================================================

log "Step 6: Committing to git..."

cd "$REPO_DIR"

# Add only the new neurônio
git add "$NEURON_PATH"

# Check if there are changes to commit
if git diff --cached --quiet; then
  log "ℹ️  No changes to commit"
else
  git commit -m "session: $DATE - $SESSION_TITLE" || true
  log "✓ Committed to git"
fi

# ============================================================================
# Step 7: Git Push (if online)
# ============================================================================

log "Step 7: Pushing to remote..."

if git push 2>/dev/null; then
  log "✓ Pushed to GitHub"
else
  log "⚠️  Could not push (offline or error) — will sync on next network"
fi

# ============================================================================
# Step 8: Summary
# ============================================================================

log ""
log "✅ Brain capture complete!"
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log "Neurônio created: $NEURON_PATH"
log "Location: $CONVERSAS_DIR"
log "Next capture: Tomorrow at 6 PM (brain-capture.yml)"
log ""
log "📖 View logs: tail -f $SESSION_LOG"
log "🧠 View neuron: open '$NEURON_PATH' in Obsidian"
log ""

# ============================================================================
# Step 9: Trigger Obsidian Sync (Optional)
# ============================================================================

# Signal Obsidian to sync (via Obsidian Git plugin if running)
# This is optional — Obsidian Git will sync automatically in 10 minutes anyway
log "Waiting for Obsidian Git to sync (10 min max)..."

exit 0
