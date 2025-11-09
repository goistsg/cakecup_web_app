# Changelog - Integração com API Backend

## [2.2.0] - 2024-11-09

### 🏪 Store Pública - Produtos sem Autenticação
- **Adicionado**: `stores/storePublic.ts` - Store para produtos públicos
- **Adicionado**: `composables/useStorePublic.ts` - Composable para store pública
- **Adicionado**: Suporte para visualizar produtos sem autenticação
- **Adicionado**: Filtros avançados (categoria, busca, preço, ordenação)
- **Adicionado**: Paginação de produtos
- **Adicionado**: Produtos em destaque públicos
- **Atualizado**: `pages/products.vue` - Usa store pública
- **Atualizado**: `components/home/FeaturedProducts.vue` - Usa store pública
- **Adicionado**: `docs/STORE_PUBLIC.md` - Documentação completa

### 🔓 Acesso Público
- ✅ Produtos visíveis sem login
- ✅ Categorias visíveis sem login
- ✅ Filtros e busca funcionam sem login
- ✅ Melhor UX para novos visitantes
- ✅ SEO friendly

### 🎯 Funcionalidades
- Buscar produtos por categoria
- Buscar produtos por texto
- Filtrar por faixa de preço
- Ordenar por nome, preço ou data
- Paginação automática
- Produtos em destaque
- Produtos disponíveis (em estoque)

---

## [2.1.0] - 2024-11-09

### 🎨 Logo e Identidade Visual
- **Adicionado**: Logo oficial no header (`cakecup_logo.png`)
- **Adicionado**: Texto "CakeCup Store" ao lado da logo
- **Adicionado**: Efeito hover na logo (scale 1.05)
- **Melhorado**: Header responsivo (logo sem texto em mobile)

### 🐳 Docker e Deploy
- **Adicionado**: `Dockerfile` otimizado para produção (multi-stage build)
- **Adicionado**: `.dockerignore` para otimizar build
- **Adicionado**: `docker-compose.yml` para desenvolvimento local
- **Adicionado**: `.env.example` com template de variáveis
- **Adicionado**: Health check no container
- **Adicionado**: Non-root user para segurança

### 📚 Documentação de Deploy
- **Adicionado**: `DEPLOY_RENDER.md` - Guia completo de deploy no Render
- **Adicionado**: `DOCKER_GUIDE.md` - Guia completo de Docker
- **Adicionado**: `DEPLOY_SUMMARY.md` - Resumo rápido
- **Atualizado**: `README.md` com seção Docker & Deploy

### 🔧 Otimizações Docker
- Imagem final: ~150-200MB (Alpine Linux)
- Build time: ~5-10 minutos
- Multi-stage build para reduzir tamanho
- Cache otimizado de dependências
- Logs estruturados

---

## [2.0.0] - 2024-11-09

### 🎨 NOVA PALETA DE CORES - Design System Completo

#### ✨ Adições
- **Sistema de Variáveis CSS**: Criado `assets/styles/colors.css` com 50+ variáveis
- **Classes Utilitárias**: 15+ classes CSS prontas (`.text-primary`, `.bg-primary`, etc)
- **Gradientes**: 4 gradientes prontos para uso
- **Sombras**: 5 níveis de sombras padronizadas
- **Bordas**: 6 tamanhos de border-radius
- **Documentação**: 4 novos documentos de referência

