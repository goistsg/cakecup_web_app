import { ref, computed } from 'vue'
import { useFetch } from '@vueuse/core'

export interface Produto {
  id: number
  name: string
  description: string
  price: number
  category: string
  image_url: string
  flavor: string
  sku: string
}

export function useProducts() {
  const produtos = ref<Produto[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchProdutos = async () => {
    loading.value = true
    error.value = null
    
    try {
      // NUXT_PUBLIC_API_BASE=http://sua-api.com
      const baseUrl = process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000'
      const { data } = await useFetch<{ data: Produto[] }>(`${baseUrl}/products`, {
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })
      
      if (data.value && JSON.parse(String(data.value))['data']) {
        produtos.value = JSON.parse(String(data.value))['data'] as Produto[]
      }
    } catch (err) {
      error.value = 'Erro ao carregar produtos'
      console.error('Erro:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    produtos,
    loading,
    error,
    fetchProdutos
  }
} 