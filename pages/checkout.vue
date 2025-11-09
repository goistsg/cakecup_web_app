<template>
  <div class="checkout-page">
    <div class="checkout-container">
      <h1>Finalizar Pedido</h1>

      <!-- Resumo do Carrinho -->
      <section class="cart-summary">
        <h2>Seu Pedido</h2>
        <div v-if="loading" class="loading">Carregando...</div>
        
        <div v-else-if="items.length === 0" class="empty-cart">
          <p>Seu carrinho está vazio</p>
          <NuxtLink to="/products" class="btn-primary">Ver Produtos</NuxtLink>
        </div>

        <div v-else class="cart-items">
          <div v-for="item in items" :key="item.id" class="cart-item">
            <img :src="getProductImage(item.product)" :alt="item.product.name">
            <div class="item-info">
              <h3>{{ item.product.name }}</h3>
              <p>Quantidade: {{ item.quantity }}</p>
              <p class="price">R$ {{ item.subtotal.toFixed(2) }}</p>
            </div>
          </div>

          <div class="cart-total">
            <h3>Total: {{ formattedTotal }}</h3>
          </div>
        </div>
      </section>

      <!-- Endereço de Entrega -->
      <section v-if="items.length > 0" class="delivery-section">
        <h2>Endereço de Entrega</h2>
        
        <div v-if="addresses.length === 0" class="no-address">
          <p>Você ainda não tem endereços cadastrados</p>
          <button @click="showAddressForm = true" class="btn-secondary">
            Adicionar Endereço
          </button>
        </div>

        <div v-else class="addresses-list">
          <div 
            v-for="address in addresses" 
            :key="address.id"
            class="address-card"
            :class="{ selected: selectedAddressId === address.id }"
            @click="selectedAddressId = address.id"
          >
            <h4>{{ address.name || 'Endereço' }}</h4>
            <p>{{ address.street }}, {{ address.number }}</p>
            <p>{{ address.district }} - {{ address.city }}/{{ address.state }}</p>
            <p>CEP: {{ address.zipCode }}</p>
          </div>
          <button @click="showAddressForm = true" class="btn-add-address">
            + Novo Endereço
          </button>
        </div>
      </section>

      <!-- Método de Pagamento -->
      <section v-if="items.length > 0" class="payment-section">
        <h2>Método de Pagamento</h2>
        
        <div class="payment-methods">
          <div 
            v-for="method in paymentMethods" 
            :key="method.value"
            class="payment-method"
            :class="{ selected: selectedPaymentMethod === method.value }"
            @click="selectedPaymentMethod = method.value"
          >
            <span class="method-icon">{{ method.icon }}</span>
            <span class="method-name">{{ method.name }}</span>
          </div>
        </div>
      </section>

      <!-- Observações -->
      <section v-if="items.length > 0" class="notes-section">
        <h2>Observações</h2>
        <textarea 
          v-model="orderNotes"
          placeholder="Alguma observação especial? (opcional)"
          rows="4"
        ></textarea>
      </section>

      <!-- Botão de Finalizar -->
      <div v-if="items.length > 0" class="checkout-actions">
        <button 
          class="btn-checkout"
          :disabled="!canCheckout || processingOrder"
          @click="finalizeOrder"
        >
          {{ processingOrder ? 'Processando...' : 'Finalizar Pedido' }}
        </button>
      </div>

      <!-- Mensagem de Erro -->
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </div>

    <!-- Modal de Formulário de Endereço -->
    <div v-if="showAddressForm" class="modal-overlay" @click="showAddressForm = false">
      <div class="modal-content" @click.stop>
        <h3>Novo Endereço</h3>
        <form @submit.prevent="saveAddress">
          <input v-model="newAddress.name" placeholder="Nome (ex: Casa, Trabalho)" />
          <input v-model="newAddress.zipCode" placeholder="CEP" required />
          <input v-model="newAddress.street" placeholder="Rua" required />
          <input v-model="newAddress.number" placeholder="Número" />
          <input v-model="newAddress.complement" placeholder="Complemento" />
          <input v-model="newAddress.district" placeholder="Bairro" />
          <input v-model="newAddress.city" placeholder="Cidade" required />
          <input v-model="newAddress.state" placeholder="Estado (UF)" maxlength="2" required />
          
          <div class="modal-actions">
            <button type="submit" class="btn-primary">Salvar</button>
            <button type="button" class="btn-secondary" @click="showAddressForm = false">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCart } from '~/composables/useCart'
import { useAuth } from '~/composables/useAuth'
import { useClientsStore } from '~/stores/clients'
import { useOrdersStore } from '~/stores/orders'
import type { Product } from '~/types/api'

const router = useRouter()
const { items, formattedTotal, loading, clearCart } = useCart()
const { user, isAuthenticated } = useAuth()
const clientsStore = useClientsStore()
const ordersStore = useOrdersStore()

const selectedAddressId = ref<string | null>(null)
const selectedPaymentMethod = ref('PIX')
const orderNotes = ref('')
const showAddressForm = ref(false)
const processingOrder = ref(false)
const error = ref<string | null>(null)

const addresses = computed(() => clientsStore.addresses)

const newAddress = ref({
  name: '',
  street: '',
  number: '',
  complement: '',
  district: '',
  city: '',
  state: '',
  zipCode: '',
})

const paymentMethods = [
  { value: 'PIX', name: 'PIX', icon: '💳' },
  { value: 'CREDIT_CARD', name: 'Cartão de Crédito', icon: '💳' },
  { value: 'DEBIT_CARD', name: 'Cartão de Débito', icon: '💳' },
  { value: 'CASH', name: 'Dinheiro', icon: '💵' },
  { value: 'BILL', name: 'Boleto', icon: '📄' },
]

