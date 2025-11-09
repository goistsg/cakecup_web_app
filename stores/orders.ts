import { defineStore } from 'pinia'
import { api } from '~/utils/api'
import type { Order, CreateOrderDto } from '~/types/api'

interface OrdersState {
  orders: Order[]
  selectedOrder: Order | null
  loading: boolean
  error: string | null
}

export const useOrdersStore = defineStore('orders', {
  state: (): OrdersState => ({
    orders: [],
    selectedOrder: null,
    loading: false,
    error: null,
  }),

  getters: {
    ordersByStatus: (state) => (status: string) => {
      return state.orders.filter(order => order.status === status)
    },

    recentOrders: (state) => {
      return state.orders.slice(0, 10)
    },
  },

  actions: {
    async fetchOrders(clientId?: string, companyId?: string) {
      this.loading = true
      this.error = null

      try {
        const response = await api.getOrders(clientId, companyId)
        this.orders = response.data || response
        return response
      } catch (error: any) {
        this.error = error.message || 'Erro ao carregar pedidos'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchOrder(id: string) {
      this.loading = true
      this.error = null

      try {
        const response = await api.getOrder(id)
        this.selectedOrder = response.data || response
        return response
      } catch (error: any) {
        this.error = error.message || 'Erro ao carregar pedido'
        throw error
      } finally {
        this.loading = false
      }
    },

    async createOrder(data: CreateOrderDto) {
      this.loading = true
      this.error = null

      try {
        const response = await api.createOrder(data)
        this.orders.unshift(response.data || response)
        return response
      } catch (error: any) {
        this.error = error.message || 'Erro ao criar pedido'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateOrder(id: string, data: any) {
      this.loading = true
      this.error = null

      try {
        const response = await api.updateOrder(id, data)
        const index = this.orders.findIndex(o => o.id === id)
        if (index !== -1) {
          this.orders[index] = response.data || response
        }
        return response
      } catch (error: any) {
        this.error = error.message || 'Erro ao atualizar pedido'
        throw error
      } finally {
        this.loading = false
      }
    },

    async cancelOrder(id: string) {
      this.loading = true
      this.error = null

      try {
        const response = await api.cancelOrder(id)
        const index = this.orders.findIndex(o => o.id === id)
        if (index !== -1) {
          this.orders[index].status = 'CANCELLED' as any
        }
        return response
      } catch (error: any) {
        this.error = error.message || 'Erro ao cancelar pedido'
        throw error
      } finally {
        this.loading = false
      }
    },

    clearError() {
      this.error = null
    },
  },
})

