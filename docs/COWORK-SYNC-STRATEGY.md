---
title: Cowork Sync Strategy — Workspace Compartilhado
date: 2026-06-07
status: Standards
author: Liquid Lab Operations
---

# Cowork Sync Strategy — Workspace Compartilhado

**Como sincronizar workspace do Claude Cowork entre múltiplos dispositivos e criar colaboração em tempo real.**

---

## 📋 Situação Atual

```
Seu Laptop (Claude Cowork)
├── Liquid Lab Project (LOCAL)
│   └─ Não aparece no celular
│   └─ Não aparece em outro laptop
│   └─ Não sincroniza com operações@liquidlab.ag
│
Celular
├── (nada)
└── Même logado com operations@liquidlab.ag

Outro Laptop
├── (nada)
└─ Mesmo logado com operations@liquidlab.ag
```

**Problema:** Workspace é local, não sincroniza.

---

## 🎯 Objetivo

```
GitHub: liquid-lab (repo remoto)
│
├─ Laptop 1 (Cowork) ─┐
├─ Laptop 2 (Cowork) ─┼─ Sincroniza automaticamente
├─ Celular (Cowork)   │
└─ Qualquer CLI/IDE   ┘

Resultado:
├─ Workspace aparece em TODOS os dispositivos
├─ Mudanças sincronizam em tempo real
├─ Múltiplas pessoas podem trabalhar simultaneamente
└─ Histórico completo no GitHub
```

---

## 🔄 Solução: Linkar Cowork ao Git

### **Step 1: Entender Estrutura Atual do Cowork**

Abra Claude Cowork no seu laptop:
```
Liquid Lab Project
├── Files/Folders (local)
├── Settings
└── Colaboradores (vazio?)
```

**Checklist:**
- [ ] Projeto existe em Cowork
- [ ] Consegue ver arquivos/estrutura
- [ ] Consegue abrir Settings

---

### **Step 2: Opção A — Linkar ao GitHub (Recomendado)**

Claude Cowork suporta integração com GitHub. Para linkar:

**No Cowork:**
1. Abra seu projeto Liquid Lab
2. Settings → Integrations/Git
3. Selecione: "Link to GitHub repository"
4. Autentique com GitHub
5. Selecione: `Liquid-Lab-Operations/liquid-lab`
6. Escolha branch: `main`

**Resultado:**
```
Cowork ←→ GitHub (sincronização automática)
├─ Pull changes automaticamente
├─ Commit automático ao fazer /compact
└─ Todos os dispositivos veem as mesmas mudanças
```

---

### **Step 2B: Opção B — Clonar Manualmente (Se A não funcionar)**

Se Cowork não tiver integração direta com GitHub:

**No seu laptop:**
```bash
# 1. Clonar repo
git clone https://github.com/Liquid-Lab-Operations/liquid-lab.git ~/Cowork/liquid-lab

# 2. Abrir em Claude Cowork
# → Cowork → Open → ~/Cowork/liquid-lab

# 3. Fazer setup
cd ~/Cowork/liquid-lab
bash scripts/setup-sync.sh
```

**Resultado:** Cowork aponta para repo local que sincroniza com GitHub

---

### **Step 3: Configurar Sincronização em Todos os Dispositivos**

**Laptop 2:**
```bash
# 1. Clonar mesmo repo
git clone https://github.com/Liquid-Lab-Operations/liquid-lab.git ~/Cowork/liquid-lab

# 2. Setup
cd ~/Cowork/liquid-lab
bash scripts/setup-sync.sh

# 3. Abrir em Cowork
# → Cowork → Open → ~/Cowork/liquid-lab
```

**Celular:**
```
1. Abra Claude app
2. Login: operations@liquidlab.ag
3. Workspace → Liquid Lab
4. Se sincronizado com GitHub:
   └─ Projeto aparece automaticamente
5. Se não aparecer:
   └─ Settings → Sync/Integrations → Refresh
```

---

## 📊 Fluxo de Sincronização Esperado

### **Cenário: Você edita no Laptop 1**

```
1. Você: Edit file.md no Cowork (Laptop 1)
2. Cowork: Auto-save local
3. Git: Auto-commit (via hook or Cowork)
4. GitHub: Push automático
        ↓
5. Laptop 2: Git pull automático (watch-sync)
6. Laptop 2 Cowork: Atualiza automático
        ↓
7. Celular Cowork: Sincroniza via iCloud/Cloud
8. Marina: Vê mudanças em tempo real
```

**Tempo esperado:** < 5 minutos

---

