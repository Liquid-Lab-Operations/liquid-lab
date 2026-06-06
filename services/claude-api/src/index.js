const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

// Initialize Anthropic client only if API key exists
let anthropic = null;
try {
  if (process.env.ANTHROPIC_API_KEY) {
    const Anthropic = require('@anthropic-ai/sdk');
    anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
} catch (e) {
  console.warn('Anthropic client initialization deferred (API key missing)');
}

// Middleware
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'claude-api',
    anthropic: anthropic ? 'configured' : 'waiting-for-api-key'
  });
});

// Claude API wrapper endpoint
app.post('/v1/messages', async (req, res) => {
  try {
    const { model = 'claude-3-5-sonnet-20241022', messages, max_tokens = 1024 } = req.body;

    const message = await anthropic.messages.create({
      model,
      max_tokens,
      messages,
    });

    res.json(message);
  } catch (error) {
    console.error('Claude API error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Claude API wrapper listening on port ${port}`);
});
