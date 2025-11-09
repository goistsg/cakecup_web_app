# 🏪 Store Pública - Produtos sem Autenticação

Este documento explica o módulo de **Store Pública** que permite acessar produtos e categorias **sem necessidade de autenticação**.

---

## 📋 Visão Geral

A Store Pública (`storePublic`) foi criada para permitir que usuários **não autenticados** possam:
- ✅ Visualizar produtos
- ✅ Filtrar por categoria
- ✅ Buscar produtos
- ✅ Ver produtos em destaque
- ✅ Navegar por categorias

---

## 🎯 Motivação

### Antes (com autenticação obrigatória):
```
❌ Usuário precisa fazer login para ver produtos
❌ Experiência ruim para novos visitantes
❌ Barreira de entrada alta
```

### Depois (com store pública):
```
✅ Usuários podem ver produtos sem login
✅ Experiência melhor para visitantes
✅ Login só necessário para checkout
✅ Aumenta conversão
```

---

## 📁 Arquivos Criados

### 1. `stores/storePublic.ts`
Store Pinia com estado e ações para produtos públicos.

### 2. `composables/useStorePublic.ts`
Composable para facilitar uso da store.

---

## 🔧 Como Usar

### Básico

```typescript
import { useStorePublic } from '~/composables/useStorePublic'

const { 
  products,          // Todos os produtos
  categories,        // Todas as categorias
  loading,           // Estado de carregamento
  error,             // Mensagem de erro
  fetchProducts,     // Buscar produtos
  fetchCategories    // Buscar categorias
} = useStorePublic()

// Carregar produtos
await fetchProducts()

// Carregar categorias
await fetchCategories()
```

### Com Filtros

```typescript
const { 
  filteredProducts,      // Produtos filtrados
  setSelectedCategory,   // Filtrar por categoria
  setSearchQuery,        // Buscar por texto
  setPriceRange,         // Filtrar por preço
  setSortBy,             // Ordenar
  clearFilters           // Limpar filtros
} = useStorePublic()

// Filtrar por categoria
setSelectedCategory('categoria-id')

// Buscar por texto
setSearchQuery('chocolate')

// Filtrar por preço
setPriceRange(5, 15)

// Ordenar
setSortBy('price') // 'name' | 'price' | 'newest'

// Limpar tudo
clearFilters()
```

### Com Paginação

```typescript
const { 
  paginatedProducts,  // Produtos da página atual
  currentPage,        // Página atual
  totalPages,         // Total de páginas
  setCurrentPage,     // Ir para página
  nextPage,           // Próxima página
  previousPage        // Página anterior
} = useStorePublic()

// Navegar
setCurrentPage(2)
nextPage()
previousPage()
```

---

## 📊 Estado da Store

```typescript
interface StorePublicState {
  // Produtos
  products: Product[]
  featuredProducts: Product[]
  currentProduct: Product | null
  
  // Categorias
  categories: Category[]
  currentCategory: Category | null
  
  // Filtros
  searchQuery: string
  selectedCategoryId: string | null
  priceRange: { min: number; max: number } | null
  sortBy: 'name' | 'price' | 'newest' | null
  
  // Estados
  loading: boolean
  error: string | null
  
  // Paginação
  currentPage: number
  totalPages: number
  itemsPerPage: number
}
```

---

## 🎨 Getters

### `filteredProducts`
Produtos filtrados baseado nos critérios selecionados.

```typescript
const { filteredProducts } = useStorePublic()
// Aplica: categoria, busca, preço, ordenação
```

### `paginatedProducts`
Produtos da página atual.

```typescript
const { paginatedProducts, currentPage } = useStorePublic()
// Retorna apenas produtos da página atual
```

### `availableProducts`
Produtos disponíveis (em estoque e ativos).

```typescript
const { availableProducts } = useStorePublic()
// Filtra: isActive = true && stock > 0
```

### `highlightedProducts`
Produtos em destaque.

```typescript
const { highlightedProducts } = useStorePublic()
// Filtra: isHighlighted = true && isActive = true
```

### `activeCategories`
Categorias ativas.

```typescript
const { activeCategories } = useStorePublic()
// Filtra: isActive = true
```

---

## 🔄 Actions

### `fetchProducts(companyId?)`
Busca todos os produtos (público).

```typescript
await fetchProducts()
// ou com company
await fetchProducts('company-id')
```

### `fetchProduct(id)`
Busca produto por ID (público).

```typescript
const product = await fetchProduct('product-id')
```

### `fetchCategories(companyId?)`
Busca todas as categorias (público).

```typescript
await fetchCategories()
```

### `fetchCategory(id)`
Busca categoria por ID (público).

```typescript
const category = await fetchCategory('category-id')
```

### `fetchProductsByCategory(categoryId, companyId?)`
Busca produtos de uma categoria específica.

```typescript
const products = await fetchProductsByCategory('category-id')
```

---

## 📄 Exemplo Completo - Página de Produtos

