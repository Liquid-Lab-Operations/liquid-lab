---
title: SOP — Sincronização Local ↔ Git
data: 2026-06-06
tipo: processo
tags: [operacao, git, sincronizacao, workflow]
status: ativo
---

# SOP-SYNC: Sincronização Local ↔ Git

**Objetivo:** Manter repositório local e GitHub sempre sincronizados  
**Frequência:** A cada sessão / mudança significativa  
**Responsável:** Todos os desenvolvedores

---

## ⚡ Quick Sync (30 segundos)

```bash
./scripts/sync-all.sh
```

Faz automaticamente:
1. ✅ Fetch do remoto
2. ✅ Add arquivos não rastreados
3. ✅ Commit de mudanças
4. ✅ Push para origin

---

## 📋 Checklist de Sincronização

### Antes de Sair da Sessão

- [ ] Rodei `/scripts/sync-all.sh`?
- [ ] Há mensagens de erro no script?
- [ ] Git status mostra "up to date"?
- [ ] Último commit em origin/main?

### No Início de Sessão

- [ ] Git status limpo?
- [ ] `git fetch origin` está atualizado?
- [ ] Branch main está sincronizado?

---

## 🔄 Workflow Completo

### 1. Iniciar Sessão

```bash
cd /Users/marcelopivovar/Claude/projects/liquid-lab
git fetch origin
git status
```

**Esperado:** `Your branch is up to date with 'origin/main'`

### 2. Fazer Mudanças

Trabalhe normalmente. Não precisa commitar a cada arquivo.

### 3. Antes de Sair

```bash
./scripts/sync-all.sh
```

### 4. Verificar Resultado

```bash
git log --oneline -3
git status
```

**Esperado:**
```
On branch main
Your branch is up to date with 'origin/main'.
nothing to commit, working tree clean
```

---

## 🎯 Regras de Ouro

### ✅ Sync Automático

- `./scripts/sync-all.sh` == Sync completo
- Roda `fetch`, `add`, `commit`, `push`
- Pede confirmação antes de commitar

### ✅ Commit Message

- Padrão: `chore: sync all changes YYYY-MM-DD`
- Ou: descrever o que foi feito

### ✅ Frequência

- **Mínimo:** Antes de sair de cada sessão
- **Ideal:** A cada mudança significativa
- **Máximo:** Nunca deixar > 1 dia sem sync

### ✅ Status Esperado

Local sempre = Remoto:
```
git status           → nothing to commit, working tree clean
git log -1 --oneline → HEAD == origin/main
```

---

## 🚨 Troubleshooting

### Erro: "Permission denied"

```bash
# Checar SSH key
ssh -T git@github.com

# Se falhar, gerar chave
ssh-keygen -t ed25519 -C "marcelopivovar@hotmail.com"
```

### Erro: "Conflicts"

```bash
# Resolver conflitos
git status
# Editar arquivos conflitados
git add .
git commit -m "chore: resolve merge conflicts"
git push origin main
```

### Erro: "Everything up-to-date"

Tudo sincronizado! ✅

### Branch desatualizado

```bash
git fetch origin
git merge origin/main
# ou
git rebase origin/main
```

---

## 📊 Verificação de Saúde

### Checar Sync Status

```bash
# Status local vs remoto
git status

# Ver commits não pusheados
git log origin/main..HEAD

# Ver mudanças não commitadas
git diff --name-only
git diff --cached --name-only
```

### Log Recente

```bash
git log --oneline -10 --all --graph
```

---

## 🔗 Integração com Obsidian

Quando uma nota é criada/modificada em Liquid Lab Brain:

1. Nota é modificada (iCloud sync)
2. Verificar mudanças locais
3. Rodar `./scripts/sync-all.sh`
4. Git fica sincronizado

---

## ⏰ Cronograma Recomendado

| Momento | Ação |
|---------|------|
| **Início** | `git fetch origin` |
| **Durante** | Trabalhar normalmente |
| **A cada 1h** | `git status` |
| **Fim de sessão** | `./scripts/sync-all.sh` |
| **Antes de dormir** | Verificar `git status` |

---

## 📝 Exemplo Real

```bash
# 1. Começo do dia
$ cd /Users/marcelopivovar/Claude/projects/liquid-lab
$ git fetch origin
$ git status
On branch main
Your branch is up to date with 'origin/main'.

# 2. Trabalho durante o dia
# ... edita arquivos, cria serviços, etc

# 3. Antes de sair
$ ./scripts/sync-all.sh
🔄 Liquid Lab — Sincronização Completa
========================================

1️⃣ Verificando status...
   ⚠️  Mudanças detectadas
 M services/graphify/README.md
 M SOP-SYNC.md
?? .DS_Store

2️⃣ Buscando atualizações remotas...
   ✅ Local sincronizado com remoto

3️⃣ Adicionando mudanças não rastreadas...
   ✅ Arquivos adicionados

4️⃣ Verificando mudanças...
   ⚠️  Mudanças pendentes
   Deseja fazer commit? (S/n)
S
   Mensagem de commit:
chore: update documentation and sync

5️⃣ Fazendo push para origin...
   ✅ Push realizado

📊 Resumo Final
==============
Branch: main
Commits à frente: 0
Último commit: chore: update documentation and sync

✅ Sincronização completa!
```

---

## 🔐 Proteção contra Perda de Dados

### Automaticamente Protegido

- ✅ Nada se perde se commitar
- ✅ Git guarda histórico completo
- ✅ Commits são imutáveis
- ✅ Remoto (GitHub) é backup automático

### Nunca Faça

❌ `git reset --hard` sem backup  
❌ `git push --force` sem acordar time  
❌ Deixar mudanças sem commitar > 1 semana  
❌ Deletar branches sem backup

---

## ✅ Checklist Mensal

- [ ] Verificou `git log` para commits órfãos?
- [ ] Removeu branches locais obsoletas?
- [ ] Verificou espaço em disco?
- [ ] Fez backup de `.env.local`?
- [ ] Atualizou dependências (`npm outdated`)?

---

**Última atualização:** 2026-06-06  
**Próxima revisão:** 2026-07-06
