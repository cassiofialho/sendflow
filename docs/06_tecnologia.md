# 06 — Tecnologia e Arquitetura

## Stack Tecnológica

### Frontend (`/web`)
| Tecnologia | Versão | Papel |
|------------|--------|-------|
| React | 18.x | Biblioteca de UI |
| TypeScript | 5.x | Tipagem estática |
| Vite | 5.x | Build tool e dev server |
| Material UI (MUI) | 5.x | Componentes de UI (DateTimePicker, Dialog, Select) |
| TailwindCSS | 3.x | Utilitários CSS, layout, responsividade |
| React Router v6 | 6.x | Roteamento client-side |
| Zustand | 4.x | Gerenciamento de estado global (auth) |
| React Hook Form | 7.x | Gerenciamento de formulários |
| Zod | 3.x | Validação de esquemas |
| date-fns | 3.x | Manipulação de datas |

### Backend / Firebase (`/functions`)
| Tecnologia | Versão | Papel |
|------------|--------|-------|
| Firebase Auth | latest | Autenticação de usuários |
| Cloud Firestore | latest | Banco de dados NoSQL em tempo real |
| Firebase Functions | 2.x | Funções serverless + scheduler |
| Firebase Hosting | latest | Deploy e CDN do frontend |
| TypeScript | 5.x | Tipagem nas functions |

---

## Estrutura de Diretórios

```
SendFlow/
├── docs/                          ← Documentação do projeto
│   ├── 01_visao_geral.md
│   ├── 02_regras_negocio.md
│   ├── 03_modelo_dados.md
│   ├── 04_fluxos.md
│   ├── 05_interfaces.md
│   ├── 06_tecnologia.md
│   ├── 07_backlog.md
│   ├── 08_decisoes.md
│   └── 09_identidade_visual.md
│
├── web/                           ← Aplicação React
│   ├── public/
│   ├── src/
│   │   ├── assets/                ← Imagens, ícones estáticos
│   │   ├── components/            ← Componentes reutilizáveis
│   │   │   ├── layout/            ← AppLayout, Sidebar, Topbar, AuthLayout
│   │   │   ├── ui/                ← Componentes genéricos de UI
│   │   │   ├── connections/       ← Componentes de Conexões
│   │   │   ├── contacts/          ← Componentes de Contatos
│   │   │   └── messages/          ← Componentes de Mensagens
│   │   ├── hooks/                 ← Custom hooks
│   │   │   ├── useConnections.ts
│   │   │   ├── useContacts.ts
│   │   │   ├── useMessages.ts
│   │   │   └── useAuth.ts
│   │   ├── pages/                 ← Páginas (1 por rota)
│   │   │   ├── auth/
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   └── RegisterPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── ConnectionsPage.tsx
│   │   │   ├── ContactsPage.tsx
│   │   │   ├── MessagesPage.tsx
│   │   │   └── MessageFormPage.tsx
│   │   ├── services/              ← Acesso ao Firebase (centralizado)
│   │   │   ├── firebase.ts        ← Inicialização do Firebase
│   │   │   ├── authService.ts
│   │   │   ├── connectionService.ts
│   │   │   ├── contactService.ts
│   │   │   └── messageService.ts
│   │   ├── store/                 ← Estado global (Zustand)
│   │   │   └── authStore.ts
│   │   ├── types/                 ← Tipos TypeScript
│   │   │   ├── auth.types.ts
│   │   │   ├── connection.types.ts
│   │   │   ├── contact.types.ts
│   │   │   └── message.types.ts
│   │   ├── utils/                 ← Funções utilitárias puras
│   │   │   ├── formatters.ts      ← Formatação de datas, telefones
│   │   │   └── validators.ts      ← Validações reutilizáveis
│   │   ├── router/
│   │   │   └── index.tsx          ← Definição de rotas + guards
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css              ← Variáveis CSS + Tailwind imports
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── functions/                     ← Firebase Functions
│   ├── src/
│   │   ├── index.ts               ← Exportação de todas as functions
│   │   ├── schedulers/
│   │   │   └── processScheduledMessages.ts
│   │   └── types/
│   │       └── message.types.ts
│   ├── tsconfig.json
│   └── package.json
│
├── firestore.rules                ← Security Rules do Firestore
├── firestore.indexes.json         ← Índices compostos
├── firebase.json                  ← Configuração do Firebase project
└── .firebaserc                    ← Alias do projeto Firebase
```

