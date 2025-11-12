<template>
  <section class="featured">
    <h2>Nossos Destaques</h2>
    
    <div v-if="loading" class="loading">
      <p>Carregando produtos...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="loadProducts">Tentar novamente</button>
    </div>

    <div v-else class="products-grid">
      <ProductCard 
        v-for="product in displayProducts" 
        :key="product.id" 
        :product="product"
        variant="complete"
        :is-favorite="isFavorite(product.id)"
        :show-stock-badge="true"
        :show-favorite-button="isAuthenticated"
        :show-quantity-control="true"
        :show-category="true"
        :show-sku="true"
        @toggle-favorite="toggleFavoriteProduct(product.id)"
        @add-to-cart="handleAddToCart"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useStorePublic } from '~/composables/useStorePublic'
import { useCompany } from '~/composables/useCompany'
import { useWishlist } from '~/composables/useWishlist'
import { useAuth } from '~/composables/useAuth'
import ProductCard from '~/components/common/ProductCard.vue'

// Store pública (sem autenticação necessária)
const { featuredProducts, loading, error, fetchProducts } = useStorePublic()
const { companyId } = useCompany()
const { isFavorite, toggleFavorite, fetchFavorites } = useWishlist()
const { isAuthenticated } = useAuth()

// Produtos de fallback caso a API falhe
const fallbackProducts = [
  {
    id: '1',
    name: 'Cupcake de Chocolate Belga',
    description: 'Cupcake de chocolate belga com cobertura de ganache',
    price: 8.50,
    images: [{ id: '1', url: '/products/CCB001.png', isPrimary: true, productId: '1' }],
    isActive: true
  },
  {
    id: '2',
    name: 'Red Velvet Tradicional',
    description: 'Cupcake red velvet com cream cheese',
    price: 9.00,
    images: [{ id: '2', url: '/products/RVT002.png', isPrimary: true, productId: '2' }],
    isActive: true
  },
  {
    id: '3',
    name: 'Pistache Premium',
    description: 'Cupcake de pistache com cobertura de creme de pistache',
    price: 12.00,
    images: [{ id: '3', url: '/products/PST006.png', isPrimary: true, productId: '3' }],
    isActive: true
  }
]

const displayProducts = computed(() => {
  // Se tiver produtos da API, usar eles, senão usar fallback
  return featuredProducts.value.length > 0 ? featuredProducts.value : fallbackProducts
})

const loadProducts = async () => {
  try {
    await fetchProducts()
    if (isAuthenticated.value) {
      await fetchFavorites()
    }
  } catch (err) {
    console.error('Erro ao carregar produtos:', err)
  }
}

const toggleFavoriteProduct = async (productId: string) => {
  if (!isAuthenticated.value) {
    alert('Por favor, faça login para favoritar produtos')
    return
  }
  
  try {
    await toggleFavorite(productId)
  } catch (err: any) {
    console.error('Erro ao favoritar produto:', err)
    alert(err.message || 'Erro ao favoritar produto')
  }
}

const handleAddToCart = (productId: string, quantity: number) => {
  console.log('Produto adicionado ao carrinho:', { productId, quantity })
}

onMounted(() => {
  loadProducts()
})
</script>

<style lang="scss" scoped>
.featured {
  padding: 4rem 2rem;
  background-color: #f9f9f9;

  h2 {
    text-align: center;
    margin-bottom: 3rem;
    font-size: 2.5rem;
    color: #333;
  }

  .loading, .error {
    text-align: center;
    padding: 3rem;
    max-width: 600px;
    margin: 0 auto;

    p {
      font-size: 1.2rem;
      color: #666;
      margin-bottom: 1rem;
    }

    button {
      padding: 0.75rem 2rem;
      background-color: var(--primary);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.3s;

      &:hover {
        background-color: var(--primary-dark);
      }
    }
  }

  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }
}
</style> 