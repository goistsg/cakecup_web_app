<template>
  <div 
    class="product-card" 
    :class="{ 'simple': variant === 'simple', 'clickable': true }"
    @click="goToProductDetail"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    <!-- Imagem do Produto -->
    <div class="product-image" @click.stop>
      <img :src="productImage" :alt="product.name">
      
      <!-- Badges de Estoque -->
      <div v-if="showStockBadge && productStock < 5 && productStock > 0" class="product-badge">
        <i class="fas fa-exclamation-circle"></i>
        Últimas unidades
      </div>
      <div v-if="showStockBadge && productStock === 0" class="product-badge out-of-stock">
        <i class="fas fa-times-circle"></i>
        Esgotado
      </div>
      
      <!-- Botão de Favoritar (modo normal) -->
      <button 
        v-if="showFavoriteButton && !isFavoritePage"
        class="favorite-btn" 
        :class="{ 'is-favorite': isFavorite }"
        @click.stop="toggleFavorite"
        :disabled="favoriteLoading"
      >
        <i class="fas" :class="favoriteLoading ? 'fa-spinner fa-spin' : 'fa-heart'"></i>
      </button>
      
      <!-- Botão de Remover Favorito (modo favoritos) -->
      <button 
        v-if="isFavoritePage"
        class="remove-favorite-btn" 
        @click.stop="removeFavorite"
        :disabled="favoriteLoading"
      >
        <i class="fas" :class="favoriteLoading ? 'fa-spinner fa-spin' : 'fa-heart-broken'"></i>
      </button>

      <!-- Overlay simples (variant simple) -->
      <div v-if="variant === 'simple'" class="product-overlay" :class="{ 'is-visible': hover }">
        <button class="overlay-add-btn" @click="handleAddToCart(1)">
          Adicionar ao Carrinho
        </button>
      </div>
    </div>

    <!-- Informações do Produto -->
    <div class="product-info">
      <!-- Header com Categoria e SKU -->
      <div v-if="showCategoryAndSku" class="product-header">
        <span v-if="product.category" class="product-category">{{ product.category }}</span>
        <span v-if="productSku" class="product-sku">{{ productSku }}</span>
      </div>
      
      <!-- Nome -->
      <h3 class="product-title">{{ product.name }}</h3>
      
      <!-- Descrição -->
      <p v-if="product.description" class="product-description">
        {{ truncatedDescription }}
      </p>
      
      <!-- Footer com Preço e Ações -->
      <div class="product-footer">
        <div class="price-section">
          <span class="price">R$ {{ formattedPrice }}</span>
          <span v-if="variant !== 'simple'" class="price-unit">por unidade</span>
        </div>

        <!-- Ações (variant completo ou favorito) -->
        <div v-if="variant !== 'simple'" class="product-actions">
          <!-- Controle de Quantidade (apenas no variant completo) -->
          <div v-if="showQuantityControl" class="quantity-control">
            <button 
              @click="decreaseQuantity" 
              class="quantity-btn"
              :disabled="productStock === 0 || quantity <= 1"
            >
              <i class="fas fa-minus"></i>
            </button>
            <span class="quantity">{{ quantity }}</span>
            <button 
              @click="increaseQuantity" 
              class="quantity-btn"
              :disabled="productStock === 0 || quantity >= productStock"
            >
              <i class="fas fa-plus"></i>
            </button>
          </div>

          <!-- Botão Adicionar -->
          <button 
            @click="handleAddToCart(quantity)" 
            class="add-btn"
            :disabled="productStock === 0 || cartLoading"
          >
            <i class="fas" :class="cartLoading ? 'fa-spinner fa-spin' : 'fa-shopping-cart'"></i>
            {{ productStock === 0 ? 'Esgotado' : 'Adicionar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCart } from '~/composables/useCart'
import { useAuth } from '~/composables/useAuth'
import { useRouter } from 'vue-router'

interface ProductCardProps {
  product: any // Aceita Product, StoreProduct, ou qualquer formato
  variant?: 'simple' | 'complete' | 'favorite' // Tipo de card
  isFavorite?: boolean // Se está favoritado
  favoriteLoading?: boolean // Loading do favorito
  showStockBadge?: boolean // Mostrar badge de estoque
  showFavoriteButton?: boolean // Mostrar botão de favoritar
  showQuantityControl?: boolean // Mostrar controle de quantidade
  showCategoryAndSku?: boolean // Mostrar categoria e SKU
  isFavoritePage?: boolean // Se está na página de favoritos
}

const props = withDefaults(defineProps<ProductCardProps>(), {
  variant: 'simple',
  isFavorite: false,
  favoriteLoading: false,
  showStockBadge: false,
  showFavoriteButton: false,
  showQuantityControl: false,
  showCategoryAndSku: false,
  isFavoritePage: false,
})

const emit = defineEmits<{
  'toggle-favorite': [productId: string]
  'remove-favorite': [productId: string]
  'add-to-cart': [productId: string, quantity: number]
}>()

const router = useRouter()
const { addItem, openCart } = useCart()
const { user } = useAuth()

const hover = ref(false)
const quantity = ref(1)
const cartLoading = ref(false)

// Computed Properties
const productImage = computed(() => {
  const prod = props.product
  
  // Suportar imageUrls (array)
  if (prod.imageUrls && prod.imageUrls.length > 0) {
    return prod.imageUrls[0]
  }
  
  // Suportar imageUrl (string)
  if (prod.imageUrl) {
    return prod.imageUrl
  }
  
  // Suportar images (array de objetos)
  if (prod.images && prod.images.length > 0) {
    const primaryImage = prod.images.find((img: any) => img.isPrimary)
    return primaryImage?.url || prod.images[0].url
  }
  
  return '/products/photo_default.png'
})

const productStock = computed(() => {
  return props.product.stock !== undefined ? props.product.stock : 999
})

const productSku = computed(() => {
  return props.product.sku || ''
})

const formattedPrice = computed(() => {
  // Suportar tanto price quanto salePrice
  const price = props.product.salePrice || props.product.price || 0
  return price.toFixed(2)
})

const truncatedDescription = computed(() => {
  if (!props.product.description) return ''
  const maxLength = props.variant === 'simple' ? 80 : 100
  return props.product.description.length > maxLength 
    ? props.product.description.substring(0, maxLength) + '...'
    : props.product.description
})

// Methods
const increaseQuantity = () => {
  if (quantity.value < productStock.value) {
    quantity.value++
  } else {
    alert(`Estoque máximo atingido! Apenas ${productStock.value} unidades disponíveis.`)
  }
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const toggleFavorite = () => {
  if (!user.value?.id) {
    alert('Por favor, faça login para adicionar aos favoritos')
    router.push('/login?redirect=/products')
    return
  }
  emit('toggle-favorite', props.product.id)
}

const removeFavorite = () => {
  emit('remove-favorite', props.product.id)
}

const handleAddToCart = async (qty: number) => {
  try {
    if (productStock.value === 0) {
      alert('Produto esgotado!')
      return
    }

    if (!user.value?.id) {
      alert('Por favor, faça login para adicionar produtos ao carrinho')
      await router.push('/login?redirect=/products')
      return
    }

    if (qty > productStock.value) {
      alert(`Apenas ${productStock.value} unidades disponíveis`)
      return
    }

    cartLoading.value = true
    await addItem(props.product.id, qty)
    
    // Reset quantity após adicionar
    if (props.showQuantityControl) {
      quantity.value = 1
    }
    
    openCart()
    
    // Emit para o pai caso queira fazer algo
    emit('add-to-cart', props.product.id, qty)
  } catch (error: any) {
    console.error('Erro ao adicionar ao carrinho:', error)
    if (error.statusCode === 401) {
      alert('Sessão expirada. Por favor, faça login novamente.')
      await router.push('/login?redirect=/products')
    } else {
      alert(error.message || 'Erro ao adicionar produto ao carrinho')
    }
  } finally {
    cartLoading.value = false
  }
}

const goToProductDetail = () => {
  // Navegar para a página de detalhes do produto
  router.push(`/products/${props.product.id}`)
}
</script>

<style lang="scss" scoped>
.product-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  }

  &.clickable {
    cursor: pointer;
  }

  // Variant simples (home)
  &.simple {
    .product-info {
      text-align: center;
    }
  }
}

// === IMAGEM ===
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

  // Badges de Estoque
  .product-badge {
    position: absolute;
    top: 1rem;
    left: 1rem;
    padding: 0.5rem 1rem;
    background: #ff9800;
    color: white;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    z-index: 5;

    &.out-of-stock {
      background: #666;
    }

    i {
      font-size: 1rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
    }
  }

  // Botão de Favoritar
  .favorite-btn {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    width: 45px;
    height: 45px;
    border-radius: 50%;
    background: white;
    border: 2px solid #ddd;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    z-index: 10;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    i {
      font-size: 1.2rem;
      color: #ccc;
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
    }

    &:hover:not(:disabled) {
      transform: scale(1.1);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

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

  // Botão de Remover Favorito
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

  // Overlay (variant simple)
  .product-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 3;

    &.is-visible {
      opacity: 1;
    }

    .overlay-add-btn {
      padding: 0.75rem 1.5rem;
      background-color: var(--primary);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;

      &:hover {
        background-color: var(--secondary);
        transform: scale(1.05);
      }

      &:active {
        transform: scale(0.95);
      }
    }
  }
}

