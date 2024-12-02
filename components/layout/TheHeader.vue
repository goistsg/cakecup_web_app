<template>
  <header class="header">
    <div class="header__container container">
      <NuxtLink to="/" class="header__logo">
        <h1>CakeCup</h1>
      </NuxtLink>

      <nav class="header__nav">
        <ul class="header__nav-list">
          <li><NuxtLink to="/">Home</NuxtLink></li>
          <li><NuxtLink to="/products">Produtos</NuxtLink></li>
          <li><NuxtLink to="/about">Sobre</NuxtLink></li>
          <li><NuxtLink to="/contact">Contato</NuxtLink></li>
        </ul>
      </nav>

      <div class="header__cart">
        <button @click="cartStore.openCart()" class="cart-icon">
          <i class="fas fa-shopping-cart"></i>
          <span class="cart-count" > <!--v-if="cartStore.totalItems > 0"> -->
            {{ cartStore.totalItems }}
          </span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'

const cartStore = useCartStore()
</script>

<style lang="scss">
.header {
  padding: 1rem 0;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  &__container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  &__logo {
    h1 {
      font-size: 2rem;
      color: #ff69b4;
      font-weight: bold;
    }
  }

  &__nav-list {
    display: flex;
    gap: 2rem;
    list-style: none;

    a {
      color: #333;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s ease;

      &:hover {
        color: #ff69b4;
      }
    }
  }

  &__cart {
    position: relative;
    
    .cart-icon {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
      font-size: 1.5rem;
      color: #000;
      transition: color 0.3s ease;
      position: relative;
      
      &:hover {
        color: var(--primary-color);
      }

      i {
        font-size: 1.5rem;
      }
    }

    .cart-count {
      position: absolute;
      top: -8px;
      right: -8px;
      background-color: #ff4081;
      color: white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: bold;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      animation: scaleIn 0.3s ease;
    }
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}
</style> 