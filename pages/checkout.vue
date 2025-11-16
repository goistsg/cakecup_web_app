<template>
  <div class="checkout-page">
    <!-- Carrinho Vazio -->
    <div v-if="!loading && items.length === 0" class="empty-cart-page">
      <i class="fas fa-shopping-cart"></i>
      <h2>Seu carrinho está vazio</h2>
      <p>Adicione produtos ao carrinho para continuar com o pedido</p>
      <NuxtLink to="/products" class="btn-shop">
        <i class="fas fa-arrow-left"></i>
        Ver Produtos
      </NuxtLink>
    </div>

    <!-- Checkout Completo -->
    <div v-else class="checkout-container">
      <!-- Header -->
      <div class="checkout-header">
        <h1>
          <i class="fas fa-shopping-bag"></i>
          Finalizar Pedido
        </h1>
        <p class="subtitle">Complete as informações abaixo para finalizar sua compra</p>
      </div>

      <div class="checkout-grid">
        <!-- Coluna Principal -->
        <div class="checkout-main">
          <!-- 1. Endereço de Entrega -->
          <AddressSelector 
            :addresses="addresses"
            :selected-address-id="selectedAddressId"
            :user-id="user?.id || ''"
            @update:selected-address-id="selectedAddressId = $event"
            @address-saved="onAddressSaved"
          />

          <!-- 2. Método de Entrega e Frete -->
          <FreightCalculator
            :address-selected="!!selectedAddressId"
            :cep="selectedAddress?.zipCode"
            :subtotal="subtotal"
            @update:method="deliveryMethod = $event"
            @update:fee="deliveryFee = $event"
            @update:estimated-days="estimatedDays = $event"
          />

          <!-- 3. Forma de Pagamento -->
          <PaymentSelector
            @update:method="selectedPaymentMethod = $event"
          />
        </div>

        <!-- Coluna Lateral - Resumo -->
        <div class="checkout-sidebar">
          <OrderSummary 
            :items="items"
            :delivery-fee="deliveryFee"
            :delivery-method="deliveryMethod"
          />

          <!-- Botão de Finalizar -->
          <button 
            class="btn-checkout"
            :disabled="!canCheckout || processingOrder"
            @click="finalizeOrder"
          >
            <i class="fas" :class="processingOrder ? 'fa-spinner fa-spin' : 'fa-check-circle'"></i>
            {{ processingOrder ? 'Processando Pedido...' : 'Confirmar Pedido' }}
          </button>

          <!-- Garantias -->
          <div class="checkout-guarantees">
            <div class="guarantee-item">
              <i class="fas fa-lock"></i>
              <span>Pagamento Seguro</span>
            </div>
            <div class="guarantee-item">
              <i class="fas fa-shield-alt"></i>
              <span>Dados Protegidos</span>
            </div>
            <div class="guarantee-item">
              <i class="fas fa-truck"></i>
              <span>Entrega Garantida</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Mensagem de Erro -->
      <div v-if="error" class="error-toast">
        <i class="fas fa-exclamation-triangle"></i>
        <span>{{ error }}</span>
        <button @click="error = ''" class="btn-close-error">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCart } from '~/composables/useCart'
import { useAuth } from '~/composables/useAuth'
import { useApi } from '~/composables/useApi'
import { useCartStore } from '~/stores/cart'
import { useClientsStore } from '~/stores/clients'
import { useOrdersStore } from '~/stores/orders'
import type { PaymentMethod } from '~/types/api'
import AddressSelector from '~/components/checkout/AddressSelector.vue'
import FreightCalculator from '~/components/checkout/FreightCalculator.vue'
import PaymentSelector from '~/components/checkout/PaymentSelector.vue'
import OrderSummary from '~/components/checkout/OrderSummary.vue'

const router = useRouter()
const { items, loading, clearCart } = useCart()
const { user, isAuthenticated } = useAuth()
const cartStore = useCartStore()
const clientsStore = useClientsStore()
const ordersStore = useOrdersStore()

