# 05 — Interfaces (Telas e Componentes)

## Layout Geral

O layout principal usa **Sidebar fixa à esquerda + área de conteúdo** com topbar em mobile.

```
┌──────────────────────────────────────────────────────┐
│ SIDEBAR (240px)    │  TOPBAR (mobile 60px)            │
│ ─────────────────  │  ──────────────────────────────  │
│ Logo SendFlow      │  [≡]  SendFlow        [👤] [→]   │
│                    │                                  │
│ Dashboard          │  ┌──────────────────────────┐   │
│ Conexões           │  │   CONTEÚDO DA PÁGINA     │   │
│ Contatos           │  │                          │   │
│ Mensagens          │  │                          │   │
│                    │  └──────────────────────────┘   │
│ ─────────────────  │                                  │
│ [Sair]             │                                  │
└──────────────────────────────────────────────────────┘
```

---

## Tela 1 — Login (`/login`)

### Componentes
- `AuthLayout` — layout de duas colunas (imagem + formulário)
- `LoginForm` — formulário de login
- `AuthInput` — campo de e-mail e senha

### Layout
- **Coluna esquerda (55%, desktop):** imagem de fundo com overlay gradiente + texto de marketing
- **Coluna direita (45%):** formulário centralizado, max-width 420px

### Campos
| Campo | Tipo | Validação |
|-------|------|-----------|
| E-mail | `input[type=email]` | Obrigatório, formato válido |
| Senha | `input[type=password]` | Obrigatório, mín. 6 chars |

### Interações
- Submit → chama `signIn(email, password)`
- Erro → exibe mensagem inline abaixo do campo
- Loading state → botão desabilitado + spinner
- Link para `/register` para quem não tem conta

---

## Tela 2 — Cadastro (`/register`)

### Componentes
- `AuthLayout` — mesmo layout do login
- `RegisterForm` — formulário de cadastro
- `AuthInput`

### Campos
| Campo | Tipo | Validação |
|-------|------|-----------|
| Nome | `input[type=text]` | Obrigatório, mín. 2 chars |
| E-mail | `input[type=email]` | Obrigatório, formato válido |
| Senha | `input[type=password]` | Obrigatório, mín. 6 chars |
| Confirmar Senha | `input[type=password]` | Deve ser igual à senha |

### Interações
- Submit → cria conta + documento `users/{uid}` + redireciona /dashboard
- Erro inline por campo
- Link para `/login`

---

## Tela 3 — Dashboard (`/dashboard`)

### Componentes
- `AppLayout` — sidebar + content area
- `StatsCard` — cards de resumo
- `RecentMessages` — lista últimas mensagens

### Conteúdo
```
┌─────────────────────────────────────────────────────┐
│  Bom dia, [Nome]!                                   │
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │Conexões  │  │Contatos  │  │Mensagens │          │
│  │    3     │  │   47     │  │   12     │          │
│  └──────────┘  └──────────┘  └──────────┘          │
│                                                     │
│  ┌──────────┐  ┌──────────┐                         │
│  │Agendadas │  │ Enviadas │                         │
│  │    5     │  │    7     │                         │
│  └──────────┘  └──────────┘                         │
│                                                     │
│  Mensagens Recentes                                 │
│  ┌─────────────────────────────────────────────┐   │
│  │ [badge] Conteúdo truncado...   📅 01/02/2024│   │
│  │ [badge] Conteúdo truncado...   📅 03/02/2024│   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### Interações
- Cards de stats são contadores em tempo real
- Lista de mensagens recentes (últimas 5) com link para /messages
- Clique em card redireciona para a seção correspondente

---

## Tela 4 — Conexões (`/connections`)

### Componentes
- `AppLayout`
- `PageHeader` — título + botão de ação
- `ConnectionCard` — card de cada conexão
- `ConnectionModal` — modal de criar/editar
- `ConfirmDialog` — confirmação de exclusão

### Layout
```
┌─────────────────────────────────────────────────────┐
│  Conexões                        [+ Nova Conexão]   │
│                                                     │
│  ┌─────────────────┐  ┌─────────────────┐           │
│  │  WhatsApp       │  │  E-mail         │           │
│  │  Vendas         │  │  Suporte        │           │
│  │                 │  │                 │           │
│  │ 3 contatos      │  │ 12 contatos     │           │
│  │           [✏️][🗑]│  │           [✏️][🗑]│           │
│  └─────────────────┘  └─────────────────┘           │
└─────────────────────────────────────────────────────┘
```

### Modal de Criar/Editar
| Campo | Tipo | Validação |
|-------|------|-----------|
| Nome | `input[type=text]` | Obrigatório, mín. 1 char |

### Interações
- Clique em card → vai para /contacts?connectionId=xxx
- Botão editar → abre modal com campo pré-preenchido
- Botão excluir → ConfirmDialog → remove
- Quantidade de contatos exibida no card (denormalizada via query)

---

## Tela 5 — Contatos (`/contacts`)

### Componentes
- `AppLayout`
- `PageHeader` — título + botão + filtro de conexão
- `ContactsTable` — tabela de contatos
- `ContactModal` — modal de criar/editar
- `ConfirmDialog`

### Layout
```
┌─────────────────────────────────────────────────────┐
│  Contatos                        [+ Novo Contato]   │
│                                                     │
│  Filtrar por conexão: [Todas ▼]                     │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ Nome          │ Telefone       │ Conexão │ ⚙️│   │
│  │───────────────┼────────────────┼─────────┼──│   │
│  │ Maria Oliveira│ +5511999998888 │ Vendas  │✏️🗑│   │
│  │ Pedro Costa   │ +5511988887777 │ Suporte │✏️🗑│   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### Modal de Criar/Editar
| Campo | Tipo | Validação |
|-------|------|-----------|
| Nome | `input[type=text]` | Obrigatório |
| Telefone | `input[type=tel]` | Obrigatório, 10–20 dígitos |
| Conexão | `select` | Obrigatório, lista de conexões do usuário |

