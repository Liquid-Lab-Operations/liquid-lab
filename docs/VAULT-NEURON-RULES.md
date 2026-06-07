---
title: Regras para Salvar Neurônios no Obsidian Vault
date: 2026-06-07
status: Standards
author: Liquid Lab Operations
---

# Regras para Salvar Neurônios no Vault

**Como estruturar, nomear e documentar neurônios no Obsidian vault da Liquid Lab.**

---

## 📋 Estrutura de Diretórios

```
brain/
├── _neurônios/              ← Todas as notas atômicas aqui
│   ├── ctx/                 → Contexto corporativo
│   ├── prj/                 → Projetos ativos
│   ├── dec/                 → Decisões arquiteturais
│   └── sys/                 → Sistemas e configurações
├── _conversas-claude/       → Resumos de sessões automáticas
├── templates/               → Templates para novas notas
├── README.md                → Overview do vault
├── GIT_CONFIG.md            → Configuração git
└── .obsidian/               → Obsidian configs (local)
```

**Regra:** TODOS os neurônios ficam em `_neurônios/<tipo>/`

---

## 🏷️ Tipos de Neurônios

### CTX — Contexto Corporativo

**Arquivo:** `_neurônios/ctx/CTX-XXX_Nome_Do_Contexto.md`

**Uso:** Perfis, estrutura organizacional, regras, padrões

**Exemplo:**
- `CTX-001_Perfil_Marcelo_Pivovar.md`
- `CTX-002_Perfil_Marina_Garcia.md`
- `CTX-003_Estrutura_V8Tech.md`

---

### PRJ — Projetos Ativos

**Arquivo:** `_neurônios/prj/PRJ-XXX_Nome_Do_Projeto.md`

**Uso:** Projetos em desenvolvimento, roadmaps, status

**Exemplo:**
- `PRJ-001_Liquid_Lab.md`
- `PRJ-002_Knowledge_Team.md`

---

### DEC — Decisões Arquiteturais (ADRs)

**Arquivo:** `_neurônios/dec/DEC-XXX_Nome_Da_Decisao.md`

**Uso:** Decisões importantes, alternativas consideradas, justificativa

**Exemplo:**
- `DEC-001_Obsidian_Single_Source_Of_Truth.md`
- `DEC-002_Nemoclaw_Security_Architecture.md`

---

### SYS — Sistemas e Configurações

**Arquivo:** `_neurônios/sys/SYS-XXX_Nome_Do_Sistema.md`

**Uso:** Configurações, procedimentos operacionais, arquitetura técnica

**Exemplo:**
- `SYS-001_Monorepo_Git_Configuration.md`
- `SYS-002_Docker_Compose_Setup.md`

---

## 📝 Frontmatter (Cabeçalho YAML)

**Obrigatório para TODOS os neurônios:**

```yaml
---
title: [TIPO]-[ID] Nome Descritivo
data: YYYY-MM-DD
tipo: contexto|projeto|decisão|sistema
tags: [tag1, tag2, tag3]
status: ativo|rascunho|arquivado
---
```

### Campos Explicados

| Campo | Obrigatório | Valor | Notas |
|-------|------------|-------|-------|
| **title** | ✅ | `CTX-001 Nome` | Deve incluir tipo + ID |
| **data** | ✅ | `2026-06-07` | Data de criação |
| **tipo** | ✅ | `contexto` ou `projeto` etc | Deve ser um dos 4 tipos |
| **tags** | ✅ | `[tag1, tag2]` | Array YAML, 2+ tags |
| **status** | ✅ | `ativo` | `ativo`, `rascunho`, ou `arquivado` |

**Exemplo completo:**

```yaml
---
title: CTX-001 Perfil Marcelo Pivovar
data: 2026-05-27
tipo: contexto
tags: [pessoas, perfil, cto, liderança]
status: ativo
---
```

---

## 🏗️ Estrutura do Conteúdo

### Seção 1: Cabeçalho (Header)

```markdown
# [TIPO]-[ID] — Nome Descritivo

**Campo1:** Valor1  
**Campo2:** Valor2  
**Campo3:** Valor3
```

**Exemplo:**

```markdown
# CTX-001 — Perfil Marcelo Pivovar

**Nome:** Marcelo Pivovar  
**Apelido:** Pivo  
**Email:** marcelopivovar@hotmail.com  
**Cargo:** VP de Tecnologia & IA — V8.Tech  
**Localização:** São Paulo, Brasil  
**Experiência:** CTO Oracle Brasil 15+ anos
```

---

### Seção 2: Conteúdo Principal

**Estrutura padrão:**

```markdown
---

## 🎯 [Tópico Principal]

Conteúdo com subtópicos.

---

## 💬 [Outro Tópico]

Mais conteúdo.

---
```

