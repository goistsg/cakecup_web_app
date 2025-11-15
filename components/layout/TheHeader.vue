<template>
  <header class="header">
    <div class="header__container container">
      <NuxtLink to="/" class="header__logo">
        <img src="/cakecup_logo.png" alt="CakeCup Store" class="logo-image" />
        <span class="logo-text">CakeCup Store</span>
      </NuxtLink>

      <!-- Menu Desktop -->
      <nav class="header__nav desktop-nav">
        <ul class="header__nav-list">
          <li><NuxtLink to="/">Home</NuxtLink></li>
          <li><NuxtLink to="/products">Produtos</NuxtLink></li>
          <li><NuxtLink to="/about">Sobre</NuxtLink></li>
          <li><NuxtLink to="/contact">Contato</NuxtLink></li>
          
          <!-- Links autenticados -->
          <li v-if="isMounted && isAuthenticated"><NuxtLink to="/orders" class="nav-link-special">Meus Pedidos</NuxtLink></li>
          <!-- Link admin -->
          <li v-if="isMounted && isCompanyAdmin"><NuxtLink to="/admin/feedback-results" class="nav-link-admin">Feedbacks</NuxtLink></li>
        </ul>
      </nav>

      <div class="header__actions">
        <!-- Botão Hambúrguer (Mobile) -->
        <button class="hamburger-button" @click="toggleMobileMenu" aria-label="Menu">
          <span :class="{ active: showMobileMenu }"></span>
          <span :class="{ active: showMobileMenu }"></span>
          <span :class="{ active: showMobileMenu }"></span>
        </button>

        <!-- Botão de Login/Perfil -->
        <div v-if="isMounted" class="header__user">
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
              <NuxtLink to="/profile" @click="showUserMenu = false">
                <i class="fas fa-user-circle"></i> Meu Perfil
              </NuxtLink>
              <NuxtLink to="/profile/addresses" @click="showUserMenu = false">
                <i class="fas fa-map-marker-alt"></i> Meus Endereços
              </NuxtLink>
              <NuxtLink to="/profile/favorites" @click="showUserMenu = false">
                <i class="fas fa-heart"></i> Meus Favoritos
              </NuxtLink>
              <div class="dropdown-divider"></div>
              <NuxtLink to="/orders" @click="showUserMenu = false">
                <i class="fas fa-box"></i> Meus Pedidos
              </NuxtLink>
              <NuxtLink v-if="isCompanyAdmin" to="/admin/feedback-results" @click="showUserMenu = false">
                <i class="fas fa-comments"></i> Feedbacks
              </NuxtLink>
              <div class="dropdown-divider"></div>
              <button @click="handleLogout">
                <i class="fas fa-sign-out-alt"></i> Sair
              </button>
            </div>
          </div>
        </div>

        <!-- Carrinho -->
        <div v-if="isMounted" class="header__cart">
          <button @click="cartStore.openCart()" class="cart-icon">
            <i class="fas fa-shopping-cart"></i>
            <span class="cart-count">
              {{ cartStore.totalItems }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Menu Mobile -->
    <Transition name="slide-fade">
      <nav v-if="showMobileMenu" class="mobile-nav">
        <ul class="mobile-nav__list">
          <li><NuxtLink to="/" @click="closeMobileMenu">Home</NuxtLink></li>
          <li><NuxtLink to="/products" @click="closeMobileMenu">Produtos</NuxtLink></li>
          <li><NuxtLink to="/about" @click="closeMobileMenu">Sobre</NuxtLink></li>
          <li><NuxtLink to="/contact" @click="closeMobileMenu">Contato</NuxtLink></li>
          
          <!-- Links autenticados -->
          <li v-if="isMounted && isAuthenticated" class="mobile-nav__divider"></li>
          <li v-if="isMounted && isAuthenticated">
            <NuxtLink to="/profile" @click="closeMobileMenu">
              <i class="fas fa-user-circle"></i> Meu Perfil
            </NuxtLink>
          </li>
          <li v-if="isMounted && isAuthenticated">
            <NuxtLink to="/profile/addresses" @click="closeMobileMenu">
              <i class="fas fa-map-marker-alt"></i> Meus Endereços
            </NuxtLink>
          </li>
          <li v-if="isMounted && isAuthenticated">
            <NuxtLink to="/profile/favorites" @click="closeMobileMenu">
              <i class="fas fa-heart"></i> Meus Favoritos
            </NuxtLink>
          </li>
          <li v-if="isMounted && isAuthenticated" class="mobile-nav__divider"></li>
          <li v-if="isMounted && isAuthenticated">
            <NuxtLink to="/orders" @click="closeMobileMenu" class="nav-link-special">
              <i class="fas fa-box"></i> Meus Pedidos
            </NuxtLink>
          </li>
          <li v-if="isMounted && isCompanyAdmin">
            <NuxtLink to="/admin/feedback-results" @click="closeMobileMenu" class="nav-link-admin">
              <i class="fas fa-comments"></i> Feedbacks
            </NuxtLink>
          </li>
          <li v-if="isMounted && isAuthenticated" class="mobile-nav__divider"></li>
          <li v-if="isMounted && isAuthenticated">
            <button @click="handleLogout" class="logout-button">
              <i class="fas fa-sign-out-alt"></i> Sair
            </button>
          </li>
        </ul>
      </nav>
    </Transition>

    <!-- Overlay -->
    <Transition name="fade">
      <div v-if="showMobileMenu" class="mobile-overlay" @click="closeMobileMenu"></div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '~/stores/cart'
import { useAuth } from '~/composables/useAuth'
import { useClientMounted } from '~/composables/useClientMounted'

const router = useRouter()
const cartStore = useCartStore()
const { isAuthenticated, user, logout, isCompanyAdmin } = useAuth()
const { isMounted } = useClientMounted()

const showUserMenu = ref(false)
const showMobileMenu = ref(false)

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

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
  if (showMobileMenu.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
  document.body.style.overflow = ''
}

const handleLogout = async () => {
  showUserMenu.value = false
  closeMobileMenu()
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

// Observar mudanças de rota para fechar menu mobile
watch(() => router.currentRoute.value.path, () => {
  closeMobileMenu()
})
</script>

<style lang="scss">
.header {
  padding: 1rem 0;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 200;

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

      &.nav-link-admin {
        color: var(--secondary);
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
      line-height: 1.4;

      i {
        font-size: 1rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
        vertical-align: middle;
      }

      span {
        line-height: 1;
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
      line-height: 1.4;

      i {
        font-size: 1.1rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
        vertical-align: middle;
      }

      span {
        line-height: 1;
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
      z-index: 150;

      .dropdown-divider {
        height: 1px;
        background: #eee;
        margin: 0.25rem 0;
      }

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
        line-height: 1.4;

        i {
          color: var(--primary);
          width: 20px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          vertical-align: middle;
          flex-shrink: 0;
        }

        &:hover {
          background-color: var(--surface);
        }
      }

      button {
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
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 44px; // Touch target size
      min-height: 44px; // Touch target size
      
      &:hover {
        color: var(--primary);
      }

      i {
        font-size: 1.5rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
        vertical-align: middle;
      }
    }

    .cart-count {
      position: absolute;
      top: 0;
      right: 0;
      background-color: var(--secondary);
      color: white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.7rem;
      font-weight: bold;
      line-height: 1;
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

// Botão Hambúrguer
.hamburger-button {
  display: none;
  flex-direction: column;
  justify-content: space-around;
  width: 44px;
  height: 44px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 10px;
  z-index: 250;
  
  span {
    width: 24px;
    height: 3px;
    background-color: var(--primary);
    border-radius: 3px;
    transition: all 0.3s ease;
    transform-origin: center;
    
    &.active:nth-child(1) {
      transform: translateY(7px) rotate(45deg);
    }
    
    &.active:nth-child(2) {
      opacity: 0;
    }
    
    &.active:nth-child(3) {
      transform: translateY(-7px) rotate(-45deg);
    }
  }
}

// Menu Mobile
.mobile-nav {
  display: none;
  position: fixed;
  top: 82px; // Altura do header
  right: 0;
  width: 280px;
  max-width: 80vw;
  height: calc(100vh - 82px);
  background: white;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 210;
  overflow-y: auto;
  
  &__list {
    list-style: none;
    padding: 1rem 0;
    margin: 0;
    
    li {
      margin: 0;
      
      a, button {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem 1.5rem;
        color: #333;
        text-decoration: none;
        font-weight: 500;
        transition: all 0.2s ease;
        width: 100%;
        background: none;
        border: none;
        text-align: left;
        cursor: pointer;
        font-size: 1rem;
        
        i {
          width: 20px;
          color: var(--primary);
          font-size: 1.1rem;
        }
        
        &:hover {
          background-color: var(--surface);
          color: var(--primary);
        }
        
        &.router-link-active {
          background-color: rgba(255, 105, 180, 0.1);
          color: var(--primary);
          border-left: 3px solid var(--primary);
        }
        
        &.nav-link-special {
          color: var(--primary);
          font-weight: 600;
        }

        &.nav-link-admin {
          color: var(--secondary);
          font-weight: 600;
        }
      }
      
      .logout-button {
        color: var(--error-color);
        
        i {
          color: var(--error-color);
        }
      }
    }
  }
  
  &__divider {
    height: 1px;
    background-color: #eee;
    margin: 0.5rem 0;
  }
}

.mobile-overlay {
  display: none;
  position: fixed;
  top: 82px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 205;
  backdrop-filter: blur(2px);
}

// Animações
.slide-fade-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .header {
    &__nav.desktop-nav {
      display: none;
    }

    &__logo h1 {
      font-size: 1.5rem;
    }

    &__actions {
      gap: 0.5rem;
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
        width: 44px;
        height: 44px;
        justify-content: center;
        
        i {
          font-size: 1.2rem;
        }
      }
    }

    &__cart {
      .cart-icon {
        padding: 0.5rem;
        width: 44px;
        height: 44px;
        
        i {
          font-size: 1.4rem;
        }
      }

      .cart-count {
        top: 2px;
        right: 2px;
        width: 18px;
        height: 18px;
        font-size: 0.65rem;
      }
    }
  }
  
  .hamburger-button {
    display: flex;
  }
  
  .mobile-nav {
    display: block;
  }
  
  .mobile-overlay {
    display: block;
  }
}
</style> 