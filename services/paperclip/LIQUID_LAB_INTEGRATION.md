# Paperclip × Hermes Integration (Liquid Lab)

## Overview

**Paperclip** is the **orchestration layer** for Liquid Lab's multi-agent system.

**Hermes** agents execute tasks coordinated by Paperclip.

## Architecture

```
┌─────────────────────────────────────┐
│     Paperclip Dashboard             │
│  (Goals, Teams, Budget, Monitoring) │
└─────────────────────┬───────────────┘
                      │
        ┌─────────────┴─────────────┐
        │ Agent Orchestration       │
        ├─ Task Distribution        │
        ├─ Budget Management        │
        ├─ Goal Alignment           │
        └──────────┬────────────────┘
                   │
        ┌──────────▼──────────────────┐
        │   Hermes Agent Team         │
        ├─ CEO Agent                  │
        ├─ CTO Agent                  │
        ├─ Engineer Agents            │
        ├─ Designer Agents            │
        └─────────────────────────────┘
```

## Integration Points

### 1. Agent Registration
Hermes agents register with Paperclip on startup:
```bash
POST paperclip:3000/agents/register
{
  "name": "hermes-cto",
  "role": "CTO",
  "capabilities": ["architecture", "agent-federation"],
  "budget": 1000
}
```

### 2. Goal Submission
Business goals are defined in Paperclip:
```bash
POST paperclip:3000/goals/create
{
  "title": "Implement Agent Federation",
  "description": "Multi-agent coordination for Liquid Lab",
  "deadline": "2026-06-30",
  "budget": 5000
}
```

### 3. Task Execution
Paperclip distributes tasks to Hermes agents:
```bash
POST paperclip:3000/tasks/assign
{
  "agentId": "hermes-cto",
  "goal": "agent-federation",
  "task": "Design federation protocol"
}
```

### 4. Monitoring & Reporting
Dashboard tracks:
- Agent activity and costs
- Goal progress
- Budget consumption
- Agent performance metrics

## Configuration

### Environment Variables
```bash
PAPERCLIP_PORT=3000
HERMES_ENDPOINT=http://hermes-agent:3001
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
```

### K8s Deployment
Paperclip runs in the same K3s cluster:
```bash
kubectl apply -f services/paperclip/docker/k8s/
```

### Docker Compose
```bash
docker-compose -f docker-compose.nemoclaw.yml up paperclip
```

## Phase 4 Implementation

### Current Status
- ✅ Paperclip official repo integrated
- ✅ Hermes service ready for coordination
- 🔄 Integration endpoints in development

### Next Steps
1. **Configure Paperclip for Liquid Lab**
   - Set up agent team structure
   - Define roles and capabilities
   - Configure budgets and governance

2. **Hermes Integration**
   - Register all Hermes agents
   - Set up task queue binding
   - Configure feedback loops

3. **Dashboard Setup**
   - Agent monitoring
   - Goal tracking
   - Budget visualization
   - Performance metrics

## References

- **Paperclip Docs**: https://paperclip.ing/docs
- **GitHub**: https://github.com/paperclipai/paperclip
- **Discord**: https://discord.gg/m4HZY7xNG3

## Key Concepts

| Term | Description |
|------|-------------|
| **Goal** | Business objective assigned to agent team |
| **Agent** | AI worker (Hermes instance) with capabilities |
| **Task** | Unit of work distributed to agents |
| **Budget** | Cost limit for agent execution |
| **Org Chart** | Team structure and roles |
| **Coordination** | Multi-agent task orchestration |

---

**Paperclip** = Company/Manager  
**Hermes** = Employee/Worker  
**Liquid Lab** = Business
