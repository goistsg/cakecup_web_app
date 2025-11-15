import { defineStore } from 'pinia'
import { api } from '~/utils/api'
import type { Product, Category } from '~/types/api'

interface ProductsState {
  products: Product[]
  categories: Category[]
  selectedProduct: Product | null
  selectedCategory: string | null
  loading: boolean
  error: string | null
}

export const useProductsStore = defineStore('products', {
  state: (): ProductsState => ({
    products: [],
    categories: [],
    selectedProduct: null,
    selectedCategory: null,
    loading: false,
    error: null,
  }),

  getters: {
    filteredProducts: (state) => {
      if (!state.selectedCategory) {
        return state.products
      }
      return state.products.filter(p => p.categoryId === state.selectedCategory)
    },

    featuredProducts: (state) => {
      return state.products.filter(p => p.isActive).slice(0, 6)
    },

    getProductById: (state) => (id: string) => {
      return state.products.find(p => p.id === id)
    },
  },

  actions: {
    async fetchProducts(companyId?: string, categoryId?: string, search?: string, orderBy?: string) {
      this.loading = true
      this.error = null

      try {
        const response = await api.getProducts(companyId, categoryId, search, orderBy)
        this.products = response.data || response
        return response
      } catch (error: any) {
        this.error = error.message || 'Erro ao carregar produtos'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchProduct(id: string) {
      this.loading = true
      this.error = null

      try {
        const response = await api.getProduct(id)
        this.selectedProduct = response.data || response
        return response
      } catch (error: any) {
        this.error = error.message || 'Erro ao carregar produto'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchCategories(companyId?: string) {
      this.loading = true
      this.error = null

      try {
        const response = await api.getCategories(companyId)
        this.categories = response.data || response
        return response
      } catch (error: any) {
        this.error = error.message || 'Erro ao carregar categorias'
        throw error
      } finally {
        this.loading = false
      }
    },

    setSelectedCategory(categoryId: string | null) {
      this.selectedCategory = categoryId
    },

    clearError() {
      this.error = null
    },
  },
})

