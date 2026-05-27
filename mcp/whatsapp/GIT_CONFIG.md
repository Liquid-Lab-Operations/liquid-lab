# Git Configuration — Dual Account Setup

**Repositório:** liquid-lab-mcp-whatsapp  
**Mantido em:** MarceloPivovar (acesso simples)  
**Commits aparecem como:** operations@liquidlab.ag (identidade corporativa)

## Status Atual

```bash
$ git config user.email
operations@liquidlab.ag

$ git config user.name
Liquid Lab Operations
```

Todos os commits feitos aqui vão aparecer como se enviados por operations@liquidlab.ag, mesmo que você esteja fazendo push com sua conta pessoal MarceloPivovar.

## Por que assim?

- Você tem acesso total em seu usuário pessoal (marcelopivovar)
- A organização Liquid-Lab-Ag é mantida como backup futuro
- Quando Marina receber seu MacBook, ela clona normalmente e pode contribuir
- Quando operations@liquidlab.ag tiver sua máquina, transferimos legalmente

## Outros Repos

Mesma configuração aplicada a:
- liquid-lab-code
- liquid-lab-brain
- liquid-lab-infra
- liquid-lab-mcp-slack

## Próximo Passo

Todos os repos estão prontos. Você pode começar a trabalhar normalmente—commits vão refletir o autor corporativo automaticamente.
