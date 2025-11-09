# 🚀 Guia de Início Rápido - CakeCup

## ⚡ Começando em 5 Minutos

### 1️⃣ Instalar Dependências (1 min)
```bash
cd cakecup_web_app
npm install
```

### 2️⃣ Configurar Ambiente (30 seg)
Crie um arquivo `.env` na raiz:
```env
NUXT_PUBLIC_API_BASE=https://vendabela.onrender.com/app/v1
```

### 3️⃣ Iniciar Servidor (30 seg)
```bash
npm run dev
```

✅ Acesse: `http://localhost:3000`

---

## 🎯 Testando Funcionalidades

### 🏠 Home Page
```
URL: http://localhost:3000/
```
- Veja produtos em destaque
- Navegue pelas seções

### 📦 Catálogo de Produtos
```
URL: http://localhost:3000/products
```
- Veja todos os produtos
- Filtre por categoria
- Adicione ao carrinho

### 🔐 Login
```
URL: http://localhost:3000/login
```
1. Digite seu WhatsApp: `+5511999999999`
2. Clique em "Enviar Código"
3. Digite o OTP recebido
4. Clique em "Verificar Código"

### 🛒 Checkout
```
URL: http://localhost:3000/checkout
```
Pré-requisitos:
- ✅ Estar autenticado
- ✅ Ter produtos no carrinho

Fluxo:
1. Veja resumo do pedido
2. Selecione endereço de entrega
3. Escolha método de pagamento
4. Adicione observações (opcional)
5. Finalize o pedido

### 📋 Meus Pedidos
```
URL: http://localhost:3000/orders
```
- Veja histórico de pedidos
- Acompanhe status
- Cancele pedidos pendentes

---

## 🧪 Testando a API

### Testar Produtos
```typescript
// No console do navegador
const api = (await import('/utils/api')).api
const products = await api.getProducts()
console.log(products)
```

### Testar Autenticação
```typescript
// No console do navegador
const api = (await import('/utils/api')).api

// 1. Enviar OTP
await api.login('+5511999999999')

// 2. Verificar OTP
const result = await api.verifyOtp('+5511999999999', '123456')
console.log(result)
```

---

## 📱 Estrutura de Navegação

```
┌─────────────────────────────────────┐
│          Home (/)                   │
│  • Hero Section                     │
│  • Produtos em Destaque             │
│  • Como Funciona                    │
│  • Depoimentos                      │
│  • Call to Action                   │
└─────────────────────────────────────┘
            │
     ┌──────┴──────┐
     │             │
┌────▼────┐   ┌───▼────┐
│Products │   │ Login  │
│(/products)   │(/login)│
└────┬────┘   └───┬────┘
     │            │
     │      ┌─────▼─────┐
     │      │Authenticated│
     │      └─────┬─────┘
     │            │
┌────▼────────────▼────┐
│     Checkout         │
│    (/checkout)       │
└──────────┬───────────┘
           │
     ┌─────▼─────┐
     │  Orders   │
     │ (/orders) │
     └───────────┘
```

---

## 🔧 Comandos Úteis

### Desenvolvimento
```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build de produção
npm run preview      # Preview da build
```

### Linting
```bash
npm run lint         # Verifica erros de linting
npm run lint:fix     # Corrige erros automaticamente
```

### Type Checking
```bash
npm run type-check   # Verifica tipos TypeScript
```

---

## 🎨 Personalizando

### Cores Principais
Arquivo: `assets/styles/_variables.scss`
```scss
$primary-color: #ff69b4;
$secondary-color: #ff1493;
$text-color: #333;
$background-color: #f9f9f9;
```

### Logo e Imagens
- Logo: `public/logo.png`
- Produtos: `public/products/`
- Ícones: `public/icons/`

### API Base URL
Arquivo: `.env`
```env
NUXT_PUBLIC_API_BASE=sua-api-url-aqui
```

---

## 📚 Documentação Detalhada

- **Integração API**: [`docs/API_INTEGRATION.md`](docs/API_INTEGRATION.md)
- **Changelog**: [`CHANGELOG.md`](CHANGELOG.md)
- **Resumo**: [`INTEGRATION_SUMMARY.md`](INTEGRATION_SUMMARY.md)
- **README**: [`README.md`](README.md)

---

## ⚠️ Solução de Problemas

### Erro: "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Erro: "API Base URL not configured"
Verifique se o arquivo `.env` existe e contém:
```env
NUXT_PUBLIC_API_BASE=https://vendabela.onrender.com/app/v1
```

### Erro: "Token inválido"
```bash
# Limpe o localStorage no console do navegador
localStorage.clear()
# Faça login novamente
```

### Port 3000 já está em uso
```bash
# Use outra porta
npm run dev -- --port 3001
```

---

## 💡 Dicas

### 1. Use o Vue DevTools
Instale a extensão Vue DevTools no seu navegador para debug.

### 2. Console do Navegador
Abra o console (F12) para ver logs e erros.

### 3. Network Tab
Use a aba Network para ver requisições à API.

### 4. Pinia DevTools
Veja o estado das stores em tempo real.

---

## 🎓 Aprenda Mais

### Vue 3
- [Documentação Oficial](https://vuejs.org/)
- [Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)

### Nuxt 3
- [Documentação Oficial](https://nuxt.com/)
- [Guia de Configuração](https://nuxt.com/docs/guide/directory-structure/nuxt.config)

### Pinia
- [Documentação Oficial](https://pinia.vuejs.org/)
- [Getting Started](https://pinia.vuejs.org/getting-started.html)

### TypeScript
- [Documentação Oficial](https://www.typescriptlang.org/)
- [TypeScript com Vue](https://vuejs.org/guide/typescript/overview.html)

---

## ✅ Checklist de Início

- [ ] Node.js instalado (v18+)
- [ ] Dependências instaladas (`npm install`)
- [ ] Arquivo `.env` configurado
- [ ] Servidor rodando (`npm run dev`)
- [ ] Navegador aberto em `localhost:3000`
- [ ] Home page carregando corretamente
- [ ] Produtos aparecendo na home
- [ ] Consegue acessar `/products`
- [ ] Consegue acessar `/login`

---

## 🆘 Precisa de Ajuda?

1. Verifique os logs no console
2. Consulte a documentação em `docs/`
3. Verifique o código de exemplo
4. Veja a documentação da API no Swagger

---

**Boa sorte e bom desenvolvimento! 🎉**

