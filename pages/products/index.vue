<template>
  <div class="produtos-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <h1>Nossos Cupcakes</h1>
        <p class="subtitle">Descubra nossos sabores artesanais</p>
      </div>
    </section>

    <!-- Filtros Sticky -->
    <section class="filters-section">
      <div class="filters-container">
        <!-- Busca -->
        <div class="filter-group search-group">
          <i class="fas fa-search"></i>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Buscar cupcakes..."
            class="search-input"
          >
        </div>

        <!-- Categoria -->
        <div class="filter-group">
          <select v-model="categoriaAtual" class="filter-select">
            <option value="">Todas as categorias</option>
            <option 
              v-for="category in categories" 
              :key="category" 
              :value="category"
            >
              {{ category }}
            </option>
          </select>
        </div>

        <!-- Ordenação -->
        <div class="filter-group">
          <select v-model="sortBy" class="filter-select">
            <option value="">Ordenar por</option>
            <option value="name">Nome (A-Z)</option>
            <option value="name-desc">Nome (Z-A)</option>
            <option value="price-asc">Menor preço</option>
            <option value="price-desc">Maior preço</option>
            <option value="newest">Mais recentes</option>
            <option value="oldest">Mais antigos</option>
          </select>
        </div>

        <!-- Botão Criar Produto (Admin) -->
        <button 
          v-if="isMounted && isCompanyAdmin"
          @click="openCreateModal"
          class="btn-create-product"
        >
          <i class="fas fa-plus-circle"></i>
          Novo Produto
        </button>

        <!-- Limpar filtros -->
        <button 
          v-if="hasActiveFilters" 
          @click="clearAllFilters"
          class="clear-filters-btn"
        >
          <i class="fas fa-times"></i>
          Limpar
        </button>
      </div>

      <!-- Resultados -->
      <div class="results-info">
        <span class="results-count">
          {{ filteredProducts.length }} {{ filteredProducts.length === 1 ? 'produto' : 'produtos' }}
        </span>
        <span v-if="hasActiveFilters" class="active-filters">
          Filtros ativos
        </span>
      </div>
    </section>

    <!-- Loading state -->
    <div v-if="loading" class="loading-state">
      <p>Carregando produtos...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="() => fetchProducts()">Tentar novamente</button>
    </div>

    <!-- Products grid -->
    <section v-if="!loading && !error && isMounted" class="produtos-grid">
      <!-- Mensagem quando não há produtos -->
      <div v-if="filteredProducts.length === 0" class="no-products">
        <i class="fas fa-search"></i>
        <h3>Nenhum produto encontrado</h3>
        <p>Tente ajustar os filtros ou buscar por outro termo</p>
        <button @click="clearAllFilters" class="btn-primary">
          Limpar filtros
        </button>
      </div>

      <!-- Grid de produtos usando ProductCard unificado -->
      <ProductCard 
        v-for="product in filteredProducts" 
        :key="product.id" 
        :product="product"
        variant="complete"
        :is-favorite="isFavorite(product.id)"
        :show-stock-badge="true"
        :show-favorite-button="!!user && isMounted"
        :show-quantity-control="true"
        :show-category="true"
        :show-sku="true"
        @toggle-favorite="toggleFavoriteProduct(product.id)"
        @add-to-cart="adicionarAoCarrinho"
      />
    </section>

    <!-- Botão flutuante do carrinho -->
    <transition name="cart-float">
      <button 
        v-if="totalItems > 0" 
        class="cart-float-btn"
        @click="openCart"
      >
        <div class="cart-float-icon">
          <i class="fas fa-shopping-cart"></i>
          <span class="cart-float-badge">{{ totalItems }}</span>
        </div>
        <div class="cart-float-info">
          <span class="cart-float-label">Ver carrinho</span>
          <span class="cart-float-total">{{ formattedTotal }}</span>
        </div>
      </button>
    </transition>

    <!-- Product Form Modal (Admin) -->
    <ProductFormModal
      v-if="isMounted && isCompanyAdmin"
      :is-open="showProductModal"
      :product="null"
      :company-id="companyId"
      @close="showProductModal = false"
      @success="handleProductSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import { useCart } from '~/composables/useCart'
