<template>
  <div class="confirmation-page">
    <!-- Loading -->
    <div v-if="loading" class="loading-container">
      <i class="fas fa-spinner fa-spin"></i>
      <p>Carregando detalhes do pedido...</p>
    </div>

    <!-- Erro -->
    <div v-else-if="error" class="error-container">
      <i class="fas fa-exclamation-triangle"></i>
      <h2>Ops! Algo deu errado</h2>
      <p>{{ error }}</p>
      <NuxtLink to="/orders" class="btn-back">
        Ver Meus Pedidos
      </NuxtLink>
    </div>

    <!-- Confirmação -->
    <div v-else-if="order" class="confirmation-container">
      <!-- Header de Sucesso -->
      <div class="success-header">
        <div class="success-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <h1>Pedido Confirmado!</h1>
        <p class="order-number">
          Pedido #{{ order.id.slice(0, 8).toUpperCase() }}
        </p>
      </div>

      <!-- Informações do Pedido -->
      <div class="order-info-grid">
        <!-- Coluna Principal -->
        <div class="order-main">
          <!-- Itens do Pedido -->
          <div class="order-section">
            <h2>
              <i class="fas fa-shopping-bag"></i>
              Itens do Pedido
            </h2>
            <div class="order-items">
              <div 
                v-for="item in order.items"
                :key="item.id"
                class="order-item"
              >
                <img :src="getProductImage(item.product)" :alt="item.product.name">
                <div class="item-details">
                  <h4>{{ item.product.name }}</h4>
                  <p class="quantity">Quantidade: {{ item.quantity }}x</p>
                  <p class="price">R$ {{ item.price.toFixed(2) }}</p>
                </div>
                <div class="item-total">
                  R$ {{ item.subtotal.toFixed(2) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Entrega -->
          <div v-if="order.deliveryAddress" class="order-section">
            <h2>
              <i class="fas fa-map-marker-alt"></i>
              Endereço de Entrega
            </h2>
            <div class="delivery-address">
              <p><strong>{{ order.deliveryAddress.name || 'Endereço Principal' }}</strong></p>
              <p>{{ order.deliveryAddress.street }}, {{ order.deliveryAddress.number }}</p>
              <p v-if="order.deliveryAddress.complement">{{ order.deliveryAddress.complement }}</p>
              <p>{{ order.deliveryAddress.district }} - {{ order.deliveryAddress.city }}/{{ order.deliveryAddress.state }}</p>
              <p class="cep">CEP: {{ formatCep(order.deliveryAddress.zipCode) }}</p>
            </div>
          </div>

          <!-- Observações -->
          <div v-if="order.notes" class="order-section">
            <h2>
              <i class="fas fa-comment-dots"></i>
              Observações
            </h2>
            <div class="order-notes">
              <p>{{ order.notes }}</p>
            </div>
          </div>
        </div>

        <!-- Coluna Lateral -->
        <div class="order-sidebar">
          <!-- Pagamento PIX -->
          <div v-if="order.paymentMethod === 'PIX' && order.payment" class="payment-section pix">
            <h2>
              <i class="fas fa-qrcode"></i>
              Pagamento PIX
            </h2>
            <div class="pix-warning">
              <i class="fas fa-clock"></i>
              <p><strong>Você tem 15 minutos</strong> para realizar o pagamento</p>
            </div>
            
            <div v-if="order.payment.qrCode" class="qr-code">
              <img :src="`data:image/png;base64,${order.payment.qrCode}`" alt="QR Code PIX">
              <p class="qr-instruction">Escaneie o QR Code com o app do seu banco</p>
            </div>

            <div v-if="order.payment.pixPayload" class="pix-copy">
              <input 
                ref="pixInput"
                :value="order.payment.pixPayload" 
                readonly
              />
              <button @click="copyPixCode" class="btn-copy">
                <i class="fas" :class="copied ? 'fa-check' : 'fa-copy'"></i>
                {{ copied ? 'Copiado!' : 'Copiar Código' }}
              </button>
            </div>
          </div>

          <!-- Outras Formas de Pagamento -->
          <div v-else class="payment-section">
            <h2>
              <i class="fas fa-credit-card"></i>
              Forma de Pagamento
            </h2>
            <div class="payment-method">
              <i :class="getPaymentIcon(order.paymentMethod)"></i>
              <span>{{ getPaymentName(order.paymentMethod) }}</span>
            </div>
            <p v-if="order.paymentMethod === 'CASH'" class="payment-info">
              Pagamento será realizado na entrega
            </p>
            <p v-else-if="order.paymentMethod === 'BILL'" class="payment-info">
              Boleto enviado para seu e-mail
            </p>
          </div>

          <!-- Resumo de Valores -->
          <div class="order-summary-section">
            <h2>
              <i class="fas fa-receipt"></i>
              Resumo
            </h2>
            <div class="summary-values">
              <div class="value-row">
                <span>Subtotal</span>
                <strong>R$ {{ order.total.toFixed(2) }}</strong>
              </div>
              <div v-if="order.deliveryFee" class="value-row">
                <span>Frete</span>
                <strong>R$ {{ order.deliveryFee.toFixed(2) }}</strong>
              </div>
              <div class="value-row total">
                <span>Total</span>
                <strong>R$ {{ orderTotal.toFixed(2) }}</strong>
              </div>
            </div>
          </div>

          <!-- Ações -->
          <div class="order-actions">
            <NuxtLink to="/orders" class="btn-orders">
              <i class="fas fa-list"></i>
              Ver Meus Pedidos
            </NuxtLink>
            <NuxtLink to="/products" class="btn-continue">
              <i class="fas fa-arrow-left"></i>
              Continuar Comprando
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useOrdersStore } from '~/stores/orders'
import type { Order, Product, PaymentMethod } from '~/types/api'

const route = useRoute()
const ordersStore = useOrdersStore()

const order = ref<Order | null>(null)
const loading = ref(true)
const error = ref('')
const copied = ref(false)
const pixInput = ref<HTMLInputElement>()

const orderTotal = computed(() => {
  if (!order.value) return 0
  return order.value.total + (order.value.deliveryFee || 0)
})

function formatCep(cep: string) {
  return cep.replace(/(\d{5})(\d{3})/, '$1-$2')
}

function getProductImage(product: any) {
  if (product?.imageUrls && product.imageUrls.length > 0) {
    return product.imageUrls[0]
  }
  if (product?.images && product.images.length > 0) {
    const primaryImage = product.images.find((img: any) => img.isPrimary)
    return primaryImage?.url || product.images[0].url
  }
  return '/products/photo_default.png'
}

function getPaymentName(method: PaymentMethod): string {
  const names: Record<PaymentMethod, string> = {
    'PIX': 'PIX',
    'CREDIT_CARD': 'Cartão de Crédito',
    'DEBIT_CARD': 'Cartão de Débito',
    'CASH': 'Dinheiro',
    'BILL': 'Boleto Bancário',
  }
  return names[method] || method
}

function getPaymentIcon(method: PaymentMethod): string {
  const icons: Record<PaymentMethod, string> = {
    'PIX': 'fas fa-qrcode',
    'CREDIT_CARD': 'fas fa-credit-card',
    'DEBIT_CARD': 'far fa-credit-card',
    'CASH': 'fas fa-money-bill-wave',
    'BILL': 'fas fa-barcode',
  }
  return icons[method] || 'fas fa-credit-card'
}

async function copyPixCode() {
  if (!order.value?.payment?.pixPayload) return
  
  try {
    await navigator.clipboard.writeText(order.value.payment.pixPayload)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    // Fallback para navegadores antigos
    pixInput.value?.select()
    document.execCommand('copy')
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
}

onMounted(async () => {
  const orderId = route.params.id as string
  
  if (!orderId) {
    error.value = 'ID do pedido não fornecido'
    loading.value = false
    return
  }

  try {
    order.value = await ordersStore.fetchOrder(orderId)
  } catch (err: any) {
    error.value = err.message || 'Erro ao carregar pedido'
    console.error(err)
  } finally {
    loading.value = false
  }
})
</script>

<style lang="scss" scoped>
.confirmation-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f9f9f9 0%, #ffffff 100%);
  padding: 2rem 1rem;
}

// Loading & Error
.loading-container,
.error-container {
  max-width: 600px;
  margin: 4rem auto;
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);

  i {
    font-size: 4rem;
    margin-bottom: 2rem;
  }

  h2 {
    font-size: 1.8rem;
    color: #333;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.1rem;
    color: #666;
    margin-bottom: 2rem;
  }
}

