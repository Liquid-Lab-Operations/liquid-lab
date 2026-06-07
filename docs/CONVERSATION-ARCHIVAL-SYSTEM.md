# Claude Conversation Archival System

**Objetivo:** Automatizar captura de conversas Claude (Chat, Cowork, Code) → Obsidian + Git

**Status:** 🏗️ Em Implementação  
**Data:** 2026-06-07

---

## 🎯 Visão Geral

Sistema automatizado que captura todas conversas do usuário `operations` de:
- ✅ Claude Chat (web)
- ✅ Claude Cowork (desktop app)
- ✅ Claude Code (CLI)

E as arquiva em Obsidian com padrão definido:
```
_conversas-claude/
├── CC 2026-06-07 Obsidian Architecture.md
├── CC 2026-06-07 Git Automation.md
└── CC 2026-06-07 Infrastructure Planning.md
```

Com versionamento Git automático e funcionamento cross-platform (Marcelo + Marina).

---

## 🏗️ Arquitetura da Solução

```
┌─────────────────────────────────────────────┐
│      Fontes de Conversa (3)                 │
├─────────────────────────────────────────────┤
│ • Claude Chat API    (chat.claude.ai)       │
│ • Cowork Local Logs  (~/Library/App.../...) │
│ • Claude Code Logs   (CLI sessions)         │
└──────────────┬────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│   Conversation Archival Engine (Python)    │
├─────────────────────────────────────────────┤
│ • Fetch & Parse conversas                   │
│ • Format padrão Obsidian                    │
│ • Deduplicate (não arquivar 2x)            │
│ • Add metadata (date, topic, tags)          │
└──────────────┬────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│      Obsidian Vault (_conversas-claude/)    │
├─────────────────────────────────────────────┤
│ Salva com padrão: CC YYYY-MM-DD Topic.md    │
└──────────────┬────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│       Git Automation (auto-commit)          │
├─────────────────────────────────────────────┤
│ • Detecta novos arquivos                    │
│ • Commit automático                         │
│ • Push para remote (GitHub)                 │
│ • Sync com Dropbox                          │
└─────────────────────────────────────────────┘
```

---

## 📋 Componentes da Solução

### 1. **Python Script** (`claude_archiver.py`)
**Função:** Capturar conversas de 3 fontes e salvar no Obsidian

```python
# Pseudocódigo
claude_archiver.py
├── config.yaml                    # Configuração (paths, API keys)
├── sources/
│   ├── chat_api.py               # Fetch Claude Chat API
│   ├── cowork_logs.py            # Parse Cowork app logs
│   └── code_cli.py               # Extract Claude Code sessions
├── processor.py                   # Format + deduplicate
├── obsidian_writer.py            # Save com padrão
└── git_sync.py                   # Auto-commit + push
```

### 2. **Configuration** (`~/.liquidlab/claude_archiver_config.yaml`)
```yaml
user: "operations"
vaults:
  primary: "~/Dropbox/Obsidian/Liquid.Lab.Brain"
  secondary: "~/Dropbox/Obsidian/Pivo.Brain"

sources:
  claude_chat:
    enabled: true
    api_key: "${CLAUDE_API_KEY}"
    fetch_interval_minutes: 30
  
  cowork:
    enabled: true
    app_data_path: "~/Library/Application Support/Claude"
    
  code:
    enabled: true
    session_logs: "~/.claude-code/logs"

output:
  folder: "_conversas-claude"
  date_format: "%Y-%m-%d"
  filename_pattern: "CC {date} {topic}.md"

git:
  auto_commit: true
  auto_push: true
  commit_message: "archive: Claude {source} conversation - {topic}"
```

### 3. **Automação macOS** (Launchd)
**Arquivo:** `~/Library/LaunchAgents/com.liquidlab.claude-archiver.plist`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" ...>
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.liquidlab.claude-archiver</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/python3</string>
        <string>/opt/liquidlab/claude_archiver.py</string>
    </array>
    <key>StartInterval</key>
    <integer>1800</integer> <!-- 30 minutos -->
    <key>RunAtLoad</key>
    <true/>
