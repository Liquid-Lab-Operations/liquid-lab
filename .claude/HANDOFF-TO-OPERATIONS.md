---
title: Handoff to Operations User
date: 2026-06-06
from: Pivo (marcelopivovar)
to: operations
---

# Handoff to Operations User

**Status:** Liquid Lab Phase 3 Complete  
**Environment:** Ready for Phase 4 (Agent Federation)  
**Date:** 2026-06-06

---

## 🎯 Current State

✅ **Infrastructure Running:**
- liquidlab-cluster-nemoclaw (K3s) — ACTIVE
- 6 pods operational (4 in liquid-lab, 2 in data-layer)
- PostgreSQL + Redis + 3 Node.js services

✅ **Codebase Complete:**
- All source code in GitHub
- Kubernetes manifests ready
- Automated setup scripts
- Full documentation

✅ **Ready for:**
- Phase 4: Agent Federation implementation
- Marina laptop replication
- Production deployment

---

## 🔄 Handoff Process

### Step 1: Logout and Switch User

```bash
# Pivo: Final check and commit (if needed)
cd ~/Claude/projects/liquid-lab
git status
git log --oneline | head -5

# Then logout
exit
```

### Step 2: Login as Operations

```bash
su - operations
# OR if using sudo
sudo su - operations
```

### Step 3: Setup Operations Environment

```bash
# Navigate to home
cd ~

# Clone repository
git clone https://github.com/Liquid-Lab-Operations/liquid-lab.git
cd liquid-lab

# Run setup (installs deps, builds images)
chmod +x scripts/*.sh
./scripts/setup-new-machine.sh

# This will:
# ✓ Check Docker/Node.js/Git
# ✓ Create .env.local
# ✓ Install npm dependencies
# ✓ Build Docker images
# ⏱️ Takes ~2 minutes
```

### Step 4: Check Existing K3s Cluster

```bash
# Verify if cluster is still running from Pivo's session
docker ps | grep liquidlab-cluster-nemoclaw

# If running, proceed to Step 5
# If NOT, create new cluster:
docker run --name liquidlab-cluster-nemoclaw \
  -d -p 8080:30051 \
  ghcr.io/nvidia/openshell/cluster:0.0.16

# Wait 10 seconds for startup
sleep 10
```

### Step 5: Deploy to K3s

```bash
# Deploy all services
./scripts/deploy-to-k3s.sh

# This will:
# ✓ Load Docker images into K3s
# ✓ Apply Kubernetes manifests
# ✓ Wait for pods to be ready
# ✓ Show status and endpoints
# ⏱️ Takes ~3 minutes
```

### Step 6: Verify All is Working

```bash
# Check pods
docker exec liquidlab-cluster-nemoclaw kubectl get pods -A

# Expected output:
# NAME                              READY   STATUS    RESTARTS   AGE
# claude-api-...                    1/1     Running   0          XXm
# embeddings-...                    1/1     Running   0          XXm
# hermes-agent-...                  1/1     Running   0          XXm
# liquid-lab-api-...                1/1     Running   0          XXm
# postgres-0                         1/1     Running   0          XXm
# redis-0                            1/1     Running   0          XXm

# Check services
docker exec liquidlab-cluster-nemoclaw kubectl get svc -A

# Test API
curl http://localhost:3000/health
```

---

## 📚 Important Files

**Know these locations:**

```
~/Claude/projects/liquid-lab/
├── code/                      # Next.js application
├── services/
│   ├── hermes-agent/         # Hermes Agent implementation
│   ├── claude-api/           # Claude API wrapper
│   └── embeddings/           # Embeddings service
├── k8s/                       # Kubernetes manifests
├── scripts/
│   ├── setup-new-machine.sh  # Initial setup
│   └── deploy-to-k3s.sh      # Deploy to K3s
├── docs/
│   └── ARCHITECTURE-LIQUIDLAB-NEMOCLAW.md  # Architecture
├── SETUP-NEW-MACHINE.md       # Setup guide
└── .env.local                 # Environment (generated)
```