import { useStorePublic } from '~/composables/useStorePublic'
import { useAuth } from '~/composables/useAuth'
import { useCompany } from '~/composables/useCompany'
import { useWishlist } from '~/composables/useWishlist'
import { useClientMounted } from '~/composables/useClientMounted'
import ProductCard from '~/components/common/ProductCard.vue'
import ProductFormModal from '~/components/admin/ProductFormModal.vue'
import type { Product } from '~/types/api'

// Client mounted state
const { isMounted } = useClientMounted()

// Auth state
const { user, isCompanyAdmin } = useAuth()

// Company
const { companyId } = useCompany()

// Carrinho (pode funcionar sem autenticação)
const { 
  items: cartItems, 
  totalItems, 
  formattedTotal, 
  addItem, 
  openCart 
} = useCart()

// Store pública (sem autenticação necessária)
const { 
  products, 
  categories,
  loading, 
  error, 
  fetchProducts,
  fetchCategories,
  setSelectedCategory,
  filteredProducts
} = useStorePublic()

// Wishlist/Favoritos
const { isFavorite, toggleFavorite, fetchFavorites } = useWishlist()
const togglingFavorite = ref<string | null>(null)

// Product Form Modal
const showProductModal = ref(false)

const openCreateModal = () => {
  showProductModal.value = true
}

const handleProductSuccess = async () => {
  // Reload products
  await fetchProducts()
  alert('Produto salvo com sucesso!')
}

const categoriaAtual = ref('')
const searchQuery = ref('')
const sortBy = ref('')
let searchTimeout: NodeJS.Timeout | null = null

// Computed para verificar se há filtros ativos
const hasActiveFilters = computed(() => {
  return categoriaAtual.value !== '' || searchQuery.value !== '' || sortBy.value !== ''
})

// Mapear valores do sortBy para o formato da API
const getOrderByParam = (sortValue: string): string | undefined => {
  const orderByMap: Record<string, string> = {
    'name': 'name:asc',
    'name-desc': 'name:desc',
    'price-asc': 'salePrice:asc',
    'price-desc': 'salePrice:desc',
    'newest': 'createdAt:desc',
    'oldest': 'createdAt:asc'
  }
  return sortValue ? orderByMap[sortValue] : undefined
}

// Função auxiliar para buscar produtos com os filtros atuais
const loadProductsWithFilters = async () => {
  const orderBy = getOrderByParam(sortBy.value)
  await fetchProducts(
    companyId.value,
    categoriaAtual.value || undefined,
    searchQuery.value || undefined,
    orderBy
  )
}

// Limpar todos os filtros
const clearAllFilters = async () => {
  categoriaAtual.value = ''
  searchQuery.value = ''
  sortBy.value = ''
  setSelectedCategory(null)
  clearSavedFilters()
  await fetchProducts(companyId.value)
}

// Restaurar filtros e scroll do sessionStorage
const restoreFiltersAndScroll = () => {
  if (process.client) {
    const savedFilters = sessionStorage.getItem('products_filters')
    const savedScroll = sessionStorage.getItem('products_scroll')
    
    if (savedFilters) {
      try {
        const filters = JSON.parse(savedFilters)
        categoriaAtual.value = filters.categoria || ''
        searchQuery.value = filters.search || ''
        sortBy.value = filters.sortBy || ''
      } catch (err) {
        console.error('Erro ao restaurar filtros:', err)
      }
    }
    
    return savedScroll ? parseInt(savedScroll) : 0
  }
  return 0
}

// Salvar filtros e scroll no sessionStorage
const saveFiltersAndScroll = () => {
  if (process.client) {
    const filters = {
      categoria: categoriaAtual.value,
      search: searchQuery.value,
      sortBy: sortBy.value
    }
    sessionStorage.setItem('products_filters', JSON.stringify(filters))
    sessionStorage.setItem('products_scroll', window.scrollY.toString())
  }
}

// Limpar filtros salvos
const clearSavedFilters = () => {
  if (process.client) {
    sessionStorage.removeItem('products_filters')
    sessionStorage.removeItem('products_scroll')
  }
}

