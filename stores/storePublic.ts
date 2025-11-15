/**
 * Store Pública - Produtos e Categorias sem Autenticação
 * 
 * Este store gerencia produtos e categorias acessíveis publicamente,
 * sem necessidade de autenticação.
 */

import { defineStore } from 'pinia'
import type { StoreProduct } from '~/types/api'
import { api } from '~/utils/api'

// Adaptador para converter StoreProduct em Product
interface Product {
  id: string
  name: string
  description: string
  price: number
  costPrice?: number
  salePrice?: number
  lastPrice?: number
  sku: string
  category: string
  images: Array<{ url: string; isPrimary: boolean }>
  imageUrls?: string[]
  ingredients?: string[]
  isActive: boolean
  stock: number
  hasSample: boolean
  createdAt: string
  updatedAt: string
}

interface StorePublicState {
  // Produtos
  products: Product[]
  featuredProducts: Product[]
  productsByCategory: Record<string, Product[]>
  currentProduct: Product | null
  
  // Categorias (agora são strings)
  categories: string[]
  currentCategory: string | null
  
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

      // Filtrar por categoria (agora é string)
      if (state.selectedCategoryId) {
        filtered = filtered.filter(p => p.category === state.selectedCategoryId)
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
              new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
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
      return state.products.filter(p => (p as any).isHighlighted && p.isActive)
    },

    /**
     * Categorias ativas (todas são ativas)
     */
    activeCategories: (state): string[] => {
      return state.categories
    },

    /**
     * Produtos por categoria específica
     */
    getProductsByCategory: (state) => {
      return (categoryId: string): Product[] => {
        return state.products.filter(p => p.category === categoryId && p.isActive)
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
    async fetchProducts(companyId?: string, categoryId?: string, search?: string, orderBy?: string) {
      this.loading = true
      this.error = null

      try {
        const response = await api.getProducts(companyId, categoryId, search, orderBy)
        
        // Converter StoreProduct para Product
        const storeProducts = response.data || []
        this.products = storeProducts.map((p: any) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.salePrice || p.price,
          costPrice: p.costPrice,
          salePrice: p.salePrice,
          lastPrice: p.lastPrice,
          sku: p.sku,
          category: p.category,
          images: p.imageUrls ? p.imageUrls.map((url: string) => ({ url, isPrimary: true })) : [],
          imageUrls: p.imageUrls || [],
          ingredients: p.ingredients || [],
          isActive: true,
          stock: p.stock,
          hasSample: p.hasSample,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt
        }))
        
        // Atualizar produtos em destaque (primeiros 8)
        this.featuredProducts = this.products.slice(0, 8)
        
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
        const response = await api.getProduct(id)
        const data = Array.isArray(response) ? response[0] : (response.data || response)
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
        const response = await api.getCategories(companyId)
        // API retorna array de strings diretamente
        this.categories = Array.isArray(response) ? response : []
        
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
        const response = await api.getCategory(id)
        const data = Array.isArray(response) ? response[0] : (response.data || response)
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
        const response = await api.getProducts(companyId, categoryId)
        const products = Array.isArray(response) ? response : (response.data || [])
        
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