```vue
<template>
  <div class="products-page">
    <!-- Filtros -->
    <div class="filters">
      <select v-model="selectedCategory" @change="onCategoryChange">
        <option value="">Todas as categorias</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">
          {{ cat.name }}
        </option>
      </select>
      
      <input 
        v-model="search" 
        @input="onSearchChange"
        placeholder="Buscar produtos..."
      />
    </div>

    <!-- Loading -->
    <div v-if="loading">Carregando...</div>

    <!-- Error -->
    <div v-else-if="error">{{ error }}</div>

    <!-- Produtos -->
    <div v-else class="products-grid">
      <ProductCard 
        v-for="product in paginatedProducts" 
        :key="product.id" 
        :product="product" 
      />
    </div>

    <!-- Paginação -->
    <div class="pagination">
      <button @click="previousPage" :disabled="currentPage === 1">
        Anterior
      </button>
      <span>Página {{ currentPage }} de {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">
        Próxima
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useStorePublic } from '~/composables/useStorePublic'

const { 
  products,
  categories,
  paginatedProducts,
  loading,
  error,
  currentPage,
  totalPages,
  fetchProducts,
  fetchCategories,
  setSelectedCategory,
  setSearchQuery,
  nextPage,
  previousPage
} = useStorePublic()

const selectedCategory = ref('')
const search = ref('')

onMounted(async () => {
  await Promise.all([
    fetchProducts(),
    fetchCategories()
  ])
})

const onCategoryChange = () => {
  setSelectedCategory(selectedCategory.value || null)
}

const onSearchChange = () => {
  setSearchQuery(search.value)
}
</script>
```

---

## 🔄 Integração com API

### Endpoints Usados (Públicos)

```
GET /products              → Listar produtos
GET /products/{id}         → Buscar produto
GET /categories            → Listar categorias
GET /categories/{id}       → Buscar categoria
```

### Sem Autenticação

Todas as requisições são feitas **sem token JWT**:

```typescript
const response = await fetch(`${apiBase}/products`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    // Sem Authorization header!
  },
})
```

---

## 🆚 Comparação: Store Pública vs Store de Produtos

| Recurso | Store Pública | Store de Produtos |
|---------|---------------|-------------------|
| **Autenticação** | ❌ Não requer | ✅ Requer |
| **Produtos** | ✅ Visualizar | ✅ Visualizar + Gerenciar |
| **Categorias** | ✅ Visualizar | ✅ Visualizar + Gerenciar |
| **Filtros** | ✅ Sim | ✅ Sim |
| **Paginação** | ✅ Sim | ❌ Não |
| **Busca** | ✅ Sim | ❌ Não |
| **Carrinho** | ❌ Não | ✅ Sim |
| **Uso** | Páginas públicas | Admin/Dashboard |

---

## 📱 Páginas que Usam

### ✅ Atualizadas para Store Pública

- `/products` - Catálogo de produtos
- `/` - Home (produtos em destaque)

### 🔄 Podem ser Atualizadas

- `/about` - Sobre (produtos em destaque)
- `/contact` - Contato (produtos em destaque)

---

## 🎯 Benefícios

### 1. ✅ Melhor UX
Usuários podem explorar produtos antes de fazer login.

### 2. ✅ Maior Conversão
Reduz barreiras de entrada para novos clientes.

### 3. ✅ SEO Friendly
Produtos públicos são indexáveis por motores de busca.

### 4. ✅ Performance
Cache de produtos públicos pode ser mais agressivo.

### 5. ✅ Escalabilidade
Separação clara entre público e privado.

---

## 🔒 Segurança

### O que é Público
✅ Visualizar produtos
✅ Visualizar categorias
✅ Filtrar e buscar

### O que Requer Autenticação
🔒 Adicionar ao carrinho (servidor)
🔒 Fazer pedidos
🔒 Ver histórico de pedidos
🔒 Gerenciar endereços

---

## 🚀 Próximos Passos

### 1. Carrinho Local
Implementar carrinho local (localStorage) para usuários não autenticados.

```typescript
// TODO: Implementar
const addToLocalCart = (product: Product, quantity: number) => {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]')
  cart.push({ product, quantity })
  localStorage.setItem('cart', JSON.stringify(cart))
}
```

### 2. Sincronização
Sincronizar carrinho local com servidor após login.

```typescript
// TODO: Implementar
const syncLocalCart = async () => {
  const localCart = JSON.parse(localStorage.getItem('cart') || '[]')
  for (const item of localCart) {
    await addItem(item.product.id, item.quantity)
  }
  localStorage.removeItem('cart')
}
```

### 3. Favoritos Locais
Permitir favoritar produtos sem login.

---

## 📚 Documentação Relacionada

- [`docs/API_INTEGRATION.md`](API_INTEGRATION.md) - Integração com API
- [`README.md`](../README.md) - Documentação geral
- [`types/api.ts`](../types/api.ts) - Tipos TypeScript

---

**Última atualização**: 09/11/2024  
**Versão**: 1.0.0