// Listener de scroll para salvar posição periodicamente
let scrollSaveTimer: NodeJS.Timeout | null = null
const handleScroll = () => {
  if (scrollSaveTimer) {
    clearTimeout(scrollSaveTimer)
  }
  scrollSaveTimer = setTimeout(() => {
    if (process.client) {
      sessionStorage.setItem('products_scroll', window.scrollY.toString())
    }
  }, 200)
}

// Carregar produtos e categorias quando o componente for montado
onMounted(async () => {
  try {
    // Restaurar filtros salvos
    const savedScroll = restoreFiltersAndScroll()
    
    // Buscar produtos e categorias da loja pública
    // Se temos filtros restaurados, usamos loadProductsWithFilters
    if (categoriaAtual.value || searchQuery.value || sortBy.value) {
      await Promise.all([
        loadProductsWithFilters(),
        fetchCategories()
      ])
    } else {
      await Promise.all([
        fetchProducts(),
        fetchCategories()
      ])
    }

    // Buscar favoritos se o usuário estiver autenticado
    if (user.value?.id) {
      try {
        await fetchFavorites()
      } catch (err) {
        console.error('Erro ao carregar favoritos:', err)
      }
    }
    
    // Restaurar posição de scroll
    if (savedScroll > 0) {
      setTimeout(() => {
        window.scrollTo({ top: savedScroll, behavior: 'instant' })
      }, 100)
    }
    
    // Adicionar listener de scroll
    if (process.client) {
      window.addEventListener('scroll', handleScroll, { passive: true })
    }
  } catch (err) {
    console.error('Erro ao carregar dados:', err)
  }
})

// Observar mudanças nos filtros e recarregar produtos
watch(categoriaAtual, async (newCategory) => {
  setSelectedCategory(newCategory || null)
  await loadProductsWithFilters()
  saveFiltersAndScroll()
})

// Debounce para a busca (aguarda 500ms após parar de digitar)
watch(searchQuery, async (newQuery) => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  
  searchTimeout = setTimeout(async () => {
    await loadProductsWithFilters()
    saveFiltersAndScroll()
  }, 500)
})

watch(sortBy, async (newSort) => {
  await loadProductsWithFilters()
  saveFiltersAndScroll()
})

// Salvar filtros antes de sair da página e limpar listeners
onBeforeUnmount(() => {
  saveFiltersAndScroll()
  
  // Limpar listener de scroll
  if (process.client) {
    window.removeEventListener('scroll', handleScroll)
  }
  
  // Limpar timers
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  if (scrollSaveTimer) {
    clearTimeout(scrollSaveTimer)
  }
})

const toggleFavoriteProduct = async (productId: string) => {
  try {
    // Verificar autenticação
    if (!user.value?.id) {
      alert('Por favor, faça login para adicionar aos favoritos')
      await navigateTo('/login?redirect=/products')
      return
    }

    togglingFavorite.value = productId
    const added = await toggleFavorite(productId)
    
    // Feedback visual
    if (added) {
      // Produto adicionado aos favoritos
      console.log('Produto adicionado aos favoritos')
    } else {
      // Produto removido dos favoritos
      console.log('Produto removido dos favoritos')
    }
  } catch (err: any) {
    console.error('Erro ao favoritar produto:', err)
    if (err.statusCode === 401) {
      alert('Sessão expirada. Por favor, faça login novamente.')
      await navigateTo('/login?redirect=/products')
    } else {
      alert(err.message || 'Erro ao favoritar produto')
    }
  } finally {
    togglingFavorite.value = null
  }
}

