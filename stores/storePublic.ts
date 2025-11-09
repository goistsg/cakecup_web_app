/**
 * Store Pública - Produtos e Categorias sem Autenticação
 * 
 * Este store gerencia produtos e categorias acessíveis publicamente,
 * sem necessidade de autenticação.
 */

import { defineStore } from 'pinia'
import type { Product, Category } from '~/types/api'

interface StorePublicState {
  // Produtos
  products: Product[]
  featuredProducts: Product[]
  productsByCategory: Record<string, Product[]>
  currentProduct: Product | null
  
  // Categorias
  categories: Category[]
  currentCategory: Category | null
  
  // Filtros e busca
  searchQuery: string
  selectedCategoryId: string | null
  priceRange: { min: number; max: number } | null
  sortBy: 'name' | 'price' | 'newest' | null
  
  // Estados
  loading: boolean
  error: string | null
  
  // Paginação
  currentPage: number
  totalPages: number
  itemsPerPage: number
}

export const useStorePublicStore = defineStore('storePublic', {
  state: (): StorePublicState => ({
    products: [],
    featuredProducts: [],
    productsByCategory: {},
    currentProduct: null,
    
    categories: [],
    currentCategory: null,
    
    searchQuery: '',
    selectedCategoryId: null,
    priceRange: null,
    sortBy: null,
    
    loading: false,
    error: null,
    
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 12,
  }),

  getters: {
    /**
     * Produtos filtrados baseado nos critérios selecionados
     */
    filteredProducts: (state): Product[] => {
      let filtered = [...state.products]

      // Filtrar por categoria
      if (state.selectedCategoryId) {
        filtered = filtered.filter(p => p.categoryId === state.selectedCategoryId)
      }

      // Filtrar por busca
      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase()
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.sku?.toLowerCase().includes(query)
        )
      }

      // Filtrar por faixa de preço
      if (state.priceRange) {
        filtered = filtered.filter(p => 
          p.price >= state.priceRange!.min && 
          p.price <= state.priceRange!.max
        )
      }

      // Ordenar
      if (state.sortBy) {
        switch (state.sortBy) {
          case 'name':
            filtered.sort((a, b) => a.name.localeCompare(b.name))
            break
          case 'price':
            filtered.sort((a, b) => a.price - b.price)
            break
          case 'newest':
            filtered.sort((a, b) => 
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
            break
        }
      }

      return filtered
    },

    /**
     * Produtos paginados
     */
    paginatedProducts: (state): Product[] => {
      const start = (state.currentPage - 1) * state.itemsPerPage
      const end = start + state.itemsPerPage
      
      // Usar filteredProducts do getter
      const filtered = (this as any).filteredProducts
      return filtered.slice(start, end)
    },

    /**
     * Produtos disponíveis (em estoque)
     */
    availableProducts: (state): Product[] => {
      return state.products.filter(p => p.isActive && (p.stock ?? 0) > 0)
    },

    /**
     * Produtos em destaque
     */
    highlightedProducts: (state): Product[] => {
      return state.products.filter(p => p.isHighlighted && p.isActive)
    },

    /**
     * Categorias ativas
     */
    activeCategories: (state): Category[] => {
      return state.categories.filter(c => c.isActive)
    },

    /**
     * Produtos por categoria específica
     */
    getProductsByCategory: (state) => {
      return (categoryId: string): Product[] => {
        return state.products.filter(p => p.categoryId === categoryId && p.isActive)
      }
    },

    /**
     * Verifica se há produtos
     */
    hasProducts: (state): boolean => {
      return state.products.length > 0
    },

    /**
     * Verifica se há categorias
     */
    hasCategories: (state): boolean => {
      return state.categories.length > 0
    },
  },

  actions: {
    /**
     * Buscar todos os produtos (público)
     */
    async fetchProducts(companyId?: string) {
      this.loading = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const apiBase = config.public.apiBase as string
        
        // Query params
        const params = new URLSearchParams()
        if (companyId) params.append('companyId', companyId)
        
        const url = `${apiBase}/products?${params.toString()}`
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`Erro ao buscar produtos: ${response.statusText}`)
        }

        const data = await response.json()
        this.products = Array.isArray(data) ? data : (data.data || [])
        
        // Atualizar produtos em destaque
        this.featuredProducts = this.products.filter(p => p.isHighlighted && p.isActive).slice(0, 8)
        
        // Calcular total de páginas
        this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage)
        
        return this.products
      } catch (err: any) {
        this.error = err.message || 'Erro ao carregar produtos'
        console.error('Erro ao buscar produtos:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    /**
     * Buscar produto por ID (público)
     */
    async fetchProduct(id: string) {
      this.loading = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const apiBase = config.public.apiBase as string
        
        const response = await fetch(`${apiBase}/products/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`Erro ao buscar produto: ${response.statusText}`)
        }

        const data = await response.json()
        this.currentProduct = data
        
        return data
      } catch (err: any) {
        this.error = err.message || 'Erro ao carregar produto'
        console.error('Erro ao buscar produto:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    /**
     * Buscar todas as categorias (público)
     */
    async fetchCategories(companyId?: string) {
      this.loading = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const apiBase = config.public.apiBase as string
        
        // Query params
        const params = new URLSearchParams()
        if (companyId) params.append('companyId', companyId)
        
        const url = `${apiBase}/categories?${params.toString()}`
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`Erro ao buscar categorias: ${response.statusText}`)
        }

        const data = await response.json()
        this.categories = Array.isArray(data) ? data : (data.data || [])
        
        return this.categories
      } catch (err: any) {
        this.error = err.message || 'Erro ao carregar categorias'
        console.error('Erro ao buscar categorias:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    /**
     * Buscar categoria por ID (público)
     */
    async fetchCategory(id: string) {
      this.loading = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const apiBase = config.public.apiBase as string
        
        const response = await fetch(`${apiBase}/categories/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`Erro ao buscar categoria: ${response.statusText}`)
        }

        const data = await response.json()
        this.currentCategory = data
        
        return data
      } catch (err: any) {
        this.error = err.message || 'Erro ao carregar categoria'
        console.error('Erro ao buscar categoria:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    /**
     * Buscar produtos por categoria
     */
    async fetchProductsByCategory(categoryId: string, companyId?: string) {
      this.loading = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const apiBase = config.public.apiBase as string
        
        const params = new URLSearchParams()
        params.append('categoryId', categoryId)
        if (companyId) params.append('companyId', companyId)
        
        const url = `${apiBase}/products?${params.toString()}`
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`Erro ao buscar produtos: ${response.statusText}`)
        }

        const data = await response.json()
        const products = Array.isArray(data) ? data : (data.data || [])
        
        // Armazenar produtos por categoria
        this.productsByCategory[categoryId] = products
        
        return products
      } catch (err: any) {
        this.error = err.message || 'Erro ao carregar produtos da categoria'
        console.error('Erro ao buscar produtos por categoria:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    /**
     * Definir filtro de categoria
     */
    setSelectedCategory(categoryId: string | null) {
      this.selectedCategoryId = categoryId
      this.currentPage = 1 // Reset para primeira página
      this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage)
    },

    /**
     * Definir busca
     */
    setSearchQuery(query: string) {
      this.searchQuery = query
      this.currentPage = 1 // Reset para primeira página
      this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage)
    },

    /**
     * Definir faixa de preço
     */
    setPriceRange(min: number, max: number) {
      this.priceRange = { min, max }
      this.currentPage = 1
      this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage)
    },

    /**
     * Limpar faixa de preço
     */
    clearPriceRange() {
      this.priceRange = null
      this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage)
    },

    /**
     * Definir ordenação
     */
    setSortBy(sortBy: 'name' | 'price' | 'newest' | null) {
      this.sortBy = sortBy
    },

    /**
     * Definir página atual
     */
    setCurrentPage(page: number) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
      }
    },

    /**
     * Próxima página
     */
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
      }
    },

    /**
     * Página anterior
     */
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--
      }
    },

    /**
     * Limpar todos os filtros
     */
    clearFilters() {
      this.selectedCategoryId = null
      this.searchQuery = ''
      this.priceRange = null
      this.sortBy = null
      this.currentPage = 1
      this.totalPages = Math.ceil(this.products.length / this.itemsPerPage)
    },

    /**
     * Limpar erro
     */
    clearError() {
      this.error = null
    },
  },
})

