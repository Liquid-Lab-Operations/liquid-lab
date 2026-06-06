/**
 * Paperclip — Agent Orchestrator for Liquid Lab Hermes
 * 
 * Responsible for:
 * - Agent lifecycle management
 * - Task distribution and queuing
 * - Agent health monitoring
 * - Workflow orchestration
 */

const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Agent Registry
const agents = new Map();
const tasks = new Map();

/**
 * Health Check Endpoint
 */
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    service: 'paperclip',
    timestamp: new Date().toISOString(),
    activeAgents: agents.size,
    pendingTasks: tasks.size
  });
});

/**
 * Register Agent
 * POST /agents/register
 */
app.post('/agents/register', (req, res) => {
  const { name, type, capabilities } = req.body;
  const agentId = uuidv4();
  
  agents.set(agentId, {
    id: agentId,
    name,
    type,
    capabilities,
    status: 'ready',
    registeredAt: new Date(),
    tasksCompleted: 0
  });
  
  res.status(201).json({ 
    agentId,
    message: 'Agent registered successfully'
  });
});

/**
 * Submit Task for Orchestration
 * POST /tasks/submit
 */
app.post('/tasks/submit', (req, res) => {
  const { agentId, action, payload, priority = 'normal' } = req.body;
  const taskId = uuidv4();
  
  if (!agents.has(agentId)) {
    return res.status(404).json({ error: 'Agent not found' });
  }
  
  tasks.set(taskId, {
    id: taskId,
    agentId,
    action,
    payload,
    priority,
    status: 'pending',
    createdAt: new Date()
  });
  
  res.status(202).json({
    taskId,
    message: 'Task submitted for orchestration'
  });
});

/**
 * Get Task Status
 * GET /tasks/:taskId
 */
app.get('/tasks/:taskId', (req, res) => {
  const task = tasks.get(req.params.taskId);
  
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  res.json(task);
});

/**
 * Get Agent Status
 * GET /agents/:agentId
 */
app.get('/agents/:agentId', (req, res) => {
  const agent = agents.get(req.params.agentId);
  
  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' });
  }
  
  res.json(agent);
});

/**
 * List All Agents
 * GET /agents
 */
app.get('/agents', (req, res) => {
  const agentsList = Array.from(agents.values());
  res.json({ agents: agentsList, total: agentsList.length });
});

/**
 * Start Server
 */
app.listen(PORT, () => {
  console.log(`[Paperclip] Agent Orchestrator running on port ${PORT}`);
  console.log(`[Paperclip] Hermes integration ready`);
});

module.exports = app;
