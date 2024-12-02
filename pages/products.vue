<template>
  <div class="produtos-page">
    <section class="header">
      <div class="header-content">
        <h1>Nossos Cupcakes</h1>
        <p class="subtitle">Descubra nossos sabores artesanais</p>
      </div>
      <div class="filters">
        <div class="select-wrapper">
          <select v-model="saborAtual">
            <option value="">Todos os sabores</option>
            <option value="chocolate">Chocolate</option>
            <option value="red velvet">Red Velvet</option>
            <option value="limão siciliano">Limão Siciliano</option>
            <option value="baunilha">Baunilha</option>
            <option value="maracujá">Maracujá</option>
            <option value="pistache">Pistache</option>
            <option value="coco">Coco</option>
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
      <button @click="fetchProdutos">Tentar novamente</button>
    </div>

    <!-- Products grid -->
    <section v-else class="produtos-grid">
      <div v-for="product in produtosFiltrados" 
           :key="product.id" 
           class="produto-card">
        <img :src="images[product.sku].url" 
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
            <AppButton @click="adicionarAoCarrinho(product)" class="app-button">
              Adicionar
            </AppButton>
          </div>
        </div>
      </div>
    </section>

    <!-- Indicador flutuante do carrinho -->
    <div v-if="cartStore.items.length > 0" 
         class="cart-indicator"
         @click="cartStore.openCart">
      <span class="cart-count">{{ cartStore.totalItems }}</span>
      <span class="cart-total">{{ cartStore.formattedTotal }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCartStore } from '~/stores/cart'
import { useProducts } from '@/composables/useProducts'

const cartStore = useCartStore()
const saborAtual = ref('')
const quantidades = ref(new Map())

const images = ref<{ [key: string]: { url: string } }>({
  'CCB001': { url: 'http://localhost:3000/products/CCB001.png' },
  'RVT002': { url: 'http://localhost:3000/products/RVT002.png' },
  'BMS003': { url: 'http://localhost:3000/products/BMS003.png' },
  'LMS004': { url: 'http://localhost:3000/products/LMS004.png' },
  'DLV005': { url: 'http://localhost:3000/products/DLV005.jpg' },
  'PST006': { url: 'http://localhost:3000/products/PST006.png' },
  'BRG007': { url: 'http://localhost:3000/products/BRG007.jpg' },
  'MCB008': { url: 'http://localhost:3000/products/MCB008.jpg' },
  'CDL009': { url: 'http://localhost:3000/products/CDL009.jpg' },
  'NTA010': { url: 'http://localhost:3000/products/NTA010.jpg' },
})

// Usando o composable de produtos
const { produtos, loading, error, fetchProdutos } = useProducts()

// Carregar produtos quando o componente for montado
onMounted(() => {
  fetchProdutos()
})

// Função para obter a quantidade de um produto
const getQuantidade = (produtoId: number) => {
  return quantidades.value.get(produtoId) || 1
}

// Funções para controlar a quantidade
const aumentarQuantidade = (produtoId: number) => {
  const atual = getQuantidade(produtoId)
  quantidades.value.set(produtoId, atual + 1)
}

const diminuirQuantidade = (produtoId: number) => {
  const atual = getQuantidade(produtoId)
  if (atual > 1) {
    quantidades.value.set(produtoId, atual - 1)
  }
}

const produtosFiltrados = computed(() => {
  // return produtos.value
  if (!saborAtual.value) return produtos.value
  return produtos.value.filter(p => p.flavor === saborAtual.value)
})

const adicionarAoCarrinho = (product: any) => {
  cartStore.addItem({
    id: product.id,
    name: product.name,
    price: product.price,
    quantity: getQuantidade(product.id),
    image: product.image_url
  })
  quantidades.value.set(product.id, 1)
  cartStore.openCart()
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
        color: #ff4081;
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
            background: #ff4081;
            color: white;
            border-radius: 4px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            
            &:hover {
              background: #ff4081;
              color: white;
            }
          }

          .quantidade {
            min-width: 24px;
            text-align: center;
          }
        }

        :deep(.app-button) {
          background-color: white;
          color: #ff4081;
          padding: 0.75rem 1.5rem;
          border-radius: 30px;
          border: none;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: all 0.3s ease;
          cursor: pointer;
          box-shadow: 0 2px 4px #ff4081;

          &:hover {
            background-color: #ff4081;
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          }

          &:active {
            transform: translateY(0);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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