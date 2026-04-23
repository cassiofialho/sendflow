# 01 — Visão Geral do SendFlow

## Objetivo do Sistema

SendFlow é uma plataforma SaaS de gerenciamento e agendamento de mensagens. Permite que usuários organizem seus contatos em conexões, criem mensagens com conteúdo personalizado, selecionem múltiplos destinatários e agendem o envio para uma data e hora específica. O sistema processa automaticamente os agendamentos via Firebase Functions, atualizando o status das mensagens de `agendada` para `enviada` sem intervenção manual.

## Problema que Resolve

Equipes de marketing, vendas e suporte frequentemente precisam disparar mensagens programadas para grupos de contatos. Sem uma ferramenta dedicada, esse processo é manual, propenso a erros, sem histórico e sem organização. O SendFlow centraliza contatos, define conexões (canais ou grupos) e agenda mensagens com rastreabilidade completa de status.

## Público-Alvo

- Pequenas e médias empresas que fazem campanhas de comunicação periódicas
- Profissionais autônomos que gerenciam listas de clientes
- Equipes de vendas que precisam agendar follow-ups
- Agências que gerenciam comunicação de múltiplos clientes (cada usuário = tenant isolado)

## Funcionalidades Principais

### Autenticação
- Cadastro com e-mail e senha via Firebase Auth
- Login com persistência de sessão
- Rotas protegidas — usuários não autenticados são redirecionados ao login

### Conexões
- Representam canais ou grupos de comunicação (ex.: "WhatsApp Vendas", "E-mail Suporte")
- CRUD completo: criar, listar, editar e excluir
- Cada conexão pertence exclusivamente ao usuário autenticado

### Contatos
- Pessoas físicas com nome e telefone
- Cada contato é vinculado obrigatoriamente a uma conexão
- CRUD completo: criar, listar, editar e excluir
- Listagem pode ser filtrada por conexão

### Mensagens
- Criação de mensagem com conteúdo textual
- Seleção de múltiplos contatos destinatários
- Agendamento com data e hora de envio
- Status gerenciado automaticamente: `agendada` → `enviada`
- Listagem com filtro por status
- CRUD completo: criar, listar, editar e excluir

### Agendamento Automático
- Firebase Function (scheduler/cron) executa periodicamente
- Busca mensagens com `status = "agendada"` e `scheduledAt <= now`
- Atualiza status para `"enviada"` (envio real não implementado — comportamento fake/simulado)

### Tempo Real
- Listeners Firestore (`onSnapshot`) para conexões, contatos e mensagens
- Interface atualiza automaticamente sem recarregamento de página

## Escopo Fora do MVP

- Envio real de mensagens (WhatsApp, SMS, e-mail)
- Integração com APIs externas
- Relatórios e analytics avançados
- Planos e billing
- Permissões granulares (admin/editor/viewer)