**Regras:**
- Use `##` para seções (não `#`)
- Use `###` para subsecções
- Use emojis para visual (opcional mas recomendado)
- Máximo 1 parágrafo por seção sem subsecção
- Se múltiplos parágrafos, use subsecções com `###`

**Exemplo:**

```markdown
---

## 🎯 Visão & Valores

- Pensa em **sistemas** — tudo conectado
- Constrói **narrativa antes de agir**
- Age com **convicção**

---

## 💬 Estilo de Comunicação

- Tom **informal, direto**
- **Discorda abertamente** quando relevante
- **Sem bullet points excessivos** — prose

---
```

---

### Seção 3: Referências/Links (Fim)

**Formato padrão:**

```markdown
---

## 🔗 Relacionado

[[CTX-001 Perfil Marcelo Pivovar]]  
[[PRJ-001 Liquid Lab]]  
[[SYS-001 Stack Tecnológico Liquid Lab]]
```

**Regras:**
- Use `[[Nome Arquivo]]` para linkar neurônios
- Link sem extensão `.md`
- Um link por linha
- Máximo 3-5 links relacionados

---

## 📛 Nomeação de Arquivos

### Padrão Obrigatório

```
[TIPO]-[ID]_Palavra_Palavra_Palavra.md
```

**Exemplos:**
- ✅ `CTX-001_Perfil_Marcelo_Pivovar.md`
- ✅ `PRJ-002_Knowledge_Team.md`
- ✅ `SYS-001_Monorepo_Git_Config.md`
- ❌ `CTX001_Perfil_Marcelo_Pivovar.md` (sem hífen)
- ❌ `ctx-001_perfil_marcelo_pivovar.md` (minúsculas)
- ❌ `CTX-001 Perfil Marcelo Pivovar.md` (espaços)

**Regras:**
- `[TIPO]` = `CTX`, `PRJ`, `DEC`, `SYS`
- `[ID]` = Número sequencial `001`, `002`, `003`
- Palavras separadas por underscore `_`
- Primeira letra MAIÚSCULA em cada palavra
- SEM espaços, SEM acentos especiais (exceto ã, é, ó)
- SEM caracteres especiais (apenas `_` e `-`)

---

## 🎨 Formatação de Conteúdo

### Texto

```markdown
**Negrito** para ênfase
*Itálico* para termo técnico
`código` para variáveis/comandos
[Link](url) para referências externas
```

### Listas

```markdown
Bullet points:
- Item 1
- Item 2

Numeradas:
1. Passo 1
2. Passo 2

Tabelas:
| Coluna 1 | Coluna 2 |
|----------|----------|
| Valor A  | Valor B  |
```

### Code Blocks

```markdown
\```bash
$ comando
\```

\```yaml
key: value
\```

\```typescript
const x = 123;
\```
```

---

## 🔄 Sincronização com Git

### Obsidian Git Configuration

Em Obsidian → **Settings → Obsidian Git**:

```
✓ Auto pull interval: 10 minutes
✓ Auto push: enabled
✓ Auto commit: enabled
✓ Commit interval: 10 minutes
```

### O que Sincroniza

| Arquivo | Sincroniza | Notas |
|---------|-----------|-------|
| `_neurônios/` | ✅ SIM | Todos os neurônios |
| `_conversas-claude/` | ✅ SIM | Sessions auto-capturadas |
| `.obsidian/plugins/` | ❌ NÃO | Configuração local |
| `.obsidian/workspace.json` | ❌ NÃO | Layout local |
| `.DS_Store` | ❌ NÃO | Sistema macOS |

### Commits Automáticos

```bash
Obsidian Git gera commits como:
"Update note: CTX-001_Perfil_Marcelo_Pivovar.md"
"Modify vault: _neurônios/prj/PRJ-001_*.md"
```

---

## ✅ Checklist: Criar Novo Neurônio

1. **Decidir tipo:** CTX, PRJ, DEC, ou SYS
2. **Gerar ID:** Próximo número sequencial (001, 002, 003...)
3. **Nomear arquivo:** `[TIPO]-[ID]_Nome_Do_Arquivo.md`
4. **Criar em:** `_neurônios/[tipo]/`
5. **Adicionar frontmatter:** title, data, tipo, tags, status
6. **Adicionar cabeçalho:** `# [TIPO]-[ID] — Nome`
7. **Adicionar conteúdo:** Seções com `##`
8. **Adicionar links:** `## 🔗 Relacionado` com links para outros neurônios
9. **Salvar:** `Ctrl+S` (Obsidian Git auto-commit em 10 min)
10. **Verificar GitHub:** Commit deve aparecer em 10 minutos

---

## 🚀 Workflow Padrão

### Criar um novo neurônio

