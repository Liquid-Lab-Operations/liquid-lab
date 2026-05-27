# Liquid Lab Brain — Obsidian Vault Corporativo

**Vault:** Knowledge base centralizado para Liquid Lab  
**Sincronização:** Git + Obsidian Git plugin  
**Acesso:** operations@liquidlab.ag (sincronizado entre Marcelo e Marina)

---

## 📖 Estrutura

```
brain/
├── _neurônios/          → Notas atômicas (CTX/PRJ/DEC/SYS)
│   ├── ctx/             → Contexto corporativo
│   ├── prj/             → Projetos ativos
│   ├── dec/             → Decisões arquiteturais
│   └── sys/             → Configurações de sistemas
├── _conversas-claude/   → Resumos de sessões Claude
├── templates/           → Templates para novas notas
└── README.md            → Este arquivo
```

---

## 🚀 Setup Inicial (Faça UMA VEZ)

### 1. Abrir vault no Obsidian

```bash
# No Obsidian:
# File → Open folder as vault → ~/Projects/liquid-lab/brain
```

### 2. Instalar Obsidian Git plugin

1. Em Obsidian: **Settings → Community plugins → Browse**
2. Procure por **"Obsidian Git"** (por Denolfi)
3. Instale e habilite

### 3. Configurar auto-sync

Em Obsidian → **Obsidian Git → Settings**:

```
✓ Auto pull interval: 10 minutes
✓ Auto push: enabled
✓ Auto commit: enabled
✓ Commit interval: 10 minutes
```

### 4. Fazer primeiro commit

```bash
cd ~/Projects/liquid-lab
git add brain/
git commit -m "Initialize Obsidian vault structure"
git push
```

---

## 📝 Workflow

### Você ou Marina abre o vault:
1. Obsidian Git **auto-pull** → sincroniza mudanças remotas
2. Edita neurônios normalmente
3. Obsidian Git **auto-commit/push** → sincroniza para GitHub

### Sem conflitos porque:
- Você edita em `_neurônios/`
- Marina edita em `_neurônios/`
- Obsidian Git resolve auto-merges

---

## 🧠 Criar novo neurônio

### Exemplo: CTX-001 (Perfil Marcelo Pivovar)

```markdown
---
title: CTX-001 Perfil Marcelo Pivovar
data: 2026-05-27
tipo: contexto
tags: [pessoas, perfil, cto]
status: ativo
---

# CTX-001 — Perfil Marcelo Pivovar

**Nome:** Marcelo Pivovar | Apelido: Pivo  
**Cargo:** VP de Tecnologia & IA — V8.Tech  
**Localização:** São Paulo, Brasil

[conteúdo...]
```

---

## 📌 Neurônios Iniciais (TODO)

- [ ] CTX-001: Perfil Marcelo Pivovar
- [ ] CTX-002: Perfil Marina Garcia
- [ ] CTX-003: Estrutura V8.Tech
- [ ] PRJ-001: Liquid Lab
- [ ] SYS-001: Stack Tecnológico Liquid Lab

---

## 🔗 Links para neurônios

Use **[[CTX-001 Perfil Marcelo Pivovar]]** para linkar entre notas.

---

## ⚠️ NÃO sincronize

Esses arquivos são ignorados por design:
- `.obsidian/plugins/` — configuração local
- `.obsidian/workspace.json` — layout local
- `.DS_Store` — arquivo de sistema

---

*Liquid Lab Brain — Knowledge base centralizado e sincronizado.*