.loading-container i {
  color: var(--primary);
}

.error-container i {
  color: #f44336;
}

.btn-back {
  display: inline-block;
  padding: 1rem 2rem;
  background: var(--primary);
  color: white;
  text-decoration: none;
  border-radius: 50px;
  font-weight: 600;
  transition: all 0.3s;

  &:hover {
    background: var(--secondary);
    transform: translateY(-2px);
  }
}

// Confirmation Container
.confirmation-container {
  max-width: 1400px;
  margin: 0 auto;
}

.success-header {
  text-align: center;
  margin-bottom: 3rem;

  .success-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 120px;
    height: 120px;
    background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
    border-radius: 50%;
    margin-bottom: 2rem;
    box-shadow: 0 8px 32px rgba(39, 174, 96, 0.3);
    animation: successPop 0.6s ease-out;

    i {
      font-size: 4rem;
      color: white;
    }
  }

  h1 {
    font-size: 2.5rem;
    color: #27ae60;
    margin-bottom: 0.5rem;
  }

  .order-number {
    font-size: 1.2rem;
    color: #666;
    font-weight: 600;
    font-family: monospace;
  }
}

@keyframes successPop {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

// Grid Layout
.order-info-grid {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
  align-items: start;
}

.order-main {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.order-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

// Order Section
.order-section {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);

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

// Order Items
.order-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-item {
  display: grid;
  grid-template-columns: 80px 1fr auto;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  border-radius: 12px;
  background: #fafafa;

  img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 8px;
  }

  .item-details {
    h4 {
      margin: 0 0 0.25rem 0;
      font-size: 1.05rem;
      color: #333;
    }

    .quantity {
      font-size: 0.9rem;
      color: #666;
      margin: 0.25rem 0;
    }

    .price {
      font-size: 0.95rem;
      color: #999;
      margin: 0;
    }
  }

  .item-total {
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--primary);
  }
}

