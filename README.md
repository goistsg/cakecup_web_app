# 🧁 CakeCup - Loja de Cupcakes Artesanais

## 📝 Descrição
CakeCup é uma aplicação web moderna e completa para venda de cupcakes artesanais, desenvolvida com Nuxt 3, TypeScript e integrada com API REST. A plataforma oferece uma experiência de compra intuitiva, segura e agradável para os amantes de doces.

## ✨ Funcionalidades Principais

### 🔐 Autenticação
- Login via WhatsApp com OTP (código de verificação)
- Gerenciamento de sessão com JWT
- Proteção de rotas autenticadas

### 📦 Produtos
- Catálogo completo de produtos **sem necessidade de login**
- Filtros avançados (categoria, busca, preço, ordenação)
- Paginação automática
- Produtos em destaque
- Imagens de alta qualidade
- Informações detalhadas de cada produto
- **Store pública** para acesso sem autenticação

### 🛒 Carrinho de Compras
- Adicionar/remover produtos
- Atualizar quantidades
- Cálculo automático de totais
- Sincronização com API
- Carrinho persistente

### 📋 Pedidos
- Criação de pedidos
- Histórico de pedidos
- Acompanhamento de status
- Cancelamento de pedidos
- Detalhes completos de cada pedido

### 📍 Endereços
- Cadastro de múltiplos endereços
- Endereço principal
- Edição e exclusão de endereços
- Seleção de endereço para entrega

### 💳 Pagamentos
- Múltiplos métodos de pagamento (PIX, Cartão, Dinheiro, Boleto)
- Geração de QR Code para PIX
- Status de pagamento em tempo real

### 🎯 Checkout
- Fluxo completo de finalização
- Seleção de endereço de entrega
- Escolha do método de pagamento
- Campo para observações
- Resumo do pedido

## 🎨 Paleta de Cores

A aplicação utiliza uma paleta de cores elegante e consistente:

- **Primary** (`#8B0014`): Vermelho escuro - usado em botões principais, links e destaques
- **Secondary** (`#D32F2F`): Vermelho médio - usado em badges e alertas
- **Accent** (`#A0522D`): Marrom - usado em elementos de destaque
- **Background** (`#E9DFD7`): Bege claro - fundo principal da aplicação
- **Surface** (`#FBE9E7`): Rosa claro - cards e modais
- **Text** (`#3A1F1B`): Marrom escuro - textos principais

📖 **Documentação completa**: [`docs/COLOR_PALETTE.md`](docs/COLOR_PALETTE.md)

---

## 🛠 Tecnologias Utilizadas

