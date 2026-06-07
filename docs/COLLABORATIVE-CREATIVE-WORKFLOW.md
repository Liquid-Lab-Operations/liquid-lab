---
title: Collaborative Creative Workflow
date: 2026-06-07
status: Standards
author: Liquid Lab Operations
---

# Collaborative Creative Workflow

**Best practices para trabalhar em modo cooperativo em projetos criativos compartilhados.**

---

## 🎨 Tipos de Projetos Criativos

```
Liquid Lab Creative Projects:
├── Decks de Apresentação (PPTX)
├── Design & Brand (logos, cores, assets)
├── Documentação (guias, manuais, educacional)
├── Conteúdo (blog, social, newsletter)
├── Estratégia (roadmaps, positioning, narrativa)
├── Insights (pesquisa, análise, findings)
└── Especificações (PRDs, design docs, specs)
```

---

## 🏗️ Estrutura Base

### **Diretório para Projetos Criativos**

```
liquid-lab/
├── creative/                          ← Projetos criativos aqui
│   ├── _active/                       ← Em produção
│   │   ├── 2026-Q2-Brand-Refresh/
│   │   ├── 2026-H1-Roadmap/
│   │   └── 2026-Pitch-Deck/
│   │
│   ├── _templates/                    ← Templates reutilizáveis
│   │   ├── deck-template.pptx
│   │   ├── document-template.md
│   │   └── brand-guidelines.md
│   │
│   ├── _archive/                      ← Projetos finalizados
│   │   └── 2025-Q4-*.pptx
│   │
│   └── README.md                      ← Overview & status
│
├── assets/                            ← Logos, imagens, fonts (existente)
│   ├── liquid-lab/
│   ├── v8tech/
│   └── personal/
│
└── brain/                             ← Knowledge base (existente)
    ├── _neurônios/
    │   ├── dec/                       ← Design decisions
    │   ├── prj/                       ← Creative projects
    │   ├── ctx/                       ← Creative context/inspiration
    │   └── sys/                       ← Creative systems (brand, design)
    └── _conversas-claude/             ← Creative sessions
```

---

## 🔄 Workflow Colaborativo (4 Fases)

### **Phase 1: Ideação (Brainstorm)**

**Objetivo:** Explorar, criar, gerar ideias

**Ambiente:**
```
Local: Creative project folder (exemplo: 2026-Q2-Brand-Refresh/)
Tool: Claude Cowork (collaborative) + Claude Chat (brainstorm)
Media: Text (MD), sketches, references, inspirations
```

**Processo:**
```
1. Você: Cria folder /creative/_active/PROJECT-NAME/
2. Você: Adiciona brief.md com objetivo + contexto
3. Você + Marina: Brainstorm em Claude (Cowork ou Chat)
4. Claude: Gera múltiplas direções/opções
5. Você + Marina: Discutem, votam, selecionam direção
6. Resultado: 2-3 direções principais escolhidas
```

**Outputs:**
```
PROJECT-NAME/
├── brief.md              ← O que estamos criando e por quê
├── directions/
│   ├── direction-1.md    ← Opção A (Marcelo's preference)
│   ├── direction-2.md    ← Opção B (Marina's preference)
│   └── direction-3.md    ← Opção C (consensus)
├── references/           ← Inspirações, imagens, links
│   └── inspo.md
└── brainstorm.md         ← Notas de sessão
```

**Documentação de Decisão:**
```
brain/_neurônios/dec/
└── DEC-XXX_PROJECT_Creative_Direction.md

---
title: DEC-XXX Project Creative Direction
tipo: decisão
tags: [criativo, design, projeto]
---

# DEC-XXX — Project Creative Direction

**Projeto:** [Nome]
**Decisão:** Escolhemos direção XYZ
**Alternativas consideradas:** A, B, C
**Justificativa:** [Por que esta direção é melhor]

## 🎨 Direção Escolhida
[Descrição visual, cores, tom, estilo]

## ❌ Direções Rejeitadas
- A: [Por que não]
- B: [Por que não]

## 🔗 Relacionado
[[PRJ-XXX_Project_Name]]
```
```

---

### **Phase 2: Execução (Design & Creation)**

**Objetivo:** Criar a versão final

**Ambiente:**
```
Tool: Claude Code (se conteúdo) + Claude Cowork (colaborativo)
Padrão: Branches para exploração
Sync: Git commit + push automático
```

**Processo:**
```
1. Branch criativa:
   git checkout -b creative/project-name
   