// Delivery Address
.delivery-address {
  padding: 1.5rem;
  background: #fafafa;
  border-radius: 12px;
  line-height: 1.8;

  p {
    margin: 0.5rem 0;
    color: #666;

    &.cep {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #e0e0e0;
      color: #999;
      font-family: monospace;
      font-weight: 600;
    }
  }

  strong {
    color: #333;
  }
}

// Order Notes
.order-notes {
  padding: 1.5rem;
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 12px;

  p {
    margin: 0;
    color: #856404;
    line-height: 1.6;
  }
}

// Payment Section
.payment-section {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);

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

  &.pix {
    background: linear-gradient(135deg, #e8f5e9 0%, #ffffff 100%);
    border: 2px solid #27ae60;
  }
}

.pix-warning {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 8px;
  margin-bottom: 1.5rem;

  i {
    font-size: 1.5rem;
    color: #f57c00;
  }

  p {
    margin: 0;
    color: #856404;
    line-height: 1.5;

    strong {
      display: block;
      font-size: 1.05rem;
    }
  }
}

.qr-code {
  text-align: center;
  margin: 2rem 0;

  img {
    max-width: 250px;
    width: 100%;
    height: auto;
    border: 4px solid #27ae60;
    border-radius: 12px;
    padding: 1rem;
    background: white;
  }

  .qr-instruction {
    margin-top: 1rem;
    color: #666;
    font-size: 0.95rem;
  }
}

.pix-copy {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  input {
    padding: 1rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-family: monospace;
    font-size: 0.9rem;
    background: white;
    color: #333;
    text-align: center;
  }

  .btn-copy {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 1rem;
    background: #27ae60;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1.05rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      background: #229954;
      transform: translateY(-2px);
    }
  }
}

.payment-method {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #fafafa;
  border-radius: 12px;

  i {
    font-size: 2rem;
    color: var(--primary);
  }

  span {
    font-size: 1.1rem;
    font-weight: 600;
    color: #333;
  }
}

.payment-info {
  margin-top: 1rem;
  padding: 1rem;
  background: #e3f2fd;
  border: 1px solid #2196f3;
  border-radius: 8px;
  color: #0d47a1;
  text-align: center;
}

// Order Summary
.order-summary-section {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);

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

.summary-values {
  .value-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 0;

    span {
      color: #666;
      font-size: 1rem;
    }

    strong {
      color: #333;
      font-size: 1.1rem;
    }

    &.total {
      margin-top: 1rem;
      padding-top: 1.5rem;
      border-top: 2px solid #e0e0e0;

      span {
        font-size: 1.3rem;
        color: #333;
        font-weight: 600;
      }

      strong {
        font-size: 1.8rem;
        color: var(--primary);
      }
    }
  }
}

// Order Actions
.order-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  a {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 1.25rem;
    border-radius: 16px;
    font-size: 1.1rem;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s;
  }

  .btn-orders {
    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
    color: white;
    box-shadow: 0 4px 16px rgba(139, 0, 20, 0.25);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 24px rgba(139, 0, 20, 0.4);
    }
  }

  .btn-continue {
    background: white;
    color: var(--primary);
    border: 2px solid var(--primary);

    &:hover {
      background: #fff5f8;
      transform: translateY(-2px);
    }
  }
}

// Responsividade
@media (max-width: 1200px) {
  .order-info-grid {
    grid-template-columns: 1fr 350px;
  }
}

@media (max-width: 1024px) {
  .order-info-grid {
    grid-template-columns: 1fr;
  }

  .order-sidebar {
    order: -1;
  }
}

@media (max-width: 768px) {
  .confirmation-page {
    padding: 1rem 0.5rem;
  }

  .success-header {
    margin-bottom: 2rem;

    .success-icon {
      width: 80px;
      height: 80px;

      i {
        font-size: 2.5rem;
      }
    }

    h1 {
      font-size: 1.8rem;
    }

    .order-number {
      font-size: 1rem;
    }
  }

  .order-info-grid {
    gap: 1.5rem;
  }

  .order-section,
  .payment-section,
  .order-summary-section {
    padding: 1.5rem;
  }

  .order-item {
    grid-template-columns: 60px 1fr auto;

    img {
      width: 60px;
      height: 60px;
    }
  }

  .qr-code img {
    max-width: 200px;
  }
}
</style>

