export default defineNuxtPlugin(async (nuxtApp) => {
  const authStore = useAuthStore()
  
  // Inicializar autenticação ao carregar o app
  await authStore.initAuth()
})

