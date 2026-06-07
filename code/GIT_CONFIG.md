# Git Configuration — Monorepo Setup

**Repositório:** liquid-lab (monorepo único)  
**Caminho:** /code  
**Identidade Git:** operations@liquidlab.ag (corporativa)

## Status Atual

```bash
$ git config user.email
operations@liquidlab.ag

$ git config user.name
Liquid Lab Operations
```

## Estrutura

Liquid Lab é um **monorepo único** com um `.git` na raiz:

```
liquid-lab/
├── .git/           ← UM repositório para tudo
├── code/           ← Subpasta (Next.js app)
├── brain/          ← Subpasta (Obsidian vault)
├── infra/          ← Subpasta (DevOps)
├── mcp/            ← Subpasta (MCP servers)
│   ├── whatsapp/
│   └── slack/
└── docs/           ← Subpasta (documentation)
```

## Identidade Corporativa

Todos os commits em QUALQUER subpasta aparecem como:
- **Email:** operations@liquidlab.ag
- **Nome:** Liquid Lab Operations

Isso é verdadeiro se você usa sua conta pessoal MarceloPivovar ou qualquer outra conta.

## Acesso

- **Atualmente:** MarceloPivovar (acesso pessoal → commits corporativos)
- **Quando Marina receber MacBook:** Ela clona e contribui (commits corporativos)
- **Transferência futura:** operations@liquidlab.ag terá acesso direto

## Próximo Passo

Trabalhe normalmente em qualquer subpasta—todos os commits refletem a identidade corporativa.