### Frontend
- [Nuxt 3](https://nuxt.com/) - Framework Vue.js com SSR
- [Vue 3](https://vuejs.org/) - Framework JavaScript reativo
- [TypeScript](https://www.typescriptlang.org/) - Superset do JavaScript
- [Pinia](https://pinia.vuejs.org/) - Gerenciamento de estado
- [SCSS](https://sass-lang.com/) - Pré-processador CSS
- [ofetch](https://github.com/unjs/ofetch) - Cliente HTTP

### Backend (API)
- API REST: `https://vendabela.onrender.com/app/v1`
- Documentação: [Swagger](https://vendabela.onrender.com/app/api/swagger-app.json)
- Autenticação: JWT + OTP via WhatsApp
- Banco de Dados: PostgreSQL (presumido)

## 🐳 Docker & Deploy

### Docker

A aplicação está pronta para deploy com Docker!

```bash
# Build
docker build -t cakecup-web-app .

# Rodar
docker run -p 3000:3000 \
  -e NUXT_PUBLIC_API_BASE=https://vendabela.onrender.com/app/v1 \
  -e NUXT_PUBLIC_COMPANY_ID=seu-company-id \
  cakecup-web-app
```

📖 **Guia Docker**: [`DOCKER_GUIDE.md`](DOCKER_GUIDE.md)

### Deploy no Render

1. Criar Web Service no [Render](https://render.com)
2. Conectar repositório Git
3. Selecionar Runtime: **Docker**
4. Configurar variáveis de ambiente
5. Deploy! 🚀

📖 **Guia de Deploy**: [`DEPLOY_RENDER.md`](DEPLOY_RENDER.md)

---

## 📋 Pré-requisitos
- Node.js (versão 18 ou superior)
- npm, yarn ou pnpm

## 🔧 Instalação e Configuração

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/cakecup_web_app.git
cd cakecup_web_app
```

### 2. Instale as dependências
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto:
```bash
# API Configuration
NUXT_PUBLIC_API_BASE=https://vendabela.onrender.com/app/v1
```

### 4. Execute o projeto em modo de desenvolvimento
```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

A aplicação estará disponível em `http://localhost:3000`

### 5. Build para produção
```bash
npm run build
npm run preview
# ou
yarn build
yarn preview
# ou
pnpm build
pnpm preview
```

## 📁 Estrutura do Projeto
```bash
cakecup_web_app/
├── assets/                    # Recursos estáticos (CSS, imagens)
│   └── styles/
│       └── _variables.scss   # Variáveis SCSS globais
├── components/               # Componentes Vue reutilizáveis
│   ├── cart/
│   │   └── CartModal.vue    # Modal do carrinho
│   ├── common/
│   │   └── ProductCard.vue  # Card de produto
│   ├── home/                # Componentes da home
│   │   ├── CallToAction.vue
│   │   ├── FeaturedProducts.vue
│   │   ├── HeroSection.vue
│   │   ├── HowItWorks.vue
│   │   └── Testimonials.vue
│   └── layout/              # Componentes de layout
│       ├── TheFooter.vue
│       └── TheHeader.vue
├── composables/             # Composables Vue
│   ├── useApi.ts           # Hook para API
│   ├── useAuth.ts          # Hook de autenticação
│   ├── useCart.ts          # Hook do carrinho
│   └── useProducts.ts      # Hook de produtos
├── docs/                    # Documentação
│   └── API_INTEGRATION.md  # Doc de integração da API
├── layouts/                 # Layouts Nuxt
│   └── default.vue
├── pages/                   # Páginas da aplicação
│   ├── about.vue           # Sobre nós
│   ├── checkout.vue        # Finalizar pedido
│   ├── contact.vue         # Contato
│   ├── index.vue           # Home
│   ├── login.vue           # Login
│   ├── orders.vue          # Meus pedidos
│   ├── privacy.vue         # Privacidade
│   └── products.vue        # Catálogo
├── plugins/                 # Plugins Nuxt
│   └── auth.client.ts      # Plugin de autenticação
├── public/                  # Arquivos públicos
│   ├── products/           # Imagens de produtos
│   └── ...
├── stores/                  # Stores Pinia
│   ├── auth.ts             # Store de autenticação
│   ├── cart.ts             # Store do carrinho
│   ├── clients.ts          # Store de clientes
│   ├── orders.ts           # Store de pedidos
│   └── products.ts         # Store de produtos
├── types/                   # Tipos TypeScript
│   └── api.ts              # Tipos da API
├── utils/                   # Utilitários
│   └── api.ts              # Serviço de API
├── CHANGELOG.md            # Log de mudanças
├── nuxt.config.ts          # Configuração Nuxt
├── package.json            # Dependências
└── tsconfig.json           # Configuração TypeScript
```

## 🔍 Componentes e Módulos Principais

### 🎨 Páginas
- **`/`** - Página inicial com seções de destaque
- **`/products`** - Catálogo de produtos com filtros
- **`/login`** - Autenticação via WhatsApp + OTP
- **`/checkout`** - Finalização do pedido
- **`/orders`** - Histórico de pedidos do usuário
- **`/about`** - Sobre a empresa
- **`/contact`** - Formulário de contato

### 🧩 Componentes
- **`ProductCard`** - Card reutilizável de produto
- **`FeaturedProducts`** - Grid de produtos em destaque
- **`CartModal`** - Modal do carrinho de compras
- **`TheHeader`** - Cabeçalho com navegação
- **`TheFooter`** - Rodapé da aplicação

### 📦 Stores (Pinia)
- **`auth`** - Gerenciamento de autenticação e usuário
- **`cart`** - Estado do carrinho de compras
- **`products`** - Catálogo de produtos e categorias
- **`orders`** - Gerenciamento de pedidos
- **`clients`** - Dados do cliente e endereços

### 🔌 Composables
- **`useAuth()`** - Hook para autenticação
- **`useCart()`** - Hook para carrinho
- **`useProducts()`** - Hook para produtos
- **`useApi()`** - Hook genérico para API

### 🛠 Utilitários
- **`api.ts`** - Classe ApiService com todos os métodos da API
- **`types/api.ts`** - Tipos TypeScript completos da API

## 🔐 Autenticação

### Fluxo de Login
1. Usuário informa WhatsApp
2. Sistema envia OTP via WhatsApp
3. Usuário informa o código OTP
4. Sistema valida e retorna token JWT
5. Token é armazenado localmente
6. Requisições subsequentes usam o token

### Exemplo de Uso
```typescript
import { useAuth } from '~/composables/useAuth'

const { login, verifyOtp, user, isAuthenticated } = useAuth()

// 1. Enviar OTP
await login('+5511999999999')

// 2. Verificar OTP
await verifyOtp('+5511999999999', '123456')

// 3. Usuário autenticado
if (isAuthenticated.value) {
  console.log('Bem-vindo,', user.value.name)
}
```

## 📡 Integração com API

A aplicação consome uma API REST completa. Consulte a [documentação de integração](docs/public/API_INTEGRATION.md) para mais detalhes.

### Endpoints Principais
- **Auth**: `/auth/login`, `/auth/verify-otp`, `/auth/me`
- **Products**: `/products`, `/products/{id}`, `/categories`
- **Cart**: `/cart/{clientId}`, `/cart/{clientId}/add`
- **Orders**: `/orders`, `/orders/{id}`
- **Clients**: `/clients`, `/addresses`

## 🔐 Variáveis de Ambiente
```env
# API Configuration
NUXT_PUBLIC_API_BASE=https://vendabela.onrender.com/app/v1

# Para desenvolvimento local
# NUXT_PUBLIC_API_BASE=http://localhost:3001/app/v1
```

## 📱 Responsividade
A aplicação é totalmente responsiva e se adapta aos seguintes breakpoints:
- Mobile: até 768px
- Tablet: até 1024px
- Desktop: 1024px ou superior

## 🎨 Estilos
O projeto utiliza SCSS para estilização, com variáveis globais definidas em:
```bash
assets/css/variables.scss
```

## 📚 Documentação

### 📖 Documentação Pública
Guias essenciais para desenvolvimento, deploy e uso:

- **Início Rápido**
  - [Guia de Início Rápido](docs/public/QUICK_START.md) - Comece em 5 minutos
  - [Comandos Rápidos](docs/public/QUICK_COMMANDS.md) - Comandos mais usados

- **Deploy e Infraestrutura**
  - [Deploy no Render](docs/public/DEPLOY_RENDER.md) - Guia completo
  - [Guia Docker](docs/public/DOCKER_GUIDE.md) - Containerização
  - [Variáveis de Ambiente](docs/public/ENVIRONMENT_VARIABLES.md) - Configuração

- **Integração e API**
  - [Integração com API](docs/public/API_INTEGRATION.md) - Backend REST
  - [Store Pública](docs/public/STORE_PUBLIC.md) - Produtos sem autenticação

- **Design System**
  - [Paleta de Cores](docs/public/COLOR_PALETTE.md) - Sistema de cores

### 🔒 Documentação Interna
Histórico e processo de desenvolvimento:

- [Histórico de Mudanças](CHANGELOG.md) - Todas as versões
- [Documentação Interna](docs/internal/) - Summaries e implementação

---

## 🤝 Contribuindo
1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)

## 📝 Licença
Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## ✨ Autor
Tiago Gois - [GitHub](https://github.com/goistsg)

---
⌨️ com ❤️ por [Tiago Gois](https://github.com/goistsg)