### **Cenário: Marina edita no seu Laptop**

```
1. Marina: Edit file.md no Cowork (seu Laptop)
2. Cowork: Auto-save
3. Git: Auto-commit
4. GitHub: Push automático
        ↓
5. Seu Laptop: Git pull (watch-sync)
6. Seu Cowork: Recarrega automaticamente
        ↓
7. Celular: Sincroniza
8. Você: Vê mudanças de Marina em tempo real
```

---

## 🔧 Configuração Detalhada por Interface

### **Claude Cowork (Qualquer Dispositivo)**

**Setup inicial:**
```
1. Login: operations@liquidlab.ag
2. New Workspace → Link to Git
3. Select: liquid-lab (GitHub)
4. Branch: main
5. Auto-sync: enabled
```

**Settings:**
```
Cowork → Settings → Sync
├─ Auto-pull interval: 5 minutes
├─ Auto-commit: enabled
├─ Auto-push: enabled
└─ Conflict resolution: auto-merge (or ask)
```

---

### **Claude Code (CLI)**

Já está configurado:
```bash
# Morning
git pull

# During day
git commit -m "decision: ..."
git push

# Evening
git tag v*.*.* && git push --tags
```

---

### **Claude Chat / Web**

```
Login: operations@liquidlab.ag
Open: Cowork → Liquid Lab
└─ Vê workspace remoto sincronizado
```

---

## 📱 Sincronização por Dispositivo

### **Laptop 1 (Seu MacBook)**
```
Cowork → liquid-lab (local)
    ↓
Git (local)
    ↓
GitHub (remote)
    ↓
watch-sync.sh (pull a cada 5 min)
```

### **Laptop 2 (Marina ou outro)**
```
Cowork → liquid-lab (local)
    ↓
Git (local)
    ↓
GitHub (remote)
    ↓
watch-sync.sh (pull a cada 5 min)
```

### **Celular (iOS/Android)**
```
Claude app → Login operations@
    ↓
iCloud/Google Drive sync
    ↓
Cowork workspace remoto
    ↓
Auto-pull de mudanças
```

---

## 🔗 Como Links Funcionam

**Brain & Workspace:**
```
Cowork Workspace (GitHub)
    ↓
Contém: code/, infra/, mcp/, etc
    ↓
brain/ (sincronizado via Git)
    ↓
Obsidian vault (todas as mudanças visíveis)
    ↓
Neurônios criados automaticamente
```

**Resultado:** Tudo conectado:
- Código → GitHub
- Brain → Obsidian (sincronizado via Git)
- Sessions → _conversas-claude/
- Colaboração → tempo real via Cowork

---

## ✅ Checklist: Ativar Cowork Sync

**Laptop 1 (seu MacBook):**
- [ ] Projeto Liquid Lab existe em Cowork
- [ ] Linkado a GitHub `liquid-lab` repo
- [ ] Auto-sync configurado (5 min)
- [ ] Consegue ver e editar arquivos
- [ ] Git push funciona

**Laptop 2 (Marina ou outro):**
- [ ] Clone repo: `git clone ...`
- [ ] Abra em Cowork
- [ ] Configure auto-sync
- [ ] Teste: edite um arquivo, veja sincronizar em Laptop 1

**Celular:**
- [ ] Abra Claude app
- [ ] Login: `operations@liquidlab.ag`
- [ ] Veja Cowork → Liquid Lab
- [ ] Se não aparecer: Settings → Refresh/Sync

**Brain & Obsidian:**
- [ ] Obsidian aberto no Laptop 1
- [ ] Vault: ~/liquid-lab/brain/
- [ ] Obsidian Git: auto-sync 10 min
- [ ] Veja mudanças de outro dispositivo aparecerem

---

## 🚀 Workflow Diário Esperado

### **Morning**
```
Você: Abra Cowork no laptop
    └─ Vê mudanças de Marina do dia anterior
    └─ Tudo sincronizado

Marina: Abra Cowork no seu laptop
    └─ Vê mudanças suas do fim do dia anterior
    └─ Tudo sincronizado

Celular: Abre Claude
    └─ Vê workspace compartilhado
    └─ Pode ler/ver mudanças
```

### **During Day**
```
Você: Edita algo no Cowork (laptop ou celular)
    └─ Auto-save → Git commit → GitHub push
    └─ < 5 min: Marina vê em seu Cowork
    
Marina: Edita algo no Cowork (seu laptop)
    └─ Auto-save → Git commit → GitHub push
    └─ < 5 min: Você vê em seu Cowork
    
watch-sync.sh: Sincroniza a cada 5 min
    └─ Pulls automaticamente mudanças
    
Obsidian: Sincroniza a cada 10 min
    └─ Brain atualizado com neurônios
    └─ Backlinks criados
```

