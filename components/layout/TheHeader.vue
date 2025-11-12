<template>
  <header class="header">
        <div class="header__container container">
          <NuxtLink to="/" class="header__logo">
            <img src="/cakecup_logo.png" alt="CakeCup Store" class="logo-image" />
            <span class="logo-text">CakeCup Store</span>
          </NuxtLink>

      <nav class="header__nav">
        <ul class="header__nav-list">
          <li><NuxtLink to="/">Home</NuxtLink></li>
          <li><NuxtLink to="/products">Produtos</NuxtLink></li>
          <li><NuxtLink to="/about">Sobre</NuxtLink></li>
          <li><NuxtLink to="/contact">Contato</NuxtLink></li>
          
          <!-- Links autenticados -->
          <template v-if="isAuthenticated">
            <li><NuxtLink to="/orders" class="nav-link-special">Meus Pedidos</NuxtLink></li>
          </template>
        </ul>
      </nav>

      <div class="header__actions">
        <!-- Botão de Login/Perfil -->
        <div class="header__user">
          <NuxtLink v-if="!isAuthenticated" to="/login" class="btn-login">
            <i class="fas fa-user"></i>
            <span>Entrar</span>
          </NuxtLink>
          
          <div v-else class="user-menu">
            <button class="user-button" @click="toggleUserMenu">
              <i class="fas fa-user-circle"></i>
              <span>{{ userName }}</span>
            </button>
            
            <div v-if="showUserMenu" class="user-dropdown">
              <NuxtLink to="/orders" @click="showUserMenu = false">
                <i class="fas fa-box"></i> Meus Pedidos
              </NuxtLink>
              <NuxtLink to="/profile/favorites" @click="showUserMenu = false">
                <i class="fas fa-heart"></i> Meus Favoritos
              </NuxtLink>
              <NuxtLink to="/profile/addresses" @click="showUserMenu = false">
                <i class="fas fa-map-marker-alt"></i> Meus Endereços
              </NuxtLink>
              <button @click="handleLogout">
                <i class="fas fa-sign-out-alt"></i> Sair
              </button>
            </div>
          </div>
        </div>

        <!-- Carrinho -->
        <div class="header__cart">
          <button @click="cartStore.openCart()" class="cart-icon">
            <i class="fas fa-shopping-cart"></i>
            <span class="cart-count">
              {{ cartStore.totalItems }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '~/stores/cart'
import { useAuth } from '~/composables/useAuth'

const router = useRouter()
const cartStore = useCartStore()
const { isAuthenticated, user, logout } = useAuth()

const showUserMenu = ref(false)

const userName = computed(() => {
  if (user.value?.name) {
    const firstName = user.value.name.split(' ')[0]
    return firstName.length > 10 ? firstName.substring(0, 10) + '...' : firstName
  }
  return 'Usuário'
})

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const handleLogout = async () => {
  showUserMenu.value = false
  await logout()
  router.push('/')
}

// Carregar carrinho quando autenticado
onMounted(async () => {
  if (isAuthenticated.value) {
    try {
      await cartStore.fetchCart()
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error)
    }
  }
})

// Observar mudanças na autenticação
watch(isAuthenticated, async (newValue) => {
  if (newValue) {
    try {
      await cartStore.fetchCart()
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error)
    }
  }
})

// Fechar menu ao clicar fora
if (process.client) {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('.user-menu')) {
      showUserMenu.value = false
    }
  })
}
</script>

<style lang="scss">
.header {
  padding: 1rem 0;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;

  &__container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  &__logo {
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    
    .logo-image {
      height: 50px;
      width: auto;
      transition: transform var(--transition);
    }
    
    .logo-text {
      font-size: 1.5rem;
      color: var(--primary);
      font-weight: bold;
      margin: 0;
      
      @media (max-width: 768px) {
        display: none;
      }
    }
    
    &:hover .logo-image {
      transform: scale(1.05);
    }
  }

  &__nav-list {
    display: flex;
    gap: 2rem;
    list-style: none;
    margin: 0;
    padding: 0;

    a {
      color: #333;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s ease;
      position: relative;

      &:hover {
        color: var(--primary);
      }

      &.router-link-active {
        color: var(--primary);
        
        &::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          right: 0;
          height: 2px;
          background-color: var(--primary);
        }
      }

      &.nav-link-special {
        color: var(--primary);
        font-weight: 600;
      }
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  &__user {
    position: relative;

    .btn-login {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background-color: #fff;
      color: var(--primary);
      border: 2px solid var(--primary);
      border-radius: 20px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s ease;

      i {
        font-size: 1.1rem;
      }

      &:hover {
        background-color: var(--primary);
        color: white;
      }
    }

    .user-menu {
      position: relative;
    }

    .user-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background-color: var(--primary);
      color: white;
      border: none;
      border-radius: 20px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;

      i {
        font-size: 1.2rem;
      }

      &:hover {
        background-color: var(--primary-dark);
      }
    }

    .user-dropdown {
      position: absolute;
      top: calc(100% + 0.5rem);
      right: 0;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      min-width: 200px;
      overflow: hidden;
      animation: slideDown 0.2s ease;

      a, button {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        width: 100%;
        padding: 0.875rem 1rem;
        background: none;
        border: none;
        color: #333;
        text-decoration: none;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.2s ease;
        text-align: left;

        i {
          color: var(--primary);
          width: 20px;
        }

        &:hover {
          background-color: var(--surface);
        }
      }

      button {
        border-top: 1px solid #eee;
        color: var(--error-color);

        i {
          color: var(--error-color);
        }
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
      color: var(--text);
      transition: color 0.3s ease;
      position: relative;
      
      &:hover {
        color: var(--primary);
      }

      i {
        font-size: 1.5rem;
      }
    }

    .cart-count {
      position: absolute;
      top: -8px;
      right: -8px;
      background-color: var(--secondary);
      color: white;
      border-radius: 50%;
      width: 22px;
      height: 22px;
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

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .header {
    &__nav-list {
      gap: 1rem;
      font-size: 0.9rem;
    }

    &__logo h1 {
      font-size: 1.5rem;
    }

    &__user {
      .btn-login span,
      .user-button span {
        display: none;
      }

      .btn-login,
      .user-button {
        padding: 0.5rem;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        justify-content: center;
      }
    }
  }
}
</style> 