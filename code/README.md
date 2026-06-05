# Liquid Lab — Next.js Model Router

**Core application** com roteamento inteligente entre Ollama (8 modelos) e Claude API fallback.

---

## 📁 Estrutura

```
code/
├── pages/
│   ├── index.tsx          → Home page
│   └── api/
│       ├── health.ts      → Health check endpoint
│       ├── models.ts      → List available Ollama models
│       └── route.ts       → Model Router logic
├── Dockerfile             → Container build
├── next.config.js         → Next.js configuration
├── tsconfig.json          → TypeScript configuration
├── package.json           → Dependencies
└── README.md              → Este arquivo
```

---

## 🚀 Development

### 1. Install Dependencies

```bash
cd /Users/marcelopivovar/Projects/liquid-lab/code
npm install
```

### 2. Local Development

```bash
npm run dev
```

Acessa em http://localhost:3000

### 3. Build for Production

```bash
npm run build
npm start
```

---

## 🤖 Model Router

### TaskProfile Options

| Profile | Ollama Models | Use Case |
|---------|---------------|----------|
| **fast** | tinyllama:1.1b, orca-mini:3b | Resposta rápida, task simples |
| **balanced** | phi:2.7b, neural-chat:7b, mistral:7b | Equilíbrio entre velocidade e qualidade |
| **quality** | llama2:7b, zephyr:7b, dolphin-mixtral:8x7b | Resposta complexa, alta qualidade |
| **fallback** | Claude API | Quando Ollama indisponível |

### Exemplo: POST /api/route

```bash
curl -X POST http://localhost:3000/api/route \
  -H "Content-Type: application/json" \
  -d '{
    "task": "summarize",
    "taskProfile": "balanced",
    "prompt": "Resuma este texto..."
  }'
```

Response:
```json
{
  "selectedModel": "mistral:7b",
  "provider": "ollama",
  "taskProfile": "balanced",
  "status": "routed",
  "timestamp": "2026-05-27T10:30:00Z"
}
```

---

## 🔌 API Endpoints

- `GET /` — Home page
- `GET /api/health` — Health check (app + Ollama + Prometheus)
- `GET /api/models` — List Ollama models
- `POST /api/route` — Model Router (task routing)

---

## 📊 Monitoring

- **Prometheus:** http://localhost:9090
- **Grafana:** http://localhost:3001 (admin / admin)

---

## 🔧 Configuration

Ver `.env.local` para variáveis de ambiente:
- `CLAUDE_API_KEY` — Claude API key (fallback)
- `OLLAMA_URL` — Ollama endpoint
- `NODE_ENV` — development ou production

---

*Liquid Lab — Infrastructure escalável com Ollama + Claude fallback.*
