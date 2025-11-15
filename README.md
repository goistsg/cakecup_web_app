# 🧁 CakeCup - Loja de Cupcakes Artesanais

## 📝 Descrição
CakeCup é uma aplicação web moderna e completa para venda de cupcakes artesanais, desenvolvida com Nuxt 3, TypeScript e integrada com API REST. A plataforma oferece uma experiência de compra intuitiva, segura e agradável para os amantes de doces.

## ✨ Funcionalidades Principais

### 🔐 Autenticação e Perfil
- Login via email e senha
- Cadastro com validação de senha forte (mínimo 8 caracteres, maiúscula, minúscula, número/caractere especial)
- Recuperação de senha (Esqueci minha senha)
- Redefinição de senha com token
- Gerenciamento de sessão com JWT
- Proteção de rotas autenticadas
- **Perfil do usuário** com:
  - Edição de informações pessoais (nome, WhatsApp)
  - Troca de senha
  - Indicador de força de senha em tempo real
  - Badge de administrador (para usuários admin)

### 📦 Produtos
- Catálogo completo de produtos **sem necessidade de login**
- Filtros avançados (categoria, busca, ordenação)
- Busca em tempo real com debounce
- Ordenação (Nome A-Z, Nome Z-A, Menor preço, Maior preço, Mais recentes, Mais antigos)
- Produtos em destaque
- Imagens de alta qualidade
- Informações detalhadas (descrição, ingredientes, especificações)
- **Avaliações de produtos**:
  - Sistema de notas (1-5 estrelas)
  - Título e comentário
  - Média de avaliações
  - Lista de avaliações de outros clientes
- **Store pública** para acesso sem autenticação
- Persistência de filtros e posição de scroll ao navegar
- **Admin**: Criação e edição de produtos
- **Admin**: Gerenciamento de imagens e ingredientes

### ❤️ Favoritos
- Lista de produtos favoritos
- Adicionar/remover produtos dos favoritos
- Acesso rápido aos produtos preferidos
- Sincronização com API

### 🛒 Carrinho de Compras
- Adicionar/remover produtos
- Atualizar quantidades
- Cálculo automático de totais
- Sincronização com API
- Carrinho persistente
- Botão flutuante do carrinho
- Controle de estoque

### 📋 Pedidos
- Criação de pedidos
- Histórico de pedidos (usuário vê apenas seus pedidos)
- **Admin**: Listagem de todos os pedidos da empresa
- Acompanhamento de status (OPEN, PAID, DELIVERED, CANCELED)
- **Admin**: Edição de status do pedido
- Timeline visual de status
- Cancelamento de pedidos (apenas status OPEN)
- Detalhes completos:
  - Itens do pedido
  - Endereço de entrega
  - Método de pagamento
  - Valores (subtotal, taxa de entrega, desconto, total)

### 📍 Endereços
- Cadastro de múltiplos endereços
- Busca automática de CEP (integração com ViaCEP)
- Endereço principal
- Edição e exclusão de endereços
- Seleção de endereço para entrega
- Validação de campos
- Interface moderna com cards

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
- Redirecionamento imediato após finalização

### 📝 Sistema de Feedback (Modo de Teste)
- **Início de sessão de teste** com:
  - Coleta de nome e WhatsApp do testador
  - Pré-preenchimento automático para usuários logados
  - Validação de WhatsApp
- **Botão flutuante** para envio de feedback
- **Modal de feedback** com:
  - Campo "Funcionou?" (Sim/Não)
  - Descrição detalhada
  - Sugestões de melhoria
  - Captura automática de tela, usuário e testador
