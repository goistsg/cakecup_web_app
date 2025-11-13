<template>
  <div class="orders-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <i class="fas fa-box-open"></i>
        <h1>Meus Pedidos</h1>
        <p class="subtitle">Acompanhe o status dos seus pedidos</p>
      </div>
    </section>

    <div class="orders-container">
      <!-- Loading state -->
      <div v-if="loading" class="loading-state">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Carregando pedidos...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="error-state">
        <i class="fas fa-exclamation-triangle"></i>
        <p>{{ error }}</p>
        <button @click="loadOrders" class="btn-retry">
          <i class="fas fa-redo"></i>
          Tentar novamente
        </button>
      </div>

      <!-- Empty state -->
      <div v-else-if="orders.length === 0" class="empty-state">
        <i class="fas fa-shopping-bag"></i>
        <h2>Nenhum pedido ainda</h2>
        <p>Que tal dar uma olhada nos nossos deliciosos cupcakes?</p>
        <NuxtLink to="/products" class="btn-primary">
          <i class="fas fa-arrow-left"></i>
          Ver Produtos
        </NuxtLink>
      </div>

      <!-- Orders list -->
      <div v-else class="orders-content">
        <!-- Filtros de Status -->
        <div class="filters-section">
          <button 
            v-for="(label, status) in filterOptions"
            :key="status"
            @click="selectedFilter = status"
            class="filter-btn"
            :class="{ active: selectedFilter === status }"
          >
            {{ label }}
          </button>
        </div>

        <!-- Lista de Pedidos -->
        <div class="orders-list">
          <div 
            v-for="order in filteredOrders" 
            :key="order.id"
            class="order-card"
            :class="`status-${order.status.toLowerCase()}`"
            @click="viewOrderDetails(order.id)"
          >
            <!-- Header do Card -->
            <div class="order-card-header">
              <div class="order-number">
                <i class="fas fa-receipt"></i>
                <div>
                  <h3>Pedido #{{ order.id.substring(0, 8).toUpperCase() }}</h3>
                  <p class="order-date">
                    <i class="far fa-calendar"></i>
                    {{ formatDate(order.createdAt) }}
                  </p>
                </div>
              </div>
              <div class="order-status">
                <span class="status-badge" :class="`badge-${order.status.toLowerCase()}`">
                  <i :class="getStatusIcon(order.status)"></i>
                  {{ getStatusText(order.status) }}
                </span>
              </div>
            </div>

            <!-- Linha do tempo do status -->
            <div class="status-timeline">
              <div 
                v-for="(step, index) in statusSteps"
                :key="step.status"
                class="timeline-step"
                :class="{ 
                  active: getStatusOrder(order.status) >= index,
                  current: step.status === order.status 
                }"
              >
                <div class="step-icon">
                  <i :class="step.icon"></i>
                </div>
                <span class="step-label">{{ step.label }}</span>
              </div>
            </div>

            <!-- Itens do Pedido -->
            <div v-if="order.items && order.items.length > 0" class="order-items-preview">
              <div class="items-header">
                <i class="fas fa-shopping-basket"></i>
                <span>{{ order.items.length }} {{ order.items.length === 1 ? 'item' : 'itens' }}</span>
              </div>
              <div class="items-list">
                <div 
                  v-for="item in order.items.slice(0, 3)" 
                  :key="item.id" 
                  class="item-preview"
                >
                  <img 
                    :src="getProductImage(item.product)" 
                    :alt="item.product.name"
                    class="item-image"
                  >
                  <div class="item-info">
                    <span class="item-name">{{ (item.product || item).name }}</span>
                    <span class="item-quantity">x{{ item.quantity || 1 }}</span>
                  </div>
                  <span class="item-price">R$ {{ getItemPrice(item).toFixed(2) }}</span>
                </div>
                <p v-if="order.items.length > 3" class="more-items">
                  + {{ order.items.length - 3 }} {{ order.items.length - 3 === 1 ? 'outro item' : 'outros itens' }}
                </p>
              </div>
            </div>

            <!-- Footer do Card -->
            <div class="order-card-footer">
              <div class="order-total">
                <span class="total-label">Total do Pedido</span>
                <span class="total-value">R$ {{ order.total.toFixed(2) }}</span>
              </div>
              <div class="order-actions">
                <button 
                  v-if="order.status === 'OPEN'"
                  @click.stop="cancelOrder(order.id)"
                  class="btn-cancel"
                >
                  <i class="fas fa-times"></i>
                  Cancelar
                </button>
                <button class="btn-details">
                  <i class="fas fa-eye"></i>
                  Ver Detalhes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import { useOrdersStore } from '~/stores/orders'
import type { OrderStatus } from '~/types/api'

