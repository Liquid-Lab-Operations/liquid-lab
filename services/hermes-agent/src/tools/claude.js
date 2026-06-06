const axios = require('axios');
const logger = require('../logger');

class ClaudeTool {
  constructor() {
    this.apiUrl = process.env.CLAUDE_API_URL || 'http://claude-api:3000';
    this.apiKey = process.env.ANTHROPIC_API_KEY;
  }

  /**
   * Call Claude API via local wrapper
   */
  async call(prompt, model = 'claude-3-5-sonnet-20241022') {
    try {
      logger.debug('Calling Claude API', { model, promptLength: prompt.length });

      const response = await axios.post(
        `${this.apiUrl}/v1/messages`,
        {
          model,
          max_tokens: 1024,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
          timeout: 30000,
        },
      );

      const content = response.data.content
        .filter((block) => block.type === 'text')
        .map((block) => block.text)
        .join('\n');

      logger.debug('Claude API response received', {
        model,
        tokensUsed: response.data.usage?.output_tokens,
      });

      return {
        success: true,
        model,
        response: content,
        usage: response.data.usage,
      };
    } catch (error) {
      logger.error('Claude API call failed', {
        error: error.message,
        status: error.response?.status,
      });

      return {
        success: false,
        error: error.message,
        status: error.response?.status,
      };
    }
  }

  /**
   * Analyze content with Claude
   */
  async analyze(content, analysisType = 'general') {
    const prompts = {
      general: `Analyze the following content and provide insights:\n\n${content}`,
      sentiment: `Analyze the sentiment of the following text:\n\n${content}`,
      summary: `Summarize the following content concisely:\n\n${content}`,
      keywords: `Extract key terms and concepts from:\n\n${content}`,
    };

    const prompt = prompts[analysisType] || prompts.general;
    return this.call(prompt);
  }
}

module.exports = ClaudeTool;
