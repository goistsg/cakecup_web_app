import { useCartStore } from '~/stores/cart'
import { ref, computed } from 'vue'
import { useFetch } from '@vueuse/core'

interface CartItem {
  id: number
  nome: string
  preco: number
  quantidade: number
  imagem: string
}

export function useCart() {
  const cartStore = useCartStore()
  const baseUrl = 'http://localhost:3000'  // ajuste para sua URL base

  const fetchCart = async () => {
    cartStore.loading = true
    cartStore.error = null
    
    try {
      const { data } = await useFetch(`${baseUrl}/cart`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      if (data.value) {
        cartStore.items = data.value as CartItem[]
      }
    } catch (err) {
      cartStore.error = 'Erro ao carregar carrinho'
      console.error('Erro:', err)
    } finally {
      cartStore.loading = false
    }
  }

  const addToCart = async (produto: CartItem) => {
    cartStore.loading = true
    cartStore.error = null
    
    try {
      await useFetch(`${baseUrl}/cart/add`, {
        method: 'POST',
        body: {
          productId: produto.id,
          quantity: 1
        }
      })
      await fetchCart() // Recarrega o carrinho
    } catch (err) {
      cartStore.error = 'Erro ao adicionar ao carrinho'
      console.error('Erro:', err)
    } finally {
      cartStore.loading = false
    }
  }

  const updateQuantity = async (itemId: number, quantidade: number) => {
    cartStore.loading = true
    cartStore.error = null
    
    try {
      await useFetch(`${baseUrl}/cart/update`, {
        method: 'PUT',
        body: {
          productId: itemId,
          quantity: quantidade
        }
      })
      await fetchCart()
    } catch (err) {
      cartStore.error = 'Erro ao atualizar quantidade'
      console.error('Erro:', err)
    } finally {
      cartStore.loading = false
    }
  }

  const removeItem = async (itemId: number) => {
    cartStore.loading = true
    cartStore.error = null
    
    try {
      await useFetch(`${baseUrl}/cart/remove`, {
        method: 'DELETE',
        body: {
          productId: itemId
        }
      })
      await fetchCart()
    } catch (err) {
      cartStore.error = 'Erro ao remover item'
      console.error('Erro:', err)
    } finally {
      cartStore.loading = false
    }
  }

  return {
    // Métodos
    fetchCart,
    addToCart,
    updateQuantity,
    removeItem,
    
    // Getters da store
    items: computed(() => cartStore.items),
    total: computed(() => cartStore.total),
    isOpen: computed(() => cartStore.isOpen),
    loading: computed(() => cartStore.loading),
    error: computed(() => cartStore.error),
    
    // Ações da store
    toggleCarrinho: cartStore.toggleCarrinho
  }
}
