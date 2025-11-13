import { useAuthStore } from '~/stores/auth'
import { computed } from 'vue'

export function useAuth() {
  const authStore = useAuthStore()

  return {
    // State
    user: computed(() => authStore.currentUser),
    isAuthenticated: computed(() => authStore.isLoggedIn),
    isAdmin: computed(() => authStore.isAdmin),
    loading: computed(() => authStore.loading),
    error: computed(() => authStore.error),
    
    // Company info
    company: computed(() => authStore.company),
    isCompanyAdmin: computed(() => authStore.isAdminOfCompany),

    // Actions
    login: (whatsapp: string) => authStore.login(whatsapp),
    verifyOtp: (whatsapp: string, otp: string) => authStore.verifyOtp(whatsapp, otp),
    logout: () => authStore.logout(),
    fetchProfile: () => authStore.fetchProfile(),
    initAuth: () => authStore.initAuth(),
    clearError: () => authStore.clearError(),
  }
}