const router = useRouter()
const { user, isAuthenticated, isCompanyAdmin, company } = useAuth()
const ordersStore = useOrdersStore()

const selectedFilter = ref<string>('all')

const loading = computed(() => ordersStore.loading)
const error = computed(() => ordersStore.error)
const orders = computed(() => ordersStore.orders)

const filterOptions = {
  all: 'Todos',
  OPEN: 'Pendentes',
  PAID: 'Confirmados',
  DELIVERED: 'Entregues',
  CANCELED: 'Cancelados',
}

const filteredOrders = computed(() => {
  if (selectedFilter.value === 'all') {
    return orders.value
  }
  return orders.value.filter(order => order.status === selectedFilter.value)
})

const statusSteps = [
  { status: 'OPEN', label: 'Pendente', icon: 'fas fa-clock' },
  { status: 'PAID', label: 'Confirmado', icon: 'fas fa-check' },
  { status: 'DELIVERED', label: 'Entregue', icon: 'fas fa-check-double' },
]

const statusLabels: Record<OrderStatus, string> = {
  OPEN: 'Pendente',
  PAID: 'Confirmado',
  DELIVERED: 'Entregue',
  CANCELED: 'Cancelado',
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
  const order: Record<OrderStatus, number> = {
    OPEN: 0,
    PAID: 1,
    DELIVERED: 2,
    CANCELED: -1,
  }
  return order[status] || 0
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

const getItemPrice = (item: any) => {
  // Tenta obter o preço de diferentes formas
  if (item.subtotal !== undefined && item.subtotal !== null) {
    return item.subtotal
  }
  
  const price = item.price || (item.product && item.product.salePrice) || (item.product && item.product.price) || item.salePrice || 0
  const quantity = item.quantity || 1
  
  return price * quantity
}

const loadOrders = async () => {
  try {
    // Se for admin da empresa, buscar todos os pedidos da empresa
    if (isCompanyAdmin.value && company.value?.id) {
      console.log('🔑 Admin detectado - buscando pedidos da empresa:', company.value.name)
      await ordersStore.fetchOrdersByCompany(company.value.id)
    } else if (user.value?.id) {
      console.log('👤 Usuário comum - buscando apenas seus pedidos')
      await ordersStore.fetchOrders(user.value.id)
    }
  } catch (err) {
    console.error('Erro ao carregar pedidos:', err)
  }
}

const cancelOrder = async (orderId: string) => {
  if (!confirm('Tem certeza que deseja cancelar este pedido?')) return
  
  try {
    await ordersStore.cancelOrder(orderId)
    await loadOrders()
  } catch (err: any) {
    console.error('Erro ao cancelar pedido:', err)
    alert(err.message || 'Erro ao cancelar pedido')
  }
}

const viewOrderDetails = (orderId: string) => {
  router.push(`/orders/${orderId}`)
}

onMounted(async () => {
  if (!isAuthenticated.value) {
    router.push('/login?redirect=/orders')
    return
  }

  await loadOrders()
})
</script>

<style lang="scss" scoped>
.orders-page {
  min-height: 100vh;
  background: var(--background);
}

// Hero Section
.hero-section {
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  color: white;
  padding: 3rem 2rem 2rem;
  text-align: center;
  margin-bottom: 2rem;

  .hero-content {
    max-width: 800px;
    margin: 0 auto;

    i {
      font-size: 3rem;
      margin-bottom: 1rem;
      opacity: 0.9;
    }

    h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      text-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .subtitle {
      font-size: 1.1rem;
      opacity: 0.95;
      font-weight: 300;
    }
  }
}

.orders-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem 4rem;
}

// Estados vazios
.loading-state,
.error-state,
.empty-state {
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

    &.fa-spinner {
      color: var(--primary);
    }
  }

  h2 {
    font-size: 1.8rem;
    color: var(--text);
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 1.1rem;
    color: #666;
    margin-bottom: 2rem;
  }
}

.btn-retry,
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(139, 0, 20, 0.3);

  i {
    font-size: 1rem;
    margin: 0;
    color: white;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(139, 0, 20, 0.4);
  }
}

// Filtros
.filters-section {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
  overflow-x: auto;
  padding: 0.5rem 0;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--primary);
    border-radius: 4px;
  }
}

.filter-btn {
  padding: 0.75rem 1.5rem;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 50px;
  color: #666;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  font-size: 0.95rem;

  &:hover {
    border-color: var(--primary);
    color: var(--primary);
  }

  &.active {
    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
    border-color: var(--primary);
    color: white;
    box-shadow: 0 4px 12px rgba(139, 0, 20, 0.3);
  }
}

// Lista de Pedidos
.orders-list {
  display: grid;
  gap: 2rem;
}

