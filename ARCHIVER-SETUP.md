# Claude Conversation Archiver - Setup Guide

**Status:** 🏗️ MVP Implementado (Fase 1)  
**Última atualização:** 2026-06-07

---

## 📋 O que foi implementado (Fase 1 - MVP)

✅ **Python Script** (`claude_archiver.py`)
- Estrutura completa da aplicação
- Sistema de configuração (YAML)
- State management (deduplication)
- Obsidian writer com padrão correto
- Git automation (commit + push)
- Logging robusto
- CLI com argumentos

⏳ **O que ainda falta (Fase 2):**
- [ ] Claude Chat API integration (real API calls)
- [ ] Cowork local logs parsing
- [ ] Claude Code CLI logs extraction
- [ ] Launchd automação macOS
- [ ] Dashboard/status page

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd ~/Claude/Projects/liquid-lab

# Install Python 3.9+
python3 --version  # Should be 3.9+

# Install requirements
pip install -r requirements.txt
```

### 2. Setup Configuration

```bash
# Create config directory
mkdir -p ~/.liquidlab

# Create config file
cat > ~/.liquidlab/claude_archiver_config.yaml << 'EOF'
user: "operations"

vaults:
  primary: "~/Library/CloudStorage/Dropbox/Obsidian/Liquid.Lab.Brain"
  secondary: "~/Library/CloudStorage/Dropbox/Obsidian/Pivo.Brain"

sources:
  claude_chat:
    enabled: false  # Will be enabled in Phase 2
    api_key: "${CLAUDE_API_KEY}"
    fetch_interval_minutes: 30
  
  cowork:
    enabled: false  # Will be enabled in Phase 2
    app_data_path: "~/Library/Application Support/Claude"
    
  code:
    enabled: false  # Will be enabled in Phase 2
    session_logs: "~/.claude-code/logs"

output:
  folder: "_conversas-claude"
  date_format: "%Y-%m-%d"
  filename_pattern: "CC {date} {topic}.md"

git:
  auto_commit: true
  auto_push: true
  commit_message: "archive: Claude {source} conversation - {topic}"
EOF

# Edit config with your paths
nano ~/.liquidlab/claude_archiver_config.yaml
```

### 3. Test the Script

```bash
# Make script executable
chmod +x ~/Claude/Projects/liquid-lab/claude_archiver.py

# Test with dry-run (no changes)
python3 ~/Claude/Projects/liquid-lab/claude_archiver.py --dry-run

# Check status
python3 ~/Claude/Projects/liquid-lab/claude_archiver.py --status
```

### 4. Manual Archival (Current Workflow)

Até que a automação esteja pronta, você pode arquivar manualmente:

```bash
# From CLI
python3 ~/Claude/Projects/liquid-lab/claude_archiver.py --force

# Or create an alias
echo 'alias claude-archiver="python3 ~/Claude/Projects/liquid-lab/claude_archiver.py"' >> ~/.zshrc
source ~/.zshrc

# Then use
claude-archiver --status
claude-archiver --force
```

---

## 📖 Como Arquivar Conversas Manualmente (Até Fase 2)

### Método 1: Export Manual

Para cada conversa que quer arquivar:

```bash
# 1. Crie arquivo em _conversas-claude/
cd ~/Dropbox/Obsidian/Liquid.Lab.Brain/_conversas-claude

# 2. Crie arquivo com padrão correto
cat > "CC 2026-06-07 [Topic].md" << 'EOF'
---
title: "CC 2026-06-07 [Topic]"
date: 2026-06-07
type: conversa-claude
source: cowork
topic: [Topic]
tags: [tag1, tag2]
participants: [Claude (Anthropic), Operations]
duration_minutes: 45
status: archived
---

# CC 2026-06-07 [Topic]

**Data:** 2026-06-07
**Fonte:** Claude Cowork
**Tema:** [Topic]
**Duração:** ~45 min

## Conversação

[Cole aqui o conteúdo da conversa]