2. Um lead (Marcelo ou Marina):
   ├─ Cria versão inicial em PPTX/MD/assets
   ├─ Commit: "creative: [project] initial draft"
   ├─ Push para branch
   
3. Outro colaborador (Marina ou você):
   ├─ Pull do branch
   ├─ Edita/sugere melhorias
   ├─ Commit: "creative: [project] feedback from Marina"
   ├─ Push
   
4. Loop feedback:
   ├─ Iterações rápidas
   ├─ Comentários em commits
   ├─ Claude reviews visuais
   └─ Até está pronto para revisão formal
```

**Estrutura de Arquivo:**

```
PROJECT-NAME/
├── brief.md                    ← Sempre atualizado
├── versions/
│   ├── v1-draft/
│   │   ├── design-deck.pptx
│   │   └── notes.md
│   │
│   ├── v2-feedback/
│   │   ├── design-deck.pptx    ← Com feedback incorporado
│   │   ├── changelog.md        ← O que mudou de V1
│   │   └── notes.md
│   │
│   ├── v3-final/
│   │   ├── design-deck.pptx    ← Pronto para produção
│   │   └── export/
│   │       ├── slides-jpg/     ← Para compartilhar
│   │       └── presentation-pdf/
│   │
│   └── CURRENT_VERSION.txt     ← "v3-final" (sempre atualizado)
│
├── assets/
│   ├── photos/
│   ├── icons/
│   ├── graphs/
│   └── references/
│
└── feedback.md                 ← Log de feedback incorporado
```

**Commits Padrão:**
```bash
git commit -m "creative: [project] [action] [detail]"

Exemplos:
- creative: brand-refresh draft color palette
- creative: deck-2026 add section 3 with metrics
- creative: pitch-deck marina feedback on flow
- creative: roadmap incorporate product feedback
```

---

### **Phase 3: Revisão (Review & Approval)**

**Objetivo:** QA, feedback, aprovação antes de finalizar

**Processo:**
```
1. Lead (Marcelo):
   git push creative/project-name
   Create PR: creative/project-name → main
   
2. Revisor (Marina ou stakeholder):
   ├─ Review visuals (imagens da apresentação)
   ├─ Valida conteúdo (textos, números, facts)
   ├─ Valida estratégia (alinha com objetivos?)
   ├─ Comentários: "looks great!" ou "suggest changes"
   
3. Feedback Loop:
   If approved:
   └─ Merge PR → main
   
   If changes needed:
   ├─ Lead incorpora feedback
   ├─ Commit: "creative: [project] incorporate review feedback"
   ├─ Push
   ├─ Re-request review
```

**Checklist de Revisão Criativa:**

```markdown
## Visual Quality
- [ ] Layout é limpo e bem organizado?
- [ ] Tipografia é consistente?
- [ ] Cores seguem brand guidelines?
- [ ] Imagens têm alta qualidade?
- [ ] Elementos não se sobrepõem?

## Conteúdo
- [ ] Mensagens estão claras?
- [ ] Números/dados estão corretos?
- [ ] Não há typos/erros?
- [ ] Tom é apropriado?
- [ ] Fluxo é lógico?

## Estratégia
- [ ] Alinha com objetivos do projeto?
- [ ] Responde à brief?
- [ ] Diferencia vs. concorrência?
- [ ] Viável para executar?
- [ ] Pronto para stakeholders?

## Pronto?
- [ ] Pode fazer merge
- [ ] Pode publicar
- [ ] Pode compartilhar com clientes
```

---

### **Phase 4: Publicação & Sharing**

**Objetivo:** Disponibilizar para uso

**Processo:**
```
1. Merge para main:
   PR → Merge → Git push
   
2. Exportar versões:
   PPTX → PDF, PNG, JPG (para compartilhar)
   MD → HTML, PDF (para documentação)
   
3. Compartilhar:
   ├─ OneDrive (se arquivo compartilhado com stakeholders)
   ├─ GitHub (versão final + histórico)
   ├─ Slack (notificação)
   └─ Cowork (todos veem automático)
   
4. Documentar decisão final:
   brain/_neurônios/prj/
   └─ PRJ-XXX_Project_Final.md
   
5. Archive versões antigas:
   creative/_active/PROJECT → creative/_archive/