### Interações
- Dropdown filtra por conexão (query Firestore + connectionId)
- Paginação ou scroll infinito (MVP: sem paginação, limite 100)
- Busca por nome (filtro client-side)

---

## Tela 6 — Mensagens (`/messages`)

### Componentes
- `AppLayout`
- `PageHeader` — título + botão + filtros
- `MessageCard` — card de cada mensagem
- `MessageFormPage` — página/drawer de criar/editar (não é modal, é página dedicada)
- `ContactMultiSelect` — seleção de múltiplos contatos
- `ConfirmDialog`

### Layout (lista)
```
┌─────────────────────────────────────────────────────┐
│  Mensagens                      [+ Nova Mensagem]   │
│                                                     │
│  Status: [Todas ▼]   Ordenar: [Data ▼]             │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ [AGENDADA]  Olá! Lembrete da reunião...     │   │
│  │ 👥 Maria Oliveira, Pedro Costa (+2)          │   │
│  │ 📅 01/02/2024 09:00                    [✏️][🗑]│   │
│  ├─────────────────────────────────────────────┤   │
│  │ [ENVIADA]   Bom dia! Confirme sua presença  │   │
│  │ 👥 Carlos Mendes                             │   │
│  │ 📅 28/01/2024 08:00              [🗑] (locked)│   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### Formulário de Criar/Editar (página `/messages/new` e `/messages/:id/edit`)
```
┌─────────────────────────────────────────────────────┐
│  Nova Mensagem                                      │
│                                                     │
│  Conteúdo da mensagem *                            │
│  ┌─────────────────────────────────────────────┐  │
│  │ Textarea multiline (mín. 4 linhas)          │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  Data e Hora de Envio *                            │
│  ┌──────────────────┐                              │
│  │  01/02/2024 09:00│  (DateTimePicker)            │
│  └──────────────────┘                              │
│                                                     │
│  Contatos *                                        │
│  ┌─────────────────────────────────────────────┐  │
│  │ Buscar contato...              [▼]           │  │
│  │ ● Maria Oliveira  ● Pedro Costa   [×]       │  │
│  └─────────────────────────────────────────────┘  │
│  Filtrar por conexão: [Todas ▼]                    │
│                                                     │
│                      [Cancelar] [Salvar Mensagem]  │
└─────────────────────────────────────────────────────┘
```

### Campos do formulário
| Campo | Tipo | Validação |
|-------|------|-----------|
| Conteúdo | `textarea` | Obrigatório, 1–2000 chars |
| Data/Hora | `datetime-local input` | Obrigatório, > now |
| Contatos | `multi-select` | Obrigatório, mín. 1 |

### Interações
- Filtro por status atualiza query Firestore
- Badge colorido: azul para `agendada`, verde para `enviada`
- Mensagem `enviada` → botão editar desabilitado/oculto
- Mensagem `agendada` → botão editar ativo
- Exclusão disponível para qualquer status

---

## Componentes Reutilizáveis

| Componente | Localização | Descrição |
|------------|-------------|-----------|
| `AppLayout` | `components/layout/AppLayout.tsx` | Sidebar + Topbar + Content |
| `Sidebar` | `components/layout/Sidebar.tsx` | Navegação lateral |
| `Topbar` | `components/layout/Topbar.tsx` | Barra superior mobile |
| `AuthLayout` | `components/layout/AuthLayout.tsx` | Layout de autenticação |
| `PageHeader` | `components/ui/PageHeader.tsx` | Título + ação + breadcrumb |
| `StatsCard` | `components/ui/StatsCard.tsx` | Card de métrica |
| `ConfirmDialog` | `components/ui/ConfirmDialog.tsx` | Modal de confirmação |
| `AuthInput` | `components/ui/AuthInput.tsx` | Input estilizado para auth |
| `LoadingSpinner` | `components/ui/LoadingSpinner.tsx` | Spinner de carregamento |
| `StatusBadge` | `components/ui/StatusBadge.tsx` | Badge agendada/enviada |
| `EmptyState` | `components/ui/EmptyState.tsx` | Estado vazio da lista |
| `ContactMultiSelect` | `components/contacts/ContactMultiSelect.tsx` | Seleção múltipla de contatos |
