<template>
  <div class="order-detail-page">
    <!-- Loading state -->
    <div v-if="loading" class="loading-state">
      <i class="fas fa-spinner fa-spin"></i>
      <p>Carregando detalhes do pedido...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error-state">
      <i class="fas fa-exclamation-triangle"></i>
      <p>{{ error }}</p>
      <button @click="loadOrderDetails" class="btn-retry">
        <i class="fas fa-redo"></i>
        Tentar novamente
      </button>
      <NuxtLink to="/orders" class="btn-back">
        <i class="fas fa-arrow-left"></i>
        Voltar para Pedidos
      </NuxtLink>
    </div>

    <!-- Order details -->
    <div v-else-if="order" class="order-detail-container">
      <!-- Header -->
      <div class="order-header">
        <button @click="router.back()" class="btn-back-header">
          <i class="fas fa-arrow-left"></i>
        </button>
        <div class="header-content">
          <div class="order-title">
            <i class="fas fa-receipt"></i>
            <div>
              <h1>Pedido #{{ order.id.substring(0, 8).toUpperCase() }}</h1>
              <p class="order-date">
                <i class="far fa-calendar"></i>
                Realizado em {{ formatDate(order.createdAt) }}
              </p>
            </div>
          </div>
          <div v-if="!isEditingStatus" class="order-status-badge" :class="`badge-${order.status.toLowerCase()}`">
            <i :class="getStatusIcon(order.status)"></i>
            {{ getStatusText(order.status) }}
            <button v-if="isCompanyAdmin" @click="startEditStatus" class="btn-edit-status">
              <i class="fas fa-edit"></i>
            </button>
          </div>
          <div v-else class="status-edit-container">
            <select v-model="editedStatus" class="status-select">
              <option value="OPEN">Pendente</option>
              <option value="PAID">Confirmado</option>
              <option value="DELIVERED">Entregue</option>
              <option value="CANCELED">Cancelado</option>
            </select>
            <button @click="saveStatus" class="btn-save-status">
              <i class="fas fa-check"></i>
            </button>
            <button @click="cancelEditStatus" class="btn-cancel-edit">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>

      <div class="order-content">
        <!-- Coluna Principal -->
        <div class="main-column">
          <!-- Timeline de Status -->
          <div class="section-card timeline-card">
            <h2>
              <i class="fas fa-route"></i>
              Status do Pedido
            </h2>
            <div class="status-timeline-vertical">
              <div 
                v-for="(step, index) in orderTimeline"
                :key="step.status"
                class="timeline-item"
                :class="{ 
                  active: getStatusOrder(order.status) >= index,
                  current: step.status === order.status 
                }"
              >
                <div class="timeline-marker">
                  <i :class="step.icon"></i>
                </div>
                <div class="timeline-content">
                  <h4>{{ step.label }}</h4>
                  <p>{{ step.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Itens do Pedido -->
          <div v-if="orderItems && orderItems.length > 0" class="section-card items-card">
            <h2>
              <i class="fas fa-shopping-basket"></i>
              Itens do Pedido ({{ orderItems.length }})
            </h2>
            <div class="order-items">
              <div 
                v-for="item in orderItems"
                :key="item.id"
                class="order-item"
              >
                <img 
                  :src="getProductImage(item.product || item)" 
                  :alt="(item.product || item).name"
                  class="item-image"
                >
                <div class="item-details">
                  <h3>{{ (item.product || item).name }}</h3>
                  <p class="item-description" v-if="(item.product || item).description">
                    {{ (item.product || item).description }}
                  </p>
                  <div class="item-meta">
                    <span class="item-quantity">
                      <i class="fas fa-times"></i>
                      {{ item.quantity || 1 }}
                    </span>
                    <span class="item-unit-price">
                      R$ {{ (item.price || item.salePrice || 0).toFixed(2) }} cada
                    </span>
                  </div>
                </div>
                <div class="item-total">
                  R$ {{ (item.subtotal || ((item.price || item.salePrice || 0) * (item.quantity || 1))).toFixed(2) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Endereço de Entrega -->
          <div v-if="order.deliveryAddress" class="section-card address-card">
            <h2>
              <i class="fas fa-map-marker-alt"></i>
              Endereço de Entrega
            </h2>
            <div class="address-content">
              <div class="address-icon">
                <i class="fas fa-home"></i>
              </div>
              <div class="address-details">
                <h3>{{ order.deliveryAddress.name || 'Endereço Principal' }}</h3>
                <p>{{ order.deliveryAddress.street }}, {{ order.deliveryAddress.number }}</p>
                <p v-if="order.deliveryAddress.complement">{{ order.deliveryAddress.complement }}</p>
                <p>{{ order.deliveryAddress.district }}</p>
                <p>{{ order.deliveryAddress.city }}/{{ order.deliveryAddress.state }}</p>
                <p class="cep">CEP: {{ formatCep(order.deliveryAddress.zipCode) }}</p>
              </div>
            </div>
          </div>

          <!-- Observações -->
          <div v-if="order.notes" class="section-card notes-card">
            <h2>
              <i class="fas fa-sticky-note"></i>
              Observações
            </h2>
            <p class="notes-text">{{ order.notes }}</p>
          </div>
        </div>

        <!-- Coluna Lateral - Resumo -->
        <div class="sidebar-column">
          <!-- Resumo do Pedido -->
          <div class="section-card summary-card">
            <h2>
              <i class="fas fa-calculator"></i>
              Resumo do Pedido
            </h2>
            <div class="summary-content">
              <div class="summary-row">
                <span>Subtotal</span>
                <span>R$ {{ calculateSubtotal().toFixed(2) }}</span>
              </div>
              <div v-if="order.deliveryFee" class="summary-row">
                <span>Taxa de Entrega</span>
                <span>R$ {{ order.deliveryFee.toFixed(2) }}</span>
              </div>
              <div class="summary-total">
                <span>Total</span>
                <span>R$ {{ order.total.toFixed(2) }}</span>
              </div>
            </div>
          </div>

          <!-- Pagamento -->
          <div class="section-card payment-card">
            <h2>
              <i class="fas fa-credit-card"></i>
              Pagamento
            </h2>
            <div class="payment-content">
              <div class="payment-method">
                <i :class="getPaymentIcon(order.paymentMethod)"></i>
                <span>{{ getPaymentText(order.paymentMethod) }}</span>
              </div>
              <div v-if="order.payment" class="payment-status" :class="`status-${order.payment.status.toLowerCase()}`">
                <i :class="getPaymentStatusIcon(order.payment.status)"></i>
                <span>{{ getPaymentStatusText(order.payment.status) }}</span>
              </div>
            </div>
          </div>

          <!-- Ações -->
          <div class="actions-card">
            <button 
              v-if="order.status === 'OPEN'"
              @click="cancelOrder"
              class="btn-cancel-order"
            >
              <i class="fas fa-times-circle"></i>
              Cancelar Pedido
            </button>
            <button @click="shareOrder" class="btn-share">
              <i class="fas fa-share-alt"></i>
              Compartilhar
            </button>
            <NuxtLink to="/orders" class="btn-back-list">
              <i class="fas fa-list"></i>
              Ver Todos os Pedidos
            </NuxtLink>
          </div>

          <!-- Suporte -->
          <div class="section-card support-card">
            <h2>
              <i class="fas fa-headset"></i>
              Precisa de Ajuda?
            </h2>
            <p>Entre em contato conosco</p>
            <a href="tel:+5511999999999" class="support-link">
              <i class="fas fa-phone"></i>
              (11) 99999-9999
            </a>
            <a href="mailto:suporte@cakecup.com" class="support-link">
              <i class="fas fa-envelope"></i>
              suporte@cakecup.com
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import { useApi } from '~/composables/useApi'
import type { Order, OrderStatus, PaymentMethod } from '~/types/api'

const route = useRoute()
const router = useRouter()
const { user, isAuthenticated, isCompanyAdmin } = useAuth()
const { api } = useApi()

const order = ref<any | null>(null)
const loading = ref(true)
const error = ref('')
const isEditingStatus = ref(false)
const editedStatus = ref<OrderStatus>('OPEN' as OrderStatus)

// Computed para lidar com a diferença entre 'items' e 'products' na API
const orderItems = computed(() => {
  if (!order.value) return []
  // A API pode retornar 'items' ou 'products'
  return order.value.items || order.value.products || []
})

const orderTimeline = [
  { 
    status: 'OPEN', 
    label: 'Pedido Pendente', 
    description: 'Aguardando confirmação',
    icon: 'fas fa-clock' 
  },
  { 
    status: 'PAID', 
    label: 'Confirmado', 
    description: 'Pagamento aprovado',
    icon: 'fas fa-check-circle' 
  },
  { 
    status: 'DELIVERED', 
    label: 'Entregue', 
    description: 'Pedido finalizado',
    icon: 'fas fa-check-double' 
  },
]

const statusLabels: Record<OrderStatus, string> = {
  OPEN: 'Pendente',
  PAID: 'Confirmado',
  DELIVERED: 'Entregue',
  CANCELED: 'Cancelado',
}

const paymentLabels: Record<PaymentMethod, string> = {
  CREDIT_CARD: 'Cartão de Crédito',
  DEBIT_CARD: 'Cartão de Débito',
  PIX: 'PIX',
  CASH: 'Dinheiro',
  BILL: 'Boleto Bancário',
}

const getStatusText = (status: OrderStatus) => {
  return statusLabels[status] || status
}

const getStatusIcon = (status: OrderStatus) => {
  const icons: Record<OrderStatus, string> = {
    OPEN: 'fas fa-clock',
    PAID: 'fas fa-check-circle',
    DELIVERED: 'fas fa-check-double',
    CANCELED: 'fas fa-times-circle',
  }
  return icons[status] || 'fas fa-info-circle'
}

const getStatusOrder = (status: OrderStatus): number => {
  const orderMap: Record<OrderStatus, number> = {
    OPEN: 0,
    PAID: 1,
    DELIVERED: 2,
    CANCELED: -1,
  }
  return orderMap[status] || 0
}

const getPaymentText = (method?: PaymentMethod) => {
  if (!method) return 'Não informado'
  return paymentLabels[method] || method
}

const getPaymentIcon = (method?: PaymentMethod) => {
  const icons: Record<PaymentMethod, string> = {
    CREDIT_CARD: 'fas fa-credit-card',
    DEBIT_CARD: 'fas fa-credit-card',
    PIX: 'fas fa-qrcode',
    CASH: 'fas fa-money-bill-wave',
    BILL: 'fas fa-barcode',
  }
  return method ? icons[method] || 'fas fa-credit-card' : 'fas fa-credit-card'
}

const getPaymentStatusIcon = (status: string) => {
  const icons: Record<string, string> = {
    PENDING: 'fas fa-clock',
    APPROVED: 'fas fa-check-circle',
    REJECTED: 'fas fa-times-circle',
    CANCELLED: 'fas fa-ban',
  }
  return icons[status] || 'fas fa-info-circle'
}

const getPaymentStatusText = (status: string) => {
  const labels: Record<string, string> = {
    PENDING: 'Aguardando pagamento',
    APPROVED: 'Pagamento aprovado',
    REJECTED: 'Pagamento rejeitado',
    CANCELLED: 'Pagamento cancelado',
  }
  return labels[status] || status
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatCep = (cep: string) => {
  return cep.replace(/(\d{5})(\d{3})/, '$1-$2')
}

const getProductImage = (product: any) => {
  if (product.imageUrls && product.imageUrls.length > 0) {
    return product.imageUrls[0]
  }
  if (product.imageUrl) {
    return product.imageUrl
  }
  if (product.images && product.images.length > 0) {
    const primaryImage = product.images.find((img: any) => img.isPrimary)
    return primaryImage?.url || product.images[0].url
  }
  return '/products/photo_default.png'
}

const calculateSubtotal = () => {
  if (!order.value) return 0
  const items = orderItems.value
  if (!items || items.length === 0) return 0
  
  return items.reduce((sum: number, item: any) => {
    const itemTotal = item.subtotal || ((item.price || item.salePrice || 0) * (item.quantity || 1))
    return sum + itemTotal
  }, 0)
}

const loadOrderDetails = async () => {
  loading.value = true
  error.value = ''

  try {
    const orderId = route.params.id as string
    const response = await api.request<any>(`/orders/${orderId}`)
    
    console.log('📦 Detalhes do pedido recebidos:', response)
    
    // Normalizar a estrutura - a API pode retornar items/products e address/deliveryAddress
    order.value = {
      ...response,
      items: response.items || response.products || [],
      deliveryAddress: response.deliveryAddress || response.address || null
    }
    
    console.log('✅ Pedido processado:', order.value)
  } catch (err: any) {
    error.value = err.message || 'Erro ao carregar detalhes do pedido'
    console.error('❌ Erro ao carregar pedido:', err)
  } finally {
    loading.value = false
  }
}

const cancelOrder = async () => {
  if (!confirm('Tem certeza que deseja cancelar este pedido?')) return
  
  try {
    // Usa o método correto da API (POST em /orders/{id}/cancel)
    const response = await api.cancelOrder(order.value!.id)
    alert('Pedido cancelado com sucesso!')
    await loadOrderDetails()
  } catch (err: any) {
    console.error('Erro ao cancelar pedido:', err)
    alert(err.message || 'Erro ao cancelar pedido')
  }
}

const startEditStatus = () => {
  if (!order.value) return
  editedStatus.value = order.value.status
  isEditingStatus.value = true
}

const cancelEditStatus = () => {
  isEditingStatus.value = false
}

const saveStatus = async () => {
  if (!order.value) return
  
  try {
    loading.value = true
    await api.updateOrder(order.value.id, { status: editedStatus.value })
    alert('Status atualizado com sucesso!')
    isEditingStatus.value = false
    await loadOrderDetails()
  } catch (err: any) {
    console.error('Erro ao atualizar status:', err)
    alert(err.message || 'Erro ao atualizar status')
  } finally {
    loading.value = false
  }
}

const shareOrder = async () => {
  const url = window.location.href
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: `Pedido #${order.value!.id.substring(0, 8)}`,
        text: `Acompanhe meu pedido CakeCup`,
        url: url,
      })
    } catch (err) {
      console.log('Compartilhamento cancelado')
    }
  } else {
    // Fallback para copiar link
    navigator.clipboard.writeText(url)
    alert('Link copiado para a área de transferência!')
  }
}

onMounted(async () => {
  if (!isAuthenticated.value) {
    router.push('/login?redirect=' + route.fullPath)
    return
  }

  await loadOrderDetails()
})
</script>

<style lang="scss" scoped>
.order-detail-page {
  min-height: 100vh;
  background: var(--background);
  padding: 2rem;
}

// Estados
.loading-state,
.error-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  max-width: 600px;
  margin: 0 auto;

  i {
    font-size: 4rem;
    color: var(--primary);
    margin-bottom: 1.5rem;
    opacity: 0.8;
  }

  p {
    font-size: 1.1rem;
    color: #666;
    margin-bottom: 2rem;
  }
}

