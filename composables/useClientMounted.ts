import { ref, onMounted } from 'vue'

export const useClientMounted = () => {
  const isMounted = ref(false)

  onMounted(() => {
    isMounted.value = true
  })

  return {
    isMounted
  }
}

