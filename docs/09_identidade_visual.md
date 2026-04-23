# 09 — Identidade Visual

## Paleta de Cores

### Cores Primárias
| Variável | Valor | Uso |
|----------|-------|-----|
| `--primary` | `#0059e8` | Botões primários, links, estados ativos |
| `--primary-foreground` | `#ffffff` | Texto sobre fundos primários |
| `--sidebar-bg` | `#0a1f4e` | Fundo da sidebar e topbar |

### Background e Superfícies
| Variável | Valor | Uso |
|----------|-------|-----|
| `--background` | `#fcfdff` | Fundo da página principal |
| `--card` | `#ffffff` | Cards e containers |
| `--secondary` | `#f5f9ff` | Seções e áreas secundárias |
| `--foreground` | `#0a2e6b` | Texto principal |

### Cores de Suporte
| Variável | Valor | Uso |
|----------|-------|-----|
| `--accent` | `#dcebff` | Destaques e hovers leves |
| `--border` | `#cee3ff` | Bordas suaves |
| `--muted-foreground` | `#3b6dbf` | Texto secundário |
| `--destructive` | `#ef4444` | Erros e ações destrutivas |
| `--success` | `#22c55e` | Estados positivos |

### Cores de Status (SendFlow específico)
| Status | Background | Texto |
|--------|------------|-------|
| `agendada` | `#dbeafe` (blue-100) | `#1d4ed8` (blue-700) |
| `enviada` | `#dcfce7` (green-100) | `#15803d` (green-700) |

---

## Tipografia

### Fontes
```css
--font-sans: 'Inter', system-ui, sans-serif;     /* Corpo e UI */
--font-heading: 'Montserrat', 'Arial Black', sans-serif; /* Títulos e Logo */
--font-mono: 'JetBrains Mono', monospace;       /* Dados e código */
```

### Escala Tipográfica
| Uso | Fonte | Tamanho | Peso |
|-----|-------|---------|------|
| Logo/Brand | Montserrat | 1.5rem | 800 |
| Título de página | Montserrat | 1.5rem | bold |
| Subtítulo | Inter | 1rem | 600 |
| Corpo | Inter | 0.875rem | 400 |
| Label | Inter | 0.75rem | 500 (uppercase) |
| Meta/Auxiliar | Inter | 0.75rem | 400 |

---

## Layout

### Sidebar
```
Width:         240px (expandida) / 64px (colapsada)
Background:    #0a1f4e
Header height: 64px
Border right:  1px solid rgba(255,255,255,0.08)
```

### Topbar (mobile)
```
Height:        60px
Background:    #0a1f4e
Border bottom: 1px solid rgba(255,255,255,0.08)
```

### Área de Conteúdo
```
Padding:       24px (p-6)
Background:    #f8fafc
Min height:    100vh
```

---

## Componentes

### Navigation Item (Sidebar)
```css
/* Normal */
padding: 12px 20px;
color: #93b8d4;
gap: 12px;
icon-size: 18px;

/* Hover */
background: rgba(255,255,255,0.06);
color: #e0eeff;

/* Ativo */
background: rgba(0,89,232,0.2);
color: #60a5fa;
border-left: 3px solid #0059e8;
```

### Cards
```css
background: #ffffff;
border: 1px solid #e2e8f0;
border-radius: 8px;
box-shadow: 0 1px 3px rgba(0,0,0,0.08);
padding: 20px;

/* Hover */
box-shadow: 0 4px 12px rgba(0,0,0,0.1);
```

### Inputs
```css
padding: 10px 14px;
border: 1px solid #cee3ff;
border-radius: 6px;
font-size: 0.875rem;
color: #0a2e6b;

/* Focus */
border-color: #0059e8;
box-shadow: 0 0 0 3px rgba(0,89,232,0.15);

/* Error */
border-color: #ef4444;
box-shadow: 0 0 0 3px rgba(239,68,68,0.15);

/* Placeholder */
color: #93b8d4;
```