---

## Paradigma Funcional

O projeto segue estritamente o **paradigma funcional**:

- **Sem classes:** nenhum `class` no frontend ou functions
- **Funções puras:** funções que não têm efeitos colaterais quando possível
- **Hooks ao invés de HoCs:** lógica encapsulada em custom hooks
- **Imutabilidade:** estado gerenciado com Zustand (sem mutação direta)
- **Composição:** componentes compostos por funções menores e hooks

---

## Camadas da Aplicação

```
┌─────────────────────────────────────────────────────┐
│                     PAGES                           │
│  (orquestram hooks, passam dados para components)   │
├─────────────────────────────────────────────────────┤
│                   COMPONENTS                        │
│  (UI pura, recebem props, sem lógica de negócio)    │
├─────────────────────────────────────────────────────┤
│                     HOOKS                           │
│  (estado local + chamadas a services)               │
├─────────────────────────────────────────────────────┤
│                    SERVICES                         │
│  (único ponto de acesso ao Firebase)                │
├─────────────────────────────────────────────────────┤
│                    FIREBASE SDK                     │
│  (Auth, Firestore, Functions)                       │
└─────────────────────────────────────────────────────┘
```

### Regras de Camada
1. **Components** nunca importam services nem Firebase diretamente
2. **Hooks** chamam services e expõem state + handlers para pages/components
3. **Services** são as únicas funções que importam e usam o Firebase SDK
4. **Pages** usam hooks e passam dados via props para components
5. **Types** são importados por qualquer camada (tipos são agnósticos)
6. **Utils** são funções puras sem dependência de Firebase

---

## Tempo Real com Firestore

Todos os hooks de entidade usam `onSnapshot` para streaming em tempo real:

```typescript
// Padrão de hook com onSnapshot
const useConnections = () => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;
    
    const unsubscribe = connectionService.subscribe(user.uid, (data) => {
      setConnections(data);
      setLoading(false);
    });
    
    return () => unsubscribe(); // cleanup ao desmontar
  }, [user]);

  return { connections, loading };
};
```

---

## Roteamento

```typescript
// Rotas protegidas por AuthGuard
/login          → LoginPage (público)
/register       → RegisterPage (público)
/dashboard      → DashboardPage (privado)
/connections    → ConnectionsPage (privado)
/contacts       → ContactsPage (privado)
/messages       → MessagesPage (privado)
/messages/new   → MessageFormPage (privado)
/messages/:id/edit → MessageFormPage (privado)
*               → Redirect para /dashboard
```

---

## Gerenciamento de Estado

- **Autenticação:** Zustand (`authStore`) — estado global persistido na memória
- **Entidades:** Estado local nos hooks (`useState`) + Firestore como source of truth
- **Formulários:** React Hook Form + Zod (estado local do formulário)
- **UI State:** Estado local nos components (`useState`) para modais, loading, etc.

---

## Convenções de Código

- Arquivos de componentes: `PascalCase.tsx`
- Arquivos de hooks: `camelCase.ts`
- Arquivos de types: `camelCase.types.ts`
- Arquivos de services: `camelCase.ts`
- Props interfaces: `[ComponentName]Props`
- Custom hooks: prefixo `use`
- Todas as funções async retornam `Promise<T>` tipado
- Nunca usar `any` — usar `unknown` + type guard se necessário
