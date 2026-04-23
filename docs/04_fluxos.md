# 04 — Fluxos do Sistema

## Fluxo 1 — Cadastro e Login

```
[Usuário acessa /login]
    │
    ├─ Já autenticado? → Redireciona para /dashboard
    │
    ├─ Ação: Cadastro
    │     1. Preenche e-mail + senha (mínimo 6 chars)
    │     2. Frontend chama createUserWithEmailAndPassword (Firebase Auth)
    │     3. Se sucesso → cria documento em users/{uid}
    │           { uid, email, displayName: "", createdAt }
    │     4. Firebase Auth persiste sessão (localStorage)
    │     5. Redireciona para /dashboard
    │     6. Se erro → exibe mensagem (e-mail já em uso, senha fraca)
    │
    └─ Ação: Login
          1. Preenche e-mail + senha
          2. Frontend chama signInWithEmailAndPassword (Firebase Auth)
          3. Se sucesso → Firebase Auth persiste sessão
          4. Redireciona para /dashboard
          5. Se erro → exibe mensagem (credenciais inválidas)
```

---

## Fluxo 2 — Proteção de Rotas

```
[Navegação para qualquer rota]
    │
    ├─ AuthGuard verifica useAuthStore
    │
    ├─ Estado: loading → exibe Spinner
    │
    ├─ Estado: autenticado
    │     └─ Rota privada → renderiza página
    │     └─ Rota pública (/login, /register) → redireciona /dashboard
    │
    └─ Estado: não autenticado
          └─ Rota privada → redireciona /login
          └─ Rota pública → renderiza normalmente
```

---

## Fluxo 3 — Conexões (CRUD)

```
[Página /connections]
    │
    ├─ Mount → useConnections() inicia onSnapshot
    │       → Firestore retorna lista filtrada por userId em tempo real
    │
    ├─ Criar Conexão
    │     1. Usuário clica "Nova Conexão"
    │     2. Modal abre com campo name
    │     3. Usuário preenche e clica "Salvar"
    │     4. Frontend chama connectionService.create({ name, userId })
    │     5. Firestore adiciona documento com timestamps
    │     6. onSnapshot atualiza lista automaticamente
    │
    ├─ Editar Conexão
    │     1. Usuário clica ícone de edição
    │     2. Modal abre com campo name pré-preenchido
    │     3. Usuário altera e clica "Salvar"
    │     4. Frontend chama connectionService.update(id, { name, updatedAt })
    │     5. onSnapshot atualiza lista automaticamente
    │
    └─ Excluir Conexão
          1. Usuário clica ícone de exclusão
          2. Dialog de confirmação é exibido
          3. Usuário confirma
          4. Frontend chama connectionService.remove(id)
          5. onSnapshot remove da lista automaticamente
          Obs: contatos vinculados permanecem (não cascade delete)
```

---

## Fluxo 4 — Contatos (CRUD)

```
[Página /contacts]
    │
    ├─ Mount → useContacts() inicia onSnapshot
    │       → Lista todos contatos do userId
    │       → Carrega lista de conexões para o select
    │
    ├─ Filtrar por Conexão
    │     1. Usuário seleciona conexão no dropdown
    │     2. Query Firestore filtra por userId + connectionId
    │     3. Lista atualiza em tempo real
    │
    ├─ Criar Contato
    │     1. Usuário clica "Novo Contato"
    │     2. Modal abre com campos: name, phone, connectionId (select)
    │     3. Usuário preenche e clica "Salvar"
    │     4. Frontend valida campos (name, phone, connectionId obrigatórios)
    │     5. contactService.create({ name, phone, connectionId, userId })
    │     6. onSnapshot atualiza lista automaticamente
    │
    ├─ Editar Contato
    │     1. Usuário clica ícone de edição
    │     2. Modal com campos pré-preenchidos
    │     3. Usuário altera e clica "Salvar"
    │     4. contactService.update(id, { name, phone, connectionId, updatedAt })
    │
    └─ Excluir Contato
          1. Usuário clica ícone de exclusão
          2. Dialog de confirmação
          3. contactService.remove(id)
          Obs: referências em mensagens já criadas permanecem (denormalizado)
```

---

## Fluxo 5 — Mensagens (CRUD)

```
[Página /messages]
    │
    ├─ Mount → useMessages() inicia onSnapshot
    │       → Lista todas mensagens do userId ordenadas por scheduledAt DESC
    │
    ├─ Filtrar por Status
    │     1. Usuário seleciona "Agendadas" ou "Enviadas" (ou Todas)
    │     2. Query filtra por userId + status
    │     3. Lista atualiza em tempo real
    │
    ├─ Criar Mensagem
    │     1. Usuário clica "Nova Mensagem"
    │     2. Página/Modal com:
    │          - Textarea: content
    │          - DateTimePicker: scheduledAt (apenas datas futuras)
    │          - MultiSelect de contatos (busca por nome/conexão)
    │     3. Usuário preenche todos os campos
    │     4. Frontend valida:
    │          - content não vazio
    │          - pelo menos 1 contato selecionado
    │          - scheduledAt > now
    │     5. messageService.create({
    │            content, contactIds, contactNames,
    │            scheduledAt, status: "agendada", userId
    │        })
    │     6. onSnapshot atualiza lista
    │
    ├─ Editar Mensagem (apenas status = "agendada")
    │     1. Se status == "enviada" → botão desabilitado
    │     2. Modal com campos pré-preenchidos
    │     3. Permite alterar content, scheduledAt, contatos
    │     4. Validação igual à criação
    │     5. messageService.update(id, { ...campos, updatedAt })
    │
    └─ Excluir Mensagem
          1. Dialog de confirmação
          2. messageService.remove(id)
          Obs: qualquer status pode ser excluído
```

---

## Fluxo 6 — Agendamento Automático (Firebase Functions)

```
[Firebase Scheduler — a cada 1 minuto]
    │
    1. Function processScheduledMessages() dispara
    │
    2. Query Firestore:
    │     db.collection("messages")
    │       .where("status", "==", "agendada")
    │       .where("scheduledAt", "<=", Timestamp.now())
    │
    3. Para cada mensagem retornada:
    │     a. Valida que ainda está "agendada" (evita race condition)
    │     b. Atualiza: { status: "enviada", sentAt: Timestamp.now(), updatedAt: Timestamp.now() }
    │     c. Usa batched write para performance (até 500 por batch)
    │
    4. Log de quantas mensagens foram processadas
    │
    5. Frontend com onSnapshot detecta mudança de status automaticamente
    │    → Item muda de cor/badge na lista em tempo real
    │
    6. Se erro:
          - Log do erro
          - Mensagem permanece "agendada"
          - Será processada na próxima execução do cron
```

---

## Fluxo 7 — Logout

```
[Usuário clica "Sair" na Sidebar]
    │
    1. authService.signOut() → Firebase Auth signOut()
    2. useAuthStore limpa o estado (user = null)
    3. Todos os listeners onSnapshot são automaticamente desconectados
       (Firebase encerra conexões ao fazer signOut)
    4. Redireciona para /login
```

---

## Fluxo 8 — Atualização em Tempo Real

```
[Listener ativo na página]
    │
    ├─ Firestore onSnapshot emite mudança
    │
    ├─ Tipos de mudança:
    │     - "added"    → novo documento → insere no estado local
    │     - "modified" → documento alterado → atualiza no estado local
    │     - "removed"  → documento excluído → remove do estado local
    │
    └─ Estado React atualiza → UI re-renderiza sem reload de página
```
