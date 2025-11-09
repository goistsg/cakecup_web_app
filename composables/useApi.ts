import { api } from '~/utils/api'
import { ref } from 'vue'

export function useApi() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const handleRequest = async <T>(request: Promise<T>): Promise<T | null> => {
    loading.value = true
    error.value = null

    try {
      const response = await request
      return response
    } catch (err: any) {
      error.value = err.message || 'Erro na requisição'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    api,
    loading,
    error,
    handleRequest,
  }
}

