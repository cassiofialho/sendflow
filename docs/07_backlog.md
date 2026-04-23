# 07 — Backlog

## MVP — Ordem de Implementação

### Sprint 0 — Setup e Infraestrutura
- [ ] Criar projeto Firebase no console
- [ ] Configurar Firebase CLI
- [ ] Inicializar projeto `/web` com Vite + React + TypeScript
- [ ] Configurar TailwindCSS + Material UI
- [ ] Criar arquivo `firebase.ts` com inicialização do SDK
- [ ] Configurar variáveis de ambiente (`.env.local`)
- [ ] Inicializar projeto `/functions` com TypeScript
- [ ] Configurar `firebase.json` (hosting + functions + firestore)
- [ ] Configurar `firestore.rules` inicial (negar tudo)
- [ ] Configurar `firestore.indexes.json` com índices compostos

### Sprint 1 — Autenticação
- [ ] Implementar `authService.ts` (signIn, signUp, signOut, getCurrentUser)
- [ ] Implementar `authStore.ts` (Zustand) com persistência de sessão
- [ ] Implementar `useAuth.ts` hook
- [ ] Criar `AuthLayout.tsx` (layout duas colunas)
- [ ] Criar `AuthInput.tsx` (input estilizado)
- [ ] Criar `LoginPage.tsx` com React Hook Form + Zod
- [ ] Criar `RegisterPage.tsx` com React Hook Form + Zod
- [ ] Implementar `AuthGuard` (proteção de rotas)
- [ ] Configurar router com rotas públicas e privadas
- [ ] Criar documento `users/{uid}` no cadastro
- [ ] Atualizar `firestore.rules` para coleção `users`
- [ ] Testar login, cadastro, logout e proteção de rotas

### Sprint 2 — Layout Base
- [ ] Criar `AppLayout.tsx` (sidebar + content)
- [ ] Criar `Sidebar.tsx` com navegação e collapse
- [ ] Criar `Topbar.tsx` para mobile
- [ ] Criar `DashboardPage.tsx` com estrutura básica
- [ ] Criar `StatsCard.tsx`
- [ ] Criar `PageHeader.tsx`
- [ ] Criar `LoadingSpinner.tsx`
- [ ] Criar `EmptyState.tsx`
- [ ] Criar `ConfirmDialog.tsx`
- [ ] Criar `StatusBadge.tsx`
- [ ] Testar responsividade mobile e desktop

### Sprint 3 — Conexões
- [ ] Definir tipos `Connection` em `connection.types.ts`
- [ ] Implementar `connectionService.ts` (CRUD + subscribe)
- [ ] Implementar `useConnections.ts` hook com onSnapshot
- [ ] Criar `ConnectionCard.tsx`
- [ ] Criar `ConnectionModal.tsx` (criar/editar) com validação
- [ ] Criar `ConnectionsPage.tsx`
- [ ] Atualizar `firestore.rules` para coleção `connections`
- [ ] Testar CRUD completo e tempo real

### Sprint 4 — Contatos
- [ ] Definir tipos `Contact` em `contact.types.ts`
- [ ] Implementar `contactService.ts` (CRUD + subscribe)
- [ ] Implementar `useContacts.ts` hook com onSnapshot
- [ ] Criar `ContactsTable.tsx`
- [ ] Criar `ContactModal.tsx` com select de conexões
- [ ] Criar `ContactsPage.tsx` com filtro por conexão
- [ ] Atualizar `firestore.rules` para coleção `contacts`
- [ ] Testar CRUD completo e filtro por conexão

### Sprint 5 — Mensagens
- [ ] Definir tipos `Message` em `message.types.ts`
- [ ] Implementar `messageService.ts` (CRUD + subscribe)
- [ ] Implementar `useMessages.ts` hook com onSnapshot
- [ ] Criar `ContactMultiSelect.tsx`
- [ ] Criar `MessageCard.tsx`
- [ ] Criar `MessagesPage.tsx` com filtro por status
- [ ] Criar `MessageFormPage.tsx` com formulário completo
- [ ] Atualizar `firestore.rules` para coleção `messages`
- [ ] Testar CRUD completo, filtros e validações

### Sprint 6 — Agendamento (Firebase Functions)
- [ ] Implementar `processScheduledMessages.ts`
- [ ] Configurar scheduler (pubsub.schedule)
- [ ] Deploy da function
- [ ] Testar processamento de mensagens agendadas
- [ ] Verificar atualização em tempo real na UI após processamento

### Sprint 7 — Dashboard Final
- [ ] Implementar contadores em tempo real no Dashboard
- [ ] Adicionar lista de mensagens recentes
- [ ] Testar integração completa

### Sprint 8 — Segurança e Qualidade
- [ ] Revisar e finalizar `firestore.rules`
- [ ] Revisar todos os tipos TypeScript
- [ ] Revisar todas as validações (forms)
- [ ] Testar isolamento multi-tenant
- [ ] Remover todos os `console.log` de desenvolvimento
- [ ] Checar acessibilidade básica (aria-labels, focus)

### Sprint 9 — Deploy
- [ ] Configurar Firebase Hosting
- [ ] Build de produção (`npm run build`)
- [ ] Deploy frontend (`firebase deploy --only hosting`)
- [ ] Deploy functions (`firebase deploy --only functions`)
- [ ] Deploy rules e indexes (`firebase deploy --only firestore`)
- [ ] Validar deploy em produção
- [ ] Documentar passo a passo de deploy

---

## Evoluções (Pós-MVP)

### V1.1 — Melhorias de UX
- [ ] Paginação ou scroll infinito em contatos e mensagens
- [ ] Busca/filtro por texto em todas as listagens
- [ ] Ordenação configurável nas tabelas
- [ ] Toast notifications globais (sucesso/erro)
- [ ] Skeleton loading nas listagens

### V1.2 — Funcionalidades Adicionais
- [ ] Importação de contatos via CSV
- [ ] Templates de mensagens reutilizáveis
- [ ] Duplicar mensagem agendada
- [ ] Histórico de alterações de status

### V1.3 — Analytics
- [ ] Dashboard com gráficos (mensagens por dia/mês)
- [ ] Taxa de agendamento vs. enviadas
- [ ] Relatório exportável (CSV/PDF)

### V2.0 — Envio Real
- [ ] Integração com WhatsApp Business API
- [ ] Integração com SMS providers (Twilio, Zenvia)
- [ ] Integração com e-mail (SendGrid, AWS SES)
- [ ] Webhook de confirmação de entrega

### V2.1 — Multi-usuário Avançado
- [ ] Organizações (múltiplos usuários por tenant)
- [ ] Roles: admin, editor, viewer
- [ ] Convidar membros por e-mail
- [ ] Audit log de ações

### V2.2 — Billing
- [ ] Planos: Free, Pro, Enterprise
- [ ] Limites por plano (contatos, mensagens/mês)
- [ ] Integração com Stripe
- [ ] Portal de faturamento
