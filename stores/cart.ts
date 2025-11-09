import { defineStore } from 'pinia'
import { api } from '~/utils/api'
import type { Cart, CartItem, Product } from '~/types/api'

interface CartState {
  cart: Cart | null
  items: CartItem[]
  isOpen: boolean
  loading: boolean
  error: string | null
  clientId: string | null
}

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    cart: null,
    items: [],
    isOpen: false,
    loading: false,
    error: null,
    clientId: null,
  }),

  getters: {
    totalItems: (state) => {
      return state.items.reduce((total, item) => total + item.quantity, 0)
    },
    
    total: (state) => {
      return state.items.reduce((total, item) => total + item.subtotal, 0)
    },
    
    formattedTotal(): string {
      return `R$ ${this.total.toFixed(2)}`
    },

    itemsCount: (state) => state.items.length,
  },

  actions: {
    setClientId(clientId: string) {
      this.clientId = clientId
    },

    async fetchCart() {
      if (!this.clientId) {
        console.warn('ClientId não definido')
        return
      }

      this.loading = true
      this.error = null

      try {
        const response = await api.getCart(this.clientId)
        this.cart = response.data || response
        this.items = this.cart?.items || []
        return response
      } catch (error: any) {
        this.error = error.message || 'Erro ao carregar carrinho'
        throw error
      } finally {
        this.loading = false
      }
    },

    async addItem(productId: string, quantity: number = 1, variant?: string) {
      if (!this.clientId) {
        console.warn('ClientId não definido')
        return
      }

      this.loading = true
      this.error = null

      try {
        const response = await api.addToCart(this.clientId, {
          productId,
          quantity,
          variant,
        })
        
        // Atualizar carrinho localmente
        await this.fetchCart()
        return response
      } catch (error: any) {
        this.error = error.message || 'Erro ao adicionar ao carrinho'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateQuantity(itemId: string, quantity: number) {
      if (!this.clientId) {
        console.warn('ClientId não definido')
        return
      }

      this.loading = true
      this.error = null

      try {
        const response = await api.updateCartItem(this.clientId, itemId, quantity)
        
        // Atualizar carrinho localmente
        await this.fetchCart()
        return response
      } catch (error: any) {
        this.error = error.message || 'Erro ao atualizar quantidade'
        throw error
      } finally {
        this.loading = false
      }
    },

    async removeItem(itemId: string) {
      if (!this.clientId) {
        console.warn('ClientId não definido')
        return
      }

      this.loading = true
      this.error = null

      try {
        const response = await api.removeFromCart(this.clientId, itemId)
        
        // Atualizar carrinho localmente
        await this.fetchCart()
        return response
      } catch (error: any) {
        this.error = error.message || 'Erro ao remover item'
        throw error
      } finally {
        this.loading = false
      }
    },

    async clearCart() {
      if (!this.clientId) {
        console.warn('ClientId não definido')
        return
      }

      this.loading = true
      this.error = null

      try {
        const response = await api.clearCart(this.clientId)
        this.items = []
        this.cart = null
        return response
      } catch (error: any) {
        this.error = error.message || 'Erro ao limpar carrinho'
        throw error
      } finally {
        this.loading = false
      }
    },

    toggleCart() {
      this.isOpen = !this.isOpen
    },
    
    openCart() {
      this.isOpen = true
    },
    
    closeCart() {
      this.isOpen = false
    },

    clearError() {
      this.error = null
    },
  },
})
 
