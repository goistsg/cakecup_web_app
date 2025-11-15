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
    login: (email: string, password: string) => authStore.login(email, password),
    signup: (data: { name: string; whatsapp: string; email: string; password: string }) => authStore.signup(data),
    forgotPassword: (email: string) => authStore.forgotPassword(email),
    resetPassword: (token: string, newPassword: string) => authStore.resetPassword(token, newPassword),
    logout: () => authStore.logout(),
    fetchProfile: () => authStore.fetchProfile(),
    initAuth: () => authStore.initAuth(),
    clearError: () => authStore.clearError(),
  }
}