</dict>
</plist>
```

---

## 📐 Padrão de Arquivo

### Estrutura de Metadados (Frontmatter)
```yaml
---
title: "CC 2026-06-07 Obsidian Architecture"
date: 2026-06-07
type: conversa-claude
source: cowork
topic: obsidian
tags: [knowledge-management, architecture, vault-design]
participants: [Claude (Anthropic), Operations]
duration_minutes: 45
status: archived
summary: "Discussão sobre arquitetura de vaults Obsidian..."
---
```

### Estrutura de Conteúdo
```markdown
# CC 2026-06-07 Obsidian Architecture

**Data:** 2026-06-07  
**Fonte:** Claude Cowork  
**Tema:** Obsidian, Arquitetura  
**Duração:** ~45 min  

## Resumo
[1-2 parágrafos do assunto principal]

## Tópicos Discutidos
- Vault structure best practices
- Neurônios architecture patterns
- Performance optimization

## Insights Principais
1. [Insight 1]
2. [Insight 2]
3. [Insight 3]

## Decisões Tomadas
- [ ] Implementar neurônios em CTX/PRJ/DEC/SYS
- [ ] Setup Git automation
- [x] Create archival system

## Links Relacionados
- [[Bem-vindo]]
- [[_conversas-claude/CC 2026-06-06 Vault Setup]]

## Próximos Passos
1. [Ação 1]
2. [Ação 2]

---
**Arquivado em:** 2026-06-07 20:30 UTC  
**Status:** ✅ Revisado  
**Notas:** [Anotações adicionais]
```

---

## 🔄 Fluxo de Trabalho

### Cenário 1: Claude Chat (Web)
```
1. Você tem conversa em chat.claude.ai
2. Script polls Claude API (a cada 30 min)
3. Detecta nova conversa
4. Extrai: título, mensagens, contexto
5. Gera padrão Obsidian
6. Salva: CC 2026-06-07 [Topic].md
7. Git commit automático
8. Push para GitHub
```

### Cenário 2: Claude Cowork (Desktop)
```
1. Você conversa aqui (agora)
2. Sistema acessa app data local
3. Extrai transcrição de sessão
4. Identifica "tópico" (análise de contexto)
5. Cria arquivo: CC 2026-06-07 [Topic].md
6. Git commit + push
```

### Cenário 3: Claude Code (CLI)
```
1. Você executa: claude-code [project]
2. Sessão registrada em logs
3. Script lê logs locais
4. Extrai contexto (prompt, resultado, files)
5. Salva: CC 2026-06-07 [Code Task].md
6. Git commit + push
```

---

## 🔐 Considerações de Privacidade & Segurança

### ✅ O Que É Capturado
- Conteúdo das conversas (prompts + responses)
- Metadados (data, hora, duração)
- Tópicos e contexto
- Decisões tomadas

### ❌ O Que NÃO É Capturado
- Dados sensíveis de usuários (PII)
- Tokens/chaves de API (exceto em config encriptada)
- Informações confidenciais marcadas com `[SENSITIVE]`

### Encriptação
- Config file: Encriptado com `gpg` ou keychain do macOS
- Vault Obsidian: E2E encryption via Obsidian Sync (opcional)
- Git: Versionado normalmente (privado no GitHub)

---

## 🛠️ Tecnologias

| Component | Tecnologia |
|-----------|-----------|
| **Linguagem** | Python 3.9+ |
| **APIs** | Claude API, Cowork local data, Code CLI |
| **Storage** | Obsidian Markdown + Git |
| **Automação** | Launchd (macOS), Systemd (Linux) |
| **Sync** | Git + Dropbox |
| **Config** | YAML + GPG encryption |

---

## 📦 Implementação (Fases)

### **Fase 1: MVP** (Semana 1)
- [x] Design da arquitetura
- [ ] Python script básico
- [ ] Captura manual Claude Chat via API
- [ ] Format Obsidian padrão
- [ ] Git auto-commit simples

### **Fase 2: Expansão** (Semana 2)
- [ ] Captura Cowork (local logs parsing)
- [ ] Captura Claude Code (CLI logs)
- [ ] Deduplication inteligente
- [ ] Auto-topic detection (NLP)

### **Fase 3: Automação** (Semana 3)
- [ ] Launchd integration macOS
- [ ] Systemd integration Linux
- [ ] Cronjob para Git push
- [ ] Dashboard de status

### **Fase 4: Polish** (Semana 4)
- [ ] UI/Dashboard web simples
- [ ] Logging e monitoring
- [ ] Error handling robusto
- [ ] Documentation completa

---

## 🚀 Quick Start (Quando Implementado)

### Setup Inicial
```bash
# 1. Clone/install
git clone https://github.com/Operations-Liquid-Lab/claude-archiver.git
cd claude-archiver
pip install -r requirements.txt