.order-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-left: 5px solid #ddd;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  }

  &.status-pending { border-left-color: #FF9800; }
  &.status-confirmed { border-left-color: #4CAF50; }
  &.status-preparing { border-left-color: #2196F3; }
  &.status-ready { border-left-color: #9C27B0; }
  &.status-out_for_delivery { border-left-color: #FF5722; }
  &.status-delivered { border-left-color: #4CAF50; }
  &.status-cancelled { border-left-color: #F44336; }
}

.order-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #f0f0f0;

  .order-number {
    display: flex;
    align-items: center;
    gap: 1rem;

    > i {
      font-size: 2rem;
      color: var(--primary);
    }

    h3 {
      font-size: 1.3rem;
      color: var(--text);
      margin-bottom: 0.25rem;
      font-weight: 700;
    }

    .order-date {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #666;
      font-size: 0.9rem;

      i {
        color: var(--primary);
      }
    }
  }
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
  
  &.badge-open { background: #FFF3E0; color: #E65100; }
  &.badge-paid { background: #E8F5E9; color: #2E7D32; }
  &.badge-delivered { background: #E3F2FD; color: #1565C0; }
  &.badge-canceled { background: #FFEBEE; color: #C62828; }

  i {
    font-size: 1rem;
  }
}

// Timeline de Status
.status-timeline {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  position: relative;
  padding: 0 1rem;

  &::before {
    content: '';
    position: absolute;
    top: 20px;
    left: 2rem;
    right: 2rem;
    height: 3px;
    background: #e0e0e0;
    z-index: 0;
  }

  .timeline-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
    position: relative;
    z-index: 1;

    .step-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #e0e0e0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      transition: all 0.3s ease;
      font-size: 1rem;
    }

    .step-label {
      font-size: 0.75rem;
      color: #999;
      text-align: center;
      font-weight: 500;
    }

    &.active {
      .step-icon {
        background: var(--primary);
      }

      .step-label {
        color: var(--text);
        font-weight: 600;
      }
    }

    &.current {
      .step-icon {
        background: var(--secondary);
        box-shadow: 0 0 0 4px rgba(139, 0, 20, 0.2);
        transform: scale(1.15);
      }
    }
  }
}

// Preview de Itens
.order-items-preview {
  margin-bottom: 1.5rem;

  .items-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
    color: var(--text);
    font-weight: 600;

    i {
      color: var(--primary);
    }
  }

  .items-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .item-preview {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem;
    background: var(--surface);
    border-radius: 12px;

    .item-image {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 8px;
    }

    .item-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;

      .item-name {
        font-weight: 600;
        color: var(--text);
      }

      .item-quantity {
        font-size: 0.9rem;
        color: #666;
      }
    }

    .item-price {
      font-weight: 700;
      color: var(--primary);
      font-size: 1.1rem;
    }
  }

  .more-items {
    text-align: center;
    color: var(--primary);
    font-weight: 600;
    font-size: 0.9rem;
    margin-top: 0.5rem;
  }
}

// Footer do Card
.order-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.5rem;
  border-top: 2px solid #f0f0f0;

  .order-total {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    .total-label {
      font-size: 0.9rem;
      color: #666;
    }

    .total-value {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--primary);
    }
  }

  .order-actions {
    display: flex;
    gap: 0.75rem;
  }
}

.btn-cancel,
.btn-details {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;

  i {
    font-size: 1rem;
  }
}

.btn-cancel {
  background: #FFEBEE;
  color: #C62828;

  &:hover {
    background: #FFCDD2;
    transform: translateY(-2px);
  }
}

.btn-details {
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(139, 0, 20, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(139, 0, 20, 0.4);
  }
}

// Responsive
@media (max-width: 768px) {
  .hero-section {
    padding: 2rem 1rem 1.5rem;

    .hero-content {
      h1 {
        font-size: 2rem;
      }

      i {
        font-size: 2.5rem;
      }
    }
  }

  .orders-container {
    padding: 0 1rem 2rem;
  }

  .order-card {
    padding: 1.5rem;
  }

  .order-card-header {
    flex-direction: column;
    gap: 1rem;
  }

  .status-timeline {
    .step-label {
      font-size: 0.65rem;
    }

    .step-icon {
      width: 35px;
      height: 35px;
      font-size: 0.85rem;
    }
  }

  .order-card-footer {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;

    .order-total {
      text-align: center;
    }

    .order-actions {
      flex-direction: column;

      button {
        width: 100%;
        justify-content: center;
      }
    }
  }

  .filters-section {
    gap: 0.5rem;

    .filter-btn {
      padding: 0.625rem 1.25rem;
      font-size: 0.85rem;
    }
  }
}
</style>

