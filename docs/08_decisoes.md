# 08 — Decisões, Suposições e Riscos

## Decisões Arquiteturais

### D01 — Sem subcoleções no Firestore
**Decisão:** Todas as coleções são raiz (`connections`, `contacts`, `messages`), não subcoleções de `users`.

**Motivo:** O requisito explícito do projeto proíbe subcoleções. Além disso, coleções raiz facilitam queries globais (ex.: a Firebase Function que processa mensagens de todos os usuários sem precisar percorrer subcoleções).

**Implicação:** O campo `userId` em todas as entidades é obrigatório e é o mecanismo de isolamento multi-tenant.

---

### D02 — Denormalização de `contactNames` em mensagens
**Decisão:** O documento de mensagem armazena `contactIds[]` E `contactNames[]`.

**Motivo:** Evitar multiple reads no Firestore para exibir a lista de destinatários. Se um contato for excluído, o histórico da mensagem ainda mostra o nome correto.

**Implicação:** Se o nome de um contato for editado após o agendamento, a mensagem mostrará o nome antigo. Aceito para o MVP.

---

### D03 — Zustand para estado global (apenas auth)
**Decisão:** Usar Zustand apenas para estado de autenticação. Estado das entidades (connections, contacts, messages) fica em hooks locais.

**Motivo:** Estado de entidades é sincronizado com Firestore via onSnapshot — não precisa de estado global. Zustand adiciona complexidade desnecessária para dados já gerenciados pelo Firestore.

---

### D04 — React Router v6 com loader pattern simplificado
**Decisão:** Usar React Router v6 com `<Routes>` e `<Route>`, sem os data routers (loader/action).

**Motivo:** Os dados são carregados via onSnapshot nos próprios hooks — não faz sentido usar o loader pattern do React Router com uma abordagem reativa. Simplifica a implementação.

---

### D05 — Material UI apenas para componentes complexos
**Decisão:** MUI é usado especificamente para: `DateTimePicker`, `Dialog`, `Select`, `Autocomplete` (ContactMultiSelect). Layout e estilos gerais usam TailwindCSS.

**Motivo:** MUI tem curva de aprendizado alta para customização visual. TailwindCSS é mais flexível para replicar a identidade visual do projeto de referência. A combinação usa o melhor de cada.

---

### D06 — Firebase Functions scheduler a cada 1 minuto
**Decisão:** O cron de processamento de mensagens executa a cada minuto.

**Motivo:** Equilíbrio entre precisão (mensagens enviadas com até 1 minuto de atraso) e custo (Functions têm custo por execução). Aceitável para o MVP.

**Risco:** Em produção com alto volume, execuções de 1 minuto em mensagens podem ser lentas se houver muitas para processar. Solução futura: Pub/Sub com processamento paralelo.

---

### D07 — Mensagem com status "enviada" fica bloqueada para edição
**Decisão:** Uma vez que uma mensagem muda para `"enviada"`, ela não pode mais ser editada pelo usuário.

**Motivo:** Simula o comportamento real de uma mensagem enviada — não faz sentido editar algo que já foi (simulado como) enviado.

---

### D08 — Sem cascade delete
**Decisão:** Ao excluir uma conexão, os contatos vinculados a ela NÃO são excluídos automaticamente.

**Motivo:** Implementar cascade delete no Firestore requer uma Cloud Function de trigger (onDelete) ou lógica no cliente com múltiplas operações. Para o MVP, mantemos simples. Contatos órfãos permanecem visíveis para o usuário.

**Risco:** Acúmulo de contatos sem conexão válida. Solução futura: Function trigger que limpa ao deletar conexão, ou warning na UI.

---

### D09 — Sem paginação no MVP
**Decisão:** Listas de conexões, contatos e mensagens carregam todos os documentos do usuário.

**Motivo:** Simplifica a implementação do MVP. Limite razoável: query com `.limit(100)` para evitar problemas de performance.

**Risco:** Performance degradada com muitos dados. Solução futura: paginação com cursor.

---

### D10 — Validação de telefone apenas no frontend
**Decisão:** A validação de formato de telefone é feita apenas no React Hook Form + Zod, não no Firestore Security Rules.

**Motivo:** Firestore Rules não oferecem validação de formato de string (regex). A validação no frontend é suficiente para o MVP com usuários legítimos.

---

## Suposições

| ID | Suposição |
|----|-----------|
| S01 | O usuário tem uma conta Firebase com projeto criado e billing ativado (Functions requer Blaze plan) |
| S02 | O envio real de mensagens não é necessário no MVP — apenas simulação de status |
| S03 | Um único tenant (usuário) não terá mais de 1000 contatos no MVP |
| S04 | A acessibilidade básica (WCAG AA) não é requisito do MVP, mas será considerada |
| S05 | O projeto não precisa de internacionalização (i18n) — português apenas |
| S06 | Não há requisito de exportação ou backup de dados no MVP |

---

## Riscos

| ID | Risco | Impacto | Mitigação |
|----|-------|---------|-----------|
| R01 | Firebase Functions requer Blaze plan (pago) | Bloqueante para agendamento | Documentar requisito de billing |
| R02 | onSnapshot em múltiplas páginas pode gerar muitas conexões simultâneas | Performance/custo | Implementar cleanup rigoroso nos useEffect |
| R03 | Sem paginação, query de 1000+ contatos pode ser lenta | UX | Adicionar `.limit(100)` e documentar como evolução |
| R04 | Race condition na Function: mensagem processada duas vezes | Dados incorretos | Usar transação Firestore ao atualizar status |
| R05 | Contatos órfãos após delete de conexão | Dados sujos | Documentar como debt técnico, resolver na V1.1 |
| R06 | Denormalização de contactNames fica desatualizada | Dados desincronizados | Aceito para MVP; evolução: atualizar mensagens ao editar contato |

---

## Pontos para Validação Futura

1. **Limite de documentos por query:** Validar se `.limit(100)` é suficiente ou se paginação é necessária mais cedo
2. **Custo do scheduler de 1 minuto:** Monitorar custo das Functions em produção
3. **UX do ContactMultiSelect:** Validar com usuários reais se a seleção múltipla é intuitiva
4. **Mobile experience:** Testar em dispositivos reais — formulário de mensagem pode ser complexo em telas pequenas
5. **Firebase plan:** Confirmar com o dono do projeto se o Blaze plan já está ativado antes de desenvolver as Functions