# 2. Configure
cp config.example.yaml ~/.liquidlab/claude_archiver_config.yaml
# Edit config com seus paths e API keys

# 3. Test
python claude_archiver.py --dry-run

# 4. Enable automação
cp launchd/com.liquidlab.claude-archiver.plist ~/Library/LaunchAgents/
launchctl load ~/Library/LaunchAgents/com.liquidlab.claude-archiver.plist

# 5. Verificar
launchctl list | grep claude-archiver
```

### Uso Manual (When Needed)
```bash
# Trigger manual archive
claude-archiver --force

# Check status
claude-archiver --status

# View logs
tail -f ~/.liquidlab/claude-archiver.log
```

---

## 📊 Monitoramento & Status

### Dashboard (Futuro)
```
┌─────────────────────────────────────────┐
│  Claude Conversation Archival Status    │
├─────────────────────────────────────────┤
│ Claude Chat:    ✅ 247 arquivadas       │
│ Cowork:         ✅ 89 arquivadas        │
│ Code:           ✅ 34 arquivadas        │
│                 ─────────────────       │
│ Total:          ✅ 370 conversas        │
│                                         │
│ Última sync:    2026-06-07 20:45 UTC   │
│ Próxima:        2026-06-07 21:15 UTC   │
│ Status:         🟢 Running normally    │
└─────────────────────────────────────────┘
```

---

## 📝 Logging & Debugging

### Log Files
```
~/.liquidlab/claude-archiver.log    # Main log
~/.liquidlab/archive_errors.log     # Errors
~/.liquidlab/git_sync.log           # Git operations
```

### Log Entry Example
```
2026-06-07T20:45:30 [INFO] Started archival cycle
2026-06-07T20:45:31 [INFO] Fetching Claude Chat API
2026-06-07T20:45:35 [INFO] Found 3 new conversations
2026-06-07T20:45:36 [INFO] Saved: CC 2026-06-07 Obsidian Architecture.md
2026-06-07T20:45:37 [INFO] Saved: CC 2026-06-07 Git Automation.md
2026-06-07T20:45:38 [INFO] Saved: CC 2026-06-07 Vault Setup.md
2026-06-07T20:45:40 [INFO] Running git add -A
2026-06-07T20:45:42 [INFO] Git commit: archive: Claude chat conversations
2026-06-07T20:45:45 [INFO] Git push successful
2026-06-07T20:45:46 [INFO] Archival cycle complete
```

---

## 🎯 Sucesso = Critérios

- ✅ Todas conversas com "operations" user são capturadas
- ✅ Nenhuma conversa é arquivada 2x (deduplication)
- ✅ Padrão de arquivo é consistente (CC YYYY-MM-DD Topic.md)
- ✅ Metadados completos (frontmatter YAML)
- ✅ Git auto-commit funciona
- ✅ Funciona em Marcelo + Marina's computers
- ✅ Automação roda a cada 30 minutos (background)
- ✅ Sem erros de API ou file system

---

## 🔗 Referências Relacionadas

- **Bem-vindo.md** — Padrão de nomenclatura
- **OBSIDIAN-ENGINEERING-GUIDE.md** — Arquitetura Obsidian
- **VAULT-CLONE-SUMMARY.md** — Setup dos vaults
- **AI-CONVERSATIONS-UPDATE.md** — Estrutura de conversas

---

## 📞 Próximos Passos

1. ✅ Aprovar design/arquitetura (AGORA)
2. [ ] Implementar Python script (MVP)
3. [ ] Testar com Claude Chat API
4. [ ] Setup Cowork logs parsing
5. [ ] Adicionar Claude Code support
6. [ ] Deploy automação macOS
7. [ ] Documentar para Marina

---

**Documento:** CONVERSATION-ARCHIVAL-SYSTEM.md  
**Versão:** 1.0 (Design)  
**Status:** 🟡 Aguardando aprovação para implementação  
**Responsável:** Claude Operations Engineer
