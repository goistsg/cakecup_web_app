import { defineStore } from 'pinia'
import { api } from '~/utils/api'
import type { Cart, CartItem, Product } from '~/types/api'

interface CartState {
  cart: Cart | null
  items: CartItem[]
  isOpen: boolean
  loading: boolean
  error: string | null
}

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    cart: null,
    items: [],
    isOpen: false,
    loading: false,
    error: null,
  }),

  getters: {
    totalItems: (state) => {
      return state.items.reduce((total, item) => total + item.quantity, 0)
    },
    
    total: (state) => {
      return state.items.reduce((total, item) => total + (item.quantity * item.price), 0)
    },
    
    formattedTotal(): string {
      return `R$ ${this.total.toFixed(2)}`
    },

    itemsCount: (state) => state.items.length,
  },

  actions: {
    async fetchCart() {
      this.loading = true
      this.error = null

      try {
        const response = await api.getCart()
        this.cart = response
        this.items = response.items || []
        return response
      } catch (error: any) {
        // Se não autenticado ou erro, limpar carrinho
        if (error.statusCode === 401 || error.statusCode === 404) {
          this.items = []
          this.cart = null
        } else {
          this.error = error.message || 'Erro ao carregar carrinho'
        }
        throw error
      } finally {
        this.loading = false
      }
    },

    async addItem(productId: string, quantity: number = 1, variant?: string) {
      this.loading = true
      this.error = null

      try {
        const response = await api.addToCart({
          productId,
          quantity,
          variant,
        })
        
        // Atualizar carrinho localmente
        await this.fetchCart()
        return response
      } catch (error: any) {
        this.error = error.message || 'Erro ao adicionar ao carrinho'
        console.error('Erro ao adicionar ao carrinho:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateQuantity(itemId: string, quantity: number) {
      // Evitar chamadas duplicadas
      if (this.loading) {
        return
      }
      
      this.loading = true
      this.error = null

      try {
        const response = await api.updateCartItem(itemId, quantity)
        
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
      this.loading = true
      this.error = null

      try {
        const response = await api.removeFromCart(itemId)
        
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
      this.loading = true
      this.error = null

      try {
        const response = await api.clearCart()
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

    // Limpar carrinho localmente (sem API call) - usado no logout
    clearLocalCart() {
      this.items = []
      this.cart = null
      this.error = null
    },
  },
})
 