---
**Arquivado em:** 2026-06-07 HH:MM UTC
**Status:** ✅ Arquivado
EOF
```

### Método 2: Usar Script para Validar

```bash
# Copie a conversa para um arquivo temporário
# Rode o script para validar e arquivar
python3 claude_archiver.py --validate-file "CC 2026-06-07 [Topic].md"
```

---

## 🔌 Para Marina (Setup Duplicado)

Marina precisa fazer o mesmo setup no seu computador:

```bash
# 1. Clone ou copie os scripts
scp ~/Claude/Projects/liquid-lab/claude_archiver.py marina@her-mac:~/Claude/Projects/liquid-lab/

# 2. Setup config
ssh marina@her-mac
mkdir -p ~/.liquidlab
# Cole o mesmo config.yaml mas com paths ajustados para Marina

# 3. Test
python3 ~/Claude/Projects/liquid-lab/claude_archiver.py --status
```

---

## 📊 Estrutura de Arquivos

```
~/.liquidlab/
├── claude_archiver_config.yaml    # Configuration
├── archiver_state.json             # Deduplication state
└── logs/
    ├── claude_archiver.log         # Main log
    └── archive_errors.log          # Error log

~/Dropbox/Obsidian/Liquid.Lab.Brain/
└── _conversas-claude/
    ├── CC 2026-06-07 Obsidian Architecture.md
    ├── CC 2026-06-07 Git Automation.md
    └── CC 2026-06-07 Infrastructure.md
```

---

## 🔍 Verificar Status

```bash
# Ver logs
tail -f ~/.liquidlab/logs/claude_archiver.log

# Ver state (conversas arquivadas)
cat ~/.liquidlab/archiver_state.json | jq

# Ver conversas no Obsidian
ls -la ~/Dropbox/Obsidian/Liquid.Lab.Brain/_conversas-claude/
```

---

## 🐛 Troubleshooting

### Erro: "Config not found"
```bash
mkdir -p ~/.liquidlab
# Rode script novamente para gerar config default
```

### Erro: "API Key not set"
```bash
# Setup sua API key
export CLAUDE_API_KEY="sk-ant-..."
# Ou adicione ao ~/.zshrc/.bash_profile
```

### Erro: "Obsidian folder not found"
```bash
# Verificar paths no config
cat ~/.liquidlab/claude_archiver_config.yaml | grep vault
# Ajustar se necessário
```

### Git push fails
```bash
# Verificar remoto
cd ~/Dropbox/Obsidian/Liquid.Lab.Brain
git remote -v

# Se não houver remote, adicionar
git remote add origin https://github.com/Operations-Liquid-Lab/brain.git
git branch -M main
git push -u origin main
```

---

## 📝 Próximas Fases

### Fase 2 (Próxima)
- [ ] Integrar Claude Chat API real
- [ ] Parser para Cowork logs
- [ ] Parser para Claude Code logs
- [ ] Auto-topic detection (NLP)

### Fase 3 (Depois)
- [ ] Launchd automation (macOS)
- [ ] Systemd automation (Linux)
- [ ] Cron scheduler

### Fase 4 (Final)
- [ ] Dashboard web
- [ ] UI melhorada
- [ ] Monitoring

---

## 🎯 Métricas de Sucesso

- [x] Script criado e funcional
- [x] Configuração YAML implementada
- [x] Deduplication logic working
- [x] Obsidian writer com padrão correto
- [x] Git integration ready
- [ ] Claude Chat API (Fase 2)
- [ ] Cowork parsing (Fase 2)
- [ ] Automação (Fase 3)

---

## 📚 Documentação Relacionada

- `CONVERSATION-ARCHIVAL-SYSTEM.md` — Arquitetura completa
- `claude_archiver.py` — Script principal
- `Bem-vindo.md` — Padrão de arquivo
- `requirements.txt` — Dependências

---

## 💬 Uso Atual (Manual)

Até automação estar pronta:

```bash
# 1. Depois de conversa importante no Cowork
# 2. Copie a conversa
# 3. Crie arquivo em _conversas-claude/ com padrão:
#    CC YYYY-MM-DD [Topic].md
# 4. Cole conteúdo e preencha frontmatter
# 5. Salve
# 6. Run script (opcional):
claude-archiver --force

# 7. Git auto-commit/push (se enabled)
```

---

**Setup criado em:** 2026-06-07  
**Versão:** MVP (Fase 1)  
**Status:** 🟢 Pronto para uso manual + testes