const adicionarAoCarrinho = async (productId: string, quantity: number) => {
  try {
    // Buscar produto para validação
    const product = filteredProducts.value.find(p => p.id === productId)
    if (!product) {
      alert('Produto não encontrado')
      return
    }
    
    // Verificar estoque
    if (product.stock === 0) {
      alert('Produto esgotado')
      return
    }
    
    if (quantity > product.stock) {
      alert(`Apenas ${product.stock} unidades disponíveis`)
      return
    }
    
    // Verificar autenticação
    if (!user.value?.id) {
      // Redirecionar para login
      alert('Por favor, faça login para adicionar produtos ao carrinho')
      await navigateTo('/login?redirect=/products')
      return
    }
    
    // Adicionar ao carrinho no servidor
    await addItem(productId, quantity)
    
    // Abrir modal do carrinho
    openCart()
  } catch (err: any) {
    console.error('Erro ao adicionar ao carrinho:', err)
    
    // Mensagens de erro específicas
    if (err.statusCode === 401) {
      alert('Sessão expirada. Por favor, faça login novamente.')
      await navigateTo('/login?redirect=/products')
    } else {
      alert(err.message || 'Erro ao adicionar produto ao carrinho')
    }
  }
}
</script>

<style lang="scss" scoped>
.produtos-page {
  min-height: 100vh;
  background: var(--background);

  // Hero Section
  .hero-section {
    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
    color: white;
    padding: 4rem 2rem 3rem;
    text-align: center;
    margin-bottom: 0;

    .hero-content {
      max-width: 800px;
      margin: 0 auto;

      h1 {
        font-size: 3rem;
        font-weight: 700;
        margin-bottom: 1rem;
        text-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }

      .subtitle {
        font-size: 1.2rem;
        opacity: 0.95;
        font-weight: 300;
      }
    }
  }

  // Filtros Sticky
  .filters-section {
    position: sticky;
    top: 80px; // Abaixo do header
    z-index: 100;
    background: white;
    padding: 1.5rem 2rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    margin-bottom: 2rem;

    .filters-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      align-items: center;

      .filter-group {
        flex: 1;
        min-width: 200px;
        position: relative;

        &.search-group {
          flex: 2;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1.25rem;
          background: var(--surface);
          border-radius: 50px;
          border: 2px solid transparent;
          transition: all 0.3s ease;

          &:focus-within {
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(139, 0, 20, 0.1);
          }

          i {
            color: var(--accent);
            font-size: 1.1rem;
          }

          .search-input {
            flex: 1;
            border: none;
            background: transparent;
            font-size: 1rem;
            outline: none;
            color: var(--text);

            &::placeholder {
              color: #999;
            }
          }
        }

        .filter-select {
          width: 100%;
          padding: 0.75rem 1.25rem;
          border: 2px solid var(--surface);
          border-radius: 50px;
          background: white;
          color: var(--text);
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238B0014' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          padding-right: 2.5rem;

          &:hover {
            border-color: var(--primary);
          }

          &:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(139, 0, 20, 0.1);
          }
        }
      }

      .btn-create-product {
        padding: 0.75rem 1.5rem;
        background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
        color: white;
        border: none;
        border-radius: 50px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: all 0.3s ease;
        white-space: nowrap;
        box-shadow: 0 4px 12px rgba(255, 105, 180, 0.3);

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(255, 105, 180, 0.4);
        }

        i {
          font-size: 1rem;
        }
      }

      .clear-filters-btn {
        padding: 0.75rem 1.5rem;
        background: var(--secondary);
        color: white;
        border: none;
        border-radius: 50px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: all 0.3s ease;
        white-space: nowrap;

        &:hover {
          background: var(--primary);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(139, 0, 20, 0.3);
        }

        i {
          font-size: 0.9rem;
        }
      }
    }

    .results-info {
      max-width: 1200px;
      margin: 1rem auto 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.95rem;
      color: #666;

      .results-count {
        font-weight: 600;
        color: var(--text);
      }

      .active-filters {
        padding: 0.25rem 0.75rem;
        background: var(--primary);
        color: white;
        border-radius: 20px;
        font-size: 0.85rem;
        font-weight: 600;
      }
    }
  }

  // Grid de produtos
  .produtos-grid {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;

    .no-products {
      grid-column: 1 / -1;
      text-align: center;
      padding: 4rem 2rem;
      background: white;
      border-radius: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);

      i {
        font-size: 4rem;
        color: var(--accent);
        margin-bottom: 1rem;
        opacity: 0.5;
      }

      h3 {
        font-size: 1.5rem;
        color: var(--text);
        margin-bottom: 0.5rem;
      }

      p {
        color: #666;
        margin-bottom: 2rem;
      }

      .btn-primary {
        padding: 0.75rem 2rem;
        background: var(--primary);
        color: white;
        border: none;
        border-radius: 50px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          background: var(--secondary);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(139, 0, 20, 0.3);
        }
      }
    }

    // ProductCard component agora cuida de toda a estilização dos cards
  }

  // Botão flutuante do carrinho
  .cart-float-btn {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    z-index: 1000;
    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
    color: white;
    border: none;
    border-radius: 60px;
    padding: 1rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    cursor: pointer;
    box-shadow: 0 8px 24px rgba(139, 0, 20, 0.4);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(139, 0, 20, 0.5);
    }

    .cart-float-icon {
      position: relative;
      font-size: 1.5rem;

      .cart-float-badge {
        position: absolute;
        top: -8px;
        right: -8px;
        background: white;
        color: var(--primary);
        font-size: 0.75rem;
        font-weight: 700;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      }
    }

    .cart-float-info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;

      .cart-float-label {
        font-size: 0.85rem;
        font-weight: 600;
        opacity: 0.9;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .cart-float-total {
        font-size: 1.1rem;
        font-weight: 700;
      }
    }
  }

  // Animação do carrinho
  .cart-float-enter-active,
  .cart-float-leave-active {
    transition: all 0.3s ease;
  }

  .cart-float-enter-from,
  .cart-float-leave-to {
    opacity: 0;
    transform: translateY(20px) scale(0.8);
  }

  // Estados de loading e erro
  .loading-state,
  .error-state {
    max-width: 600px;
    margin: 4rem auto;
    text-align: center;
    padding: 3rem 2rem;
    background: white;
    border-radius: 16px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);

    p {
      font-size: 1.1rem;
      color: #666;
      margin-bottom: 1.5rem;
    }

    button {
      padding: 0.75rem 2rem;
      background: var(--primary);
      color: white;
      border: none;
      border-radius: 50px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: var(--secondary);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(139, 0, 20, 0.3);
      }
    }
  }
}

