import { defineStore } from 'pinia'
import { api } from '~/utils/api'
import type { User, UserCompany, Company } from '~/types/api'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  currentCompany: Company | null
  isCompanyAdmin: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    currentCompany: null,
    isCompanyAdmin: false,
  }),

  getters: {
    currentUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated,
    userRole: (state) => state.user?.role,
    isAdmin: (state) => state.user?.role === 'ADMIN',
    company: (state) => state.currentCompany,
    isAdminOfCompany: (state) => state.isCompanyAdmin,
  },

  actions: {
    async login(email: string, password: string) {
      this.loading = true
      this.error = null

      try {
        const response = await api.login(email, password)
        
        this.token = response.token
        this.user = response.user
        this.isAuthenticated = true

        // Processar informações da empresa
        this.processCompanyInfo(response.user)

        // Salvar token no localStorage
        if (process.client) {
          localStorage.setItem('auth_token', response.token)
          localStorage.setItem('user', JSON.stringify(response.user))
          localStorage.setItem('current_company', JSON.stringify(this.currentCompany))
          localStorage.setItem('is_company_admin', String(this.isCompanyAdmin))
        }

        return response
      } catch (error: any) {
        this.error = error.message || 'Erro ao fazer login'
        throw error
      } finally {
        this.loading = false
      }
    },

    async signup(data: { name: string; whatsapp: string; email: string; password: string }) {
      this.loading = true
      this.error = null

      try {
        const response = await api.signup(data)
        
        // Após signup bem-sucedido, fazer login automaticamente
        if (response.token) {
          this.token = response.token
          this.user = response.user
          this.isAuthenticated = true

          this.processCompanyInfo(response.user)

          if (process.client) {
            localStorage.setItem('auth_token', response.token)
            localStorage.setItem('user', JSON.stringify(response.user))
            localStorage.setItem('current_company', JSON.stringify(this.currentCompany))
            localStorage.setItem('is_company_admin', String(this.isCompanyAdmin))
          }
        }

        return response
      } catch (error: any) {
        this.error = error.message || 'Erro ao criar conta'
        throw error
      } finally {
        this.loading = false
      }
    },

    async forgotPassword(email: string) {
      this.loading = true
      this.error = null

      try {
        const response = await api.forgotPassword(email)
        return response
      } catch (error: any) {
        this.error = error.message || 'Erro ao solicitar recuperação de senha'
        throw error
      } finally {
        this.loading = false
      }
    },

    async resetPassword(token: string, newPassword: string) {
      this.loading = true
      this.error = null

      try {
        const response = await api.resetPassword(token, newPassword)
        return response
      } catch (error: any) {
        this.error = error.message || 'Erro ao redefinir senha'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchProfile() {
      this.loading = true
      this.error = null

      try {
        const response = await api.getProfile()
        this.user = response.user
        this.isAuthenticated = true
        
        // Processar informações da empresa
        this.processCompanyInfo(response.user)
        
        // Atualizar localStorage
        if (process.client) {
          localStorage.setItem('user', JSON.stringify(response.user))
          localStorage.setItem('current_company', JSON.stringify(this.currentCompany))
          localStorage.setItem('is_company_admin', String(this.isCompanyAdmin))
        }
        
        return response
      } catch (error: any) {
        this.error = error.message || 'Erro ao buscar perfil'
        this.logout()
        throw error
      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.loading = true
      
      try {
        await api.logout()
      } catch (error) {
        console.error('Erro ao fazer logout:', error)
      } finally {
        this.user = null
        this.token = null
        this.isAuthenticated = false
        this.currentCompany = null
        this.isCompanyAdmin = false
        this.loading = false

        if (process.client) {
          localStorage.removeItem('auth_token')
          localStorage.removeItem('user')
          localStorage.removeItem('current_company')
          localStorage.removeItem('is_company_admin')
          
          // Limpar carrinho ao fazer logout
          try {
            const { useCartStore } = await import('./cart')
            const cartStore = useCartStore()
            cartStore.clearLocalCart()
          } catch (error) {
            console.error('Erro ao limpar carrinho:', error)
          }
        }
      }
    },

    async initAuth() {
      if (process.client) {
        const token = localStorage.getItem('auth_token')
        const userStr = localStorage.getItem('user')
        const currentCompanyStr = localStorage.getItem('current_company')
        const isCompanyAdminStr = localStorage.getItem('is_company_admin')

        if (token && userStr) {
          this.token = token
          this.user = JSON.parse(userStr)
          this.isAuthenticated = true
          
          // Restaurar informações da empresa
          if (currentCompanyStr) {
            this.currentCompany = JSON.parse(currentCompanyStr)
          }
          if (isCompanyAdminStr) {
            this.isCompanyAdmin = isCompanyAdminStr === 'true'
          }

          // Validar token buscando perfil
          try {
            await this.fetchProfile()
          } catch (error) {
            console.error('Token inválido, fazendo logout')
            this.logout()
          }
        }
      }
    },

    clearError() {
      this.error = null
    },

    // Método auxiliar para processar informações da empresa
    processCompanyInfo(user: User) {
      if (process.client) {
        const config = useRuntimeConfig()
        const envCompanyId = config.public.companyId
        
        if (!envCompanyId) {
          console.warn('NUXT_PUBLIC_COMPANY_ID não está configurado no .env')
          this.currentCompany = null
          this.isCompanyAdmin = false
          return
        }

        // Filtrar a empresa do usuário baseado no companyId do env
        const userCompany = user.companies?.find(
          (uc: UserCompany) => uc.companyId === envCompanyId
        )

        if (userCompany) {
          this.currentCompany = userCompany.company
          this.isCompanyAdmin = userCompany.role === 'COMPANY_ADMIN'
          
          console.log('✅ Empresa filtrada:', this.currentCompany.name)
          console.log('✅ É admin da empresa:', this.isCompanyAdmin)
        } else {
          console.warn('⚠️ Usuário não pertence à empresa configurada no .env')
          this.currentCompany = null
          this.isCompanyAdmin = false
        }
      }
    },
  },
})

