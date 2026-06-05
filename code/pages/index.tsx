import React from 'react';

export default function Home() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Liquid Lab — Model Router</h1>
      <p>Infraestrutura escalável com Ollama (8 modelos) + Claude API fallback</p>

      <section style={{ marginTop: '2rem' }}>
        <h2>Status</h2>
        <ul>
          <li><strong>Ollama:</strong> <a href="http://localhost:11434/api/tags">http://localhost:11434/api/tags</a></li>
          <li><strong>Prometheus:</strong> <a href="http://localhost:9090">http://localhost:9090</a></li>
          <li><strong>Grafana:</strong> <a href="http://localhost:3001">http://localhost:3001</a></li>
        </ul>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>API Endpoints</h2>
        <ul>
          <li><code>/api/health</code> — Health check</li>
          <li><code>/api/models</code> — List available models</li>
          <li><code>/api/route</code> — Model Router (POST)</li>
        </ul>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>Documentation</h2>
        <p>Ver <code>./README.md</code> para instruções de setup e deployment.</p>
      </section>
    </div>
  );
}
