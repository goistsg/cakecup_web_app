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

  async verifyOtp(whatsapp: string, otp: string) {
    return this.request<{ user: any; token: string; message: string }>('/auth/verify-otp', {
      method: 'POST',
      body: { whatsapp, otp },
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

  // Products
  async getProducts(companyId?: string, categoryId?: string) {
    const query: Record<string, any> = {}
    if (companyId) query.companyId = companyId
    if (categoryId) query.categoryId = categoryId
    
    return this.request<any>('/products', { query })
  }

  async getProduct(id: string) {
    return this.request<any>(`/products/${id}`)
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

  // Categories
  async getCategories(companyId?: string) {
    const query: Record<string, any> = {}
    if (companyId) query.companyId = companyId
    
    return this.request<any>('/categories', { query })
  }

  async getCategory(id: string) {
    return this.request<any>(`/categories/${id}`)
  }

  // Cart
  async getCart(clientId: string) {
    return this.request<any>(`/cart/${clientId}`)
  }

  async addToCart(clientId: string, data: { productId: string; quantity: number; variant?: string }) {
    return this.request<any>(`/cart/${clientId}/add`, {
      method: 'POST',
      body: data,
    })
  }

  async updateCartItem(clientId: string, itemId: string, quantity: number) {
    return this.request<any>(`/cart/${clientId}/items/${itemId}`, {
      method: 'PATCH',
      body: { quantity },
    })
  }

  async removeFromCart(clientId: string, itemId: string) {
    return this.request<any>(`/cart/${clientId}/items/${itemId}`, {
      method: 'DELETE',
    })
  }

  async clearCart(clientId: string) {
    return this.request<any>(`/cart/${clientId}/clear`, {
      method: 'DELETE',
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

  // Favorites
  async getFavorites(clientId: string) {
    return this.request<any>(`/product-favorites/${clientId}`)
  }

  async addFavorite(clientId: string, productId: string) {
    return this.request<any>(`/product-favorites/${clientId}`, {
      method: 'POST',
      body: { productId },
    })
  }

  async removeFavorite(clientId: string, productId: string) {
    return this.request<any>(`/product-favorites/${clientId}/${productId}`, {
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

