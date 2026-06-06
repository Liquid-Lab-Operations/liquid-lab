const Anthropic = require('@anthropic-ai/sdk');
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const logger = require('./logger');
const DatabaseTool = require('./tools/database');
const ClaudeTool = require('./tools/claude');
const SearchTool = require('./tools/search');

// Initialize Anthropic
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Initialize tools
const databaseTool = new DatabaseTool();
const claudeTool = new ClaudeTool();
const searchTool = new SearchTool();

// Tool definitions for Claude
const TOOLS = [
  {
    name: 'database_query',
    description: 'Execute SQL queries against the Liquid Lab database. Use for data retrieval and storage operations.',
    input_schema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'SQL query to execute (SELECT, INSERT, UPDATE, DELETE)',
        },
        params: {
          type: 'array',
          description: 'Query parameters for prepared statements',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'knowledge_search',
    description: 'Search documents and knowledge base for relevant information',
    input_schema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query to find relevant documents',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results to return',
          default: 5,
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'call_claude',
    description: 'Call Claude API for decision making, analysis, or generation tasks',
    input_schema: {
      type: 'object',
      properties: {
        prompt: {
          type: 'string',
          description: 'The prompt to send to Claude',
        },
        model: {
          type: 'string',
          description: 'Claude model to use',
          enum: ['claude-3-5-sonnet-20241022', 'claude-3-opus-20250219'],
          default: 'claude-3-5-sonnet-20241022',
        },
      },
      required: ['prompt'],
    },
  },
];

/**
 * Process tool calls from Claude
 */
async function processToolCall(toolName, toolInput) {
  logger.info(`Processing tool call: ${toolName}`, { toolInput });

  try {
    switch (toolName) {
      case 'database_query':
        return await databaseTool.execute(toolInput.query, toolInput.params || []);

      case 'knowledge_search':
        return await searchTool.search(toolInput.query, toolInput.limit || 5);

      case 'call_claude':
        return await claudeTool.call(toolInput.prompt, toolInput.model);

      default:
        return {
          error: `Unknown tool: ${toolName}`,
          success: false,
        };
    }
  } catch (error) {
    logger.error(`Tool execution failed: ${toolName}`, { error: error.message });
    return {
      error: error.message,
      success: false,
    };
  }
}

/**
 * Agent execution loop
 */
async function executeAgent(userMessage, conversationContext = []) {
  const executionId = uuidv4();
  logger.info(`Starting agent execution: ${executionId}`, { userMessage });

  const messages = [
    ...conversationContext,
    {
      role: 'user',
      content: userMessage,
    },
  ];

  let response;
  let iteration = 0;
  const maxIterations = 10;

  while (iteration < maxIterations) {
    iteration++;
    logger.info(`Agent iteration ${iteration}/${maxIterations}`, { executionId });

    // Call Claude with tools
    response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
      tools: TOOLS,
      messages,
    });

    // Check if we need to process tool calls
    if (response.stop_reason === 'end_turn') {
      logger.info(`Agent completed after ${iteration} iterations`, { executionId });
      break;
    }

    if (response.stop_reason === 'tool_use') {
      // Process all tool calls
      const toolResults = [];

      for (const content of response.content) {
        if (content.type === 'tool_use') {
          logger.info(`Tool use detected: ${content.name}`, { executionId, toolId: content.id });

          const result = await processToolCall(content.name, content.input);

          toolResults.push({
            type: 'tool_result',
            tool_use_id: content.id,
            content: JSON.stringify(result),
          });
        }
      }

      // Add assistant response and tool results to conversation
      messages.push({
        role: 'assistant',
        content: response.content,
      });

      messages.push({
        role: 'user',
        content: toolResults,
      });
    }
  }

  // Extract final text response
  const finalResponse = response.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('\n');

  logger.info(`Agent execution completed: ${executionId}`, {
    iterations: iteration,
    hasResponse: !!finalResponse,
  });

  return {
    executionId,
    response: finalResponse,
    iterations: iteration,
    messages,
  };
}

// Express API
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'hermes-agent',
    timestamp: new Date().toISOString(),
  });
});

/**
 * Execute agent endpoint
 */
app.post('/agent/execute', async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({
        error: 'message is required',
      });
    }

    const result = await executeAgent(message, context || []);

    res.json(result);
  } catch (error) {
    logger.error('Agent execution error', { error: error.message });
    res.status(500).json({
      error: error.message,
      success: false,
    });
  }
});

/**
 * Agent status endpoint
 */
app.get('/agent/status', (req, res) => {
  res.json({
    status: 'running',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

/**
 * Tool info endpoint
 */
app.get('/agent/tools', (req, res) => {
  res.json({
    tools: TOOLS.map((tool) => ({
      name: tool.name,
      description: tool.description,
    })),
  });
});

// Start server
app.listen(port, () => {
  logger.info(`Hermes Agent listening on port ${port}`);
});

module.exports = {
  executeAgent,
  processToolCall,
};
