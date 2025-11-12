import type { ApiError } from '~/types/api'

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: any
  headers?: Record<string, string>
  query?: Record<string, any>
}

class ApiService {
  private baseURL: string
  private defaultHeaders: Record<string, string>

  constructor() {
    this.baseURL = 'https://vendabela.onrender.com/app/v1'
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }
  }

  private getToken(): string | null {
    if (process.client) {
      return localStorage.getItem('auth_token')
    }
    return null
  }

  private getHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const headers = { ...this.defaultHeaders, ...customHeaders }
    const token = this.getToken()
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    // Adicionar company-id header se disponível
    try {
      const config = useRuntimeConfig()
      if (config.public.companyId) {
        headers['company-id'] = config.public.companyId as string
      }
    } catch (error) {
      // Ignorar erro se useRuntimeConfig não estiver disponível
      console.debug('Runtime config não disponível')
    }

    return headers
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, headers: customHeaders, query } = options

    try {
      const response = await $fetch<T>(endpoint, {
        baseURL: this.baseURL,
        method,
        headers: this.getHeaders(customHeaders),
        body: body ? JSON.stringify(body) : undefined,
        query,
        onResponseError({ response }) {
          const error = response._data as ApiError
          throw new Error(error.message || 'Erro na requisição')
        },
      })

      return response
    } catch (error: any) {
      console.error('API Error:', error)
      throw error
    }
  }

  // Auth
  async login(whatsapp: string) {
    return this.request<{ message: string }>('/auth/login', {
      method: 'POST',
      body: { whatsapp },
    })
  }

  async verifyOtp(whatsapp: string, otpCode: string) {
    return this.request<{ user: any; token: string; message: string }>('/auth/verify-otp', {
      method: 'POST',
      body: { whatsapp, otpCode },
    })
  }

  async getProfile() {
    return this.request<{ user: any }>('/auth/me')
  }

  async logout() {
    return this.request<{ message: string }>('/auth/logout', {
      method: 'POST',
    })
  }

  async createUserConsumer(data: { name: string; whatsapp: string; companyId: string }) {
    return this.request<any>('/users/consumer', {
      method: 'POST',
      body: data,
    })
  }

  // Products (Store - sem autenticação)
  async getProducts(companyId?: string, categoryId?: string) {
    const query: Record<string, any> = {}
    if (categoryId) query.category = categoryId // API usa 'category' não 'categoryId'
    
    return this.request<any>('/store/products', { query })
  }

  async getProduct(id: string) {
    return this.request<any>(`/store/products/${id}`)
  }

  async createProduct(data: any) {
    return this.request<any>('/products', {
      method: 'POST',
      body: data,
    })
  }

  async updateProduct(id: string, data: any) {
    return this.request<any>(`/products/${id}`, {
      method: 'PATCH',
      body: data,
    })
  }

  async deleteProduct(id: string) {
    return this.request<any>(`/products/${id}`, {
      method: 'DELETE',
    })
  }

  // Categories (Store - sem autenticação) - Retorna array de strings
  async getCategories(companyId?: string) {
    return this.request<string[]>('/store/categories')
  }

  async getCategory(id: string) {
    return this.request<any>(`/categories/${id}`)
  }

  // Cart (usa autenticação via Bearer token)
  async getCart() {
    return this.request<any>('/cart')
  }

  async addToCart(data: { productId: string; quantity: number; variant?: string }) {
    return this.request<any>('/cart/items', {
      method: 'POST',
      body: data,
    })
  }

  async updateCartItem(itemId: string, quantity: number) {
    return this.request<any>(`/cart/items/${itemId}`, {
      method: 'PUT',
      body: { quantity },
    })
  }

  async removeFromCart(itemId: string) {
    return this.request<any>(`/cart/items/${itemId}`, {
      method: 'DELETE',
    })
  }

  async clearCart() {
    return this.request<any>('/cart', {
      method: 'DELETE',
    })
  }

  // Favorites
  async getFavorites() {
    return this.request<any[]>('/favorites')
  }

  async addFavorite(productId: string) {
    return this.request<any>('/favorites', {
      method: 'POST',
      body: { productId },
    })
  }

  async removeFavorite(productId: string) {
    return this.request<any>(`/favorites`, {
      method: 'DELETE',
      body: { productId },
    })
  }

  // Orders
  async getOrders(clientId?: string, companyId?: string) {
    const query: Record<string, any> = {}
    if (clientId) query.clientId = clientId
    if (companyId) query.companyId = companyId
    
    return this.request<any>('/orders', { query })
  }

  async getOrder(id: string) {
    return this.request<any>(`/orders/${id}`)
  }

  async createOrder(data: any) {
    return this.request<any>('/orders', {
      method: 'POST',
      body: data,
    })
  }

  async updateOrder(id: string, data: any) {
    return this.request<any>(`/orders/${id}`, {
      method: 'PATCH',
      body: data,
    })
  }

  async cancelOrder(id: string) {
    return this.request<any>(`/orders/${id}/cancel`, {
      method: 'POST',
    })
  }

  // Clients
  async getClients(companyId?: string) {
    const query: Record<string, any> = {}
    if (companyId) query.companyId = companyId
    
    return this.request<any>('/clients', { query })
  }

  async getClient(id: string) {
    return this.request<any>(`/clients/${id}`)
  }

  async createClient(data: any) {
    return this.request<any>('/clients', {
      method: 'POST',
      body: data,
    })
  }

  async updateClient(id: string, data: any) {
    return this.request<any>(`/clients/${id}`, {
      method: 'PATCH',
      body: data,
    })
  }

  // Addresses
  async getAddresses(clientId: string) {
    return this.request<any>('/addresses', {
      query: { clientId },
    })
  }

  async getAddress(id: string) {
    return this.request<any>(`/addresses/${id}`)
  }

  async createAddress(data: any) {
    return this.request<any>('/addresses', {
      method: 'POST',
      body: data,
    })
  }

  async updateAddress(id: string, data: any) {
    return this.request<any>(`/addresses/${id}`, {
      method: 'PATCH',
      body: data,
    })
  }

  async deleteAddress(id: string) {
    return this.request<any>(`/addresses/${id}`, {
      method: 'DELETE',
    })
  }


  // Payments
  async getPayments(orderId?: string) {
    const query: Record<string, any> = {}
    if (orderId) query.orderId = orderId
    
    return this.request<any>('/payments', { query })
  }

  async getPayment(id: string) {
    return this.request<any>(`/payments/${id}`)
  }

  async createPayment(data: any) {
    return this.request<any>('/payments', {
      method: 'POST',
      body: data,
    })
  }

  async updatePayment(id: string, data: any) {
    return this.request<any>(`/payments/${id}`, {
      method: 'PATCH',
      body: data,
    })
  }

  // Raffles
  async getRaffles(companyId?: string) {
    const query: Record<string, any> = {}
    if (companyId) query.companyId = companyId
    
    return this.request<any>('/raffles', { query })
  }

  async getRaffle(id: string) {
    return this.request<any>(`/raffles/${id}`)
  }

  async createRaffleEntry(raffleId: string, clientId: string) {
    return this.request<any>(`/raffles/${raffleId}/entries`, {
      method: 'POST',
      body: { clientId },
    })
  }

  async getRaffleEntries(raffleId: string) {
    return this.request<any>(`/raffles/${raffleId}/entries`)
  }

  // User Feedback
  async createFeedback(data: any) {
    return this.request<any>('/user-feedback', {
      method: 'POST',
      body: data,
    })
  }

  async getFeedbacks(sessionId?: string) {
    const query: Record<string, any> = {}
    if (sessionId) query.sessionId = sessionId
    
    return this.request<any>('/user-feedback', { query })
  }
}

export const api = new ApiService()
export default api

