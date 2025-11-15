<template>
  <div class="product-detail-page">
    <!-- Loading -->
    <div v-if="loading" class="loading-state">
      <i class="fas fa-spinner fa-spin"></i>
      <p>Carregando produto...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error-state">
      <i class="fas fa-exclamation-triangle"></i>
      <h2>Produto não encontrado</h2>
      <p>{{ error }}</p>
      <NuxtLink to="/products" class="btn-back">
        <i class="fas fa-arrow-left"></i>
        Voltar para produtos
      </NuxtLink>
    </div>

    <!-- Product Detail -->
    <div v-else-if="product" class="product-detail">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <NuxtLink to="/">
          <i class="fas fa-home"></i>
          Início
        </NuxtLink>
        <i class="fas fa-chevron-right"></i>
        <NuxtLink to="/products">Produtos</NuxtLink>
        <i class="fas fa-chevron-right"></i>
        <span>{{ product.name }}</span>
      </nav>

      <!-- Product Content -->
      <div class="product-content">
        <!-- Left: Image Gallery -->
        <div class="product-gallery">
          <div class="main-image">
            <img :src="currentImage" :alt="product.name">
            
            <!-- Stock Badge -->
            <div class="stock-badge" v-if="product.stock !== undefined && product.stock < 5 && product.stock > 0">
              <i class="fas fa-exclamation-circle"></i>
              Últimas {{ product.stock }} unidades
            </div>
            <div class="stock-badge out-of-stock" v-if="product.stock !== undefined && product.stock === 0">
              <i class="fas fa-times-circle"></i>
              Esgotado
            </div>

            <!-- Favorite Button -->
            <button 
              v-if="isMounted && isAuthenticated"
              class="favorite-btn-large"
              :class="{ 'is-favorite': isFavorite(product.id) }"
              @click="toggleFavoriteProduct"
              :disabled="togglingFavorite"
            >
              <i class="fas" :class="togglingFavorite ? 'fa-spinner fa-spin' : 'fa-heart'"></i>
            </button>
          </div>

          <!-- Thumbnail Gallery -->
          <div class="thumbnail-gallery" v-if="productImages.length > 1">
            <button 
              v-for="(image, index) in productImages" 
              :key="index"
              class="thumbnail"
              :class="{ active: currentImageIndex === index }"
              @click="currentImageIndex = index"
            >
              <img :src="image" :alt="`${product.name} - ${index + 1}`">
            </button>
          </div>
        </div>

        <!-- Right: Product Info -->
        <div class="product-info">
          <!-- Category & SKU -->
          <div class="product-meta">
            <span class="category-badge">
              <i class="fas fa-tag"></i>
              {{ product.category || 'Cupcake' }}
            </span>
            <span class="sku-badge" v-if="product.sku">SKU: {{ product.sku }}</span>
          </div>

          <!-- Product Name -->
          <div class="product-name-wrapper">
            <h1 class="product-name">{{ product.name }}</h1>
            <button
              v-if="isMounted && isCompanyAdmin"
              @click="openEditModal"
              class="btn-edit-product"
              title="Editar produto"
            >
              <i class="fas fa-edit"></i>
              Editar
            </button>
          </div>

          <!-- Product Description -->
          <p class="product-description">{{ product.description }}</p>

          <!-- Rating (if available) -->
          <div class="product-rating" v-if="false">
            <div class="stars">
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star-half-alt"></i>
            </div>
            <span class="rating-text">4.5 (120 avaliações)</span>
          </div>

          <!-- Price -->
          <div class="price-section">
            <span class="price">R$ {{ formatPrice((product as any).price || (product as any).salePrice) }}</span>
            <span class="price-label">por unidade</span>
          </div>

          <!-- Stock Info -->
          <div class="stock-info">
            <i class="fas" :class="product.stock > 0 ? 'fa-check-circle' : 'fa-times-circle'"></i>
            <span v-if="product.stock > 0">
              <strong>Em estoque</strong> - {{ product.stock }} unidade{{ product.stock > 1 ? 's' : '' }} disponíve{{ product.stock > 1 ? 'is' : 'l' }}
            </span>
            <span v-else>
              <strong>Produto esgotado</strong>
            </span>
          </div>

          <!-- Quantity Control -->
          <div class="quantity-section">
            <label>Quantidade:</label>
            <div class="quantity-control">
              <button 
                @click="decreaseQuantity" 
                class="quantity-btn"
                :disabled="quantity <= 1 || product.stock === 0"
              >
                <i class="fas fa-minus"></i>
              </button>
              <input 
                type="number" 
                v-model.number="quantity" 
                min="1" 
                :max="product.stock"
                class="quantity-input"
                :disabled="product.stock === 0"
              >
              <button 
                @click="increaseQuantity" 
                class="quantity-btn"
                :disabled="quantity >= product.stock || product.stock === 0"
              >
                <i class="fas fa-plus"></i>
              </button>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="action-buttons">
            <button 
              class="btn-add-cart"
              @click="addToCart"
              :disabled="product.stock === 0 || addingToCart"
            >
              <i class="fas" :class="addingToCart ? 'fa-spinner fa-spin' : 'fa-shopping-cart'"></i>
              {{ product.stock === 0 ? 'Produto Esgotado' : 'Adicionar ao Carrinho' }}
            </button>
            
            <button 
              class="btn-buy-now"
              @click="buyNow"
              :disabled="product?.stock === 0"
              v-if="false"
            >
              <i class="fas fa-bolt"></i>
              Comprar Agora
            </button>
          </div>

          <!-- Additional Info -->
          <div class="additional-info">
            <div class="info-item">
              <i class="fas fa-truck"></i>
              <div>
                <strong>Entrega rápida</strong>
                <p>Calcule o frete no checkout</p>
              </div>
            </div>
            <div class="info-item">
              <i class="fas fa-shield-alt"></i>
              <div>
                <strong>Compra segura</strong>
                <p>Seus dados protegidos</p>
              </div>
            </div>
            <div class="info-item">
              <i class="fas fa-medal"></i>
              <div>
                <strong>Qualidade garantida</strong>
                <p>Produtos frescos e artesanais</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Product Details Tabs -->
      <div class="product-details-tabs">
        <div class="tabs-header">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            class="tab-btn"
            :class="{ active: activeTab === tab.id }"
            @click="activeTab = tab.id"
          >
            <i :class="tab.icon"></i>
            {{ tab.label }}
          </button>
        </div>

        <div class="tabs-content">
          <!-- Description Tab -->
          <div v-if="activeTab === 'description'" class="tab-pane">
            <h3>Sobre este produto</h3>
            <p>{{ product.description }}</p>
            <p v-if="(product as any).longDescription">{{ (product as any).longDescription }}</p>
          </div>

          <!-- Ingredients Tab -->
          <div v-if="activeTab === 'ingredients'" class="tab-pane">
            <h3>Ingredientes</h3>
            <ul v-if="product.ingredients && product.ingredients.length > 0" class="ingredients-list">
              <li v-for="(ingredient, index) in product.ingredients" :key="index">
                <i class="fas fa-check-circle"></i>
                {{ ingredient }}
              </li>
            </ul>
            <p v-else class="no-ingredients">
              Ingredientes de alta qualidade selecionados para garantir o melhor sabor e frescor.
              Consulte nossa equipe para informações detalhadas sobre alergênicos.
            </p>
          </div>

          <!-- Details Tab -->
          <div v-if="activeTab === 'details'" class="tab-pane">
            <h3>Especificações</h3>
            <table class="specs-table">
              <tbody>
                <tr>
                  <td><strong>SKU:</strong></td>
                  <td>{{ product.sku || 'N/A' }}</td>
                </tr>
                <tr>
                  <td><strong>Categoria:</strong></td>
                  <td>{{ product.category || 'Cupcake' }}</td>
                </tr>
                <tr>
                  <td><strong>Peso aproximado:</strong></td>
                  <td>{{ (product as any).weight || '80g' }}</td>
                </tr>
                <tr>
                  <td><strong>Validade:</strong></td>
                  <td>{{ (product as any).shelfLife || '3 dias após a produção' }}</td>
                </tr>
                <tr>
                  <td><strong>Conservação:</strong></td>
                  <td>{{ (product as any).storage || 'Refrigerar entre 2°C e 8°C' }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Reviews Tab -->
          <div v-if="activeTab === 'reviews'" class="tab-pane">
            <div class="reviews-header">
              <div class="reviews-summary">
                <h3>Avaliações dos Clientes</h3>
                <div class="rating-summary">
                  <div class="average-rating">
                    <span class="rating-number">{{ averageRating }}</span>
                    <div class="stars-display">
                      <i
                        v-for="star in 5"
                        :key="star"
                        class="fas fa-star"
                        :class="{ filled: star <= Math.round(parseFloat(String(averageRating))) }"
                      ></i>
                    </div>
                    <span class="review-count">{{ reviews.length }} {{ reviews.length === 1 ? 'avaliação' : 'avaliações' }}</span>
                  </div>
                </div>
              </div>

              <button
                v-if="isMounted && isAuthenticated"
                @click="toggleReviewForm"
                class="btn-add-review"
              >
                <i class="fas" :class="showReviewForm ? 'fa-times' : 'fa-plus'"></i>
                {{ showReviewForm ? 'Cancelar' : 'Escrever Avaliação' }}
              </button>
            </div>

            <!-- Review Form -->
            <div v-if="showReviewForm" class="review-form-container">
              <form @submit.prevent="submitReview" class="review-form">
                <h4>Sua Avaliação</h4>

                <!-- Rating -->
                <div class="form-group">
                  <label>Nota:</label>
                  <div class="rating-input">
                    <button
                      v-for="star in 5"
                      :key="star"
                      type="button"
                      @click="reviewForm.rating = star"
                      class="star-btn"
                      :class="{ active: star <= reviewForm.rating }"
                    >
                      <i class="fas fa-star"></i>
                    </button>
                  </div>
                </div>

                <!-- Title -->
                <div class="form-group">
                  <label for="review-title">Título:</label>
                  <input
                    id="review-title"
                    v-model="reviewForm.title"
                    type="text"
                    placeholder="Resuma sua experiência"
                    maxlength="100"
                    required
                  />
                </div>

                <!-- Comment -->
                <div class="form-group">
                  <label for="review-comment">Comentário:</label>
                  <textarea
                    id="review-comment"
                    v-model="reviewForm.comment"
                    rows="4"
                    placeholder="Conte-nos mais sobre sua experiência com este produto"
                    required
                  ></textarea>
                </div>

                <div class="form-actions">
                  <button
                    type="button"
                    @click="toggleReviewForm"
                    class="btn-cancel"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    class="btn-submit"
                    :disabled="submittingReview"
                  >
                    <i v-if="submittingReview" class="fas fa-spinner fa-spin"></i>
                    {{ submittingReview ? 'Enviando...' : 'Enviar Avaliação' }}
                  </button>
                </div>
              </form>
            </div>

            <!-- Reviews List -->
            <div class="reviews-list">
              <div v-if="loadingReviews" class="loading-reviews">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Carregando avaliações...</p>
              </div>

              <div v-else-if="reviews.length === 0" class="no-reviews">
                <i class="fas fa-comment-slash"></i>
                <p>Ainda não há avaliações para este produto</p>
                <button
                  v-if="isMounted && isAuthenticated"
                  @click="toggleReviewForm"
                  class="btn-first-review"
                >
                  Seja o primeiro a avaliar!
                </button>
              </div>

              <div v-else class="review-items">
                <div v-for="review in reviews" :key="review.id" class="review-item">
                  <div class="review-header">
                    <div class="review-author">
                      <div class="author-avatar">
                        <i class="fas fa-user"></i>
                      </div>
                      <div class="author-info">
                        <span class="author-name">{{ review.user?.name || 'Usuário' }}</span>
                        <span class="review-date">{{ new Date(review.createdAt).toLocaleDateString('pt-BR') }}</span>
                      </div>
                    </div>
                    <div class="review-rating">
                      <i
                        v-for="star in 5"
                        :key="star"
                        class="fas fa-star"
                        :class="{ filled: star <= review.rating }"
                      ></i>
                    </div>
                  </div>
                  <h5 class="review-title">{{ review.title }}</h5>
                  <p class="review-comment">{{ review.comment }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Related Products -->
      <div class="related-products" v-if="relatedProducts.length > 0">
        <h2>Produtos Relacionados</h2>
        <div class="products-grid">
          <ProductCard 
            v-for="relatedProduct in relatedProducts" 
            :key="relatedProduct.id" 
            :product="relatedProduct"
            variant="complete"
            :is-favorite="isFavorite(relatedProduct.id)"
            :show-stock-badge="true"
            :show-favorite-button="isAuthenticated && isMounted"
            :show-quantity-control="true"
            :show-category="true"
            :show-sku="true"
            @toggle-favorite="toggleRelatedFavorite(relatedProduct.id)"
            @add-to-cart="handleAddRelatedToCart"
          />
        </div>
      </div>
    </div>

    <!-- Product Form Modal (Admin) -->
    <ProductFormModal
      v-if="isMounted && isCompanyAdmin"
      :is-open="showProductModal"
      :product="product"
      :company-id="companyId"
      @close="showProductModal = false"
      @success="handleProductSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCart } from '~/composables/useCart'
import { useWishlist } from '~/composables/useWishlist'
import { useAuth } from '~/composables/useAuth'
import { useCompany } from '~/composables/useCompany'
import { useStorePublic } from '~/composables/useStorePublic'
import { useClientMounted } from '~/composables/useClientMounted'
import ProductCard from '~/components/common/ProductCard.vue'
import ProductFormModal from '~/components/admin/ProductFormModal.vue'
import type { StoreProduct } from '~/types/api'
import { api } from '~/utils/api'

const route = useRoute()
const router = useRouter()
const { isMounted } = useClientMounted()
const { addItem, openCart } = useCart()
const { isFavorite, toggleFavorite, fetchFavorites } = useWishlist()
const { isAuthenticated, user, isCompanyAdmin } = useAuth()
const { companyId } = useCompany()
const { products, fetchProducts } = useStorePublic()

// State
const product = ref<any>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const quantity = ref(1)
const currentImageIndex = ref(0)
const addingToCart = ref(false)
const togglingFavorite = ref(false)
const activeTab = ref('description')
const relatedProducts = ref<any[]>([])
const showProductModal = ref(false)

// Reviews state
const reviews = ref<any[]>([])
const loadingReviews = ref(false)
const showReviewForm = ref(false)
const reviewForm = ref({
  rating: 5,
  title: '',
  comment: ''
})
const submittingReview = ref(false)

// Tabs configuration
const tabs = [
  { id: 'description', label: 'Descrição', icon: 'fas fa-align-left' },
  { id: 'ingredients', label: 'Ingredientes', icon: 'fas fa-list' },
  { id: 'details', label: 'Especificações', icon: 'fas fa-info-circle' },
  { id: 'reviews', label: 'Avaliações', icon: 'fas fa-star' },
]

// Modal functions
const openEditModal = async () => {
  try {
    // Buscar dados mais recentes do produto antes de abrir a modal
    loading.value = true
    await loadProduct()
    showProductModal.value = true
  } catch (err) {
    console.error('Erro ao carregar dados do produto:', err)
    alert('Erro ao carregar dados do produto. Tente novamente.')
  } finally {
    loading.value = false
  }
}

const handleProductSuccess = async () => {
  showProductModal.value = false
  // Reload product
  await loadProduct()
  alert('Produto atualizado com sucesso!')
}

// Computed
const productImages = computed(() => {
  if (!product.value) return []
  
  const prod = product.value as any
  
  // Se tem images array
  if (prod.images && prod.images.length > 0) {
    return prod.images
      .sort((a: any, b: any) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0))
      .map((img: any) => img.url)
  }
  
  // Se tem imageUrls array
  if (prod.imageUrls && prod.imageUrls.length > 0) {
    return prod.imageUrls
  }
  
  // Fallback para SKU ou imagem padrão
  if (prod.sku) {
    return [`/products/${prod.sku}.png`]
  }
  
  return ['/products/photo_default.png']
})

const currentImage = computed(() => {
  return productImages.value[currentImageIndex.value] || productImages.value[0]
})

// Methods
const formatPrice = (price: number | undefined) => {
  if (!price) return '0,00'
  return price.toFixed(2).replace('.', ',')
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const increaseQuantity = () => {
  if (product.value && quantity.value < product.value.stock) {
    quantity.value++
  }
}

const addToCart = async () => {
  if (!product.value) return

  try {
    // Verificar autenticação
    if (!user.value?.id) {
      alert('Por favor, faça login para adicionar produtos ao carrinho')
      await router.push(`/login?redirect=/products/${product.value.id}`)
      return
    }

    // Validar quantidade
    if (quantity.value > product.value.stock) {
      alert(`Apenas ${product.value.stock} unidades disponíveis`)
      return
    }

    addingToCart.value = true
    await addItem(product.value.id, quantity.value)
    
    // Resetar quantidade e abrir carrinho
    quantity.value = 1
    openCart()
  } catch (err: any) {
    console.error('Erro ao adicionar ao carrinho:', err)
    alert(err.message || 'Erro ao adicionar produto ao carrinho')
  } finally {
    addingToCart.value = false
  }
}

const buyNow = async () => {
  await addToCart()
  if (product.value) {
    await router.push('/checkout')
  }
}

const toggleFavoriteProduct = async () => {
  if (!product.value) return
  
  try {
    togglingFavorite.value = true
    await toggleFavorite(product.value.id)
  } catch (err: any) {
    console.error('Erro ao favoritar produto:', err)
    alert(err.message || 'Erro ao favoritar produto')
  } finally {
    togglingFavorite.value = false
  }
}

const toggleRelatedFavorite = async (productId: string) => {
  try {
    await toggleFavorite(productId)
  } catch (err: any) {
    console.error('Erro ao favoritar produto:', err)
    alert(err.message || 'Erro ao favoritar produto')
  }
}

const handleAddRelatedToCart = async (productId: string, quantity: number) => {
  try {
    if (!user.value?.id) {
      alert('Por favor, faça login para adicionar produtos ao carrinho')
      await router.push(`/login?redirect=/products/${route.params.id}`)
      return
    }

    await addItem(productId, quantity)
    openCart()
  } catch (err: any) {
    console.error('Erro ao adicionar ao carrinho:', err)
    alert(err.message || 'Erro ao adicionar produto ao carrinho')
  }
}

const loadProduct = async () => {
  try {
    loading.value = true
    error.value = null

    const productId = route.params.id as string

    // Buscar produtos se ainda não foram carregados
    if (products.value.length === 0) {
      await fetchProducts()
    }

    // Encontrar o produto
    const foundProduct = products.value.find((p: any) => p.id === productId)
    
    if (!foundProduct) {
      error.value = 'Produto não encontrado'
      return
    }

    product.value = foundProduct

    // Buscar produtos relacionados (mesma categoria)
    relatedProducts.value = products.value
      .filter((p: any) => p.id !== productId && p.category === foundProduct.category)
      .slice(0, 4)

    // Se autenticado, buscar favoritos
    if (user.value?.id) {
      await fetchFavorites()
    }

    // Buscar avaliações do produto
    await loadReviews()
  } catch (err: any) {
    console.error('Erro ao carregar produto:', err)
    error.value = err.message || 'Erro ao carregar produto'
  } finally {
    loading.value = false
  }
}

// Reviews functions
const loadReviews = async () => {
  try {
    loadingReviews.value = true
    const productId = route.params.id as string
    const response = await api.getProductReviews(productId)
    reviews.value = response.data || response || []
  } catch (err) {
    console.error('Erro ao carregar avaliações:', err)
    reviews.value = []
  } finally {
    loadingReviews.value = false
  }
}

const averageRating = computed(() => {
  if (reviews.value.length === 0) return 0
  const sum = reviews.value.reduce((acc, review) => acc + review.rating, 0)
  return (sum / reviews.value.length).toFixed(1)
})

const toggleReviewForm = () => {
  if (!user.value?.id) {
    alert('Por favor, faça login para avaliar este produto')
    router.push(`/login?redirect=/products/${route.params.id}`)
    return
  }
  showReviewForm.value = !showReviewForm.value
  if (!showReviewForm.value) {
    resetReviewForm()
  }
}

const resetReviewForm = () => {
  reviewForm.value = {
    rating: 5,
    title: '',
    comment: ''
  }
}

const submitReview = async () => {
  if (!user.value?.id) {
    alert('Por favor, faça login para avaliar')
    return
  }

  if (!reviewForm.value.title || !reviewForm.value.comment) {
    alert('Por favor, preencha todos os campos')
    return
  }

  try {
    submittingReview.value = true
    const productId = route.params.id as string
    
    await api.createReview({
      productId,
      rating: reviewForm.value.rating,
      title: reviewForm.value.title,
      comment: reviewForm.value.comment
    })

    alert('Avaliação enviada com sucesso!')
    showReviewForm.value = false
    resetReviewForm()
    await loadReviews()
  } catch (err: any) {
    console.error('Erro ao enviar avaliação:', err)
    alert(err.message || 'Erro ao enviar avaliação. Tente novamente.')
  } finally {
    submittingReview.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadProduct()
})

// Watch route changes
watch(() => route.params.id, () => {
  if (route.params.id) {
    loadProduct()
    window.scrollTo(0, 0)
  }
})
</script>

<style lang="scss" scoped>
.product-detail-page {
  min-height: 100vh;
  background: var(--background);
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }

  // Loading & Error States
  .loading-state,
  .error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    text-align: center;

    i {
      font-size: 4rem;
      color: var(--primary);
      margin-bottom: 1rem;
    }

    h2 {
      color: var(--text);
      margin-bottom: 0.5rem;
    }

    p {
      color: #666;
      margin-bottom: 2rem;
    }

    .btn-back {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 2rem;
      background: var(--primary);
      color: white;
      text-decoration: none;
      border-radius: 50px;
      font-weight: 600;
      transition: all 0.3s ease;

      &:hover {
        background: var(--secondary);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(139, 0, 20, 0.3);
      }
    }
  }

  // Breadcrumb
  .breadcrumb {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 2rem;
    font-size: 0.9rem;
    flex-wrap: wrap;

    a {
      color: #666;
      text-decoration: none;
      transition: color 0.2s;

      &:hover {
        color: var(--primary);
      }

      i {
        margin-right: 0.5rem;
      }
    }

    i.fa-chevron-right {
      font-size: 0.7rem;
      color: #ccc;
    }

    span {
      color: var(--text);
      font-weight: 600;
    }
  }

  // Product Content
  .product-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    margin-bottom: 4rem;

    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
  }

  // Product Gallery
  .product-gallery {
    .main-image {
      position: relative;
      width: 100%;
      aspect-ratio: 1;
      border-radius: 20px;
      overflow: hidden;
      background: white;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      margin-bottom: 1rem;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .stock-badge {
        position: absolute;
        top: 1.5rem;
        right: 1.5rem;
        padding: 0.75rem 1.25rem;
        background: var(--accent);
        color: white;
        border-radius: 30px;
        font-size: 0.9rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 10;

        &.out-of-stock {
          background: #666;
        }
      }

      .favorite-btn-large {
        position: absolute;
        bottom: 1.5rem;
        right: 1.5rem;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: white;
        border: 2px solid #ddd;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        z-index: 10;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

        i {
          font-size: 1.5rem;
          color: #ccc;
          transition: all 0.3s ease;
        }

        &:hover:not(:disabled) {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);

          i {
            color: var(--primary);
          }
        }

        &.is-favorite {
          background: var(--primary);
          border-color: var(--primary);

          i {
            color: white;
            animation: heartbeat 0.6s ease-out;
          }

          &:hover:not(:disabled) {
            background: var(--secondary);
            border-color: var(--secondary);
          }
        }

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      }
    }

    .thumbnail-gallery {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
      gap: 0.75rem;

      .thumbnail {
        aspect-ratio: 1;
        border-radius: 12px;
        overflow: hidden;
        border: 2px solid transparent;
        background: white;
        cursor: pointer;
        transition: all 0.3s ease;
        padding: 0;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        &:hover {
          border-color: var(--primary);
          opacity: 0.8;
        }

        &.active {
          border-color: var(--primary);
          box-shadow: 0 2px 8px rgba(139, 0, 20, 0.3);
        }
      }
    }
  }

  // Product Info
  .product-info {
    .product-meta {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;

      .category-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        color: white;
        border-radius: 20px;
        font-size: 0.85rem;
        font-weight: 600;
      }

      .sku-badge {
        font-size: 0.85rem;
        color: #999;
        font-weight: 500;
      }
    }

    .product-name-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 1rem;

      .product-name {
        font-size: 2.5rem;
        color: var(--text);
        font-weight: 700;
        line-height: 1.2;
        margin: 0;

        @media (max-width: 768px) {
          font-size: 2rem;
        }
      }

      .btn-edit-product {
        padding: 0.75rem 1.5rem;
        background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
        color: white;
        border: none;
        border-radius: 12px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(255, 105, 180, 0.3);
        white-space: nowrap;
        font-size: 1rem;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(255, 105, 180, 0.4);
        }

        i {
          font-size: 1rem;
        }
      }

      @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;

        .btn-edit-product {
          width: 100%;
          justify-content: center;
        }
      }
    }

    .product-description {
      font-size: 1.1rem;
      color: #666;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    .product-rating {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;

      .stars {
        display: flex;
        gap: 0.25rem;

        i {
          color: #ffc107;
          font-size: 1.2rem;
        }
      }

      .rating-text {
        color: #666;
        font-size: 0.95rem;
      }
    }

    .price-section {
      margin-bottom: 1.5rem;
      padding: 1.5rem;
      background: linear-gradient(135deg, #fff5f7, #ffe8ec);
      border-radius: 16px;
      border: 2px solid var(--primary);

      .price {
        display: block;
        font-size: 3rem;
        color: var(--primary);
        font-weight: 700;
        line-height: 1;
        margin-bottom: 0.5rem;

        @media (max-width: 768px) {
          font-size: 2.5rem;
        }
      }

      .price-label {
        font-size: 1rem;
        color: #666;
      }
    }

    .stock-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      background: white;
      border-radius: 12px;
      margin-bottom: 1.5rem;
      border: 2px solid #e0e0e0;

      i {
        font-size: 1.5rem;

        &.fa-check-circle {
          color: #4caf50;
        }

        &.fa-times-circle {
          color: #f44336;
        }
      }

      span {
        color: #666;
        font-size: 0.95rem;

        strong {
          color: var(--text);
        }
      }
    }

    .quantity-section {
      margin-bottom: 1.5rem;

      label {
        display: block;
        font-weight: 600;
        color: var(--text);
        margin-bottom: 0.75rem;
        font-size: 1.1rem;
      }

      .quantity-control {
        display: flex;
        align-items: center;
        gap: 1rem;

        .quantity-btn {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          border: 2px solid var(--primary);
          background: white;
          color: var(--primary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          font-size: 1.2rem;

          &:hover:not(:disabled) {
            background: var(--primary);
            color: white;
            transform: scale(1.05);
          }

          &:disabled {
            opacity: 0.3;
            cursor: not-allowed;
          }
        }

        .quantity-input {
          width: 80px;
          height: 50px;
          text-align: center;
          font-size: 1.5rem;
          font-weight: 700;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          color: var(--text);

          &:focus {
            outline: none;
            border-color: var(--primary);
          }

          &:disabled {
            background: #f5f5f5;
            opacity: 0.6;
          }
        }
      }
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;

      @media (max-width: 600px) {
        flex-direction: column;
      }

      .btn-add-cart,
      .btn-buy-now {
        flex: 1;
        padding: 1.25rem 2rem;
        border-radius: 50px;
        font-size: 1.1rem;
        font-weight: 700;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
        transition: all 0.3s ease;
        text-transform: uppercase;
        letter-spacing: 0.5px;

        i {
          font-size: 1.3rem;
        }

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
        }
      }

      .btn-add-cart {
        background: var(--primary);
        color: white;

        &:hover:not(:disabled) {
          background: var(--secondary);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(139, 0, 20, 0.4);
        }
      }

      .btn-buy-now {
        background: var(--accent);
        color: white;

        &:hover:not(:disabled) {
          background: #c17b1f;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(218, 137, 30, 0.4);
        }
      }
    }

    .additional-info {
      display: grid;
      gap: 1rem;
      padding: 1.5rem;
      background: white;
      border-radius: 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

      .info-item {
        display: flex;
        align-items: center;
        gap: 1rem;

        i {
          font-size: 2rem;
          color: var(--primary);
          width: 40px;
          flex-shrink: 0;
        }

        strong {
          display: block;
          color: var(--text);
          margin-bottom: 0.25rem;
        }

        p {
          font-size: 0.9rem;
          color: #666;
          margin: 0;
        }
      }
    }
  }

  // Product Details Tabs
  .product-details-tabs {
    background: white;
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    margin-bottom: 4rem;

    .tabs-header {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      border-bottom: 2px solid #f0f0f0;
      overflow-x: auto;

      .tab-btn {
        padding: 1rem 2rem;
        background: none;
        border: none;
        border-bottom: 3px solid transparent;
        cursor: pointer;
        color: #666;
        font-weight: 600;
        font-size: 1rem;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        white-space: nowrap;

        i {
          font-size: 1.1rem;
        }

        &:hover {
          color: var(--primary);
        }

        &.active {
          color: var(--primary);
          border-bottom-color: var(--primary);
        }
      }
    }

    .tabs-content {
      .tab-pane {
        animation: fadeIn 0.3s ease;

        h3 {
          font-size: 1.5rem;
          color: var(--text);
          margin-bottom: 1rem;
        }

        p {
          font-size: 1.05rem;
          color: #666;
          line-height: 1.8;
          margin-bottom: 1rem;
        }

        .ingredients-list {
          list-style: none;
          padding: 0;
          margin: 0;

          li {
            padding: 0.75rem 1rem;
            margin-bottom: 0.5rem;
            background: #f9f9f9;
            border-left: 4px solid var(--primary);
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-size: 1.05rem;
            color: var(--text);
            transition: all 0.3s ease;

            i {
              color: var(--primary);
              font-size: 1rem;
            }

            &:hover {
              background: #f0f0f0;
              transform: translateX(5px);
            }
          }
        }

        .no-ingredients {
          padding: 2rem;
          background: #f9f9f9;
          border-radius: 12px;
          text-align: center;
          color: #666;
          font-style: italic;
        }

        .specs-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0 0.5rem;

          tr {
            background: var(--surface);

            td {
              padding: 1rem 1.5rem;
              color: #666;

              &:first-child {
                border-radius: 12px 0 0 12px;
                color: var(--text);
              }

              &:last-child {
                border-radius: 0 12px 12px 0;
              }
            }
          }
        }
      }
    }
  }

  // Related Products
  .related-products {
    h2 {
      font-size: 2rem;
      color: var(--text);
      margin-bottom: 2rem;
      text-align: center;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 2rem;
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes heartbeat {
  0%, 100% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.3);
  }
  50% {
    transform: scale(1.1);
  }
  75% {
    transform: scale(1.2);
  }
}