// === INFORMAÇÕES ===
.product-info {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;

  // Header com Categoria e SKU
  .product-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;

    .product-category {
      padding: 0.25rem 0.75rem;
      background: var(--surface);
      color: var(--primary);
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .product-sku {
      font-size: 0.8rem;
      color: #999;
      font-weight: 500;
    }
  }

  // Título
  .product-title {
    font-size: 1.25rem;
    color: var(--text);
    margin-bottom: 0.5rem;
    font-weight: 700;
    line-height: 1.3;
  }

  // Descrição
  .product-description {
    color: #666;
    font-size: 0.9rem;
    line-height: 1.5;
    margin-bottom: 1rem;
    flex: 1;
  }

  // Footer com Preço e Ações
  .product-footer {
    border-top: 1px solid var(--surface);
    padding-top: 1rem;

    .price-section {
      margin-bottom: 1rem;

      .price {
        display: block;
        font-size: 1.75rem;
        font-weight: 700;
        color: var(--primary);
        margin-bottom: 0.25rem;
      }

      .price-unit {
        font-size: 0.8rem;
        color: #999;
      }
    }

    // Ações
    .product-actions {
      display: flex;
      gap: 0.75rem;
      align-items: center;

      // Controle de Quantidade
      .quantity-control {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem;
        background: var(--surface);
        border-radius: 12px;

        .quantity-btn {
          width: 32px;
          height: 32px;
          border: none;
          background: white;
          color: var(--primary);
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

          i {
            font-size: 0.8rem;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            line-height: 1;
          }

          &:hover:not(:disabled) {
            background: var(--primary);
            color: white;
            transform: scale(1.1);
          }

          &:disabled {
            opacity: 0.4;
            cursor: not-allowed;
          }
        }

        .quantity {
          min-width: 32px;
          text-align: center;
          font-weight: 600;
          color: var(--text);
          font-size: 1rem;
        }
      }

      // Botão Adicionar
      .add-btn {
        flex: 1;
        padding: 0.875rem 1.25rem;
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
        box-shadow: 0 4px 12px rgba(139, 0, 20, 0.3);

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
          box-shadow: 0 6px 20px rgba(139, 0, 20, 0.4);
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

// Animação de batimento do coração
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

// Responsive
@media (max-width: 768px) {
  .product-image {
    height: 200px;
  }

  .product-info {
    padding: 1.25rem;

    .product-title {
      font-size: 1.1rem;
    }

    .product-footer {
      .price-section .price {
        font-size: 1.5rem;
      }

      .product-actions {
        flex-direction: column;
        gap: 0.5rem;

        .quantity-control,
        .add-btn {
          width: 100%;
        }
      }
    }
  }
}
</style> 