```

**Documentação de Resultado:**

```markdown
brain/_neurônios/prj/PRJ-XXX_Brand_Refresh_Final.md

---
title: PRJ-XXX Brand Refresh — Final
tipo: projeto
tags: [criativo, brand, concluído]
status: ativo (published)
---

# PRJ-XXX — Brand Refresh Final

**Status:** ✅ Publicado
**Data:** 2026-06-07
**Lead:** Marcelo Pivovar
**Colaborador:** Marina Garcia

---

## 🎨 Resultado Final

[Screenshot/descrição visual]

---

## 📋 Especificações

| Item | Detalhe |
|------|---------|
| Cores | #2C5F2D, #97BC62, #F5F5F5 |
| Tipografia | Inter (sans), Georgia (serif) |
| Estilo | Moderno, accessible, sustainável |

---

## 🔄 Processo

- **Direções exploradas:** 3
- **Rodadas feedback:** 2
- **Tempo total:** 2 semanas
- **Reuniões:** 4

---

## 👥 Colaboradores

[[CTX-001_Perfil_Marcelo_Pivovar]]
[[CTX-002_Perfil_Marina_Garcia]]

---

## 🔗 Relacionado

[[DEC-XXX_Creative_Direction]]
[[SYS-XXX_Brand_Guidelines]]
```

---

## 💬 Comunicação & Feedback

### **Durante Criação (Real-time)**

```
Local: Cowork workspace
Tool: Comments em arquivos (se suportado) ou Slack
Padrão:
├─ ✅ "Looks great!" — aprovado
├─ 💬 "Suggest..." — mudança sugerida
├─ ❓ "Question about..." — dúvida
└─ 🎨 "Try this..." — alternativa
```

### **Feedback em Arquivo**

```markdown
# Project Name — Feedback

## 💬 Feedback de Marina (2026-06-07)

### Seção 1: Cores
> "As cores estão bonitas, mas sugerem tentar #2C5F2D no lugar de #3D6E4F"
> → INCORPORADO em v2

### Seção 2: Fluxo
> "O slide 3 poderia vir antes do slide 2 para melhor narrativa"
> → INCORPORADO em v2 + EXPLICAÇÃO em brain neuron

### Seção 3: Tipografia
> "Serifa em títulos é ousada — testar sem serifa também?"
> → TESTADO em v2, mantém serifa (mais sofisticado)

## 💬 Feedback de Stakeholder (2026-06-08)

### Geral
> "Adorei a direção! Algumas pequenas ajustes..."
> → INCORPORADO em v3-final
```

---

## 🧠 Documentação: Neurônios para Projetos Criativos

### **CTX — Contexto Criativo**

```markdown
brain/_neurônios/ctx/CTX-XXX_Project_Inspiration.md

---
title: CTX-XXX Project Inspiration & Mood
tipo: contexto
tags: [criativo, inspiração, projeto]
---

# CTX-XXX — Project Inspiration & Mood

**Projeto:** [Nome]
**Vibe:** [Uma frase que capture o mood]

---

## 🎨 Inspiration Board

- [Reference 1]: Link + por quê
- [Reference 2]: Link + o que aprender
- [Reference 3]: Link + elemento a explorar

---

## 📊 Target Audience

- Persona A: [Descrição + como abordamos]
- Persona B: [Descrição + como abordamos]

---

## 💡 Key Messages

1. [Mensagem principal]
2. [Suporte 1]
3. [Suporte 2]

---

## 🔗 Relacionado

[[DEC-XXX_Creative_Direction]]
[[PRJ-XXX_Project_Name]]
```

### **DEC — Decisão Criativa**

```markdown
brain/_neurônios/dec/DEC-XXX_Creative_Decision.md

[Já documentado acima]
```

### **PRJ — Projeto Criativo**

```markdown
brain/_neurônios/prj/PRJ-XXX_Creative_Project.md

[Já documentado acima]
```

### **SYS — Sistema Criativo (Brand Guidelines)**

```markdown
brain/_neurônios/sys/SYS-XXX_Brand_Guidelines.md

---
title: SYS-XXX Brand Guidelines
tipo: sistema
tags: [brand, guidelines, sistema]
---

# SYS-XXX — Brand Guidelines

**Mantém consistência criativa**

---

## 🎨 Paleta de Cores

