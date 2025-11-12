<template>
  <div class="product-card" @mouseenter="hover = true" @mouseleave="hover = false">
    <div class="product-card__image">
      <img :src="productImage" :alt="product.name">
      <div class="product-card__overlay" :class="{ 'is-visible': hover }">
        <button class="add-to-cart-btn" @click="addToCart">
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
    <div class="product-card__content">
      <h3 class="product-card__title">{{ product.name }}</h3>
      <p v-if="product.description" class="product-card__description">
        {{ truncatedDescription }}
      </p>
      <p class="product-card__price">R$ {{ formattedPrice }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCart } from '~/composables/useCart'
import { useAuth } from '~/composables/useAuth'
import type { Product } from '~/types/api'

const props = defineProps<{
  product: Product
}>()

const { addItem, toggleCart } = useCart()
const { user } = useAuth()
const hover = ref(false)

const productImage = computed(() => {
  // Se o produto tem imagens, usar a primeira ou a primária
  if (props.product.images && props.product.images.length > 0) {
    const primaryImage = props.product.images.find(img => img.isPrimary)
    return primaryImage?.url || props.product.images[0].url
  }
  return '/products/photo_default.png'
})

const formattedPrice = computed(() => {
  return props.product.price.toFixed(2)
})

const truncatedDescription = computed(() => {
  if (!props.product.description) return ''
  return props.product.description.length > 80 
    ? props.product.description.substring(0, 80) + '...'
    : props.product.description
})

const addToCart = async () => {
  try {
    // Verificar se o usuário está autenticado
    if (!user.value?.id) {
      const router = useRouter()
      router.push('/login?redirect=/products')
      return
    }

    // Validar estoque
    const stock = props.product.stock || 0
    if (stock <= 0) {
      alert('Produto sem estoque!')
      return
    }

    await addItem(props.product.id, 1)
    toggleCart()
  } catch (error: any) {
    console.error('Erro ao adicionar ao carrinho:', error)
    alert(error.message || 'Erro ao adicionar ao carrinho')
  }
}
</script>

<style lang="scss">
.product-card {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  }

  &__image {
    position: relative;
    aspect-ratio: 1;
    overflow: hidden;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    &:hover img {
      transform: scale(1.05);
    }
  }

  &__overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;

    &.is-visible {
      opacity: 1;
    }

    .add-to-cart-btn {
      padding: 0.75rem 1.5rem;
      background-color: var(--primary);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.3s ease, transform 0.2s ease;

      &:hover {
        background-color: var(--secondary);
        transform: scale(1.05);
      }

      &:active {
        transform: scale(0.95);
      }
    }
  }

  &__content {
    padding: 1.25rem;
    text-align: center;
  }

  &__title {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    color: #333;
    font-weight: 600;
    line-height: 1.4;
  }

  &__description {
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 0.75rem;
    line-height: 1.5;
    min-height: 2.7em;
  }

  &__price {
    color: var(--primary);
    font-weight: bold;
    font-size: 1.4rem;
    margin-top: 0.5rem;
  }
}
</style> 