### Botões Primários
```css
background: #0059e8;
color: #ffffff;
padding: 10px 20px;
border-radius: 6px;
font-weight: 600;
font-size: 0.875rem;

/* Hover */
background: #0047c7;

/* Disabled */
opacity: 0.6;
cursor: not-allowed;
```

### Botões Secundários
```css
background: transparent;
color: #0059e8;
border: 1px solid #cee3ff;
padding: 10px 20px;
border-radius: 6px;

/* Hover */
background: #f5f9ff;
```

### Status Badges
```css
/* Agendada */
background: #dbeafe;
color: #1d4ed8;
padding: 2px 10px;
border-radius: 9999px;
font-size: 0.75rem;
font-weight: 600;

/* Enviada */
background: #dcfce7;
color: #15803d;
```

### Stats Cards (Dashboard)
```css
/* Label */
font-size: 0.75rem;
font-weight: 600;
text-transform: uppercase;
color: #64748b;
letter-spacing: 0.05em;

/* Valor */
font-size: 1.75rem;
font-weight: 700;
color: #0a2e6b;
```

---

## Efeitos e Animações

### Loading Skeleton
```css
background: linear-gradient(90deg, #dcebff 25%, #f5f9ff 50%, #dcebff 75%);
background-size: 200% 100%;
animation: skeleton-shimmer 1.5s ease-in-out infinite;
border-radius: 6px;
```

### Scrollbar Customizada
```css
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #cee3ff; border-radius: 999px; }
::-webkit-scrollbar-thumb:hover { background: #0059e8; }
```

### Transições Padrão
```css
transition-all duration-300  /* Sidebar collapse, modais */
transition-colors             /* Hover em links/botões */
```

---

## Layout de Autenticação

```
Desktop (>768px):
┌─────────────────────────────┬─────────────────┐
│  Imagem + Overlay Gradiente  │  Formulário     │
│  55% da largura              │  45% da largura │
│                              │  max-w: 420px   │
│  Gradient: linear-gradient(  │  padding: 40px  │
│    135deg,                   │                 │
│    rgba(8,15,32,0.70),       │                 │
│    rgba(10,31,78,0.50) 60%,  │                 │
│    rgba(10,31,78,0.15)       │                 │
│  )                           │                 │
└─────────────────────────────┴─────────────────┘

Mobile (<768px):
┌─────────────────────────────┐
│  Formulário apenas           │
│  padding: 24px               │
│  Fundo: #fcfdff              │
└─────────────────────────────┘
```

---

## Logo SendFlow

```
Fonte: Montserrat
Peso: 800
Tamanho: 1.5rem (sidebar), 2rem (auth)
Cor: #ffffff (sidebar), #0059e8 (formulário auth)
Símbolo: ícone de envio/seta (Lucide: "send") + texto "SendFlow"
```

---

## Iconografia

Biblioteca: **Lucide React** (mesma do projeto de referência)

| Contexto | Ícone |
|----------|-------|
| Logo/Brand | `Send` |
| Dashboard | `LayoutDashboard` |
| Conexões | `Link2` |
| Contatos | `Users` |
| Mensagens | `MessageSquare` |
| Editar | `Pencil` |
| Excluir | `Trash2` |
| Adicionar | `Plus` |
| Fechar modal | `X` |
| Logout | `LogOut` |
| Agendada | `Clock` |
| Enviada | `CheckCircle2` |
| Telefone | `Phone` |
| Calendário | `Calendar` |
| Filtro | `Filter` |

---

## index.css (variáveis CSS)

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@700;800&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary: #0059e8;
  --primary-foreground: #ffffff;
  --background: #fcfdff;
  --card: #ffffff;
  --secondary: #f5f9ff;
  --foreground: #0a2e6b;
  --muted-foreground: #3b6dbf;
  --accent: #dcebff;
  --border: #cee3ff;
  --destructive: #ef4444;
  --success: #22c55e;
  --sidebar-bg: #0a1f4e;
  --sidebar-active: rgba(0,89,232,0.2);
  --sidebar-hover: rgba(255,255,255,0.06);
  --sidebar-text: #93b8d4;
  --sidebar-text-active: #60a5fa;
  --sidebar-border-active: #0059e8;
}
```
