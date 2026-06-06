# Paperclip — Agent Orchestrator

**Paperclip** is the agent orchestration system for Liquid Lab Hermes. It manages agent lifecycle, task distribution, and workflow execution.

## Architecture

```
┌─────────────┐
│   Hermes    │  (Agent Execution)
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│   Paperclip         │  (Orchestration)
│                     │
├─ Agent Registry    │
├─ Task Queue        │
├─ Health Monitor    │
└─────────────────────┘
```

## Features

- ✅ Agent registration & lifecycle management
- ✅ Task submission & queuing
- ✅ Agent health monitoring
- ✅ Workflow orchestration
- ✅ Task status tracking

## API Endpoints

### Health Check
```bash
GET /health
```

### Register Agent
```bash
POST /agents/register
Body: {
  "name": "hermes-1",
  "type": "agent",
  "capabilities": ["task-execution", "federation"]
}
```

### Submit Task
```bash
POST /tasks/submit
Body: {
  "agentId": "uuid",
  "action": "execute",
  "payload": {...},
  "priority": "normal"
}
```

### Get Agent Status
```bash
GET /agents/:agentId
```

### Get Task Status
```bash
GET /tasks/:taskId
```

### List Agents
```bash
GET /agents
```

## Deployment

### Local Development
```bash
npm install
npm run dev
```

### Docker
```bash
docker build -t paperclip:latest .
docker run -p 3001:3001 paperclip:latest
```

### Kubernetes
```bash
kubectl apply -f k8s/deployment.yaml
```

## Integration with Hermes

Hermes agents register with Paperclip on startup:
```javascript
await axios.post('http://paperclip:3001/agents/register', {
  name: 'hermes-agent-1',
  type: 'agent',
  capabilities: ['task-execution', 'agent-federation']
});
```

Tasks are submitted by Hermes for orchestration:
```javascript
const taskId = await orchestrator.submit({
  agentId: agentId,
  action: 'execute-task',
  payload: taskData
});
```

## Configuration

### Environment Variables
- `PORT` — Server port (default: 3001)
- `NODE_ENV` — Environment (development/production)
- `HERMES_URL` — Hermes service URL (optional)

## Status

🟢 **Phase 1**: Basic orchestration framework  
🟡 **Phase 2**: Advanced task queuing and prioritization  
🟡 **Phase 3**: Workflow templates and execution plans  
🟡 **Phase 4**: Distributed agent coordination  

---

**Part of Liquid Lab Phase 4: Agent Federation**
