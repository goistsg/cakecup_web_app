import { defineStore } from 'pinia'
import { api } from '~/utils/api'
import type { Client, CreateClientDto, Address } from '~/types/api'

interface ClientsState {
  currentClient: Client | null
  clients: Client[]
  addresses: Address[]
  loading: boolean
  error: string | null
}

export const useClientsStore = defineStore('clients', {
  state: (): ClientsState => ({
    currentClient: null,
    clients: [],
    addresses: [],
    loading: false,
    error: null,
  }),

  getters: {
    primaryAddress: (state) => {
      return state.addresses.find(addr => addr.isPrimary)
    },
  },

  actions: {
    async fetchClients(companyId?: string) {
      this.loading = true
      this.error = null

      try {
        const response = await api.getClients(companyId)
        this.clients = response.data || response
        return response
      } catch (error: any) {
        this.error = error.message || 'Erro ao carregar clientes'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchClient(id: string) {
      this.loading = true
      this.error = null

      try {
        const response = await api.getClient(id)
        this.currentClient = response.data || response
        return response
      } catch (error: any) {
        this.error = error.message || 'Erro ao carregar cliente'
        throw error
      } finally {
        this.loading = false
      }
    },

    async createClient(data: CreateClientDto) {
      this.loading = true
      this.error = null

      try {
        const response = await api.createClient(data)
        this.currentClient = response.data || response
        return response
      } catch (error: any) {
        this.error = error.message || 'Erro ao criar cliente'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateClient(id: string, data: any) {
      this.loading = true
      this.error = null

      try {
        const response = await api.updateClient(id, data)
        this.currentClient = response.data || response
        return response
      } catch (error: any) {
        this.error = error.message || 'Erro ao atualizar cliente'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchAddresses(clientId: string) {
      this.loading = true
      this.error = null

      try {
        const response = await api.getAddresses(clientId)
        this.addresses = response.data || response
        return response
      } catch (error: any) {
        this.error = error.message || 'Erro ao carregar endereços'
        throw error
      } finally {
        this.loading = false
      }
    },

    async createAddress(data: any) {
      this.loading = true
      this.error = null

      try {
        const response = await api.createAddress(data)
        this.addresses.push(response.data || response)
        return response
      } catch (error: any) {
        this.error = error.message || 'Erro ao criar endereço'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateAddress(id: string, data: any) {
      this.loading = true
      this.error = null

      try {
        const response = await api.updateAddress(id, data)
        const index = this.addresses.findIndex(a => a.id === id)
        if (index !== -1) {
          this.addresses[index] = response.data || response
        }
        return response
      } catch (error: any) {
        this.error = error.message || 'Erro ao atualizar endereço'
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteAddress(id: string) {
      this.loading = true
      this.error = null

      try {
        await api.deleteAddress(id)
        this.addresses = this.addresses.filter(a => a.id !== id)
      } catch (error: any) {
        this.error = error.message || 'Erro ao deletar endereço'
        throw error
      } finally {
        this.loading = false
      }
    },

    setCurrentClient(client: Client) {
      this.currentClient = client
    },

    clearError() {
      this.error = null
    },
  },
})

