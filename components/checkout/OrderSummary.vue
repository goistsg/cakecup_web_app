<template>
  <div class="order-summary">
    <h2>
      <i class="fas fa-receipt"></i>
      Resumo do Pedido
    </h2>

    <!-- Items do Carrinho -->
    <div class="summary-items">
      <div v-for="item in items" :key="item.id" class="summary-item">
        <img :src="getProductImage(item)" :alt="item.product?.name">
        <div class="item-details">
          <h4>{{ item.product?.name }}</h4>
          <p class="quantity">{{ item.quantity }}x R$ {{ item.price.toFixed(2) }}</p>
        </div>
        <div class="item-total">
          R$ {{ (item.quantity * item.price).toFixed(2) }}
        </div>
      </div>
    </div>

    <!-- Valores -->
    <div class="summary-values">
      <div class="value-row">
        <span>Subtotal</span>
        <strong>R$ {{ subtotal.toFixed(2) }}</strong>
      </div>

      <div v-if="deliveryFee !== null" class="value-row">
        <span>
          <i class="fas fa-truck"></i>
          Frete ({{ deliveryMethod }})
        </span>
        <strong :class="{ free: deliveryFee === 0 }">
          {{ deliveryFee === 0 ? 'GRÁTIS' : `R$ ${deliveryFee.toFixed(2)}` }}
        </strong>
      </div>


      <div class="value-row total">
        <span>Total</span>
        <strong>R$ {{ total.toFixed(2) }}</strong>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CartItem } from '~/types/api'

const props = defineProps<{
  items: CartItem[]
  deliveryFee: number | null
  deliveryMethod: string | null
}>()

const subtotal = computed(() => {
  return props.items.reduce((sum, item) => sum + (item.quantity * item.price), 0)
})

const total = computed(() => {
  const fee = props.deliveryFee || 0
  return subtotal.value + fee
})

const getProductImage = (item: CartItem) => {
  if (item.product?.imageUrls && item.product.imageUrls.length > 0) {
    return item.product.imageUrls[0]
  }
  return '/products/photo_default.png'
}
</script>

<style lang="scss" scoped>
.order-summary {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  position: sticky;
  top: 2rem;

  h2 {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
    color: var(--primary);
    font-size: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #f0f0f0;

    i {
      font-size: 1.3rem;
    }
  }
}

.summary-items {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 1.5rem;
  padding-right: 0.5rem;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 3px;
  }
}

.summary-item {
  display: grid;
  grid-template-columns: 60px 1fr auto;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #f5f5f5;
  transition: background-color 0.2s;

  &:hover {
    background-color: #fafafa;
  }

  &:last-child {
    border-bottom: none;
  }

  img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 8px;
  }

  .item-details {
    h4 {
      font-size: 0.95rem;
      margin: 0 0 0.25rem 0;
      color: #333;
      font-weight: 600;
    }

    .quantity {
      font-size: 0.85rem;
      color: #666;
      margin: 0;
    }
  }

  .item-total {
    font-weight: 700;
    color: var(--primary);
    font-size: 1rem;
  }
}

.summary-values {
  padding-top: 1.5rem;
  border-top: 2px dashed #e0e0e0;
}

.value-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  font-size: 1rem;

  span {
    color: #666;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    i {
      font-size: 0.9rem;
    }
  }

  strong {
    color: #333;
    font-size: 1.1rem;

    &.free {
      color: #27ae60;
      font-weight: 700;
    }
  }


  &.total {
    margin-top: 1rem;
    padding-top: 1.5rem;
    border-top: 2px solid #e0e0e0;
    font-size: 1.2rem;

    span {
      color: #333;
      font-weight: 600;
      font-size: 1.3rem;
    }

    strong {
      color: var(--primary);
      font-size: 1.8rem;
      font-weight: 700;
    }
  }
}

@media (max-width: 1024px) {
  .order-summary {
    position: relative;
    top: 0;
  }
}

@media (max-width: 768px) {
  .summary-item {
    grid-template-columns: 50px 1fr auto;
    gap: 0.75rem;
    padding: 0.75rem;

    img {
      width: 50px;
      height: 50px;
    }
  }

  .value-row {
    font-size: 0.9rem;

    strong {
      font-size: 1rem;
    }

    &.total {
      span {
        font-size: 1.1rem;
      }

      strong {
        font-size: 1.5rem;
      }
    }
  }
}
</style>