// Reviews Styles
.reviews-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #f0f0f0;

  .reviews-summary {
    flex: 1;

    h3 {
      margin-bottom: 1rem;
    }
  }

  .rating-summary {
    .average-rating {
      display: flex;
      align-items: center;
      gap: 1rem;

      .rating-number {
        font-size: 3rem;
        font-weight: 700;
        color: var(--primary);
      }

      .stars-display {
        display: flex;
        gap: 0.25rem;

        i {
          font-size: 1.5rem;
          color: #ddd;

          &.filled {
            color: #FFD700;
          }
        }
      }

      .review-count {
        color: #666;
        font-size: 0.95rem;
      }
    }
  }

  .btn-add-review {
    padding: 0.875rem 1.5rem;
    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(255, 105, 180, 0.3);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(255, 105, 180, 0.4);
    }
  }
}

.review-form-container {
  background: #f9f9f9;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;

  .review-form {
    h4 {
      font-size: 1.25rem;
      color: var(--text);
      margin-bottom: 1.5rem;
    }

    .form-group {
      margin-bottom: 1.5rem;

      label {
        display: block;
        font-weight: 600;
        color: var(--text);
        margin-bottom: 0.5rem;
      }

      input,
      textarea {
        width: 100%;
        padding: 0.875rem 1rem;
        border: 2px solid #e0e0e0;
        border-radius: 12px;
        font-size: 1rem;
        transition: all 0.3s ease;
        box-sizing: border-box;

        &:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(255, 105, 180, 0.1);
        }
      }

      textarea {
        resize: vertical;
        min-height: 100px;
      }
    }

    .rating-input {
      display: flex;
      gap: 0.5rem;

      .star-btn {
        background: none;
        border: none;
        font-size: 2rem;
        color: #ddd;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover,
        &.active {
          color: #FFD700;
          transform: scale(1.1);
        }
      }
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;

      button {
        padding: 0.875rem 1.5rem;
        border-radius: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        box-sizing: border-box;
      }

      .btn-cancel {
        background: white;
        color: var(--text-light);
        border: 2px solid #e0e0e0;

        &:hover {
          background: #f5f5f5;
          border-color: #ccc;
        }
      }

      .btn-submit {
        background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
        color: white;
        border: none;
        box-shadow: 0 4px 12px rgba(255, 105, 180, 0.3);

        &:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(255, 105, 180, 0.4);
        }

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      }
    }
  }
}