// Estados
const selectedAddressId = ref<string | null>(null)
const selectedPaymentMethod = ref<PaymentMethod | null>(null)
const deliveryMethod = ref<string | null>(null)
const deliveryFee = ref<number | null>(null)
const estimatedDays = ref<number | null>(null)
const processingOrder = ref(false)
const error = ref<string>('')

// Computed
const addresses = computed(() => clientsStore.addresses)

const selectedAddress = computed(() => {
  return addresses.value.find(a => a.id === selectedAddressId.value)
})

const subtotal = computed(() => {
  return items.value.reduce((sum, item) => sum + (item.quantity * item.price), 0)
})

const canCheckout = computed(() => {
  return items.value.length > 0 && 
         selectedAddressId.value && 
         deliveryMethod.value &&
         selectedPaymentMethod.value
})

// Métodos
async function onAddressSaved(newAddressId: string) {
  if (user.value?.id) {
    const clientsStore = useClientsStore() as any
    await clientsStore.fetchAddresses(user.value.id)
    
    // Pré-selecionar o endereço recém-criado
    selectedAddressId.value = newAddressId
  }
}

async function finalizeOrder() {
  if (!canCheckout.value || !user.value?.id) {
    error.value = 'Por favor, preencha todos os dados obrigatórios'
    return
  }
  
  processingOrder.value = true
  error.value = ''

  try {
    // Obter cartId do store
    const cartId = cartStore.cart?.id
    
    if (!cartId) {
      error.value = 'Carrinho não encontrado. Por favor, recarregue a página.'
      return
    }
    
    // Criar o pedido usando a rota /orders/checkout/
    const checkoutData = {
      cartId: cartId,
      addressId: selectedAddressId.value!,
      paymentMethod: selectedPaymentMethod.value!,
    }

    console.log('🚀 Finalizando pedido com:', checkoutData)
    
    const { api } = useApi()
    const order = await api.request<any>('/orders/checkout/', {
      method: 'POST',
      body: checkoutData,
    })
    
    console.log('✅ Pedido criado com sucesso:', order)
    
    // Redirecionar IMEDIATAMENTE para a página de pedidos
    router.push('/orders')
    
    // Recarregar carrinho em background (após redirecionamento)
    // O backend já limpa o carrinho ao finalizar o pedido
    setTimeout(async () => {
      try {
        await cartStore.fetchCart()
        console.log('✅ Carrinho atualizado após checkout')
      } catch (err) {
        console.log('⚠️ Erro ao recarregar carrinho (não crítico):', err)
        // Não mostra erro para o usuário, é apenas limpeza de cache
      }
    }, 500)
  } catch (err: any) {
    error.value = err.message || 'Erro ao finalizar pedido. Tente novamente.'
    console.error('❌ Erro ao finalizar pedido:', err)
    
    // Scroll para o erro
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } finally {
    processingOrder.value = false
  }
}

// Lifecycle
onMounted(async () => {
  // Verificar autenticação
  if (!isAuthenticated.value) {
    router.push('/login?redirect=/checkout')
    return
  }

  // Carregar endereços
  if (user.value?.id) {
    try {
      const clientsStore = useClientsStore() as any
      await clientsStore.fetchAddresses(user.value.id)
      
      // Auto-selecionar endereço principal
      const primaryAddress = addresses.value.find(a => a.isPrimary)
      if (primaryAddress) {
        selectedAddressId.value = primaryAddress.id
      } else if (addresses.value.length > 0) {
        // Se não tem principal, selecionar o primeiro
        selectedAddressId.value = addresses.value[0].id
      }
    } catch (err) {
      console.error('Erro ao carregar endereços:', err)
    }
  }
})
</script>

<style lang="scss" scoped>
.checkout-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f9f9f9 0%, #ffffff 100%);
  padding: 2rem 1rem;
}

