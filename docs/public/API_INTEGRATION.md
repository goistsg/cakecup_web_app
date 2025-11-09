# Integração com a API Backend

Este documento descreve como o frontend está integrado com a API backend do CakeCup.

## 🔗 URL da API

A API está hospedada em: `https://vendabela.onrender.com/app/v1`

Documentação Swagger: `https://vendabela.onrender.com/app/api/swagger-app.json`

## 📁 Estrutura de Arquivos

### Tipos TypeScript
- `types/api.ts` - Tipos TypeScript gerados a partir do Swagger da API

### Serviço de API
- `utils/api.ts` - Classe ApiService com métodos para todas as rotas da API

### Stores (Pinia)
- `stores/auth.ts` - Gerenciamento de autenticação
- `stores/cart.ts` - Gerenciamento do carrinho
- `stores/products.ts` - Gerenciamento de produtos
- `stores/orders.ts` - Gerenciamento de pedidos
- `stores/clients.ts` - Gerenciamento de clientes

### Composables
- `composables/useAuth.ts` - Hook para autenticação
- `composables/useCart.ts` - Hook para carrinho
- `composables/useProducts.ts` - Hook para produtos
- `composables/useApi.ts` - Hook genérico para API

### Plugins
- `plugins/auth.client.ts` - Inicializa a autenticação ao carregar o app

## 🔐 Autenticação

A API usa autenticação via WhatsApp com OTP:

### Fluxo de Login

1. **Enviar WhatsApp**
```typescript
const { login } = useAuth()
await login('+5511999999999')
```

2. **Verificar OTP**
```typescript
const { verifyOtp } = useAuth()
await verifyOtp('+5511999999999', '123456')
// Token JWT é armazenado automaticamente
```

3. **Verificar Status de Autenticação**
```typescript
const { isAuthenticated, user } = useAuth()

if (isAuthenticated.value) {
  console.log('Usuário:', user.value)
}
```

4. **Logout**
```typescript
const { logout } = useAuth()
await logout()
```

## 🛒 Carrinho

### Configurar Cliente
Antes de usar o carrinho, é necessário definir o clientId:

```typescript
const { setClientId } = useCart()
setClientId(user.value.id) // ou clientId específico
```

### Operações do Carrinho

**Buscar Carrinho:**
```typescript
const { fetchCart, cart, items } = useCart()
await fetchCart()
```

**Adicionar Item:**
```typescript
const { addItem } = useCart()
await addItem(productId, quantity, variant?)
```

**Atualizar Quantidade:**
```typescript
const { updateQuantity } = useCart()
await updateQuantity(itemId, newQuantity)
```

**Remover Item:**
```typescript
const { removeItem } = useCart()
await removeItem(itemId)
```

**Limpar Carrinho:**
```typescript
const { clearCart } = useCart()
await clearCart()
```

## 📦 Produtos

### Listar Produtos

```typescript
const { products, fetchProducts } = useProducts()
await fetchProducts(companyId?, categoryId?)
```

### Produtos em Destaque

```typescript
const { featuredProducts } = useProducts()
// Retorna os 6 primeiros produtos ativos
```

### Filtrar por Categoria

```typescript
const { setSelectedCategory, filteredProducts } = useProducts()
setSelectedCategory(categoryId)
```

### Buscar Produto Individual

```typescript
const { fetchProduct, selectedProduct } = useProducts()
await fetchProduct(productId)
```

## 📋 Pedidos

### Criar Pedido

```typescript
import { useOrdersStore } from '~/stores/orders'

const ordersStore = useOrdersStore()
await ordersStore.createOrder({
  clientId: 'uuid',
  companyId: 'uuid',
  items: [
    { productId: 'uuid', quantity: 2 }
  ],
  deliveryAddressId: 'uuid',
  paymentMethod: 'PIX',
  notes: 'Sem cebola'
})
```

### Listar Pedidos

```typescript
await ordersStore.fetchOrders(clientId?, companyId?)
```

### Atualizar Status do Pedido

```typescript
await ordersStore.updateOrder(orderId, {
  status: 'CONFIRMED'
})
```

## 👤 Clientes

### Criar Cliente

```typescript
import { useClientsStore } from '~/stores/clients'

const clientsStore = useClientsStore()
await clientsStore.createClient({
  name: 'João Silva',
  whatsapp: '+5511999999999',
  email: 'joao@example.com',
  companyId: 'uuid'
})
```

### Gerenciar Endereços

```typescript
// Buscar endereços
await clientsStore.fetchAddresses(clientId)

// Criar endereço
await clientsStore.createAddress({
  street: 'Rua das Flores',
  number: '123',
  city: 'São Paulo',
  state: 'SP',
  zipCode: '01310-100',
  clientId: 'uuid'
})

// Atualizar endereço
await clientsStore.updateAddress(addressId, data)

// Deletar endereço
await clientsStore.deleteAddress(addressId)
```

## 🎨 Componentes Adaptados

### FeaturedProducts
Componente que exibe produtos em destaque na home page. Carrega produtos da API automaticamente.

### ProductCard
Componente reutilizável para exibir um produto individual com imagem, preço e botão de adicionar ao carrinho.

### Pages/Products
Página de listagem de produtos com filtros por categoria e funcionalidade de adicionar ao carrinho.

### Pages/Login
Página de autenticação via WhatsApp + OTP.

## ⚙️ Configuração

### Variáveis de Ambiente

Você pode configurar a URL base da API no arquivo `.env`:

```env
NUXT_PUBLIC_API_BASE=https://vendabela.onrender.com/app/v1
```

### Nuxt Config

A configuração está em `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBase: 'https://vendabela.onrender.com/app/v1',
    }
  }
})
```

## 🔄 Estado de Loading e Erros

Todas as stores e composables incluem estados de loading e error:

```typescript
const { loading, error, clearError } = useProducts()

if (loading.value) {
  // Mostrar spinner
}

if (error.value) {
  // Mostrar mensagem de erro
  console.error(error.value)
  clearError() // Limpar erro quando necessário
}
```

## 🎯 Próximos Passos

1. **Implementar Carrinho Local**: Para usuários não autenticados
2. **Página de Checkout**: Finalização de pedidos
3. **Histórico de Pedidos**: Visualização de pedidos anteriores
4. **Perfil do Usuário**: Gerenciamento de dados pessoais
5. **Favoritos**: Sistema de produtos favoritos
6. **Sorteios**: Página de sorteios ativos

## 📱 Suporte

Para dúvidas ou problemas com a integração, consulte a documentação Swagger da API ou entre em contato com o time de backend.

