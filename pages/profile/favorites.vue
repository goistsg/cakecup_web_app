<template>
  <div class="favorites-page">
    <!-- Header -->
    <div class="favorites-header">
      <h1>
        <i class="fas fa-heart"></i>
        Meus Favoritos
      </h1>
      <p class="subtitle">{{ favoritesCount }} {{ favoritesCount === 1 ? 'produto favorito' : 'produtos favoritos' }}</p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading">
      <i class="fas fa-spinner fa-spin"></i>
      <p>Carregando favoritos...</p>
    </div>

    <!-- Lista de Favoritos -->
    <div v-if="!loading && productsWithFavorites.length > 0 && isMounted" class="favorites-grid">
      <ProductCard 
        v-for="product in productsWithFavorites" 
        :key="product.id" 
        :product="product"
        variant="complete"
        :is-favorite="true"
        :show-stock-badge="true"
        :show-favorite-button="isMounted"
        :show-quantity-control="true"
        :show-category="true"
        :show-sku="true"
        @toggle-favorite="handleRemoveFavorite(product.id)"
        @add-to-cart="handleAddToCart"
      />
    </div>

    <!-- Estado Vazio -->
    <div v-else-if="!loading && productsWithFavorites.length === 0 && isMounted" class="empty-state">
      <i class="fas fa-heart-broken"></i>
      <h2>Nenhum favorito ainda</h2>
      <p>Adicione produtos aos seus favoritos para encontrá-los facilmente depois</p>
      <NuxtLink to="/products" class="btn-shop">
        <i class="fas fa-shopping-bag"></i>
        Ver Produtos
      </NuxtLink>
    </div>

    <!-- Mensagem de Erro -->
    <div v-if="error" class="error-message">
      <i class="fas fa-exclamation-triangle"></i>
      <span>{{ error }}</span>
      <button @click="clearError" class="btn-close">
        <i class="fas fa-times"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useWishlist } from '~/composables/useWishlist'
import { useCart } from '~/composables/useCart'
import { useAuth } from '~/composables/useAuth'
import { useRouter } from 'vue-router'
import { useClientMounted } from '~/composables/useClientMounted'
import ProductCard from '~/components/common/ProductCard.vue'

definePageMeta({
  middleware: 'auth',
})

const router = useRouter()
const { user } = useAuth()
const { isMounted } = useClientMounted()
const { productsWithFavorites, favoritesCount, loading, error, fetchFavorites, removeFavorite, clearError } = useWishlist()
const { addItem, openCart } = useCart()

const handleRemoveFavorite = async (productId: string) => {
  try {
    await removeFavorite(productId)
  } catch (err: any) {
    console.error('Erro ao remover favorito:', err)
    alert(err.message || 'Erro ao remover favorito')
  }
}

const handleAddToCart = async (productId: string, quantity: number) => {
  try {
    const product = productsWithFavorites.value.find(p => p.id === productId)
    if (!product) {
      alert('Produto não encontrado')
      return
    }

    const stock = product.stock !== undefined ? product.stock : 999
    
    if (stock === 0) {
      alert('Produto esgotado!')
      return
    }

    if (!user.value?.id) {
      alert('Por favor, faça login para adicionar produtos ao carrinho')
      await router.push('/login?redirect=/profile/favorites')
      return
    }

    await addItem(productId, quantity)
    openCart()
  } catch (err: any) {
    console.error('Erro ao adicionar ao carrinho:', err)
    if (err.statusCode === 401) {
      alert('Sessão expirada. Por favor, faça login novamente.')
      await router.push('/login?redirect=/profile/favorites')
    } else {
      alert(err.message || 'Erro ao adicionar produto ao carrinho')
    }
  }
}

onMounted(async () => {
  try {
    console.log('🔍 Carregando favoritos...')
    await fetchFavorites()
    console.log('✅ Favoritos carregados:', productsWithFavorites.value.length, 'produtos')
    console.log('📦 Produtos:', productsWithFavorites.value)
  } catch (err) {
    console.error('❌ Erro ao carregar favoritos:', err)
  }
})
</script>

<style lang="scss" scoped>
.favorites-page {
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #FBE9E7 0%, #E9DFD7 100%);
}