const canCheckout = computed(() => {
  return items.value.length > 0 && 
         selectedAddressId.value && 
         selectedPaymentMethod.value
})

const getProductImage = (product: Product) => {
  if (product.images && product.images.length > 0) {
    const primaryImage = product.images.find(img => img.isPrimary)
    return primaryImage?.url || product.images[0].url
  }
  return '/products/photo_default.png'
}

const saveAddress = async () => {
  try {
    if (!user.value?.id) return
    
    const clientsStore = useClientsStore() as any
    await clientsStore.createAddress({
      ...newAddress.value,
      clientId: user.value.id,
    })
    
    showAddressForm.value = false
    newAddress.value = {
      name: '',
      street: '',
      number: '',
      complement: '',
      district: '',
      city: '',
      state: '',
      zipCode: '',
    }
  } catch (err: any) {
    error.value = 'Erro ao salvar endereço'
    console.error(err)
  }
}

const finalizeOrder = async () => {
  if (!canCheckout.value || !user.value?.id) return
  
  processingOrder.value = true
  error.value = null

  try {
    const config = useRuntimeConfig()
    const companyId = config.public.companyId as string
    
    if (!companyId) {
      error.value = 'COMPANY_ID não configurado. Configure a variável de ambiente NUXT_PUBLIC_COMPANY_ID'
      return
    }
    
    const orderData = {
      clientId: user.value.id,
      companyId: companyId,
      items: items.value.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      deliveryAddressId: selectedAddressId.value!,
      paymentMethod: selectedPaymentMethod.value as any,
      notes: orderNotes.value || undefined,
    }

    await ordersStore.createOrder(orderData)
    await clearCart()
    
    router.push('/orders')
  } catch (err: any) {
    error.value = err.message || 'Erro ao finalizar pedido'
    console.error(err)
  } finally {
    processingOrder.value = false
  }
}

onMounted(async () => {
  if (!isAuthenticated.value) {
    router.push('/login')
    return
  }

  if (user.value?.id) {
    const clientsStore = useClientsStore() as any
    await clientsStore.fetchAddresses(user.value.id)
    
    // Selecionar endereço principal automaticamente
    const primaryAddress = addresses.value.find(a => a.isPrimary)
    if (primaryAddress) {
      selectedAddressId.value = primaryAddress.id
    }
  }
})
</script>

<style lang="scss" scoped>
.checkout-page {
  min-height: 100vh;
  background-color: #f9f9f9;
  padding: 2rem;
}

.checkout-container {
  max-width: 800px;
  margin: 0 auto;
  
  h1 {
    text-align: center;
    margin-bottom: 2rem;
    color: #333;
  }

  section {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    margin-bottom: 2rem;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);

    h2 {
      margin-bottom: 1.5rem;
      color: var(--primary);
      border-bottom: 2px solid var(--primary);
      padding-bottom: 0.5rem;
    }
  }
}

.cart-items {
  .cart-item {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    border-bottom: 1px solid #eee;

    &:last-child {
      border-bottom: none;
    }

    img {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 8px;
    }

    .item-info {
      flex: 1;

      h3 {
        font-size: 1.1rem;
        margin-bottom: 0.5rem;
      }

      .price {
        color: var(--primary);
        font-weight: bold;
        margin-top: 0.5rem;
      }
    }
  }
}

.cart-total {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid #eee;
  text-align: right;

  h3 {
    color: var(--primary);
    font-size: 1.5rem;
  }
}

.addresses-list {
  display: grid;
  gap: 1rem;
}

.address-card {
  padding: 1rem;
  border: 2px solid #eee;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    border-color: var(--primary);
  }

  &.selected {
    border-color: var(--primary);
    background-color: #fff5f8;
  }

  h4 {
    margin-bottom: 0.5rem;
    color: #333;
  }

  p {
    color: #666;
    margin: 0.25rem 0;
  }
}

.payment-methods {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.payment-method {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem;
  border: 2px solid #eee;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    border-color: var(--primary);
  }

  &.selected {
    border-color: var(--primary);
    background-color: #fff5f8;
  }

  .method-icon {
    font-size: 2rem;
  }

  .method-name {
    font-weight: 600;
  }
}

textarea {
  width: 100%;
  padding: 1rem;
  border: 2px solid #eee;
  border-radius: 8px;
  font-family: inherit;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: var(--primary);
  }
}

.checkout-actions {
  text-align: center;
}

.btn-checkout {
  padding: 1rem 3rem;
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  color: white;
  border: none;
  border-radius: 30px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 105, 180, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.btn-primary,
.btn-secondary,
.btn-add-address {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background-color: var(--primary);
  color: white;

  &:hover {
    background-color: var(--secondary);
  }
}

.btn-secondary {
  background-color: #eee;
  color: #666;

  &:hover {
    background-color: #ddd;
  }
}

.btn-add-address {
  width: 100%;
  background-color: #f9f9f9;
  color: var(--primary);
  border: 2px dashed var(--primary);

  &:hover {
    background-color: #fff5f8;
  }
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;

  h3 {
    margin-bottom: 1.5rem;
    color: var(--primary);
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    input {
      padding: 0.75rem;
      border: 2px solid #eee;
      border-radius: 8px;

      &:focus {
        outline: none;
        border-color: var(--primary);
      }
    }
  }

  .modal-actions {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;

    button {
      flex: 1;
    }
  }
}

.error-message {
  padding: 1rem;
  background-color: #fee;
  border: 1px solid #fcc;
  border-radius: 8px;
  color: #c33;
  text-align: center;
  margin-top: 1rem;
}

.loading,
.empty-cart,
.no-address {
  text-align: center;
  padding: 2rem;
  color: #666;
}
</style>

