<template>
  <div class="orders-page">
    <div class="orders-container">
      <h1>Meus Pedidos</h1>

      <div v-if="loading" class="loading">
        <p>Carregando pedidos...</p>
      </div>

      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
        <button @click="loadOrders" class="btn-retry">Tentar novamente</button>
      </div>

      <div v-else-if="orders.length === 0" class="empty-state">
        <p>Você ainda não fez nenhum pedido</p>
        <NuxtLink to="/products" class="btn-primary">Ver Produtos</NuxtLink>
      </div>

      <div v-else class="orders-list">
        <div 
          v-for="order in orders" 
          :key="order.id"
          class="order-card"
          :class="`status-${order.status.toLowerCase()}`"
        >
          <div class="order-header">
            <div class="order-info">
              <h3>Pedido #{{ order.id.substring(0, 8) }}</h3>
              <p class="order-date">{{ formatDate(order.createdAt) }}</p>
            </div>
            <div class="order-status">
              <span class="status-badge">{{ getStatusText(order.status) }}</span>
            </div>
          </div>

          <div class="order-items">
            <div v-for="item in order.items" :key="item.id" class="order-item">
              <span>{{ item.product.name }}</span>
              <span>x{{ item.quantity }}</span>
              <span class="item-price">R$ {{ item.subtotal.toFixed(2) }}</span>
            </div>
          </div>

          <div class="order-footer">
            <div class="order-total">
              <strong>Total: R$ {{ order.total.toFixed(2) }}</strong>
            </div>
            <div class="order-actions">
              <button 
                v-if="order.status === 'PENDING'"
                @click="cancelOrder(order.id)"
                class="btn-cancel"
              >
                Cancelar
              </button>
              <button @click="viewOrderDetails(order.id)" class="btn-details">
                Ver Detalhes
              </button>
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
const { user, isAuthenticated } = useAuth()
const ordersStore = useOrdersStore()

const loading = computed(() => ordersStore.loading)
const error = computed(() => ordersStore.error)
const orders = computed(() => ordersStore.orders)

const statusLabels: Record<OrderStatus, string> = {
  PENDING: 'Pendente',
  CONFIRMED: 'Confirmado',
  PREPARING: 'Em Preparo',
  READY: 'Pronto',
  OUT_FOR_DELIVERY: 'Saiu para Entrega',
  DELIVERED: 'Entregue',
  CANCELLED: 'Cancelado',
}

const getStatusText = (status: OrderStatus) => {
  return statusLabels[status] || status
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const loadOrders = async () => {
  if (!user.value?.id) return
  
  try {
    await ordersStore.fetchOrders(user.value.id)
  } catch (err) {
    console.error('Erro ao carregar pedidos:', err)
  }
}

const cancelOrder = async (orderId: string) => {
  if (!confirm('Tem certeza que deseja cancelar este pedido?')) return
  
  try {
    await ordersStore.cancelOrder(orderId)
  } catch (err) {
    console.error('Erro ao cancelar pedido:', err)
  }
}

const viewOrderDetails = (orderId: string) => {
  // Implementar visualização de detalhes do pedido
  console.log('Ver detalhes do pedido:', orderId)
}

onMounted(async () => {
  if (!isAuthenticated.value) {
    router.push('/login')
    return
  }

  await loadOrders()
})
</script>

<style lang="scss" scoped>
.orders-page {
  min-height: 100vh;
  background-color: #f9f9f9;
  padding: 2rem;
}

.orders-container {
  max-width: 900px;
  margin: 0 auto;

  h1 {
    text-align: center;
    margin-bottom: 2rem;
    color: #333;
  }
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.order-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  border-left: 4px solid #ddd;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  }

  &.status-pending {
    border-left-color: #ffa500;
  }

  &.status-confirmed {
    border-left-color: #4caf50;
  }

  &.status-preparing {
    border-left-color: #2196f3;
  }

  &.status-ready {
    border-left-color: #9c27b0;
  }

  &.status-out_for_delivery {
    border-left-color: #ff9800;
  }

  &.status-delivered {
    border-left-color: #4caf50;
  }

  &.status-cancelled {
    border-left-color: #f44336;
  }
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;

  .order-info {
    h3 {
      font-size: 1.2rem;
      color: #333;
      margin-bottom: 0.25rem;
    }

    .order-date {
      color: #666;
      font-size: 0.9rem;
    }
  }

  .status-badge {
    display: inline-block;
    padding: 0.5rem 1rem;
    background-color: #f0f0f0;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 600;
  }
}

.order-items {
  margin-bottom: 1rem;
}

.order-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  color: #666;

  .item-price {
    color: var(--primary);
    font-weight: 600;
  }
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #eee;

  .order-total {
    font-size: 1.1rem;
    color: #333;
  }

  .order-actions {
    display: flex;
    gap: 0.5rem;
  }
}

.btn-cancel,
.btn-details,
.btn-retry {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-cancel {
  background-color: #fee;
  color: #c33;

  &:hover {
    background-color: #fdd;
  }
}

.btn-details {
  background-color: var(--primary);
  color: white;

  &:hover {
    background-color: var(--secondary);
  }
}

.btn-retry {
  background-color: var(--primary);
  color: white;
  margin-top: 1rem;

  &:hover {
    background-color: var(--secondary);
  }
}

.btn-primary {
  display: inline-block;
  padding: 1rem 2rem;
  background-color: var(--primary);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s;

  &:hover {
    background-color: var(--secondary);
    transform: translateY(-2px);
  }
}

.loading,
.error,
.empty-state {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);

  p {
    font-size: 1.2rem;
    color: #666;
    margin-bottom: 1rem;
  }
}

@media (max-width: 768px) {
  .order-footer {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;

    .order-actions {
      justify-content: stretch;
      
      button {
        flex: 1;
      }
    }
  }
}
</style>