// Responsividade
@media (max-width: 1024px) {
  .produtos-page {
    .filters-section {
      .filters-container {
        .filter-group {
          min-width: 180px;

          &.search-group {
            flex: 1;
            min-width: 100%;
          }
        }
      }
    }

    .produtos-grid {
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }
  }
}

@media (max-width: 768px) {
  .produtos-page {
    .hero-section {
      padding: 3rem 1.5rem 2rem;

      .hero-content {
        h1 {
          font-size: 2rem;
        }

        .subtitle {
          font-size: 1rem;
        }
      }
    }

    .filters-section {
      top: 70px;
      padding: 1rem;

      .filters-container {
        flex-direction: column;
        gap: 0.75rem;

        .filter-group {
          width: 100%;
          min-width: 100%;
        }

        .clear-filters-btn {
          width: 100%;
          justify-content: center;
        }
      }

      .results-info {
        flex-direction: column;
        gap: 0.5rem;
        align-items: flex-start;
      }
    }

    .produtos-grid {
      padding: 1rem;
      grid-template-columns: 1fr;
      gap: 1.5rem;

      .produto-card {
        .produto-info {
          .produto-footer {
            .produto-actions {
              flex-direction: column;
              gap: 0.75rem;

              .quantidade-controle {
                width: 100%;
                justify-content: center;
              }

              .add-btn {
                width: 100%;
              }
            }
          }
        }
      }
    }

    .cart-float-btn {
      bottom: 1rem;
      right: 1rem;
      padding: 0.75rem 1rem;
      gap: 0.75rem;

      .cart-float-icon {
        font-size: 1.25rem;
      }

      .cart-float-info {
        .cart-float-label {
          font-size: 0.75rem;
        }

        .cart-float-total {
          font-size: 1rem;
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .produtos-page {
    .hero-section {
      padding: 2rem 1rem 1.5rem;

      .hero-content {
        h1 {
          font-size: 1.75rem;
        }
      }
    }

    .cart-float-btn {
      .cart-float-info {
        display: none;
      }

      padding: 1rem;
      border-radius: 50%;
      width: 60px;
      height: 60px;
      justify-content: center;
    }
  }
}
</style> 