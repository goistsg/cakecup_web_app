import { useCartStore } from '~/stores/cart'
import { computed } from 'vue'

export function useCart() {
  const cartStore = useCartStore()

  return {
    // State
    cart: computed(() => cartStore.cart),
    items: computed(() => cartStore.items),
    totalItems: computed(() => cartStore.totalItems),
    total: computed(() => cartStore.total),
    formattedTotal: computed(() => cartStore.formattedTotal),
    itemsCount: computed(() => cartStore.itemsCount),
    isOpen: computed(() => cartStore.isOpen),
    loading: computed(() => cartStore.loading),
    error: computed(() => cartStore.error),

    // Actions
    fetchCart: () => cartStore.fetchCart(),
    addItem: (productId: string, quantity?: number, variant?: string) => 
      cartStore.addItem(productId, quantity, variant),
    updateQuantity: (itemId: string, quantity: number) => 
      cartStore.updateQuantity(itemId, quantity),
    removeItem: (itemId: string) => cartStore.removeItem(itemId),
    clearCart: () => cartStore.clearCart(),
    toggleCart: () => cartStore.toggleCart(),
    openCart: () => cartStore.openCart(),
    closeCart: () => cartStore.closeCart(),
    clearError: () => cartStore.clearError(),
  }
}
