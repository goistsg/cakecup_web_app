export function useCompany() {
  const config = useRuntimeConfig()
  
  const companyId = computed(() => config.public.companyId)

  return {
    companyId
  }
}