1. Abra Obsidian
2. Novo arquivo: `_neurônios/ctx/CTX-002_Novo_Contexto.md`
3. Copie frontmatter do template (CTX-001)
4. Edite: title, data, tags, status
5. Edite conteúdo (seções com ##)
6. Adicione links relacionados (fim)
7. Salve: `Ctrl+S`
8. Obsidian Git fará commit em ~10 minutos

### Editar um neurônio existente

1. Abra arquivo em Obsidian
2. Edite conteúdo
3. Atualize `data` se mudança significativa
4. Salve: `Ctrl+S`
5. Obsidian Git auto-commit em ~10 minutos

### Linkar entre neurônios

```markdown
[[CTX-001 Perfil Marcelo Pivovar]]
[[PRJ-001 Liquid Lab]]
```

Obsidian reconhece automaticamente e cria "backlinks" bidirecionais.

---

## 📊 Exemplo Completo

**Arquivo:** `_neurônios/prj/PRJ-002_Knowledge_Team.md`

```markdown
---
title: PRJ-002 Knowledge Team V8.Tech
data: 2026-06-07
tipo: projeto
tags: [projetos, v8tech, equipe, arquitetura]
status: ativo
---

# PRJ-002 — Knowledge Team V8.Tech

**Nome:** Knowledge Team  
**Lider:** Marcelo Pivovar (VP Tech & IA)  
**Organização:** V8.Tech  
**Parceiros:** Databricks, Google Cloud, Microsoft, AWS

---

## 🎯 Objetivo

Liderar arquitetura de dados e IA para clientes.

---

## 👥 Membros

- **Marcelo Pivovar** — VP Tech & IA, Architect
- **Marina Garcia** — Operations (entrada em 2026)

---

## 🛠 Stack Tecnológico

| Componente | Tech |
|------------|------|
| **LLM Routing** | Ollama + Claude API |
| **App** | Next.js 14, TypeScript |
| **Infra** | Docker, K3s, Kubernetes |

---

## 📊 Status

| Item | Status |
|------|--------|
| Team formado | ✅ |
| Stack definido | ✅ |
| Clients em onboarding | ⏳ |

---

## 🔗 Relacionado

[[CTX-001 Perfil Marcelo Pivovar]]  
[[PRJ-001 Liquid Lab]]  
[[SYS-001 Monorepo Git Configuration]]
```

---

## 🤔 Perguntas Frequentes

### "Quantas seções (##) um neurônio deve ter?"

**Resposta:** Típicamente 3-5 seções + links no fim.
- Mínimo: 2 seções (além do cabeçalho)
- Máximo: 6-7 seções (muito longo = dividir em 2 neurônios)

### "Quando criar um novo neurônio vs editar um existente?"

**Resposta:**
- **Novo:** Tema diferente, perspectiva diferente, novo projeto/contexto
- **Editar:** Atualizar informação existente, corrigir, expandir

### "Como linkar neurônios corretamente?"

**Resposta:** Use `[[Nome Do Arquivo]]` (sem .md)
```markdown
[[CTX-001 Perfil Marcelo Pivovar]]    ✅
[[CTX-001_Perfil_Marcelo_Pivovar]]    ✅
[[CTX-001 Perfil Marcelo Pivovar.md]] ❌
```

### "Obsidian Git não está sincronizando. O que fazer?"

**Resposta:**
1. Verificar: Settings → Obsidian Git → habilitado?
2. Verificar: Auto commit/push habilitado?
3. Git status manual: `cd brain && git status`
4. Manual push: `git push origin main`

### "Qual o melhor formato para tabelas?"

**Resposta:** Use Markdown tables padrão:
```markdown
| Coluna 1 | Coluna 2 |
|----------|----------|
| Valor A  | Valor B  |
```

---

## 📚 Documentação Relacionada

- **[README.md](README.md)** — Overview do vault
- **[GIT_CONFIG.md](GIT_CONFIG.md)** — Configuração Git
- **[../SYNC-AND-DEPLOY-STRATEGY.md](../SYNC-AND-DEPLOY-STRATEGY.md)** — Sincronização entre laptops
- **[../docs/DIRECTORY-STRUCTURE.md](../docs/DIRECTORY-STRUCTURE.md)** — Estrutura local/remota

---

## ✨ Resumo Rápido

| Aspecto | Regra |
|---------|-------|
| **Tipo** | CTX, PRJ, DEC, SYS |
| **Arquivo** | `[TIPO]-[ID]_Nome.md` em `_neurônios/[tipo]/` |
| **Frontmatter** | title, data, tipo, tags, status |
| **Conteúdo** | Cabeçalho + Seções (##) + Links (fim) |
| **Sincronização** | Obsidian Git auto (10 min) |
| **Links** | `[[Nome Arquivo]]` para neurônios |
| **Emoji** | Opcional mas recomendado em seções |

---

**Status:** ✅ Padrão consolidado | **Last update:** 2026-06-07

_Regras claras = vault consistente = knowledge base profissional._