// Carrinho Vazio
.empty-cart-page {
  max-width: 600px;
  margin: 4rem auto;
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);

  i {
    font-size: 5rem;
    color: #ddd;
    margin-bottom: 2rem;
  }

  h2 {
    font-size: 2rem;
    color: #333;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.1rem;
    color: #666;
    margin-bottom: 2rem;
  }

  .btn-shop {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 2.5rem;
    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
    color: white;
    text-decoration: none;
    border-radius: 50px;
    font-size: 1.1rem;
    font-weight: 600;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(139, 0, 20, 0.3);
    }
  }
}

// Checkout Container
.checkout-container {
  max-width: 1400px;
  margin: 0 auto;
}

.checkout-header {
  text-align: center;
  margin-bottom: 3rem;

  h1 {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    font-size: 2.5rem;
    color: var(--primary);
    margin-bottom: 0.5rem;

    i {
      font-size: 2rem;
    }
  }

  .subtitle {
    font-size: 1.1rem;
    color: #666;
  }
}

// Grid Layout
.checkout-grid {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
  align-items: start;
}

.checkout-main {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.checkout-sidebar {
  display: flex;
  flex-direction: column;
  gap: 2rem; // Aumentar gap para melhor separação visual
  position: sticky;
  top: 2rem;
  align-self: flex-start;
  max-height: calc(100vh - 4rem);
  overflow-y: auto;
  
  // Garantir que elementos não se sobreponham
  > * {
    position: relative;
    z-index: 1;
  }
}

// Botão de Finalizar
.btn-checkout {
  width: 100%;
  padding: 1.25rem;
  margin-top: 0.5rem; // Espaçamento extra do resumo
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  box-shadow: 0 4px 16px rgba(139, 0, 20, 0.25);
  min-height: 64px; // Garante altura mínima consistente
  flex-shrink: 0; // Não encolhe no flex container

  i {
    font-size: 1.3rem;
  }

  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 6px 24px rgba(139, 0, 20, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important; // Força a manter posição
    background: linear-gradient(135deg, #999 0%, #777 100%);
  }
}

// Garantias
.checkout-guarantees {
  display: flex;
  justify-content: space-around;
  padding: 1.5rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);

  .guarantee-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    text-align: center;

    i {
      font-size: 1.5rem;
      color: #27ae60;
    }

    span {
      font-size: 0.85rem;
      color: #666;
      font-weight: 500;
    }
  }
}

// Toast de Erro
.error-toast {
  position: fixed;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  background: #ffffff;
  border: 2px solid #f44336;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(244, 67, 54, 0.3);
  z-index: 3000;
  max-width: 90%;
  animation: slideDown 0.3s ease-out;

  i {
    font-size: 1.5rem;
    color: #f44336;
    flex-shrink: 0;
  }

  span {
    color: #333;
    font-weight: 500;
    flex: 1;
  }

  .btn-close-error {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: none;
    background: #ffebee;
    color: #f44336;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
    flex-shrink: 0;

    &:hover {
      background: #f44336;
      color: white;
    }
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translate(-50%, -20px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

// Responsividade
@media (max-width: 1200px) {
  .checkout-grid {
    grid-template-columns: 1fr 350px;
  }
}

@media (max-width: 1024px) {
  .checkout-grid {
    grid-template-columns: 1fr;
  }

  .checkout-sidebar {
    order: -1;
    position: static; // Remove sticky no mobile
    max-height: none;
    overflow-y: visible;
  }
}

@media (max-width: 768px) {
  .checkout-page {
    padding: 1rem 0.5rem;
  }

  .checkout-header {
    margin-bottom: 2rem;

    h1 {
      font-size: 1.8rem;
      flex-direction: column;
      gap: 0.5rem;
    }

    .subtitle {
      font-size: 1rem;
    }
  }

  .checkout-grid {
    gap: 1.5rem;
  }

  .checkout-main {
    gap: 1.5rem;
  }

  .checkout-sidebar > * {
    border-radius: 12px;
    padding: 1.5rem;
  }

  .checkout-guarantees {
    flex-direction: column;
    gap: 1rem;

    .guarantee-item {
      flex-direction: row;
      justify-content: center;
    }
  }

  .error-toast {
    top: 1rem;
    left: 1rem;
    right: 1rem;
    transform: none;
    max-width: none;
  }
}
</style>
