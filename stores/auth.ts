import { defineStore } from 'pinia'
import { api } from '~/utils/api'
import type { User } from '~/types/api'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  }),

  getters: {
    currentUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated,
    userRole: (state) => state.user?.role,
    isAdmin: (state) => state.user?.role === 'ADMIN',
  },

  actions: {
    async login(whatsapp: string) {
      this.loading = true
      this.error = null

      try {
        const response = await api.login(whatsapp)
        return response
      } catch (error: any) {
        this.error = error.message || 'Erro ao enviar OTP'
        throw error
      } finally {
        this.loading = false
      }
    },

    async verifyOtp(whatsapp: string, otp: string) {
      this.loading = true
      this.error = null

      try {
        const response = await api.verifyOtp(whatsapp, otp)
        
        this.token = response.token
        this.user = response.user
        this.isAuthenticated = true

        // Salvar token no localStorage
        if (process.client) {
          localStorage.setItem('auth_token', response.token)
          localStorage.setItem('user', JSON.stringify(response.user))
        }

        return response
      } catch (error: any) {
        this.error = error.message || 'OTP inválido'
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
        this.loading = false

        if (process.client) {
          localStorage.removeItem('auth_token')
          localStorage.removeItem('user')
        }
      }
    },

    async initAuth() {
      if (process.client) {
        const token = localStorage.getItem('auth_token')
        const userStr = localStorage.getItem('user')

        if (token && userStr) {
          this.token = token
          this.user = JSON.parse(userStr)
          this.isAuthenticated = true

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
  },
})

