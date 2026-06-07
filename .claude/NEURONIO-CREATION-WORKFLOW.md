# Neurônio Creation Workflow — Standard Procedure
**Data:** 2026-06-07  
**Propósito:** Documento padrão para criar neurônios no brain vault

---

## ⚠️ IMPORTANTE: Criar Neurônios SEMPRE exige 3 steps

Muitos dos neurônios são criados via Claude + Git, mas o **Obsidian NÃO sincroniza automaticamente**. Seguir este workflow garante que neurônios apareçam no vault.

---

## 📋 Standard Workflow para Criar Neurônios

### Step 1: Criar arquivo via escrita (Git)
```bash
# Claude cria arquivo em:
# /Users/marcelopivovar/Claude/Projects/liquid-lab/brain/_neurônios/[tipo]/[NAME].md

# Exemplo:
# brain/_neurônios/ctx/CTX-002_Cowork_Setup_Session.md
```

### Step 2: Sincronizar Git com Obsidian
```bash
cd liquid-lab

# Pull latest changes
git pull

# Verify neurônio file exists
ls brain/_neurônios/ctx/CTX-002*
```

### Step 3: Abrir Neurônio no Obsidian
1. **Feche Obsidian completamente** (⌘Q)
2. **Reabra Obsidian**
3. **Verifique se neurônio aparece:**
   - Vá para `brain/_neurônios/` no sidebar
   - Procure por `CTX-002_Cowork_Setup_Session`
   - Se não aparecer, faça: **Obrigada → Settings → About → Vault size** (force refresh)

### Step 4: Validar Links
```markdown
# Abra o neurônio no Obsidian
# Verifique:
- ✅ Frontmatter completo (name, description, metadata)
- ✅ Links internos funcionam ([[nome-arquivo]])
- ✅ Referências na MEMORY.md index
```

---

## 🔧 Auto-Sync Setup (Recomendado)

Para Obsidian sincronizar automaticamente com Git, configure:

### Opção A: Obsidian Git Plugin (Recomendado)
1. Obsidian → Settings → Community Plugins
2. Search: "Obsidian Git"
3. Install + Enable
4. Configure:
   - Auto pull: Every 1 minute
   - Auto push: Every 10 minutes
   - Commit message: `auto: sync neurônios`

### Opção B: Git Auto-Sync via Cron (Terminal)
```bash
# Editar crontab
crontab -e

# Adicionar (pull a cada 5 minutos)
*/5 * * * * cd /Users/marcelopivovar/Claude/Projects/liquid-lab && git pull origin main > /dev/null 2>&1
```

---

## ✅ Checklist: Neurônio Criado Corretamente

Quando criar neurônio SEMPRE validar:

- [ ] Arquivo criado em Git: `brain/_neurônios/[tipo]/[NAME].md`
- [ ] Commit done: `git log --oneline | head -1`
- [ ] Git pull successful: `git pull`
- [ ] Arquivo visível em Obsidian após reabrir
- [ ] Frontmatter correto (name, description, type)
- [ ] Links internos funcionam ([[referências]])
- [ ] Referência adicionada em MEMORY.md index
- [ ] Status confirmado no terminal:
```bash
cat brain/_neurônios/ctx/CTX-002_Cowork_Setup_Session.md | head -10
```

---

## 🚨 Troubleshooting: Neurônio não aparece no Obsidian

### Problema: Arquivo existe em Git mas não aparece no Obsidian

**Solução 1: Force Obsidian Reload**
```bash
# Terminal
cd liquid-lab
git pull

# Obsidian: Quit completely (⌘Q) → Reopen
```

**Solução 2: Check File Encoding**
```bash
# Verify file is UTF-8
file brain/_neurônios/ctx/CTX-002_Cowork_Setup_Session.md

# Output should be: 
# text/plain; charset=utf-8
```

**Solução 3: Regenerate Cache**
- Obsidian → Settings → About → Vault Size (clica para refresh)
- Obsidian → Settings → Files → Refresh file index

**Solução 4: Full Resync**
```bash
# Remove Obsidian cache
rm -rf brain/.obsidian/cache*

# Reopen Obsidian
```

---

## 📝 Template: Neurônio Padrão

Quando criar novo neurônio, SEMPRE usar este template:

```markdown
---
name: ctx-002-cowork-setup  # kebab-case, único
description: Brief one-line description
metadata:
  type: ctx  # ctx, prj, dec, sys
  date: 2026-06-07
  status: completo
---

# CTX-002: Title

**Data:** 2026-06-07  
**Tipo:** Contexto Corporativo  
**Status:** Completo  

---

## Seção 1

Conteúdo...

## Links Relacionados

[[reference-1]] — Description
[[reference-2]] — Description
```

---

## 🔄 Workflow Completo: Claude → Git → Obsidian

```
Claude Creates File
    ↓
    ↓ (Write tool)
    ↓
File in Git Directory
    ↓
    ↓ (git add + commit)
    ↓
Git Repository
    ↓
    ↓ (git pull)
    ↓
Local Sync
    ↓
    ↓ (Obsidian reload)
    ↓
Obsidian Vault ✅
```

---

## 🎓 Reference

**Neurônio Types:**
- **CTX** — Contexto corporativo (brand, valores, decisions)
- **PRJ** — Projetos (planejamento, status, roadmap)
- **DEC** — Decisões arquiteturais (tech decisions)
- **SYS** — Sistemas (configurações, procedures)

**Example Neurônios:**
- `CTX-001_Brand_Identity.md`
- `CTX-002_Cowork_Setup_Session.md`
- `PRJ-001_Liquid_Lab_Roadmap.md`
- `DEC-001_Monorepo_Architecture.md`
- `SYS-001_Git_Configuration.md`

---

*Standard procedure for neurônio creation in Liquid Lab brain vault*
