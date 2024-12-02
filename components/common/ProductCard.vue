<template>
  <div class="product-card" @mouseenter="hover = true" @mouseleave="hover = false">
    <div class="product-card__image">
      <img :src="product.image" :alt="product.name">
      <div class="product-card__overlay" :class="{ 'is-visible': hover }">
        <AppButton @click="addToCart">Adicionar ao Carrinho</AppButton>
      </div>
    </div>
    <div class="product-card__content">
      <h3 class="product-card__title">{{ product.name }}</h3>
      <p class="product-card__price">R$ {{ product.price.toFixed(2) }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'

const cartStore = useCartStore()

interface Product {
  id: number
  name: string
  price: number
  image: string
}

const props = defineProps<{
  product: Product
}>()

const hover = ref(false)

const addToCart = () => {
  cartStore.addItem({
    id: props.product.id,
    name: props.product.name,
    price: props.product.price,
    image: props.product.image
  })
  cartStore.toggleCart()
}
</script>

<style lang="scss">
.product-card {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  &__image {
    position: relative;
    aspect-ratio: 1;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;

    &.is-visible {
      opacity: 1;
    }
  }

  &__content {
    padding: 1rem;
    text-align: center;
  }

  &__title {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }

  &__price {
    color: #ff69b4;
    font-weight: bold;
  }
}
</style> 