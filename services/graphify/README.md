# Graphify Service

Knowledge graph analysis service for Liquid Lab. Runs in Nemoclaw sandbox, outputs to `~/.nemoclaw/graphify-out/`.

## Architecture

```
Hermes Agent
    ↓
REST API (:7000)
    ↓
Graphify Service (Nemoclaw)
    ↓
HTML Graph + JSON Metadata
    ↓
Linked in Liquid Lab Brain (Obsidian)
```

## Features

- ✅ Analyze documentation, code, conversations
- ✅ Generate semantic knowledge graphs
- ✅ Interactive HTML output
- ✅ JSON structured data
- ✅ Isolated in Nemoclaw sandbox
- ✅ Integrated with Obsidian via links

## API Endpoints

### Health Check
```bash
GET /health
```

### Submit Analysis
```bash
POST /analyze
{
  "source": "path/to/file",
  "type": "docs|code|conversation",
  "title": "Analysis Title",
  "tags": ["tag1", "tag2"]
}
```

### Get Analysis
```bash
GET /analyze/:id
```

### List All Analyses
```bash
GET /analyses
```

### Get Graphify Version
```bash
GET /version
```

## Output

All outputs stored in: `~/.nemoclaw/graphify-out/`

Format: `graph-YYYY-MM-DD.html`

## Configuration

### Environment Variables
- `PORT` — Service port (default: 7000)
- `OUTPUT_DIR` — Output directory (default: `~/.nemoclaw/graphify-out`)
- `NODE_ENV` — Environment (development/production)

### Required Tools
- Graphify CLI (`graphifyy`)
- Python 3.11+
- Node.js 18+

## Deployment

### Local Development
```bash
npm install
npm start
```

### Docker
```bash
docker build -t graphify:latest .
docker run -p 7000:7000 -v $HOME/.nemoclaw:/nemoclaw graphify:latest
```

### Kubernetes
```bash
kubectl apply -f k8s/deployment.yaml
```

## Integration with Hermes

Hermes agents request analysis via REST API:

```javascript
const result = await axios.post('http://graphify:7000/analyze', {
  source: documentPath,
  type: 'docs',
  title: `Analysis of ${documentPath}`,
  tags: ['hermes-analysis']
});

// Link in Liquid Lab Brain
noteMetadata.graphifyAnalysis = result.id;
```

## Obsidian Integration

### In Your Note

```markdown
---
title: Architecture Analysis
graphify-analysis: graph-2026-06-06
tags: [architecture, graphify-analysis]
---

# Analysis

Content here...

[[graphify-2026-06-06]] — See knowledge graph
```

### Rules

✅ Links only — use `graphify-analysis` in frontmatter  
✅ Output external — `~/.nemoclaw/graphify-out/`  
✅ Tag analysis — `#graphify-analysis`  
✅ Naming standard — `graph-YYYY-MM-DD.html`  

❌ Never store in vault  
❌ Never create sub-folders  
❌ Never pollute Obsidian cache  

## Security

Runs in Nemoclaw sandbox (ADR-001):
- Isolated from host
- No direct file system access
- Policy-based execution (`pypi`, `network`)
- All outputs in isolated directory

## References

- [Graphify Official](https://graphify.ing)
- [ADR-001: Nemoclaw Security](../docs/ADR-001-NEMOCLAW-SECURITY.md)
- [ADR-002: Graphify in Nemoclaw](../docs/ADR-002-GRAPHIFY-NEMOCLAW.md)
- [SOP-001: Documentation Protocol](../docs/SOP-001-DOCUMENTATION-PROTOCOL.md)
- [Bem-vindo — Liquid Lab Brain](https://obsidian.md) (Graphify section)

---

**Part of Liquid Lab Phase 4: Multi-Agent Knowledge Graph Integration**