### **Evening**
```
Você: /compact ao fim da sessão
    └─ post-compact.sh cria neurônio
    └─ Commit automático
    └─ Marina vê em 5 min (watch-sync)
    
Obsidian: Sincroniza mudança
    └─ Neurônio da sessão visível
    └─ Links criados
```

---

## 🔐 Permissões & Access Control

**Quem pode acessar:**
```
GitHub: operations@liquidlab.ag (admin)
    ↓
Todos com acesso ao repo:
├─ Você (owner)
├─ Marina (quando adicionada)
└─ Qualquer colaborador adicionado
```

**Como adicionar Marina:**
```bash
# GitHub
1. Go to: github.com/Liquid-Lab-Operations/liquid-lab
2. Settings → Collaborators
3. Add: Marina's GitHub account
4. Role: Maintain or Admin

# Cowork
1. Seu Cowork: Liquid Lab
2. Settings → Collaborators
3. Add: Marina's email (operations.marina@liquidlab.ag ou pessoal)
4. Role: Editor
```

---

## 🆘 Troubleshooting

### **"Projeto não aparece no outro laptop"**
```
Solução:
1. Clone repo manualmente
   git clone https://github.com/Liquid-Lab-Operations/liquid-lab.git
   
2. Abra em Cowork
   Cowork → Open → ~/pasta/liquid-lab
   
3. Configure sync
   Settings → Auto-sync: enabled
   
4. Aguarde 5 min (watch-sync pull)
```

### **"Mudanças não sincronizam"**
```
Solução:
1. Verify GitHub status: gh status
2. Check internet connection
3. Manual pull: git pull
4. Cowork: Settings → Refresh/Sync
5. Restart Cowork app
```

### **"Conflito de edição (dois editando mesmo arquivo)"**
```
Solução:
1. Git detecta conflito automaticamente
2. Cowork mostra: "merge conflict"
3. Opções:
   - Keep local version
   - Keep remote version
   - Manual merge (mais seguro)
4. Resolve → Commit → Push
```

### **"Celular não sincroniza"**
```
Solução:
1. Verify login: operations@liquidlab.ag
2. Verify internet (WiFi ou cellular)
3. Verify iCloud/Google Drive sync ativo
4. Restart app
5. Settings → Cloud Sync → Refresh
6. If still fails: manual refresh (pull-to-refresh)
```

---

## 📊 Comparação: Antes vs Depois

### **ANTES (Local Only)**
```
Laptop 1 (Seu)
├── Cowork: Liquid Lab (local)
└─ Ninguém mais vê

Laptop 2 (Marina)
├── (nada)
└─ Mesmo logado

Celular
├── (nada)
└─ Mesmo logado
```

### **DEPOIS (GitHub Sync)**
```
GitHub: liquid-lab (source of truth)
│
├─ Laptop 1 (Seu)
│  └─ Cowork: Liquid Lab (sincronizado)
│
├─ Laptop 2 (Marina)
│  └─ Cowork: Liquid Lab (sincronizado)
│
├─ Celular
│  └─ Claude: Workspace remoto (sincronizado)
│
└─ Qualquer CLI/IDE
   └─ Git repo (sincronizado)

Resultado:
├─ Todos veem as MESMAS mudanças
├─ Colaboração em tempo real
├─ Histórico completo no GitHub
└─ Brain sincronizado (Obsidian)
```

---

## 🎯 Próximas Etapas

1. **Hoje:** Linkar Cowork ao GitHub (Step 2)
2. **Amanhã:** Adicionar Marina ao repo + configurar seu laptop
3. **Próxima semana:** Testar colaboração em tempo real
4. **Quando Marina receber MacBook:** Setup automático (repo já sincronizado)

---

## 📚 Documentação Relacionada

- **[SYNC-DAILY-WORKFLOW.md](SYNC-DAILY-WORKFLOW.md)** — Workflow diário prático
- **[SYNC-AND-DEPLOY-STRATEGY.md](SYNC-AND-DEPLOY-STRATEGY.md)** — Estratégia completa
- **[BRAIN-CAPTURE-INTEGRATION.md](BRAIN-CAPTURE-INTEGRATION.md)** — Brain capture + Cowork

---

**Status:** ✅ Estratégia documentada | **Last update:** 2026-06-07

_Cowork + GitHub = Sincronização universal + Colaboração em tempo real._
