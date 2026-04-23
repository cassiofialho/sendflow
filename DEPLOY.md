# Guia de Deploy — SendFlow

## Pré-requisitos

- Node.js 20+
- Firebase CLI: `npm install -g firebase-tools`
- Conta Firebase com **Blaze Plan** ativo (necessário para Cloud Functions)

---

## 1. Configurar Firebase

### 1.1 Criar projeto no Firebase Console
1. Acesse https://console.firebase.google.com
2. Clique em "Adicionar projeto"
3. Nome: `SendFlow` (ID: `sendflow-app` ou o que preferir)
4. Ative o Google Analytics (opcional)

### 1.2 Ativar serviços
No Firebase Console, ative:
- **Authentication**: Email/Password
- **Firestore Database**: modo produção, região `southamerica-east1`
- **Functions**: ativado automaticamente ao fazer deploy com Blaze Plan
- **Hosting**: ativado automaticamente

### 1.3 Registrar app web
1. No Console > Configurações do Projeto > Seus apps > Web
2. Registre um app web, copie as configurações

---

## 2. Configurar o projeto local

```bash
# 1. Clone/abra a pasta do projeto
cd "C:\Users\cassi\OneDrive\Documentos\MEUS DOCS\jobs\SendFlow"

# 2. Configure o Firebase CLI
firebase login
firebase use --add   # selecione seu projeto, alias: default

# 3. Configure as variáveis de ambiente do frontend
cd web
cp .env.local.example .env.local
# Edite .env.local com os valores do Firebase Console

# 4. Instale as dependências
cd ../web && npm install
cd ../functions && npm install
```

---

## 3. Rodar localmente

```bash
# Frontend (dev server)
cd web
npm run dev
# Acesse: http://localhost:5173

# Firebase Emulators (opcional, para testar offline)
firebase emulators:start
```

---

## 4. Deploy

### 4.1 Build do frontend
```bash
cd web
npm run build
# Gera: web/dist/
```

### 4.2 Deploy completo (recomendado)
```bash
# Da raiz do projeto SendFlow:
firebase deploy
```

Isso faz deploy de:
- Hosting (frontend)
- Functions (scheduler)
- Firestore Rules
- Firestore Indexes

### 4.3 Deploy parcial

```bash
# Apenas frontend
firebase deploy --only hosting

# Apenas Functions
cd functions
npm run build
cd ..
firebase deploy --only functions

# Apenas Firestore Rules
firebase deploy --only firestore:rules

# Apenas Indexes
firebase deploy --only firestore:indexes
```

---

## 5. Verificar deploy

1. Acesse a URL do Hosting fornecida pelo Firebase
2. Teste login e cadastro
3. No Firebase Console > Functions > Logs, verifique se o scheduler está ativo
4. Crie uma mensagem com data no passado (ou próxima), aguarde e verifique se muda para "enviada"

---

## 6. Troubleshooting

**Erro: "Functions require the Blaze plan"**
→ Acesse Firebase Console > Spark Plan → Upgrade → Blaze

**Erro: "Missing or insufficient permissions"**
→ Verifique se o usuário está autenticado e se o `firestore.rules` foi deployado

**Build falha com erros de TypeScript**
→ Rode `npm run lint` no diretório `web/` para ver erros detalhados

**Scheduler não executa**
→ Verifique no Console > Functions se a function `processScheduledMessages` aparece
→ Cloud Scheduler pode levar até 1 hora para primeira execução após deploy
