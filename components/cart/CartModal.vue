<template>
  <div v-if="cartStore.isOpen" class="carrinho-modal">
    <div class="carrinho-content">
      <header>
        <h2>Seu Carrinho</h2>
        <button @click="cartStore.closeCart()" class="close-btn">×</button>
      </header>

      <div v-if="cartStore.items.length > 0" class="items-list">
        <div v-for="item in cartStore.items" 
             :key="item.id" 
             class="cart-item">
          <img :src="item.imagem" :alt="item.nome">
          <div class="item-info">
            <h3>{{ item.nome }}</h3>
            <p>R$ {{ item.preco.toFixed(2) }}</p>
          </div>
          <div class="quantidade">
            <button @click="diminuirQuantidade(item.id)">-</button>
            <span>{{ item.quantidade }}</span>
            <button @click="aumentarQuantidade(item.id)">+</button>
          </div>
          <button @click="cartStore.removerItem(item.id)" 
                  class="remove-btn">
            Remover
          </button>
        </div>
      </div>
      
      <div v-else class="empty-cart">
        <p>Seu carrinho está vazio</p>
      </div>

      <footer v-if="cartStore.items.length > 0">
        <div class="total">
          <span>Total:</span>
          <strong>R$ {{ cartStore.total.toFixed(2) }}</strong>
        </div>
        <button @click="finalizarPedido" class="checkout-btn">
          Finalizar Pedido
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'

const cartStore = useCartStore()

const aumentarQuantidade = (itemId: number) => {
  const item = cartStore.items.find((i: any) => i.id === itemId)
  if (item) {
    cartStore.atualizarQuantidade(itemId, item.quantidade + 1)
  }
}

const diminuirQuantidade = (itemId: number) => {
  const item = cartStore.items.find((i: any) => i.id === itemId)
  if (item && item.quantidade > 1) {
    cartStore.atualizarQuantidade(itemId, item.quantidade - 1)
  }
}

const finalizarPedido = () => {
  // Implementar lógica de checkout
  console.log('Implementar checkout')
}
</script>

<style lang="scss" scoped>
.carrinho-modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 400px;
  background: white;
  box-shadow: -2px 0 10px rgba(0,0,0,0.1);
  z-index: 1000;
  animation: slideIn 0.3s ease-out;

  .carrinho-content {
    display: flex;
    flex-direction: column;
    height: 100%;

    header {
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #eee;

      h2 {
        margin: 0;
        color: var(--primary-color);
      }

      .close-btn {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #666;
        
        &:hover {
          color: var(--primary-color);
        }
      }
    }

    .items-list {
      flex: 1;
      overflow-y: auto;
      padding: 1rem;

      .cart-item {
        display: grid;
        grid-template-columns: 80px 1fr auto auto;
        gap: 1rem;
        align-items: center;
        padding: 1rem;
        border-bottom: 1px solid #eee;

        img {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 4px;
        }

        .quantidade {
          display: flex;
          align-items: center;
          gap: 0.5rem;

          button {
            padding: 0.25rem 0.5rem;
            border: 1px solid #ddd;
            background: white;
            cursor: pointer;
            
            &:hover {
              background: #f5f5f5;
            }
          }
        }

        .remove-btn {
          color: var(--primary-color);
          background: none;
          border: none;
          cursor: pointer;
          
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }

    .empty-cart {
      padding: 2rem;
      text-align: center;
      color: #666;
    }

    footer {
      padding: 1rem;
      border-top: 1px solid #eee;
      background: white;

      .total {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1rem;
        font-size: 1.2rem;
      }

      .checkout-btn {
        width: 100%;
        padding: 1rem;
        background-color: var(--primary-color);
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
        transition: background-color 0.3s;

        &:hover {
          background-color: #ff4081;
        }
      }
    }
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
    width: 100%;
  }
}
</style> 