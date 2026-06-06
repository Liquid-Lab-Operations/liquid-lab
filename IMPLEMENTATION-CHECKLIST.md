# IMPLEMENTATION CHECKLIST — Liquid Lab Nemoclaw-First

**Status:** Ready to start  
**Date:** 2026-06-06

---

## Phase 1: Foundation (This week)

### 1.1 Setup Infrastructure

- [ ] Create all 4 base sandboxes in Nemoclaw:
  ```bash
  nemoclaw init liquid-lab-api
  nemoclaw init hermes-agent
  nemoclaw init claude-api
  nemoclaw init data-layer
  ```

- [ ] Create config files in `~/.nemoclaw/`:
  - [ ] `liquid-lab-api.env`
  - [ ] `hermes-agent.env`
  - [ ] `claude-api.env`
  - [ ] `data-layer.env`

- [ ] Create setup scripts in `~/.nemoclaw/`:
  - [ ] `setup-liquid-lab-api.sh`
  - [ ] `setup-hermes-agent.sh`
  - [ ] `setup-claude-api.sh`
  - [ ] `setup-data-layer.sh`

### 1.2 liquid-lab-api Sandbox

- [ ] Create Dockerfile: `code/Dockerfile.nemoclaw`
- [ ] Create start script: `~/.nemoclaw/setup-liquid-lab-api.sh`
- [ ] Test locally:
  ```bash
  nemoclaw liquid-lab-api connect
  cd /app
  npm install
  npm run build
  npm start
  ```
- [ ] Verify health: `curl http://localhost:3000/health`
- [ ] Setup monitoring: Add to Prometheus config

### 1.3 data-layer Sandbox

- [ ] Create docker-compose: `infra/docker-compose.nemoclaw.yml`
- [ ] Create initialization SQL: `infra/init.sql`
- [ ] Setup PostgreSQL:
  ```bash
  nemoclaw data-layer connect
  psql -f /app/init.sql
  ```
- [ ] Setup Redis cache
- [ ] Verify connections from liquid-lab-api

### 1.4 claude-api Sandbox (API Wrapper)

- [ ] Create wrapper service: `services/claude-api/`
- [ ] Features:
  - [ ] Prompt caching layer
  - [ ] Request throttling
  - [ ] Response validation
  - [ ] Audit logging
- [ ] Test:
  ```bash
  curl -X POST http://localhost:3000/v1/messages \
    -H "Content-Type: application/json" \
    -d '{"model":"claude-3-5-sonnet-20241022","messages":[...]}'
  ```

### 1.5 Observability

- [ ] Setup Prometheus config
- [ ] Setup Grafana dashboards:
  - [ ] API health dashboard
  - [ ] Agent execution dashboard
  - [ ] Database performance dashboard
- [ ] Configure centralized logging (Loki)
- [ ] Test metrics collection

---

## Phase 2: Hermes Agent Integration (Week 1)

### 2.1 hermes-agent Sandbox

- [ ] Install Hermes framework:
  ```bash
  npm install @hermes-ai/core @anthropic-ai/sdk
  ```

- [ ] Create agent structure:
  ```
  services/hermes-agent/
  ├── src/
  │   ├── agent.js          (main agent)
  │   ├── tools/            (agent tools)
  │   │   ├── search.js
  │   │   ├── database.js
  │   │   └── claude.js
  │   ├── config.js
  │   └── logger.js
  ├── package.json
  └── Dockerfile
  ```

- [ ] Implement core tools:
  - [ ] Knowledge search (to database)
  - [ ] Claude API call (to claude-api sandbox)
  - [ ] Decision making
  - [ ] Logging/audit

### 2.2 Agent Testing

- [ ] Unit tests for each tool
- [ ] Integration tests (agent + dependencies)
- [ ] End-to-end test (API → Agent → Database → Claude)

- [ ] Stress test:
  ```bash
  ab -n 100 -c 10 http://localhost:3001/agent/execute
  ```

### 2.3 Documentation

- [ ] Document agent architecture
- [ ] Document tool usage
- [ ] Document agent policies
- [ ] Create troubleshooting guide

---

## Phase 3: Knowledge Base (Week 2)

- [ ] Create vector-db sandbox
- [ ] Integrate embeddings (Anthropic or OpenAI)
- [ ] Setup RAG pipeline
- [ ] Test retrieval quality

---

## Security Validation

### Per Sandbox

- [ ] [ ] Verify network policies (no unexpected outbound)
- [ ] [ ] Verify filesystem access (read/write limited)
- [ ] [ ] Verify environment variables (secrets not logged)
- [ ] [ ] Verify resource limits (CPU, memory, disk)

### Cross-Sandbox

- [ ] [ ] API sandbox cannot reach database directly
- [ ] [ ] Agent sandbox cannot reach external networks
- [ ] [ ] Claude API sandbox only reaches Anthropic endpoint
- [ ] [ ] All traffic is logged and auditable

### Audit

- [ ] [ ] Enable audit logging for all sandboxes
- [ ] [ ] Setup alerts for policy violations
- [ ] [ ] Regular security scans (npm audit, trivy, etc)

---

## Deployment Readiness

- [ ] [ ] All sandboxes have health checks
- [ ] [ ] All sandboxes have graceful shutdown
- [ ] [ ] All sandboxes have backup/restore procedures
- [ ] [ ] Documentation is complete
- [ ] [ ] Team is trained
- [ ] [ ] Monitoring is configured
- [ ] [ ] Runbooks are written

---

## Success Criteria

By end of Phase 1:
- ✓ 4 sandboxes running independently
- ✓ Data persists in database
- ✓ API serves requests
- ✓ Metrics collected in Prometheus
- ✓ Logs aggregated in Loki

By end of Phase 2:
- ✓ Hermes Agent executes within sandbox
- ✓ Agent can call tools (database, Claude, search)
- ✓ Agent decisions are logged and auditable
- ✓ End-to-end flow works

By end of Phase 3:
- ✓ RAG pipeline functional
- ✓ Knowledge retrieval works
- ✓ Quality metrics acceptable
- ✓ Ready for production

---

## Quick Commands

```bash
# Start all sandboxes
nemoclaw start-all

# Connect to a sandbox shell
nemoclaw liquid-lab-api connect

# View logs
nemoclaw logs liquid-lab-api --follow

# Health check all
for s in liquid-lab-api hermes-agent claude-api; do
  curl http://localhost:3000/health 2>/dev/null && echo "$s: OK"
done

# Clean up (if needed)
nemoclaw destroy liquid-lab-api
```

---

**Ready to implement?** Start with Phase 1, Step 1.1.  
**Questions?** Refer to ARCHITECTURE-NEMOCLAW-FIRST.md

