# Knowledge Capture System

Sistema integrado que captura e sincroniza conversas de Chat, Cowork e Code para Obsidian + Graphify, construindo um grafo de conhecimento em tempo real.

## Arquitetura

```
┌─────────────────────────────────────┐
│      Múltiplas Fontes               │
├─────────────────────────────────────┤
│ • Claude Code (Chat + Code)         │
│ • Cowork Sessions                   │
│ • Manual Notes                      │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Knowledge Capture Service          │
├─────────────────────────────────────┤
│ • Parse conversations               │
│ • Extract insights & decisions      │
│ • Generate metadata                 │
└──────────────┬──────────────────────┘
               │
        ┌──────┴──────┐
        ▼             ▼
    Obsidian      Graphify
    (Vault)    (Knowledge Graph)
       │             │
       └─────┬───────┘
             ▼
      Liquid Lab Brain
      (Unified Knowledge)
```

## Features

✅ **Captura Automática:**
- Chat histories
- Code sessions
- Cowork notes
- Decision logs

✅ **Processamento:**
- Parse markdown
- Extract topics
- Identify decisions
- Link entities

✅ **Sincronização:**
- Para Obsidian vault
- Para Graphify análise
- Metadados estruturados
- Frontmatter completo

✅ **Análise:**
- Grafo semântico
- Relações entre notas
- Insights detectados
- Tendências de decisão

## Estrutura de Diretórios

```
services/knowledge-capture/
├── src/
│   ├── index.js              — Main service
│   ├── parser.js             — Parse conversations
│   ├── extractor.js          — Extract insights
│   └── sync.js               — Sync to destinations
├── scripts/
│   ├── capture-chat.sh       — Capture from Chat
│   ├── capture-cowork.sh     — Capture from Cowork
│   └── process-all.sh        — Process & sync all
├── converters/
│   ├── chat-to-md.js         — Chat → Markdown
│   ├── code-to-md.js         — Code → Markdown
│   └── decision-extractor.js — Extract decisions
└── README.md
```

## Padrão de Nota (Obsidian)

```markdown
---
title: Session Title
data: 2026-06-06
tipo: conversacao
fonte: claude-code | cowork | manual
tags: [conversacao, insights, decisoes]
status: documentado
participants: [pivo, claude]
graphify-analysis: graph-2026-06-06
knowledge-graph: true
---

# Session: Topic

## Contexto

[Resumo do que foi discutido]

## Decisões Tomadas

- [[decisão-1]] — Implementar X
- [[decisão-2]] — Usar Y

## Insights Extraídos

- Insight 1
- Insight 2
- Insight 3

## Próximos Passos

- [ ] Ação 1
- [ ] Ação 2

## Links Relacionados

- [[Projeto XYZ]]
- [[SOP Relacionado]]
- [[graphify-2026-06-06]] — Ver análise

---

**Capturado em:** 2026-06-06  
**Fonte:** Claude Code  
**Status:** Analysed by Graphify
```

## Workflow Automático

### 1. Captura

```bash
# Ao fim de cada sessão
./scripts/capture-chat.sh
./scripts/capture-cowork.sh
```

### 2. Processamento

```bash
# Converte para markdown estruturado
node src/parser.js < raw-conversation.txt
```

### 3. Extração de Insights

```bash
# Extrai decisões, ações, insights
node src/extractor.js conversation.md
```

### 4. Sincronização

```bash
# Envia para Obsidian + Graphify
node src/sync.js --destination obsidian,graphify
```

### 5. Análise

```bash
# Graphify analisa o novo conhecimento
curl -X POST http://graphify:7000/analyze \
  -d '{"source": "liquid-lab-brain", "type": "conversation"}'
```

## Integração com Obsidian

**Vault:** `~/Library/Mobile Documents/iCloud~md~obsidian/Documents/Liquid Lab Brain/`

**Pasta:** `_conversas-claude/` (padrão do Bem-vindo.md)

**Sincronização:** Automática via iCloud

## Integração com Graphify

**Endpoint:** `POST /analyze`

**Payload:**
```json
{
  "source": "_conversas-claude/2026-06-06.md",
  "type": "conversation",
  "title": "Session: Knowledge Capture",
  "tags": ["knowledge-capture", "insights"]
}
```

**Output:** `graph-2026-06-06.html` em `~/.nemoclaw/graphify-out/`

## Fluxo Completo

```
1. Conversação ocorre
   ↓
2. ./scripts/process-all.sh
   ├─ Captura chat/cowork
   ├─ Converte para MD
   ├─ Extrai decisões
   └─ Gera frontmatter
   ↓
3. Arquivo .md criado
   ├─ Enviado para Obsidian
   ├─ Adicionado ao Git
   └─ Commitado
   ↓
4. Graphify analisa
   ├─ Parse grafo semântico
   ├─ Extrai relações
   └─ Gera HTML interativo
   ↓
5. Nota atualizada
   └─ [[graphify-YYYY-MM-DD]] link adicionado
   ↓
6. Liquid Lab Brain
   └─ Conhecimento unificado disponível
```

## Benefícios

🎯 **Captura Zero-Esforço:**
- Automático ao fim da sessão
- Sem perda de contexto
- Histórico completo

🎯 **Conhecimento Estruturado:**
- Decisões rastreáveis
- Ações identificadas
- Insights documentados

🎯 **Análise em Tempo Real:**
- Graphify processa automaticamente
- Grafo semântico gerado
- Relações descobertas

🎯 **Acesso Unificado:**
- Tudo em Obsidian
- Conectado via links
- Pesquisável e navegável

## Próximas Fases

**Phase 1:** Captura e sincronização básica  
**Phase 2:** Extração automática de decisões  
**Phase 3:** Análise com Graphify em tempo real  
**Phase 4:** Dashboard de knowledge metrics  
**Phase 5:** Recommendations baseadas em grafo  

---

**Parte de:** Liquid Lab Phase 4  
**Status:** Design → Implementation
