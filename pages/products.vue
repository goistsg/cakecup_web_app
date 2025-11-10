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
            <option value="price-asc">Menor preço</option>
            <option value="price-desc">Maior preço</option>
            <option value="newest">Mais recentes</option>
          </select>
        </div>

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
    <section v-else class="produtos-grid">
      <!-- Mensagem quando não há produtos -->
      <div v-if="filteredProducts.length === 0" class="no-products">
        <i class="fas fa-search"></i>
        <h3>Nenhum produto encontrado</h3>
        <p>Tente ajustar os filtros ou buscar por outro termo</p>
        <button @click="clearAllFilters" class="btn-primary">
          Limpar filtros
        </button>
      </div>

      <!-- Grid de produtos -->
      <div v-for="product in filteredProducts" 
           :key="product.id" 
           class="produto-card">
        <div class="produto-image">
          <img :src="getProductImage(product)" 
               :alt="product.name">
          <div class="produto-badge" v-if="product.stock < 5 && product.stock > 0">
            <i class="fas fa-exclamation-circle"></i>
            Últimas unidades
          </div>
          <div class="produto-badge out-of-stock" v-if="product.stock === 0">
            <i class="fas fa-times-circle"></i>
            Esgotado
          </div>
        </div>

        <div class="produto-info">
          <div class="produto-header">
            <span class="produto-category">{{ product.category }}</span>
            <span class="produto-sku">{{ product.sku }}</span>
          </div>
          
          <h3>{{ product.name }}</h3>
          <p class="produto-description">{{ truncateDescription(product.description) }}</p>
          
          <div class="produto-footer">
            <div class="preco-section">
              <span class="preco">R$ {{ product.price.toFixed(2) }}</span>
              <span class="preco-unit">por unidade</span>
            </div>

            <div class="produto-actions">
              <div class="quantidade-controle">
                <button 
                  @click="diminuirQuantidade(product.id)" 
                  class="quantidade-btn"
                  :disabled="product.stock === 0"
                >
                  <i class="fas fa-minus"></i>
                </button>
                <span class="quantidade">{{ getQuantidade(product.id) }}</span>
                <button 
                  @click="aumentarQuantidade(product.id)" 
                  class="quantidade-btn"
                  :disabled="product.stock === 0 || getQuantidade(product.id) >= product.stock"
                >
                  <i class="fas fa-plus"></i>
                </button>
              </div>

              <button 
                @click="adicionarAoCarrinho(product)" 
                class="add-btn"
                :disabled="product.stock === 0"
              >
                <i class="fas fa-shopping-cart"></i>
                {{ product.stock === 0 ? 'Esgotado' : 'Adicionar' }}
              </button>
            </div>
          </div>
        </div>
      </div>
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useCart } from '~/composables/useCart'
import { useStorePublic } from '~/composables/useStorePublic'
import { useAuth } from '~/composables/useAuth'
import { useCompany } from '~/composables/useCompany'
import type { Product } from '~/types/api'

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

// Autenticação (opcional)
const { user } = useAuth()

// Company ID
const { companyId } = useCompany()

const categoriaAtual = ref('')
const searchQuery = ref('')
const sortBy = ref('')
const quantidades = ref(new Map<string, number>())

// Computed para verificar se há filtros ativos
const hasActiveFilters = computed(() => {
  return categoriaAtual.value !== '' || searchQuery.value !== '' || sortBy.value !== ''
})

// Limpar todos os filtros
const clearAllFilters = () => {
  categoriaAtual.value = ''
  searchQuery.value = ''
  sortBy.value = ''
  setSelectedCategory(null)
}

// Carregar produtos e categorias quando o componente for montado
onMounted(async () => {
  try {
    // Buscar produtos e categorias da loja pública
    await Promise.all([
      fetchProducts(),
      fetchCategories()
    ])
  } catch (err) {
    console.error('Erro ao carregar dados:', err)
  }
})

// Função para obter a quantidade de um produto
const getQuantidade = (produtoId: string) => {
  return quantidades.value.get(produtoId) || 1
}

// Funções para controlar a quantidade
const aumentarQuantidade = (produtoId: string) => {
  const atual = getQuantidade(produtoId)
  quantidades.value.set(produtoId, atual + 1)
}

const diminuirQuantidade = (produtoId: string) => {
  const atual = getQuantidade(produtoId)
  if (atual > 1) {
    quantidades.value.set(produtoId, atual - 1)
  }
}

// Observar mudanças nos filtros
watch(categoriaAtual, (newCategory) => {
  setSelectedCategory(newCategory || null)
})

watch(searchQuery, (newQuery) => {
  // Implementar busca via store se disponível
  // Por enquanto, filtraremos localmente
})

