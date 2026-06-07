# Cowork Project Setup Guide
**Última atualização:** 2026-06-07  
**Status:** ✅ Completo e Pronto para Uso  
**Configurado por:** Marcelo Pivovar

---

## 📋 O que é Este Documento

Guia completo para replicar o setup do projeto Liquid Lab no Cowork, incluindo:
- Sincronização com GitHub
- Configuração de memória master
- Carregamento de brand identity
- Onboarding de novos usuários (ex: Marina Garcia)

---

## 🎯 Objetivo

Ter um projeto Cowork **compartilhado** que:
- ✅ Sincroniza automaticamente com GitHub
- ✅ Carrega contexto corporativo completo (brand, tech, git)
- ✅ Persiste memória entre sessões
- ✅ Acessível para Marina quando receber MacBook

---

## 🚀 Como Replicar Este Setup

### Pré-requisitos
- [ ] Acesso ao repositório GitHub: `Liquid-Lab-Operations/liquid-lab`
- [ ] Plano Cowork Max (permite shared projects)
- [ ] Conta `operations@liquidlab.ag` (identidade corporativa)

### Passo 1: Criar Novo Projeto Cowork

1. Abra Cowork → **Projects**
2. Clique **+ Novo Projeto**
3. Escolha **"Adicionar conteúdo de GitHub"**
4. Selecione:
   - Repositório: `Liquid-Lab-Operations/liquid-lab`
   - Branch: `main`
   - Pastas a sincronizar:
     - ✅ code/
     - ✅ brain/
     - ✅ infra/
     - ✅ mcp/
     - ✅ docs/
     - ❌ assets/ (muito grande)
5. Clique **Criar Projeto**

### Passo 2: Configurar Nome & Visibilidade

1. Vá para **Project Settings**
2. Nome: `Liquid Lab`
3. Descrição: `Independent Business Boutique — Transform challenges into fluid solutions`
4. Visibilidade: **Compartilhado** (aparece em Projects para equipe)
5. Salve configurações

### Passo 3: Carregar Memória Master

#### 3.1 Criar Estrutura de Memória
1. Abra o projeto
2. Clique em **Memória** (ícone de livro)
3. Crie os seguintes arquivos:

**Arquivo 1: `liquid_lab_brand_guide.md`**
```
---
name: liquid_lab_brand_guide
description: Complete brand identity
metadata:
  type: project
---

[Copie conteúdo de brain/_neurônios/ctx/CTX-002 ou veja liquid_lab_brand_guide.md na memória]
```

**Arquivo 2: `liquid_lab_founders.md`**
```
---
name: liquid_lab_founders
description: Co-founders information
metadata:
  type: project
---

# Liquid Lab Co-Founders

**Marcelo Pivovar** — Co-founder & Co-CEO
- GitHub: MarceloPivovar (pessoal), Operations-Liquid-Lab (corporativo)
- Email: operations@liquidlab.ag
- Role: Visão estratégica, arquitetura, inovação

**Marina Garcia** — Co-founder & Co-CEO
- Acesso via operations@liquidlab.ag
- Recebendo MacBook (2026-06)
- Role: Criatividade, storytelling, design thinking
```

**Arquivo 3: `MEMORY.md` (Index)**
```
# Memory Index

## People & Company

- [Liquid Lab Co-Founders](liquid_lab_founders.md)
- [Liquid Lab Brand Guide](liquid_lab_brand_guide.md)
```

#### 3.2 Atualizar Memória
Sempre que acessar o projeto, a memória carrega automaticamente com:
- Brand identity completo
- Informações dos fundadores
- Contexto corporativo

### Passo 4: Validar Sincronização GitHub

1. Faça uma edição em CLAUDE.md
2. Verifique se aparece no GitHub (dentro de 30 segundos)
3. Confirme que commit aparece como `operations@liquidlab.ag`

---

## 📦 Arquivos Configurados

### No Repositório Git
| Arquivo | Propósito |
|---------|-----------|
| `.claude/CLAUDE.md` | Documentação técnica + brand |
| `.claude/SETUP_SESSION.md` | Transcript desta sessão |
| `.claude/COWORK_SETUP.md` | Este guia |
| `brain/_neurônios/ctx/CTX-002_Cowork_Setup_Session.md` | Neurônio de contexto |

