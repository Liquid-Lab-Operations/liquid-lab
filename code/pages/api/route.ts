import type { NextApiRequest, NextApiResponse } from 'next';

type TaskProfile = 'fast' | 'balanced' | 'quality' | 'fallback';

type RouteRequest = {
  task: string;
  taskProfile?: TaskProfile;
  prompt: string;
};

type RouteResponse = {
  selectedModel: string;
  provider: 'ollama' | 'claude';
  taskProfile: TaskProfile;
  timestamp: string;
  status: 'routed' | 'error';
  message?: string;
};

/**
 * Model Router — routes tasks to appropriate LLM based on TaskProfile
 *
 * Ollama (8 models):
 * - fast: tinyllama:1.1b, orca-mini:3b
 * - balanced: phi:2.7b, neural-chat:7b, mistral:7b
 * - quality: llama2:7b, zephyr:7b, dolphin-mixtral:8x7b
 * - fallback: Claude API
 */
const modelRouter = {
  fast: {
    ollama: ['tinyllama:1.1b', 'orca-mini:3b'],
    fallback: 'claude',
  },
  balanced: {
    ollama: ['phi:2.7b', 'neural-chat:7b', 'mistral:7b'],
    fallback: 'claude',
  },
  quality: {
    ollama: ['llama2:7b', 'zephyr:7b', 'dolphin-mixtral:8x7b'],
    fallback: 'claude',
  },
  fallback: {
    ollama: [],
    fallback: 'claude',
  },
};

async function checkOllamaAvailability(): Promise<boolean> {
  try {
    const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(`${ollamaUrl}/api/tags`, { signal: controller.signal });
      return response.ok;
    } finally {
      clearTimeout(timeout);
    }
  } catch {
    return false;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RouteResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      selectedModel: '',
      provider: 'ollama',
      taskProfile: 'fallback',
      status: 'error',
      timestamp: new Date().toISOString(),
      message: 'Method not allowed',
    });
  }

  try {
    const { task, taskProfile = 'balanced', prompt } = req.body as RouteRequest;

    if (!task || !prompt) {
      return res.status(400).json({
        selectedModel: '',
        provider: 'ollama',
        taskProfile,
        status: 'error',
        timestamp: new Date().toISOString(),
        message: 'Missing task or prompt',
      });
    }

    const profile = (Object.keys(modelRouter).includes(taskProfile) ? taskProfile : 'balanced') as TaskProfile;
    const ollamaAvailable = await checkOllamaAvailability();

    // Route decision
    if (ollamaAvailable && modelRouter[profile].ollama.length > 0) {
      const models = modelRouter[profile].ollama;
      const selectedModel = models[Math.floor(Math.random() * models.length)];

      return res.status(200).json({
        selectedModel,
        provider: 'ollama',
        taskProfile: profile,
        status: 'routed',
        timestamp: new Date().toISOString(),
      });
    } else {
      // Fallback to Claude API
      return res.status(200).json({
        selectedModel: 'claude-3-5-sonnet',
        provider: 'claude',
        taskProfile: 'fallback',
        status: 'routed',
        timestamp: new Date().toISOString(),
        message: ollamaAvailable ? undefined : 'Ollama unavailable, using Claude API',
      });
    }
  } catch (error) {
    console.error('Router error:', error);
    res.status(500).json({
      selectedModel: 'claude-3-5-sonnet',
      provider: 'claude',
      taskProfile: 'fallback',
      status: 'error',
      timestamp: new Date().toISOString(),
      message: 'Routing error, using Claude API fallback',
    });
  }
}