.favorites-header {
  max-width: 1400px;
  margin: 0 auto 3rem;
  text-align: center;

  h1 {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    font-size: 2.5rem;
    color: var(--primary);
    margin-bottom: 0.5rem;
    line-height: 1.2;

    i {
      font-size: 2rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
      animation: heartbeat 1.5s ease-in-out infinite;
    }
  }

  .subtitle {
    font-size: 1.1rem;
    color: #666;
  }
}

@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  10%, 30% { transform: scale(1.1); }
  20% { transform: scale(1); }
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 4rem 2rem;
  text-align: center;

  i {
    font-size: 3rem;
    color: var(--primary);
  }

  p {
    color: #666;
    font-size: 1.1rem;
  }
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  animation: fadeInUp 0.6s ease-out;
}

.favorite-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  }
}

.product-image {
  position: relative;
  width: 100%;
  height: 250px;
  overflow: hidden;
  background: #f8f8f8;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }

  .product-badge {
    position: absolute;
    top: 1rem;
    left: 1rem;
    background: #ff9800;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

    &.out-of-stock {
      background: #666;
    }
  }

  .remove-favorite-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 45px;
    height: 45px;
    border-radius: 50%;
    background: white;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
    z-index: 10;

    i {
      font-size: 1.2rem;
      color: #e74c3c;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
      vertical-align: middle;
    }

    &:hover:not(:disabled) {
      transform: scale(1.1);
      background: #e74c3c;

      i {
        color: white;
      }
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
}

.product-info {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;

  .product-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
    gap: 0.5rem;

    .product-category {
      background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
      color: white;
      padding: 0.35rem 0.85rem;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .product-sku {
      color: #999;
      font-size: 0.85rem;
      font-weight: 500;
    }
  }

  h3 {
    font-size: 1.25rem;
    color: #333;
    margin-bottom: 0.75rem;
    line-height: 1.4;
  }

  .product-description {
    color: #666;
    font-size: 0.95rem;
    line-height: 1.6;
    margin-bottom: 1.5rem;
    flex: 1;
  }

  .product-footer {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .price-section {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;

      .price {
        font-size: 1.8rem;
        font-weight: 700;
        color: var(--primary);
      }

      .price-unit {
        font-size: 0.85rem;
        color: #999;
      }
    }

    .product-actions {
      .add-to-cart-btn {
        width: 100%;
        padding: 1rem;
        background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
        color: white;
        border: none;
        border-radius: 12px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;

        i {
          font-size: 1rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          vertical-align: middle;
        }

        &:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(139, 0, 20, 0.3);
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background: #999;
        }
      }
    }
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding: 4rem 2rem;
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
  animation: fadeInUp 0.6s ease-out;

  i {
    font-size: 5rem;
    color: #ddd;
  }

  h2 {
    font-size: 2rem;
    color: #666;
    margin: 0;
  }

  p {
    font-size: 1.1rem;
    color: #999;
    line-height: 1.6;
    margin: 0;
  }

  .btn-shop {
    padding: 1.25rem 2.5rem;
    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
    color: white;
    text-decoration: none;
    border-radius: 12px;
    font-size: 1.1rem;
    font-weight: 600;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;

    i {
      font-size: 1.1rem;
      color: white;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
      vertical-align: middle;
    }

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 24px rgba(139, 0, 20, 0.3);
    }
  }
}

.error-message {
  position: fixed;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: white;
  border: 2px solid #f44336;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(244, 67, 54, 0.3);
  z-index: 3000;
  max-width: 90%;
  animation: slideDown 0.3s ease-out;

  i:first-child {
    font-size: 1.5rem;
    color: #f44336;
  }

  span {
    color: #c62828;
    font-weight: 500;
  }

  .btn-close {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.25rem;
    color: #999;
    transition: color 0.3s;

    &:hover {
      color: #333;
    }

    i {
      font-size: 1.2rem;
    }
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translate(-50%, -20px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

@media (max-width: 768px) {
  .favorites-page {
    padding: 1rem;
  }

  .favorites-header h1 {
    font-size: 2rem;
  }

  .favorites-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .empty-state {
    padding: 3rem 1rem;

    i {
      font-size: 4rem;
    }

    h2 {
      font-size: 1.5rem;
    }
  }
}
</style>