- **Admin**: Dashboard de resultados com:
  - Estatísticas gerais (total de sessões, feedbacks, taxa de sucesso)
  - Lista de feedbacks por sessão
  - Indicadores visuais (verde para sucesso, vermelho para falhas)
  - Destaque para sugestões de melhoria

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
- Documentação: [Swagger](https://vendabela.onrender.com/app/api)
- Autenticação: JWT
- Login: Email e Senha
- Banco de Dados: PostgreSQL

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
│   ├── admin/
│   │   └── ProductFormModal.vue  # Modal de criação/edição de produtos
│   ├── cart/
│   │   └── CartModal.vue    # Modal do carrinho
│   ├── checkout/
│   │   └── AddressSelector.vue  # Seletor de endereços
│   ├── common/
│   │   ├── PasswordStrength.vue  # Indicador de força de senha
│   │   └── ProductCard.vue  # Card de produto
│   ├── feedback/            # Sistema de feedback
│   │   ├── FloatingButton.vue
│   │   ├── FeedbackModal.vue
│   │   └── StartSessionModal.vue
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
│   ├── useClientMounted.ts # Hook para montagem do cliente
│   ├── useCompany.ts       # Hook de empresa
│   ├── useProducts.ts      # Hook de produtos
│   ├── useStorePublic.ts   # Hook da store pública
│   └── useWishlist.ts      # Hook de favoritos
├── docs/                    # Documentação
│   └── public/
│       ├── API_INTEGRATION.md  # Doc de integração da API
│       ├── COLOR_PALETTE.md    # Sistema de cores
│       ├── DEPLOY_RENDER.md    # Guia de deploy
│       └── ...
├── layouts/                 # Layouts Nuxt
│   └── default.vue
├── pages/                   # Páginas da aplicação
│   ├── admin/
│   │   └── feedback-results.vue  # Dashboard de feedback (Admin)
│   ├── orders/
│   │   ├── index.vue       # Lista de pedidos
│   │   └── [id].vue        # Detalhes do pedido
│   ├── products/
│   │   ├── index.vue       # Catálogo
│   │   └── [id].vue        # Detalhes do produto
│   ├── profile/
│   │   ├── index.vue       # Perfil do usuário
│   │   ├── addresses.vue   # Gerenciar endereços
│   │   └── favorites.vue   # Produtos favoritos
│   ├── about.vue           # Sobre nós
│   ├── checkout.vue        # Finalizar pedido
│   ├── contact.vue         # Contato
│   ├── forgot-password.vue # Recuperar senha
│   ├── index.vue           # Home
│   ├── login.vue           # Login
│   ├── privacy.vue         # Privacidade
│   ├── reset-password.vue  # Redefinir senha
│   └── signup.vue          # Cadastro
├── plugins/                 # Plugins Nuxt
│   └── auth.client.ts      # Plugin de autenticação
├── public/                  # Arquivos públicos
│   ├── products/           # Imagens de produtos
│   └── ...
├── stores/                  # Stores Pinia
│   ├── auth.ts             # Store de autenticação
│   ├── cart.ts             # Store do carrinho
│   ├── clients.ts          # Store de clientes
│   ├── feedback.ts         # Store de feedback
│   ├── orders.ts           # Store de pedidos
│   ├── products.ts         # Store de produtos
│   └── storePublic.ts      # Store pública (sem auth)
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
- **`/products`** - Catálogo de produtos com filtros e busca
- **`/products/[id]`** - Detalhes do produto com avaliações
- **`/login`** - Autenticação via email e senha
- **`/signup`** - Cadastro com validação de senha
- **`/forgot-password`** - Recuperação de senha
- **`/reset-password`** - Redefinição de senha com token
- **`/checkout`** - Finalização do pedido
- **`/orders`** - Histórico de pedidos (usuário ou admin)
- **`/orders/[id]`** - Detalhes do pedido
- **`/profile`** - Perfil do usuário
- **`/profile/addresses`** - Gerenciamento de endereços
- **`/profile/favorites`** - Lista de produtos favoritos
- **`/admin/feedback-results`** - Dashboard de feedback (Admin only)
- **`/about`** - Sobre a empresa
- **`/contact`** - Formulário de contato

### 🧩 Componentes
- **`ProductCard`** - Card reutilizável de produto com ações
- **`ProductFormModal`** - Modal de criação/edição de produtos (Admin)
- **`FeaturedProducts`** - Grid de produtos em destaque
- **`CartModal`** - Modal do carrinho de compras
- **`AddressSelector`** - Seletor de endereços para checkout
- **`PasswordStrength`** - Indicador visual de força de senha
- **`FloatingButton`** - Botão flutuante para feedback
- **`FeedbackModal`** - Modal de envio de feedback
- **`StartSessionModal`** - Modal para iniciar sessão de teste
- **`TheHeader`** - Cabeçalho com navegação e menu responsivo
- **`TheFooter`** - Rodapé da aplicação com link de feedback

### 📦 Stores (Pinia)
- **`auth`** - Gerenciamento de autenticação, usuário e role (admin)
- **`cart`** - Estado do carrinho de compras
- **`products`** - Catálogo de produtos e categorias
- **`storePublic`** - Acesso público a produtos sem autenticação
- **`orders`** - Gerenciamento de pedidos (usuário e admin)
- **`clients`** - Dados do cliente e endereços
- **`feedback`** - Gerenciamento de sessões de teste e feedback

### 🔌 Composables
- **`useAuth()`** - Hook para autenticação e perfil
- **`useCart()`** - Hook para carrinho de compras
- **`useProducts()`** - Hook para produtos
- **`useStorePublic()`** - Hook para store pública (sem auth)
- **`useWishlist()`** - Hook para lista de favoritos
- **`useCompany()`** - Hook para informações da empresa
- **`useClientMounted()`** - Hook para controle de montagem no cliente
- **`useApi()`** - Hook genérico para API

### 🛠 Utilitários
- **`api.ts`** - Classe ApiService com todos os métodos da API
- **`types/api.ts`** - Tipos TypeScript completos da API

## 🔐 Autenticação

### Fluxo de Login
1. Usuário informa email e senha
2. Sistema valida credenciais
3. Sistema retorna token JWT e informações do usuário
4. Token é armazenado localmente
5. Requisições subsequentes usam o token
6. Sistema identifica se usuário é admin da empresa

### Fluxo de Cadastro
1. Usuário informa nome, WhatsApp, email e senha
2. Sistema valida força da senha (mínimo 8 caracteres, maiúscula, minúscula, número/especial)
3. Indicador visual mostra força da senha em tempo real
4. Após cadastro, usuário é automaticamente autenticado

### Recuperação de Senha
1. Usuário informa email
2. Sistema envia token por email
3. Usuário acessa link com token
4. Define nova senha com validação
5. Redirecionado para login

### Exemplo de Uso
```typescript
import { useAuth } from '~/composables/useAuth'

const { login, signup, user, isAuthenticated, isCompanyAdmin } = useAuth()

// Login
await login('user@example.com', 'senha123')

// Cadastro
await signup({
  name: 'João Silva',
  whatsapp: '+5511999999999',
  email: 'joao@example.com',
  password: 'SenhaForte@123'
})

// Usuário autenticado
if (isAuthenticated.value) {
  console.log('Bem-vindo,', user.value.name)
  
  // Verificar se é admin
  if (isCompanyAdmin.value) {
    console.log('Usuário é administrador')
  }
}
```

## 📡 Integração com API

A aplicação consome uma API REST completa. Consulte a [documentação de integração](docs/public/API_INTEGRATION.md) para mais detalhes.

### Endpoints Principais
- **Auth**: `/auth/login`, `/auth/forgot-password`, `/auth/reset-password`, `/auth/me`
- **Users**: `/users/consumer`, `/users/profile`, `/users/change-password`
- **Products**: `/store/products`, `/store/products/{id}`, `/products` (create/update - admin)
- **Reviews**: `/reviews`, `/reviews?productId={id}`
- **Cart**: `/cart/{clientId}`, `/cart/{clientId}/add`
- **Orders**: `/orders`, `/orders/{id}`, `/orders/company/{companyId}` (admin)
- **Clients**: `/clients`, `/clients/addresses`
- **Feedback**: `/feedbacks/session/start`, `/feedbacks`, `/feedbacks/session/results` (admin)

## 🔐 Variáveis de Ambiente
```env
# API Configuration
NUXT_PUBLIC_API_BASE=https://vendabela.onrender.com/app/v1
NUXT_PUBLIC_COMPANY_ID=seu-company-id-aqui

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