#!/bin/bash

# ============================================================================
# Setup Multi-Laptop Sync & Deploy
# Configura sincronização automática entre laptops Marcelo + Marina
# ============================================================================

set -e

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
USER_NAME="${1:-}"
SYNC_INTERVAL="${2:-300}"  # 5 minutos default

echo "🚀 Setting up multi-laptop sync for Liquid Lab"
echo "=================================================="
echo ""

# ============================================================================
# Step 1: Verify Git Setup
# ============================================================================

echo "✓ Step 1: Verifying Git setup..."

if ! git config user.email | grep -q "operations@liquidlab.ag"; then
  echo "⚠️  Git email not set correctly. Setting now..."
  git config user.email "operations@liquidlab.ag"
  git config user.name "Liquid Lab Operations"
  echo "✅ Git configured"
else
  echo "✅ Git already configured"
fi

# ============================================================================
# Step 2: Install Husky Hooks
# ============================================================================

echo ""
echo "✓ Step 2: Setting up Husky hooks..."

if [ -d ".husky" ]; then
  echo "✅ Husky already installed"
else
  echo "Installing Husky..."
  npm install husky
  npx husky install
  echo "✅ Husky installed"
fi

# ============================================================================
# Step 3: Setup npm Dependencies
# ============================================================================

echo ""
echo "✓ Step 3: Installing npm dependencies..."

if [ -d "node_modules" ]; then
  echo "✅ Dependencies already installed"
else
  npm install
  echo "✅ Dependencies installed"
fi

# ============================================================================
# Step 4: Create Directories
# ============================================================================

echo ""
echo "✓ Step 4: Creating necessary directories..."

mkdir -p ~/.logs
mkdir -p ~/scripts
mkdir -p .logs

echo "✅ Directories created"

# ============================================================================
# Step 5: Setup Watch-Sync Script
# ============================================================================

echo ""
echo "✓ Step 5: Setting up watch-sync daemon..."

# Copy watch-sync script to home directory
if [ -f "scripts/watch-sync.sh" ]; then
  cp scripts/watch-sync.sh ~/scripts/watch-sync.sh
  chmod +x ~/scripts/watch-sync.sh
  echo "✅ watch-sync.sh copied to ~/scripts/"
else
  echo "⚠️  watch-sync.sh not found in scripts/"
fi

# ============================================================================
# Step 6: Optional - Start Daemon for Marina
# ============================================================================

echo ""
if [ -n "$USER_NAME" ]; then
  echo "✓ Step 6: Starting watch-sync daemon for $USER_NAME..."

  # Kill any existing daemon
  pkill -f "watch-sync.sh" || true
  sleep 1

  # Start new daemon
  nohup ~/scripts/watch-sync.sh "$USER_NAME" "$SYNC_INTERVAL" > ~/.logs/watch-sync.log 2>&1 &
  DAEMON_PID=$!

  echo "✅ watch-sync daemon started (PID: $DAEMON_PID)"
  echo "   Syncing every $SYNC_INTERVAL seconds"
  echo "   Logs: tail -f ~/.logs/watch-sync.log"
else
  echo "⏭️  Skipping daemon setup (for Marcelo's laptop)"
  echo "   Marina can run: setup-sync.sh Marina 300"
fi

# ============================================================================
# Step 7: Setup GitHub Secrets (Info Only)
# ============================================================================

echo ""
echo "✓ Step 7: GitHub Secrets Setup"
echo "=============================="
echo ""
echo "Add these secrets in GitHub Repository Settings → Secrets:"
echo ""
echo "  DOCKER_USERNAME         ← Docker Hub username"
echo "  DOCKER_PASSWORD         ← Docker Hub token"
echo "  KUBE_CONFIG            ← K8s config (base64)"
echo "  AWS_ACCESS_KEY_ID      ← AWS credentials"
echo "  AWS_SECRET_ACCESS_KEY  ← AWS credentials"
echo "  SLACK_WEBHOOK          ← Slack bot webhook"
echo "  MAIL_SERVER            ← Email server"
echo "  MAIL_USERNAME          ← Email username"
echo "  MAIL_PASSWORD          ← Email password"
echo ""

# ============================================================================
# Step 8: Verify npm Scripts
# ============================================================================

echo "✓ Step 8: Verifying npm scripts..."

REQUIRED_SCRIPTS=(
  "lint"
  "lint:fix"
  "format"
  "format:check"
  "type-check"
  "test"
  "test:unit"
)

MISSING=0
for script in "${REQUIRED_SCRIPTS[@]}"; do
  if grep -q "\"$script\":" package.json; then
    echo "  ✅ npm run $script"
  else
    echo "  ❌ npm run $script (MISSING)"
    MISSING=$((MISSING + 1))
  fi
done

if [ $MISSING -gt 0 ]; then
  echo ""
  echo "⚠️  Add missing scripts to package.json scripts section"
fi

# ============================================================================
# Step 9: Test Setup
# ============================================================================

echo ""
echo "✓ Step 9: Testing setup..."

echo "  Testing git..."
git status > /dev/null && echo "  ✅ Git working"

echo "  Testing node..."
node --version && echo "  ✅ Node working"

echo "  Testing npm..."
npm --version && echo "  ✅ npm working"

# ============================================================================
# Step 10: Final Status
# ============================================================================

echo ""
echo "✅ Setup Complete!"
echo "================="
echo ""
echo "What's next?"
echo ""
echo "1️⃣  For Marcelo (Main Laptop):"
echo "   git pull                    (get latest)"
echo "   npm run dev                 (start development)"
echo "   git commit + git push       (pre-commit hooks run automatically)"
echo "   git tag v1.0.0 + git push --tags  (deploy)"
echo ""
echo "2️⃣  For Marina (Second Laptop):"
echo "   watch-sync.sh runs in background (automatic sync every $SYNC_INTERVAL sec)"
echo "   git pull (to catch up)"
echo "   Work normally (commits auto-sync)"
echo "   git tag v1.0.0 + git push --tags (deploy when needed)"
echo ""
echo "3️⃣  Both:"
echo "   GitHub Actions handles:"
echo "      ✓ Testing on push"
echo "      ✓ Building Docker images"
echo "      ✓ Deploying on tags"
echo "      ✓ Brain capture automático"
echo ""
echo "📖 Read: docs/SYNC-AND-DEPLOY-STRATEGY.md for details"
echo ""
