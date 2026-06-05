import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  status: string;
  timestamp: string;
  services: {
    app: string;
    ollama: string;
    prometheus: string;
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check Ollama health
    const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
    const ollamaController = new AbortController();
    const ollamaTimeout = setTimeout(() => ollamaController.abort(), 5000);

    const ollamaHealth = await fetch(`${ollamaUrl}/api/tags`, { signal: ollamaController.signal })
      .then(() => 'ok')
      .catch(() => 'down')
      .finally(() => clearTimeout(ollamaTimeout));

    // Check Prometheus health
    const prometheusController = new AbortController();
    const prometheusTimeout = setTimeout(() => prometheusController.abort(), 5000);

    const prometheusHealth = await fetch('http://localhost:9090/-/healthy', { signal: prometheusController.signal })
      .then(() => 'ok')
      .catch(() => 'down')
      .finally(() => clearTimeout(prometheusTimeout));

    const allHealthy = ollamaHealth === 'ok' && prometheusHealth === 'ok';

    res.status(allHealthy ? 200 : 503).json({
      status: allHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      services: {
        app: 'ok',
        ollama: ollamaHealth,
        prometheus: prometheusHealth,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Health check failed' });
  }
}
