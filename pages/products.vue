<template>
  <div class="produtos-page">
    <section class="header">
      <div class="header-content">
        <h1>Nossos Cupcakes</h1>
        <p class="subtitle">Descubra nossos sabores artesanais</p>
      </div>
      <div class="filters">
        <div class="select-wrapper">
          <select v-model="categoriaAtual">
            <option value="">Todas as categorias</option>
            <option 
              v-for="category in categories" 
              :key="category.id" 
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>
          <span class="select-icon">▼</span>
        </div>
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
      <div v-for="product in filteredProducts" 
           :key="product.id" 
           class="produto-card">
        <img :src="getProductImage(product)" 
             :alt="product.name">
        <div class="produto-info">
          <h3>{{ product.name }}</h3>
          <p>{{ product.description }}</p>
          <div class="produto-footer">
            <span class="preco">R$ {{ product.price.toFixed(2) }}</span>
            <div class="quantidade-controle">
              <button @click="diminuirQuantidade(product.id)" 
                      class="quantidade-btn">-</button>
              <span class="quantidade">{{ getQuantidade(product.id) }}</span>
              <button @click="aumentarQuantidade(product.id)" 
                      class="quantidade-btn">+</button>
            </div>
            <button @click="adicionarAoCarrinho(product)" class="add-btn">
              Adicionar
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Indicador flutuante do carrinho -->
    <div v-if="cartItems.length > 0" 
         class="cart-indicator"
         @click="openCart">
      <span class="cart-count">{{ totalItems }}</span>
      <span class="cart-total">{{ formattedTotal }}</span>
    </div>
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
const quantidades = ref(new Map<string, number>())

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

// Observar mudanças na categoria selecionada
watch(categoriaAtual, (newCategory) => {
  setSelectedCategory(newCategory || null)
})

// Obter imagem do produto
const getProductImage = (product: Product) => {
  if (product.images && product.images.length > 0) {
    const primaryImage = product.images.find(img => img.isPrimary)
    return primaryImage?.url || product.images[0].url
  }
  // Fallback para imagens locais
  if (product.sku) {
    return `/products/${product.sku}.png`
  }
  return '/products/photo_default.png'
}

const adicionarAoCarrinho = async (product: Product) => {
  try {
    const quantidade = getQuantidade(product.id)
    
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
  }
}
</script>

<style lang="scss" scoped>
.produtos-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  .header {
    padding: 3rem 0;
    text-align: center;
    background: linear-gradient(to right, #fff5f8, #fff);
    border-radius: 12px;
    margin-bottom: 3rem;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);

    .header-content {
      margin-bottom: 2rem;

      h1 {
        font-size: 2.5rem;
        color: var(--primary-color);
        margin-bottom: 0.5rem;
        font-weight: 700;
      }

      .subtitle {
        color: #666;
        font-size: 1.1rem;
        font-weight: 300;
      }
    }

    .filters {
      display: flex;
      justify-content: center;
      
      .select-wrapper {
        position: relative;
        width: 250px;

        select {
          width: 100%;
          padding: 0.8rem 1.5rem;
          border: 2px solid #ffd1e0;
          border-radius: 30px;
          appearance: none;
          background-color: white;
          color: #333;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;

          &:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(255, 64, 129, 0.1);
          }

          &:hover {
            border-color: var(--primary-color);
          }
        }

        .select-icon {
          position: absolute;
          right: 1.2rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--primary-color);
          pointer-events: none;
          font-size: 0.8rem;
        }
      }
    }
  }

  .produtos-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 2rem;
  }

  .produto-card {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    transition: transform 0.3s;

    &:hover {
      transform: translateY(-5px);
    }

    img {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }

    .produto-info {
      padding: 1rem;

      h3 {
        margin-bottom: 0.5rem;
        color: var(--secondary);
      }

      p {
        color: #666;
        margin-bottom: 1rem;
      }

      .produto-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .preco {
          font-weight: bold;
          color: var(--primary-color);
        }

        .quantidade-controle {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0 1rem;

          .quantidade-btn {
            width: 24px;
            height: 24px;
            border: 1px solid var(--primary-color);
            background: var(--secondary);
            color: white;
            border-radius: 4px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            
            &:hover {
              background: var(--secondary);
              color: white;
            }
          }

          .quantidade {
            min-width: 24px;
            text-align: center;
          }
        }

        .add-btn {
          background-color: white;
          color: var(--secondary);
          padding: 0.75rem 1.5rem;
          border-radius: 30px;
          border: 2px solid var(--secondary);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: all 0.3s ease;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(255, 64, 129, 0.2);

          &:hover {
            background-color: var(--secondary);
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(255, 64, 129, 0.4);
          }

          &:active {
            transform: translateY(0);
            box-shadow: 0 2px 4px rgba(255, 64, 129, 0.2);
          }
        }
      }
    }
  }

  .cart-indicator {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    background-color: var(--primary-color);
    color: white;
    padding: 1rem;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    transition: transform 0.2s;

    &:hover {
      transform: scale(1.05);
    }

    .cart-count {
      font-size: 1.2rem;
      font-weight: bold;
    }

    .cart-total {
      font-size: 0.9rem;
      opacity: 0.9;
    }
  }

  .loading-state,
  .error-state {
    text-align: center;
    padding: 2rem;
    
    button {
      margin-top: 1rem;
      padding: 0.5rem 1rem;
      background-color: var(--primary-color);
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      
      &:hover {
        opacity: 0.9;
      }
    }
  }
}

// Responsividade
@media (max-width: 768px) {
  .produtos-page {
    .header {
      padding: 2rem 1rem;

      .header-content {
        h1 {
          font-size: 2rem;
        }
      }

      .filters {
        .select-wrapper {
          width: 90%;
          max-width: 250px;
        }
      }
    }
  }
}
</style> 