### Na Memória do Cowork (Persistente)
| Arquivo | Propósito |
|---------|-----------|
| `liquid_lab_brand_guide.md` | Brand identity completo |
| `liquid_lab_founders.md` | Informações dos fundadores |
| `MEMORY.md` | Index de memória |

---

## 🔑 Configurações Importantes

### Git Identity
Todos os commits DEVEM aparecer como:
```bash
git config user.email "operations@liquidlab.ag"
git config user.name "Liquid Lab Operations"
```

### Cowork Settings
- **Plan:** Max (compartilhado)
- **User:** operations@liquidlab.ag
- **Sync:** GitHub Liquid-Lab-Operations/liquid-lab
- **Memory:** Automatic (persistent across sessions)

### Brand Colors (Use em designs)
- Primary: Liquid Purple `#5e42eb`
- Accent: Creative Red `#fc263f`
- Trust: Ocean Blue `#041e32`

---

## 👥 Onboarding de Novos Usuários

Quando Marina (ou outro usuário) receber acesso:

### Checklist
1. [ ] Marina recebe MacBook
2. [ ] Marina instala Claude desktop + Cowork
3. [ ] Marina faz login com `operations@liquidlab.ag`
4. [ ] Marina vai para **Projects**
5. [ ] Marina abre **"Liquid Lab"**
6. [ ] Memória master carrega automaticamente
7. [ ] Marina tem acesso completo ao contexto:
   - ✅ Brand guide (definição, valores, drivers, cores, tipografia)
   - ✅ Estrutura monorepo (code, brain, infra, mcp)
   - ✅ Stack técnico (Next.js, Ollama, Docker/K8s)
   - ✅ Git config (operations@liquidlab.ag)
   - ✅ Founders info

### Primeiro Acesso de Marina
Recomendações:
- Leia `CLAUDE.md` (overview técnico + brand)
- Leia `SETUP_SESSION.md` (contexto de como foi criado)
- Acesse `brain/_neurônios/ctx/` para compreender estrutura
- Verifique memória do projeto (carregada automaticamente)

---

## 🔄 Manutenção Contínua

### Atualizações de Brand
Se brand guide for atualizado:
1. Atualize `liquid_lab_brand_guide.md` na memória
2. Commit em `.claude/` ou brain/
3. Memória sincroniza automaticamente

### Novos Contextos
Para adicionar novo contexto (ex: nova neurônio):
1. Crie em `brain/_neurônios/`
2. Referencie em `MEMORY.md`
3. Commit no Git
4. Sync automático

### Rotação de Usuários
Quando novo usuário (ex: Marina) começar:
1. Login com `operations@liquidlab.ag`
2. Acesse projeto "Liquid Lab"
3. Memória carrega automaticamente
4. Leia CLAUDE.md + SETUP_SESSION.md

---

## ❓ Troubleshooting

### Projeto não aparece em Projects
**Problema:** Projeto criado antes era local-only
**Solução:** Criar novo projeto COM GitHub integration

### Memória não persiste
**Problema:** Usando conta pessoal ao invés de operations@liquidlab.ag
**Solução:** Logout e faça login com operations@liquidlab.ag

### Git commits não sincronizam
**Problema:** Git config está com usuário pessoal
**Solução:** `git config user.email "operations@liquidlab.ag"`

### Cores não aparecem corretas
**Problema:** Designer usando hex incorreto
**Solução:** Use valores de `liquid_lab_brand_guide.md`

---

## 📞 Contato & Suporte

- **Setup Issues:** Veja SETUP_SESSION.md para contexto histórico
- **Brand Questions:** Consulte liquid_lab_brand_guide.md
- **Tech Stack:** Veja CLAUDE.md seção "Stack Tecnológico"
- **Neurônios:** Acesse brain/_neurônios/ para contexto detalhado

---

## 🎓 Referências

- **Brand Guide:** brain/_neurônios/ctx/CTX-002_Cowork_Setup_Session.md
- **Tech Documentation:** .claude/CLAUDE.md
- **Session Transcript:** .claude/SETUP_SESSION.md
- **GitHub Repo:** https://github.com/Operations-Liquid-Lab/liquid-lab

---

*Guia de setup do projeto Liquid Lab no Cowork — Updated 2026-06-07*
