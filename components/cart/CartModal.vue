<template>
  <div v-if="cartStore.isOpen" class="carrinho-modal" @click.self="cartStore.closeCart()">
    <div class="carrinho-content">
      <header>
        <h2>Seu Carrinho</h2>
        <button @click="cartStore.closeCart()" class="close-btn">×</button>
      </header>

      <div v-if="cartStore.items.length > 0" class="items-list">
        <div v-for="item in cartStore.items" 
             :key="item.id" 
             class="cart-item">
          <img :src="getProductImage(item)" :alt="item.product?.name || 'Produto'">
          <div class="item-info">
            <h3>{{ item.product?.name || 'Produto' }}</h3>
            <p>R$ {{ item.price.toFixed(2) }}</p>
          </div>
          <div class="quantidade">
            <button @click="diminuirQuantidade(item.id)">-</button>
            <span>{{ item.quantity }}</span>
            <button @click="aumentarQuantidade(item.id)">+</button>
          </div>
          <button @click="removerItem(item.id)" 
                  class="remove-btn">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
      
      <div v-else class="empty-cart">
        <i class="fas fa-shopping-cart"></i>
        <p>Seu carrinho está vazio</p>
        <NuxtLink to="/products" @click="cartStore.closeCart()" class="btn-shop">
          Ver Produtos
        </NuxtLink>
      </div>

      <footer v-if="cartStore.items.length > 0">
        <div class="total">
          <span>Total:</span>
          <strong>{{ cartStore.formattedTotal }}</strong>
        </div>
        <button @click="irParaCheckout" class="checkout-btn">
          <i class="fas fa-check-circle"></i>
          Finalizar Pedido
        </button>
        <button @click="cartStore.closeCart()" class="continue-btn">
          Continuar Comprando
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCartStore } from '~/stores/cart'
import { useAuth } from '~/composables/useAuth'
import type { Product } from '~/types/api'

const router = useRouter()
const cartStore = useCartStore()
const { isAuthenticated } = useAuth()

const getProductImage = (item: any) => {
  if (item.product?.images && item.product.images.length > 0) {
    const primaryImage = item.product.images.find((img: any) => img.isPrimary)
    return primaryImage?.url || item.product.images[0].url
  }
  return '/products/photo_default.png'
}

const aumentarQuantidade = async (itemId: string) => {
  const item = cartStore.items.find((i: any) => i.id === itemId)
  if (item) {
    await cartStore.updateQuantity(itemId, item.quantity + 1)
  }
}

const diminuirQuantidade = async (itemId: string) => {
  const item = cartStore.items.find((i: any) => i.id === itemId)
  if (item && item.quantity > 1) {
    await cartStore.updateQuantity(itemId, item.quantity - 1)
  }
}

const removerItem = async (itemId: string) => {
  if (confirm('Deseja remover este item do carrinho?')) {
    await cartStore.removeItem(itemId)
  }
}

const irParaCheckout = () => {
  if (!isAuthenticated.value) {
    // Redirecionar para login antes do checkout
    cartStore.closeCart()
    router.push('/login?redirect=/checkout')
  } else {
    cartStore.closeCart()
    router.push('/checkout')
  }
}
</script>

<style lang="scss" scoped>
.carrinho-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
  animation: fadeIn 0.3s ease-out;

  .carrinho-content {
    width: 450px;
    max-width: 100%;
    background: white;
    display: flex;
    flex-direction: column;
    height: 100%;
    animation: slideIn 0.3s ease-out;
    box-shadow: -2px 0 20px rgba(0,0,0,0.2);

    header {
      padding: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #f0f0f0;
      background: #fff;

      h2 {
        margin: 0;
        color: var(--primary);
        font-size: 1.5rem;
      }

      .close-btn {
        background: none;
        border: none;
        font-size: 2rem;
        cursor: pointer;
        color: #666;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        
        &:hover {
          background-color: #f0f0f0;
          color: var(--primary);
        }
      }
    }

    .items-list {
      flex: 1;
      overflow-y: auto;
      padding: 1rem;

      .cart-item {
        display: grid;
        grid-template-columns: 80px 1fr 80px 40px;
        gap: 1rem;
        align-items: center;
        padding: 1rem;
        border-bottom: 1px solid #f0f0f0;
        transition: background-color 0.2s ease;

        &:hover {
          background-color: #fafafa;
        }

        img {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 8px;
        }

        .item-info {
          h3 {
            margin: 0 0 0.5rem 0;
            font-size: 1rem;
            color: #333;
          }

          p {
            margin: 0;
            color: var(--primary);
            font-weight: 600;
            font-size: 1.1rem;
          }
        }

        .quantidade {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background-color: #f5f5f5;
          border-radius: 20px;
          padding: 0.25rem;

          button {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            border: none;
            background: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: var(--primary);
            transition: all 0.2s ease;
            
            &:hover {
              background: var(--primary);
              color: white;
            }
          }

          span {
            min-width: 20px;
            text-align: center;
            font-weight: 600;
          }
        }

        .remove-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #e74c3c;
          font-size: 1.1rem;
          padding: 0.5rem;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          
          &:hover {
            background-color: #fee;
            color: #c0392b;
          }
        }
      }
    }

    .empty-cart {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem 2rem;
      text-align: center;
      color: #999;

      i {
        font-size: 4rem;
        margin-bottom: 1rem;
        color: #ddd;
      }

      p {
        font-size: 1.1rem;
        margin-bottom: 1.5rem;
      }

      .btn-shop {
        padding: 0.75rem 2rem;
        background-color: var(--primary);
        color: white;
        text-decoration: none;
        border-radius: 25px;
        font-weight: 600;
        transition: all 0.3s ease;

        &:hover {
          background-color: var(--secondary);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 105, 180, 0.3);
        }
      }
    }

    footer {
      padding: 1.5rem;
      border-top: 2px solid #f0f0f0;
      background: white;

      .total {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1rem;
        font-size: 1.3rem;
        padding: 1rem;
        background-color: #f9f9f9;
        border-radius: 8px;

        strong {
          color: var(--primary);
        }
      }

      .checkout-btn {
        width: 100%;
        padding: 1rem;
        background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
        color: white;
        border: none;
        border-radius: 25px;
        cursor: pointer;
        font-weight: 600;
        font-size: 1.1rem;
        transition: all 0.3s ease;
        margin-bottom: 0.75rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;

        i {
          font-size: 1.2rem;
        }

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(255, 105, 180, 0.4);
        }

        &:active {
          transform: translateY(0);
        }
      }

      .continue-btn {
        width: 100%;
        padding: 0.75rem;
        background: white;
        color: #666;
        border: 2px solid #f0f0f0;
        border-radius: 25px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;

        &:hover {
          border-color: var(--primary);
          color: var(--primary);
        }
      }
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

@media (max-width: 768px) {
  .carrinho-modal {
    .carrinho-content {
      width: 100%;

      .items-list .cart-item {
        grid-template-columns: 60px 1fr 70px 36px;
        gap: 0.75rem;
        padding: 0.75rem;

        img {
          width: 60px;
          height: 60px;
        }

        .item-info h3 {
          font-size: 0.9rem;
        }
      }
    }
  }
}
</style> 