| Nome | HEX | RGB | Uso |
|------|-----|-----|-----|
| Primary | #2C5F2D | ... | Headlines, CTAs |
| Secondary | #97BC62 | ... | Backgrounds, accents |
| Neutral | #F5F5F5 | ... | Body text |

---

## 📝 Tipografia

| Elemento | Font | Tamanho | Peso |
|----------|------|---------|------|
| Headlines | Georgia | 36-44pt | Bold |
| Body | Inter | 14-16pt | Regular |
| Captions | Inter | 12pt | Light |

---

## 🖼 Imagery Style

- Fotografia: Authentic, diverse, inclusive
- Ilustração: Minimalist, modern, accessible
- Ícones: Thin stroke, 2px weight, consistent

---

## ✍️ Voice & Tone

- Informal, direct, conversational
- Never corporate jargon
- Brazilian Portuguese nuances
- Accessible language

---

## 🔗 Relacionado

[[PRJ-001_Liquid_Lab]] (brand principal)
[[DEC-XXX_Color_Palette_Decision]]
```

---

## 🔄 Ciclo de Vida do Projeto Criativo

```
┌─ Ideação
│  └─ Brief → Direções (3) → Escolher 1
│  └─ Documentar em DEC neuron
│
├─ Execução
│  └─ V1 → Feedback → V2 → Feedback → V3-Final
│  └─ Branch criativo → iterações
│
├─ Revisão
│  └─ Review checklist → Aprovação
│  └─ Incorporate feedback → Merge PR
│
├─ Publicação
│  └─ Export versões → Share → Archive
│  └─ Documentar em PRJ neuron
│
└─ Documentação
   └─ Brain neurons criados
   └─ Decisões rastreáveis
   └─ Conhecimento compartilhado
```

---

## ⚡ Quick Workflow (Resumido)

```
Para cada projeto criativo:

1. Crie folder em creative/_active/
2. Escreva brief.md
3. Brainstorm com Marina (Claude Cowork ou Chat)
4. Escolha direção (documente em DEC)
5. Crie branch criativa
6. Itere (v1 → v2 → v3)
7. PR para review
8. Merge
9. Export + Share
10. Archive quando feito
11. Documente em brain (CTX + DEC + PRJ)
```

---

## 🎯 Princípios Chave

```
1. **Colaboração** 
   Ambas as vozes importam. Duas perspectivas > uma.

2. **Iteração Rápida**
   Draft → Feedback → V2 é melhor que "perfeição na primeira".

3. **Documentação**
   Decisões criativas devem ser rastreáveis (por quê dessa cor?).

4. **Reusabilidade**
   Templates, brand guidelines, estilos = eficiência futura.

5. **Versioning**
   Git tracks criativo também. Histórico é importante.

6. **Comunicação Clara**
   "Looks good" = ambíguo. "Suggest X because Y" = claro.

7. **Approval Gate**
   Feedback formal antes de publicar. QA visual + conteúdo.

8. **Sharing**
   Outcome deve ser fácil compartilhar (PDF, PNG, link).
```

---

## 📋 Checklist: Setup Projeto Criativo

- [ ] Criar folder em `creative/_active/PROJECT-NAME/`
- [ ] Escrever brief.md (objetivo + contexto)
- [ ] Coletar referencias (inspo.md)
- [ ] Brainstorm: 3 direções
- [ ] Documentar decisão em `brain/_neurônios/dec/`
- [ ] Criar branch criativa
- [ ] Começar versão 1
- [ ] Feedback loop: v2, v3, ...
- [ ] PR para review formal
- [ ] Merge quando aprovado
- [ ] Export para PDF/PNG/JPG
- [ ] Compartilhar (OneDrive, Slack)
- [ ] Documentar resultado em `brain/_neurônios/prj/`
- [ ] Archive em `creative/_archive/`

---

## 📚 Exemplos de Projetos Criativos

```
creative/_active/
├── 2026-Brand-Refresh/           ← Repositioning da marca
├── 2026-H1-Pitch-Deck/           ← Para investidores
├── 2026-Knowledge-Hub-Design/    ← Site design
├── 2026-Marketing-Campaign/      ← Social + email
├── 2026-Product-Roadmap/         ← Visual roadmap
├── 2026-Team-Handbook/           ← Onboarding doc
└── 2026-Case-Study/              ← Para clientes
```

---

**Status:** ✅ Framework documentado | **Last update:** 2026-06-07

_Criatividade + Estrutura = Colaboração eficiente._
