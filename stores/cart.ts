import { defineStore } from 'pinia'

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
    isOpen: false,
  }),

  getters: {
    totalItems: (state: any) => {
      return state.items.reduce((total: any, item: any) => total + item.quantity, 0)
    },
    
    total: (state: any) => {
      return state.items.reduce((total: any, item: any) => total + (item.price * item.quantity), 0)
    },
    
    formattedTotal: (state: any) => {
        return `R$ ${state.total.toFixed(2)}`
    }
  },

  actions: {
    addItem(item: CartItem) {
      const existingItem = this.items.find((i: CartItem) => i.id === item.id)
      
      if (existingItem) {
        existingItem.quantity += item.quantity
      } else {
        this.items.push({ ...item })
      }
    },

    updateQuantity(itemId: number, quantity: number) {
      const item = this.items.find((i: any) => i.id === itemId)
      if (item) {
        item.quantity = quantity
        if (quantity <= 0) {
          this.removeItem(itemId)
        }
      }
    },

    removeItem(itemId: number) {
      const index = this.items.findIndex((item: any) => item.id === itemId)
      if (index > -1) {
        this.items.splice(index, 1)
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
  },
  
  persist: true
}) 