.reviews-list {
  .loading-reviews,
  .no-reviews {
    text-align: center;
    padding: 3rem 2rem;
    color: #666;

    i {
      font-size: 3rem;
      color: var(--accent);
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    p {
      font-size: 1.1rem;
      margin-bottom: 1.5rem;
    }

    .btn-first-review {
      padding: 0.875rem 1.5rem;
      background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(255, 105, 180, 0.3);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(255, 105, 180, 0.4);
      }
    }
  }

  .review-items {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    .review-item {
      background: white;
      border: 2px solid #f0f0f0;
      border-radius: 16px;
      padding: 1.5rem;
      transition: all 0.3s ease;

      &:hover {
        border-color: var(--primary);
        box-shadow: 0 4px 12px rgba(255, 105, 180, 0.1);
      }

      .review-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;

        .review-author {
          display: flex;
          align-items: center;
          gap: 1rem;

          .author-avatar {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.25rem;
          }

          .author-info {
            display: flex;
            flex-direction: column;

            .author-name {
              font-weight: 600;
              color: var(--text);
              font-size: 1rem;
            }

            .review-date {
              font-size: 0.875rem;
              color: #999;
            }
          }
        }

        .review-rating {
          display: flex;
          gap: 0.25rem;

          i {
            font-size: 1.125rem;
            color: #ddd;

            &.filled {
              color: #FFD700;
            }
          }
        }
      }

      .review-title {
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--text);
        margin-bottom: 0.5rem;
      }

      .review-comment {
        font-size: 1rem;
        color: #666;
        line-height: 1.6;
      }
    }
  }
}

@media (max-width: 768px) {
  .reviews-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;

    .btn-add-review {
      width: 100%;
      justify-content: center;
    }
  }

  .review-form-container {
    padding: 1.5rem;

    .form-actions {
      flex-direction: column;

      button {
        width: 100%;
        justify-content: center;
      }
    }
  }

  .review-items {
    .review-item {
      .review-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
      }
    }
  }
}
</style>

