import type { NextApiRequest, NextApiResponse } from 'next';

type Model = {
  name: string;
  modified_at: string;
  size: number;
};

type ResponseData = {
  models: Model[];
  total: number;
  timestamp: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(`${ollamaUrl}/api/tags`, {
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout));

    if (!response.ok) {
      throw new Error(`Ollama returned ${response.status}`);
    }

    const data = (await response.json()) as { models?: Model[] };
    const models = data.models || [];

    res.status(200).json({
      models,
      total: models.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching models:', error);
    res.status(503).json({ error: 'Ollama service unavailable' });
  }
}