.btn-retry,
.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;
  margin: 0.5rem;

  i {
    font-size: 1rem;
  }
}

.btn-retry {
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(139, 0, 20, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(139, 0, 20, 0.4);
  }
}

.btn-back {
  background: white;
  color: var(--primary);
  border: 2px solid var(--primary);

  &:hover {
    background: var(--primary);
    color: white;
  }
}

// Container Principal
.order-detail-container {
  max-width: 1400px;
  margin: 0 auto;
}

// Header
.order-header {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;

  .btn-back-header {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 2px solid var(--primary);
    background: white;
    color: var(--primary);
    font-size: 1.25rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    &:hover {
      background: var(--primary);
      color: white;
      transform: translateX(-3px);
    }
  }

  .header-content {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .order-title {
    display: flex;
    gap: 1rem;
    align-items: center;

    > i {
      font-size: 2.5rem;
      color: var(--primary);
    }

    h1 {
      font-size: 2rem;
      color: var(--text);
      margin-bottom: 0.25rem;
    }

    .order-date {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #666;
      font-size: 0.95rem;

      i {
        color: var(--primary);
      }
    }
  }

  .order-status-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.5rem;
    border-radius: 50px;
    font-size: 1rem;
    font-weight: 600;
    position: relative;
    
    &.badge-open { background: #FFF3E0; color: #E65100; }
    &.badge-paid { background: #E8F5E9; color: #2E7D32; }
    &.badge-delivered { background: #E3F2FD; color: #1565C0; }
    &.badge-canceled { background: #FFEBEE; color: #C62828; }

    i {
      font-size: 1.2rem;
    }
    
    .btn-edit-status {
      background: rgba(255, 255, 255, 0.3);
      border: 2px solid rgba(255, 255, 255, 0.5);
      color: inherit;
      cursor: pointer;
      padding: 0.375rem 0.75rem;
      margin-left: 0.75rem;
      border-radius: 8px;
      transition: all 0.3s ease;
      font-weight: 600;
      
      &:hover {
        background: rgba(255, 255, 255, 0.5);
        border-color: rgba(255, 255, 255, 0.8);
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      }

      &:active {
        transform: scale(0.95);
      }
      
      i {
        font-size: 0.95rem;
      }
    }
  }

  .status-edit-container {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background: linear-gradient(135deg, rgba(255, 105, 180, 0.05), rgba(139, 0, 20, 0.05));
    border-radius: 16px;
    border: 2px solid rgba(255, 105, 180, 0.2);
    
    .status-select {
      padding: 0.875rem 1.25rem;
      border: 2px solid rgba(0, 0, 0, 0.1);
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 600;
      background: white;
      cursor: pointer;
      transition: all 0.3s ease;
      flex: 1;
      color: var(--text);
      
      &:hover {
        border-color: var(--primary);
        box-shadow: 0 2px 8px rgba(255, 105, 180, 0.2);
      }
      
      &:focus {
        outline: none;
        border-color: var(--primary);
        box-shadow: 0 0 0 3px rgba(255, 105, 180, 0.15);
      }

      option {
        padding: 0.5rem;
        font-weight: 600;
      }
    }
    
    .btn-save-status,
    .btn-cancel-edit {
      padding: 0.875rem 1.25rem;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 48px;
      font-weight: 600;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      
      i {
        font-size: 1.1rem;
      }

      &:active {
        transform: scale(0.95);
      }
    }
    
    .btn-save-status {
      background: linear-gradient(135deg, #4CAF50 0%, #388E3C 100%);
      color: white;
      
      &:hover {
        background: linear-gradient(135deg, #388E3C 0%, #2E7D32 100%);
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(76, 175, 80, 0.4);
      }
    }
    
    .btn-cancel-edit {
      background: linear-gradient(135deg, #F44336 0%, #D32F2F 100%);
      color: white;
      
      &:hover {
        background: linear-gradient(135deg, #D32F2F 0%, #C62828 100%);
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(244, 67, 54, 0.4);
      }
    }
  }
}

// Conteúdo
.order-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
}

.section-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;

  h2 {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1.4rem;
    color: var(--text);
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #f0f0f0;

    i {
      color: var(--primary);
      font-size: 1.3rem;
    }
  }
}

// Timeline Vertical
.status-timeline-vertical {
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
  padding-left: 2rem;

  &::before {
    content: '';
    position: absolute;
    left: 19px;
    top: 20px;
    bottom: 20px;
    width: 3px;
    background: #e0e0e0;
  }

  .timeline-item {
    display: flex;
    gap: 1.5rem;
    padding: 1.5rem 0;
    position: relative;

    .timeline-marker {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #e0e0e0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1rem;
      flex-shrink: 0;
      position: relative;
      z-index: 1;
      transition: all 0.3s ease;
    }

    .timeline-content {
      flex: 1;
      padding-top: 0.5rem;

      h4 {
        font-size: 1.1rem;
        color: #999;
        margin-bottom: 0.25rem;
        font-weight: 600;
      }

      p {
        font-size: 0.9rem;
        color: #aaa;
      }
    }

    &.active {
      .timeline-marker {
        background: var(--primary);
      }

      .timeline-content h4 {
        color: var(--text);
      }

      .timeline-content p {
        color: #666;
      }
    }

    &.current {
      .timeline-marker {
        background: var(--secondary);
        box-shadow: 0 0 0 4px rgba(139, 0, 20, 0.2);
        transform: scale(1.1);
      }

      .timeline-content h4 {
        color: var(--primary);
        font-weight: 700;
      }
    }
  }
}

// Itens do Pedido
.order-items {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.order-item {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  background: var(--surface);
  border-radius: 16px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  .item-image {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 12px;
    flex-shrink: 0;
  }

  .item-details {
    flex: 1;

    h3 {
      font-size: 1.2rem;
      color: var(--text);
      margin-bottom: 0.5rem;
    }

    .item-description {
      font-size: 0.9rem;
      color: #666;
      margin-bottom: 0.75rem;
    }

    .item-meta {
      display: flex;
      gap: 1.5rem;
      font-size: 0.9rem;
      color: #999;

      .item-quantity {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 600;
        color: var(--primary);

        i {
          font-size: 0.7rem;
        }
      }
    }
  }

  .item-total {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--primary);
    display: flex;
    align-items: center;
  }
}

// Endereço
.address-content {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  background: var(--surface);
  border-radius: 16px;

  .address-icon {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  .address-details {
    flex: 1;

    h3 {
      font-size: 1.1rem;
      color: var(--text);
      margin-bottom: 0.5rem;
      font-weight: 600;
    }

    p {
      font-size: 0.95rem;
      color: #666;
      line-height: 1.6;
      margin-bottom: 0.25rem;
    }

    .cep {
      margin-top: 0.5rem;
      color: var(--primary);
      font-weight: 600;
    }
  }
}

// Observações
.notes-text {
  padding: 1.5rem;
  background: var(--surface);
  border-radius: 12px;
  color: #666;
  line-height: 1.8;
  font-size: 0.95rem;
}

// Resumo
.summary-content {
  .summary-row {
    display: flex;
    justify-content: space-between;
    padding: 1rem 0;
    font-size: 1rem;
    color: #666;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }
  }

  .summary-total {
    display: flex;
    justify-content: space-between;
    padding: 1.5rem 0 0;
    margin-top: 1rem;
    border-top: 2px solid #f0f0f0;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--primary);
  }
}

// Pagamento
.payment-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .payment-method {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: var(--surface);
    border-radius: 12px;
    font-weight: 600;
    color: var(--text);

    i {
      font-size: 1.5rem;
      color: var(--primary);
    }
  }

  .payment-status {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1.25rem;
    border-radius: 50px;
    font-size: 0.9rem;
    font-weight: 600;

    &.status-pending { background: #FFF3E0; color: #E65100; }
    &.status-approved { background: #E8F5E9; color: #2E7D32; }
    &.status-rejected { background: #FFEBEE; color: #C62828; }
  }
}

// Ações
.actions-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  button, a {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 1rem 1.5rem;
    border-radius: 50px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
    text-decoration: none;
    font-size: 0.95rem;

    i {
      font-size: 1rem;
    }
  }
}

.btn-cancel-order {
  background: #FFEBEE;
  color: #C62828;

  &:hover {
    background: #FFCDD2;
    transform: translateY(-2px);
  }
}

.btn-share {
  background: white;
  color: var(--primary);
  border: 2px solid var(--primary) !important;

  &:hover {
    background: var(--primary);
    color: white;
  }
}

.btn-back-list {
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(139, 0, 20, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(139, 0, 20, 0.4);
  }
}

// Suporte
.support-card {
  p {
    color: #666;
    margin-bottom: 1rem;
  }

  .support-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    background: var(--surface);
    border-radius: 12px;
    color: var(--text);
    text-decoration: none;
    margin-bottom: 0.75rem;
    transition: all 0.3s ease;
    font-weight: 500;

    &:last-child {
      margin-bottom: 0;
    }

    i {
      color: var(--primary);
      font-size: 1.2rem;
    }

    &:hover {
      background: var(--primary);
      color: white;
      transform: translateX(4px);

      i {
        color: white;
      }
    }
  }
}

// Responsive
@media (max-width: 1024px) {
  .order-content {
    grid-template-columns: 1fr;
  }

  .sidebar-column {
    order: 2;
  }
}

@media (max-width: 768px) {
  .order-detail-page {
    padding: 1rem;
  }

  .order-header {
    padding: 1.5rem;
    flex-direction: column;
    gap: 1rem;

    .btn-back-header {
      width: 40px;
      height: 40px;
      font-size: 1rem;
    }

    .header-content {
      flex-direction: column;
      gap: 1rem;
    }

    .order-title {
      > i {
        font-size: 2rem;
      }

      h1 {
        font-size: 1.5rem;
      }
    }
  }

  .section-card {
    padding: 1.5rem;

    h2 {
      font-size: 1.2rem;
    }
  }

  .order-item {
    flex-direction: column;
    text-align: center;

    .item-image {
      width: 100%;
      height: 200px;
    }

    .item-details .item-meta {
      justify-content: center;
    }

    .item-total {
      font-size: 1.75rem;
    }
  }

  .address-content {
    flex-direction: column;
    text-align: center;

    .address-icon {
      margin: 0 auto;
    }
  }
}
</style>

