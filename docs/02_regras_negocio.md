# 02 — Regras de Negócio

## Multi-tenant (SaaS)

- Cada usuário autenticado é um **tenant independente**
- Toda entidade (conexão, contato, mensagem) armazena o campo `userId` com o UID do proprietário
- Nenhum usuário pode ver, editar ou excluir dados de outro usuário
- O isolamento é garantido em duas camadas:
  1. **Firestore Security Rules** — queries sem `userId == auth.uid` são bloqueadas no servidor
  2. **Camada de serviço** — todas as queries no frontend filtram por `userId` antes de executar

---

## Permissões de Acesso

| Operação | Regra |
|----------|-------|
| Ler qualquer documento | `userId == request.auth.uid` |
| Criar documento | `userId == request.auth.uid` e campos obrigatórios presentes |
| Atualizar documento | Documento já existe e `userId == request.auth.uid` |
| Deletar documento | Documento já existe e `userId == request.auth.uid` |
| Acesso sem autenticação | Bloqueado em todas as coleções |

---

## Regras por Entidade

### Usuários (`users`)
- Criado automaticamente no primeiro login após registro
- Campos: `uid`, `email`, `displayName`, `createdAt`
- Um usuário só pode ler/escrever seu próprio documento (`id == auth.uid`)

### Conexões (`connections`)
- Cada conexão pertence a exatamente um usuário (`userId`)
- O campo `name` é obrigatório e não pode ser vazio
- Não há limite de conexões por usuário no MVP
- Ao excluir uma conexão, os contatos vinculados a ela **não são excluídos automaticamente** (ver Decisões — 08)
  - Fica como dado órfão visível apenas para o owner; é responsabilidade do usuário limpar
- Dois usuários distintos podem ter conexões com o mesmo nome — sem conflito

### Contatos (`contacts`)
- Cada contato pertence a exatamente um usuário (`userId`)
- O campo `connectionId` é obrigatório — todo contato precisa de uma conexão
- Os campos `name` e `phone` são obrigatórios
- `phone` deve ter no mínimo 10 dígitos (validação no frontend, não no Firestore Rules)
- Um contato pode ser reutilizado em múltiplas mensagens
- Ao excluir um contato, ele permanece referenciado em mensagens já criadas (denormalização — ver 03_modelo_dados)

### Mensagens (`messages`)
- Cada mensagem pertence a exatamente um usuário (`userId`)
- O campo `content` é obrigatório e não pode ser vazio
- O campo `contactIds` deve ter pelo menos um elemento (mínimo 1 contato)
- O campo `scheduledAt` é obrigatório e deve ser uma data no futuro no momento da criação
- O campo `status` só pode ser `"agendada"` ou `"enviada"`
- Ao criar a mensagem, `status` é sempre `"agendada"` — nunca `"enviada"`
- O status só é atualizado pela **Firebase Function** (cron), nunca diretamente pelo usuário
- Mensagem com status `"enviada"` não pode ser editada (somente leitura)
- Mensagem com status `"agendada"` pode ser editada enquanto `scheduledAt` ainda for futuro

---

## Regras de Agendamento

- O cron executa a cada **1 minuto** (configurável no deploy)
- A Function busca todas as mensagens onde:
  - `status == "agendada"`
  - `scheduledAt <= Timestamp.now()`
- Para cada mensagem encontrada, atualiza `status` para `"enviada"` e define `sentAt = Timestamp.now()`
- A Function **não envia mensagens reais** — apenas simula o envio atualizando o status
- Se a Function falhar por qualquer motivo, mensagens permanecem `"agendada"` e serão processadas na próxima execução

---

## Restrições de Dados

| Campo | Restrição |
|-------|-----------|
| `connection.name` | Obrigatório, string, 1–100 caracteres |
| `contact.name` | Obrigatório, string, 1–100 caracteres |
| `contact.phone` | Obrigatório, string, 10–20 caracteres, apenas dígitos/+/- |
| `contact.connectionId` | Obrigatório, deve referenciar uma connection existente |
| `message.content` | Obrigatório, string, 1–2000 caracteres |
| `message.contactIds` | Array obrigatório, mínimo 1 elemento |
| `message.scheduledAt` | Obrigatório, Timestamp futuro (na criação) |
| `message.status` | Enum: `"agendada"` ou `"enviada"` |

---

## Isolamento entre Usuários

- Todas as queries do Firestore incluem `.where("userId", "==", currentUser.uid)`
- Security Rules rejeitam qualquer leitura/escrita onde `resource.data.userId != request.auth.uid`
- O frontend nunca expõe dados de outros usuários — mesmo que as Rules falhassem, as queries já filtram
- IDs de documentos são gerados automaticamente pelo Firestore (`auto-id`) — não são previsíveis