**Key Documentation:**

```bash
# Read architecture
cat docs/ARCHITECTURE-LIQUIDLAB-NEMOCLAW.md

# Read setup guide
cat SETUP-NEW-MACHINE.md

# View recent commits
git log --oneline | head -10
```

---

## 🚀 Next Phase: Agent Federation

**Where to start:**

```bash
# Open the implementation checklist
cat IMPLEMENTATION-CHECKLIST.md

# Phase 4 tasks:
1. Modify Hermes Agent for delegation
2. Create Agent Registry
3. Implement agent-to-agent HTTP
4. Test with Marina's agent
```

**Key files to modify:**

```
services/hermes-agent/src/agent.js
  ├── Add /agents/delegate endpoint
  ├── Add /agents/register endpoint
  └── Add agent_federation tool

services/hermes-agent/src/tools/agent-federation.js  (NEW)
  ├── Call remote agents
  ├── Agent discovery
  └── Result aggregation
```

---

## 🔐 Security Notes

**Credentials:**

```
.env.local contains:
- DB_PASSWORD (auto-generated, safe to regenerate)
- ANTHROPIC_API_KEY (needs real value)
- GRAFANA_PASSWORD (default: admin)

DO NOT commit .env.local to Git
DO NOT share ANTHROPIC_API_KEY
```

**Git Access:**

```bash
# Verify you have access
git remote -v
# Should show: origin https://github.com/Liquid-Lab-Operations/liquid-lab.git

# Make changes and push
git add .
git commit -m "..."
git push origin main
```

---

## 🆘 Troubleshooting

**If something breaks:**

```bash
# 1. Check K3s status
docker ps | grep liquidlab-cluster-nemoclaw

# 2. View pod logs
docker exec liquidlab-cluster-nemoclaw \
  kubectl logs -n liquid-lab deployment/hermes-agent

# 3. Check pod details
docker exec liquidlab-cluster-nemoclaw \
  kubectl describe pod <pod-name> -n liquid-lab

# 4. Restart a pod
docker exec liquidlab-cluster-nemoclaw \
  kubectl rollout restart deployment/hermes-agent -n liquid-lab

# 5. Full reset (if needed)
docker exec liquidlab-cluster-nemoclaw \
  kubectl delete all -n liquid-lab
# Then re-run: ./scripts/deploy-to-k3s.sh
```

---

## ✅ Handoff Checklist

**For Pivo (before logout):**
- [x] All code committed and pushed
- [x] Documentation updated
- [x] K3s cluster running
- [x] All tests passing
- [x] Handoff document created

**For operations (after login):**
- [ ] Clone repository
- [ ] Run ./scripts/setup-new-machine.sh
- [ ] Verify K3s cluster running
- [ ] Run ./scripts/deploy-to-k3s.sh
- [ ] Verify all pods are ready
- [ ] Test API endpoints
- [ ] Read ARCHITECTURE-LIQUIDLAB-NEMOCLAW.md
- [ ] Start Phase 4 implementation

---

## 📞 Communication

**If operations needs to ask Pivo something:**

Use GitHub Issues:
```bash
# Create issue
gh issue create --title "Phase 4: Agent Federation questions" \
  --body "..."

# Or comment on existing issues
gh issue comment <number> --body "..."
```

**Or direct message via Slack/Email**

---

## 🎯 Summary

**What operations inherits:**
✅ Running K3s cluster  
✅ 6 operational pods  
✅ Complete codebase  
✅ Automated scripts  
✅ Full documentation  

**What operations needs to do:**
→ Setup local environment (5 min)  
→ Verify infrastructure (5 min)  
→ Start Phase 4 (Agent Federation)  

**Total onboarding time: ~15-20 minutes**

---

**Good luck! Phase 4 is ready to go.** 🚀

