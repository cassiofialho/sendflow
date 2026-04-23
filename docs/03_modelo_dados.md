# 03 — Modelo de Dados

> **Regra crítica:** O Firestore NÃO usa subcoleções. Todas as entidades ficam em coleções raiz com `userId` para multi-tenancy.

---

## Coleções

### `users`

Criada no primeiro login. Um documento por usuário autenticado.

| Campo | Tipo | Obrigatório | Exemplo |
|-------|------|-------------|---------|
| `uid` | `string` | Sim | `"abc123xyz"` |
| `email` | `string` | Sim | `"user@email.com"` |
| `displayName` | `string` | Não | `"João Silva"` |
| `createdAt` | `Timestamp` | Sim | `2024-01-15T10:00:00Z` |

**ID do documento:** igual ao `uid` do Firebase Auth

**Exemplo:**
```json
{
  "uid": "abc123xyz",
  "email": "user@email.com",
  "displayName": "João Silva",
  "createdAt": "2024-01-15T10:00:00Z"
}
```

---

### `connections`

Canais/grupos que agrupam contatos.

| Campo | Tipo | Obrigatório | Exemplo |
|-------|------|-------------|---------|
| `id` | `string` | Sim (auto) | `"conn_xYz789"` |
| `userId` | `string` | Sim | `"abc123xyz"` |
| `name` | `string` | Sim | `"WhatsApp Vendas"` |
| `createdAt` | `Timestamp` | Sim | `2024-01-15T10:05:00Z` |
| `updatedAt` | `Timestamp` | Sim | `2024-01-15T10:05:00Z` |

**ID do documento:** gerado automaticamente pelo Firestore

**Exemplo:**
```json
{
  "id": "conn_xYz789",
  "userId": "abc123xyz",
  "name": "WhatsApp Vendas",
  "createdAt": "2024-01-15T10:05:00Z",
  "updatedAt": "2024-01-15T10:05:00Z"
}
```

---

### `contacts`

Pessoas com nome e telefone, vinculadas a uma conexão.

| Campo | Tipo | Obrigatório | Exemplo |
|-------|------|-------------|---------|
| `id` | `string` | Sim (auto) | `"cont_aB123"` |
| `userId` | `string` | Sim | `"abc123xyz"` |
| `connectionId` | `string` | Sim | `"conn_xYz789"` |
| `name` | `string` | Sim | `"Maria Oliveira"` |
| `phone` | `string` | Sim | `"+5511999998888"` |
| `createdAt` | `Timestamp` | Sim | `2024-01-15T10:10:00Z` |
| `updatedAt` | `Timestamp` | Sim | `2024-01-15T10:10:00Z` |

**ID do documento:** gerado automaticamente pelo Firestore

**Exemplo:**
```json
{
  "id": "cont_aB123",
  "userId": "abc123xyz",
  "connectionId": "conn_xYz789",
  "name": "Maria Oliveira",
  "phone": "+5511999998888",
  "createdAt": "2024-01-15T10:10:00Z",
  "updatedAt": "2024-01-15T10:10:00Z"
}
```

---

### `messages`

Mensagens agendadas com lista de contatos destinatários.

| Campo | Tipo | Obrigatório | Exemplo |
|-------|------|-------------|---------|
| `id` | `string` | Sim (auto) | `"msg_cD456"` |
| `userId` | `string` | Sim | `"abc123xyz"` |
| `content` | `string` | Sim | `"Olá, tudo bem?"` |
| `contactIds` | `string[]` | Sim | `["cont_aB123", "cont_eF456"]` |
| `contactNames` | `string[]` | Sim | `["Maria Oliveira", "Pedro Costa"]` |
| `scheduledAt` | `Timestamp` | Sim | `2024-02-01T09:00:00Z` |
| `status` | `"agendada" \| "enviada"` | Sim | `"agendada"` |
| `sentAt` | `Timestamp \| null` | Não | `null` (antes do envio) |
| `createdAt` | `Timestamp` | Sim | `2024-01-15T10:15:00Z` |
| `updatedAt` | `Timestamp` | Sim | `2024-01-15T10:15:00Z` |

> **Nota sobre `contactNames`:** Os nomes dos contatos são denormalizados no documento da mensagem. Isso evita joins e permite exibir os nomes mesmo se o contato for deletado posteriormente.

**ID do documento:** gerado automaticamente pelo Firestore

**Exemplo:**
```json
{
  "id": "msg_cD456",
  "userId": "abc123xyz",
  "content": "Olá! Lembrete da nossa reunião amanhã às 10h.",
  "contactIds": ["cont_aB123", "cont_eF456"],
  "contactNames": ["Maria Oliveira", "Pedro Costa"],
  "scheduledAt": "2024-02-01T09:00:00Z",
  "status": "agendada",
  "sentAt": null,
  "createdAt": "2024-01-15T10:15:00Z",
  "updatedAt": "2024-01-15T10:15:00Z"
}
```

---

## Relacionamentos (via IDs)

```
users (1)
  └── connections (N)  ← connections.userId = users.uid
        └── contacts (N)  ← contacts.connectionId = connections.id
                              contacts.userId = users.uid

users (1)
  └── messages (N)  ← messages.userId = users.uid
        └── [contactIds[]]  ← referência a contacts.id (array)
```

---

## Índices Sugeridos (Firestore Composite Indexes)

| Coleção | Campos do Índice | Tipo | Uso |
|---------|-----------------|------|-----|
| `connections` | `userId ASC`, `createdAt DESC` | Composto | Listar conexões do usuário ordenadas |
| `contacts` | `userId ASC`, `connectionId ASC`, `createdAt DESC` | Composto | Listar contatos por conexão |
| `contacts` | `userId ASC`, `createdAt DESC` | Composto | Listar todos os contatos do usuário |
| `messages` | `userId ASC`, `status ASC`, `scheduledAt ASC` | Composto | Filtrar por status + ordenar por data |
| `messages` | `userId ASC`, `createdAt DESC` | Composto | Listar todas as mensagens do usuário |
| `messages` | `status ASC`, `scheduledAt ASC` | Composto | Cron: buscar agendadas vencidas |

---

## Estratégia Multi-tenant

- **Campo `userId`** presente em todos os documentos de `connections`, `contacts` e `messages`
- **Todas as queries** incluem `.where("userId", "==", auth.currentUser.uid)` obrigatoriamente
- **Firestore Security Rules** validam que `resource.data.userId == request.auth.uid`
- Documentos da coleção `users` usam o próprio UID como ID do documento — isolamento natural
- Não há coleção compartilhada entre usuários no MVP