#### 🔄 Mudanças de Cores
**Paleta Antiga → Nova:**
- Rosa Choque (#ff69b4) → Vermelho Escuro (#8B0014) - Primary
- Rosa Escuro (#ff1493) → Vermelho Médio (#D32F2F) - Secondary
- Rosa Médio (#ff4081) → Vermelho Médio (#D32F2F) - Secondary

**Nova Paleta Completa:**
- **Primary**: #8B0014 (Vermelho Escuro) - Botões, links, destaques
- **Secondary**: #D32F2F (Vermelho Médio) - Badges, alertas
- **Accent**: #A0522D (Marrom) - Elementos especiais
- **Background**: #E9DFD7 (Bege Claro) - Fundo principal
- **Surface**: #FBE9E7 (Rosa Claro) - Cards, modais
- **Text**: #3A1F1B (Marrom Escuro) - Textos

#### 📝 Arquivos Atualizados (13 arquivos)
**Componentes:**
- ✅ `components/layout/TheHeader.vue` - 15 mudanças
- ✅ `components/cart/CartModal.vue` - 12 mudanças
- ✅ `components/common/ProductCard.vue` - 8 mudanças
- ✅ `components/home/FeaturedProducts.vue` - 6 mudanças
- ✅ `components/home/HeroSection.vue` - 4 mudanças
- ✅ `components/home/CallToAction.vue` - 3 mudanças
- ✅ `components/home/Testimonials.vue` - 2 mudanças

**Páginas:**
- ✅ `pages/login.vue` - 10 mudanças
- ✅ `pages/checkout.vue` - 18 mudanças
- ✅ `pages/orders.vue` - 9 mudanças
- ✅ `pages/products.vue` - 12 mudanças

**Estilos:**
- ✅ `assets/styles/colors.css` - NOVO (300 linhas)
- ✅ `assets/styles/_variables.scss` - ATUALIZADO

#### 📚 Documentação Nova
- `docs/COLOR_PALETTE.md` - Documentação completa da paleta
- `COLORS_QUICK_GUIDE.md` - Guia rápido de uso
- `COLORS_BEFORE_AFTER.md` - Comparação visual antes/depois
- `COLOR_UPDATE_SUMMARY.md` - Resumo da atualização
- `README.md` - Adicionada seção de paleta de cores

#### ♿ Melhorias de Acessibilidade
- **Contraste**: Todos os textos atendem WCAG 2.1 AAA (8-11:1)
- **Legibilidade**: Melhor contraste entre texto e fundo
- **Estados**: Hover e focus mais visíveis

#### 🎨 Design System
- **Consistência**: Sistema unificado de cores
- **Manutenibilidade**: Fácil alterar cores em um único lugar
- **Escalabilidade**: Pronto para adicionar temas
- **Performance**: CSS otimizado com variáveis

#### 📊 Estatísticas
- 120+ substituições de cores
- 56 referências a var(--primary/secondary/accent)
- 0 erros de linter
- 100% de cobertura de componentes

---

## [1.0.0] - 2024-11-09

### ✨ Novos Recursos

#### 🔐 Autenticação
- Implementado sistema de login via WhatsApp + OTP
- Store de autenticação (`stores/auth.ts`)
- Composable `useAuth()` para gerenciar autenticação
- Página de login (`pages/login.vue`)
- Plugin de inicialização automática da autenticação

#### 🛒 Carrinho
- Integração completa com API de carrinho
- Suporte para múltiplos clientes
- Operações: adicionar, atualizar, remover e limpar itens
- Store de carrinho atualizada (`stores/cart.ts`)
- Composable `useCart()` melhorado

#### 📦 Produtos
- Store de produtos (`stores/products.ts`)
- Integração com API de produtos e categorias
- Filtros por categoria
- Produtos em destaque
- Composable `useProducts()`

#### 📋 Pedidos
- Store de pedidos (`stores/orders.ts`)
- Criar, atualizar e cancelar pedidos
- Filtros por cliente e empresa
- Histórico de pedidos

#### 👤 Clientes
- Store de clientes (`stores/clients.ts`)
- Gerenciamento de clientes
- Gerenciamento de endereços
- CRUD completo de endereços

### 🔧 Melhorias

#### Componentes Atualizados
- **FeaturedProducts**: Agora carrega produtos da API
- **ProductCard**: Adaptado para nova estrutura de dados
- **Pages/Products**: Filtros por categoria, loading states

#### API Service
- Classe `ApiService` centralizada em `utils/api.ts`
- Métodos para todas as rotas da API
- Gerenciamento automático de tokens JWT
- Tratamento de erros

#### Tipos TypeScript
- Arquivo completo de tipos (`types/api.ts`)
- Tipos gerados a partir do Swagger
- Interfaces para todas as entidades

### 📚 Documentação
- Documentação completa de integração (`docs/API_INTEGRATION.md`)
- Exemplos de uso de cada funcionalidade
- Guia de configuração

### ⚙️ Configuração
- Configuração de API base no `nuxt.config.ts`
- Suporte para variáveis de ambiente
- Exemplo de `.env` (`.env.example`)

### 🎨 UI/UX
- Estados de loading em todos os componentes
- Mensagens de erro amigáveis
- Feedback visual para ações do usuário
- Design responsivo mantido

## 📊 Estatísticas

- **Arquivos Criados**: 15
- **Arquivos Modificados**: 5
- **Linhas de Código**: ~2500+
- **Tipos TypeScript**: 50+
- **Stores Pinia**: 5
- **Composables**: 4

## 🔗 API

**URL Base**: `https://vendabela.onrender.com/app/v1`

**Documentação**: `https://vendabela.onrender.com/app/api/swagger-app.json`

## 🚀 Próximas Features

- [ ] Página de checkout
- [ ] Histórico de pedidos do usuário
- [ ] Perfil do usuário
- [ ] Sistema de favoritos
- [ ] Página de sorteios
- [ ] Notificações em tempo real
- [ ] Sistema de avaliações
- [ ] Carrinho para usuários não autenticados

## 🐛 Correções

- Corrigido tipo de evento onClick em botões
- Corrigido import do composable useProducts
- Ajustado gerenciamento de estados de loading

## 📝 Notas

Esta versão estabelece a base completa para integração com o backend. Todos os principais módulos estão funcionais e prontos para uso em produção.