watch(sortBy, (newSort) => {
  // Implementar ordenação
})

// Obter imagem do produto
const getProductImage = (product: any) => {
  if (product.images && product.images.length > 0) {
    const primaryImage = product.images.find((img: any) => img.isPrimary)
    return primaryImage?.url || product.images[0].url
  }
  // Fallback para imagens locais
  if (product.sku) {
    return `/products/${product.sku}.png`
  }
  return '/products/photo_default.png'
}

const adicionarAoCarrinho = async (product: any) => {
  try {
    if (product.stock === 0) {
      alert('Produto esgotado')
      return
    }

    const quantidade = getQuantidade(product.id)
    
    if (quantidade > product.stock) {
      alert(`Apenas ${product.stock} unidades disponíveis`)
      return
    }
    
    if (user.value?.id) {
      // Com autenticação: adiciona ao carrinho do servidor
      await addItem(product.id, quantidade)
    } else {
      // Sem autenticação: adiciona ao carrinho local
      console.log('Produto adicionado ao carrinho local:', product.name)
      // TODO: Implementar carrinho local (localStorage)
    }
    
    quantidades.value.set(product.id, 1)
    openCart()
  } catch (err) {
    console.error('Erro ao adicionar ao carrinho:', err)
    alert('Erro ao adicionar produto ao carrinho')
  }
}

// Truncar descrição
const truncateDescription = (text: string, maxLength: number = 80) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
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

    .produto-card {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;

      &:hover {
        transform: translateY(-8px);
        box-shadow: 0 8px 24px rgba(0,0,0,0.15);
      }

      .produto-image {
        position: relative;
        width: 100%;
        height: 250px;
        overflow: hidden;
        background: var(--surface);

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        &:hover img {
          transform: scale(1.05);
        }

        .produto-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          padding: 0.5rem 1rem;
          background: var(--accent);
          color: white;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);

          &.out-of-stock {
            background: #666;
          }

          i {
            font-size: 1rem;
          }
        }
      }

      .produto-info {
        padding: 1.5rem;
        flex: 1;
        display: flex;
        flex-direction: column;

        .produto-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;

          .produto-category {
            padding: 0.25rem 0.75rem;
            background: var(--surface);
            color: var(--primary);
            border-radius: 12px;
            font-size: 0.8rem;
            font-weight: 600;
          }

          .produto-sku {
            font-size: 0.8rem;
            color: #999;
            font-weight: 500;
          }
        }

        h3 {
          font-size: 1.25rem;
          color: var(--text);
          margin-bottom: 0.5rem;
          font-weight: 700;
          line-height: 1.3;
        }

        .produto-description {
          color: #666;
          font-size: 0.9rem;
          line-height: 1.5;
          margin-bottom: 1rem;
          flex: 1;
        }

        .produto-footer {
          border-top: 1px solid var(--surface);
          padding-top: 1rem;

          .preco-section {
            margin-bottom: 1rem;

            .preco {
              display: block;
              font-size: 1.75rem;
              font-weight: 700;
              color: var(--primary);
              margin-bottom: 0.25rem;
            }

            .preco-unit {
              font-size: 0.8rem;
              color: #999;
            }
          }

          .produto-actions {
            display: flex;
            gap: 0.75rem;
            align-items: center;

            .quantidade-controle {
              display: flex;
              align-items: center;
              gap: 0.5rem;
              padding: 0.5rem;
              background: var(--surface);
              border-radius: 50px;

              .quantidade-btn {
                width: 32px;
                height: 32px;
                border: none;
                background: white;
                color: var(--primary);
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
                font-weight: 600;

                &:hover:not(:disabled) {
                  background: var(--primary);
                  color: white;
                  transform: scale(1.1);
                }

                &:disabled {
                  opacity: 0.3;
                  cursor: not-allowed;
                }

                i {
                  font-size: 0.8rem;
                }
              }

              .quantidade {
                min-width: 32px;
                text-align: center;
                font-weight: 700;
                color: var(--text);
              }
            }

            .add-btn {
              flex: 1;
              padding: 0.75rem 1.5rem;
              background: var(--primary);
              color: white;
              border: none;
              border-radius: 50px;
              font-weight: 700;
              cursor: pointer;
              transition: all 0.3s ease;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 0.5rem;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              font-size: 0.9rem;

              &:hover:not(:disabled) {
                background: var(--secondary);
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(139, 0, 20, 0.3);
              }

              &:disabled {
                background: #ccc;
                cursor: not-allowed;
                transform: none;
              }

              i {
                font-size: 1rem;
              }
            }
          }
        }
      }
    }
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