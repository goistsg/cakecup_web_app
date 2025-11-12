import { defineStore } from 'pinia'
import { api } from '~/utils/api'
import type { Favorite, StoreProduct } from '~/types/api'

interface WishlistState {
  favorites: Favorite[]
  products: StoreProduct[]
  loading: boolean
  error: string | null
}

export const useWishlistStore = defineStore('wishlist', {
  state: (): WishlistState => ({
    favorites: [],
    products: [],
    loading: false,
    error: null,
  }),

  getters: {
    favoriteIds: (state) => {
      return state.favorites.map(f => f.productId)
    },
    
    isFavorite: (state) => {
      return (productId: string) => {
        return state.favorites.some(f => f.productId === productId)
      }
    },
    
    favoritesCount: (state) => state.favorites.length,
    
    productsWithFavorites: (state) => {
      // Se os favoritos já têm products, use-os
      const favoritesWithProducts = state.favorites
        .filter(f => f.product)
        .map(f => f.product as StoreProduct)
      
      // Se não, use os produtos carregados separadamente
      if (favoritesWithProducts.length > 0) {
        return favoritesWithProducts
      }
      
      // Filtrar produtos que estão nos favoritos
      const favoriteIds = state.favorites.map(f => f.productId)
      return state.products.filter(p => favoriteIds.includes(p.id))
    },
  },

  actions: {
    async fetchFavorites() {
      this.loading = true
      this.error = null

      try {
        const response = await api.getFavorites()
        this.favorites = response || []
        
        // Se os favoritos não têm produtos, buscar os produtos
        if (this.favorites.length > 0 && !this.favorites[0].product) {
          await this.fetchFavoriteProducts()
        }
        
        return response
      } catch (error: any) {
        if (error.statusCode === 401) {
          // Não autenticado - limpar favoritos
          this.favorites = []
          this.products = []
        } else {
          this.error = error.message || 'Erro ao carregar favoritos'
          throw error
        }
      } finally {
        this.loading = false
      }
    },

    async fetchFavoriteProducts() {
      try {
        // Buscar detalhes de cada produto favoritado
        const productPromises = this.favorites.map(favorite => 
          api.getProduct(favorite.productId).catch(err => {
            console.error(`Erro ao buscar produto ${favorite.productId}:`, err)
            return null
          })
        )
        
        const products = await Promise.all(productPromises)
        this.products = products.filter(p => p !== null) as StoreProduct[]
      } catch (error: any) {
        console.error('Erro ao buscar produtos favoritos:', error)
        // Não lançar erro, apenas logar
      }
    },

    async addFavorite(productId: string) {
      // Verificar se já é favorito
      if (this.isFavorite(productId)) {
        console.warn('Produto já está nos favoritos')
        return
      }

      try {
        const favorite = await api.addFavorite(productId)
        
        // Adicionar à lista local
        this.favorites.push(favorite)
        
        return favorite
      } catch (error: any) {
        this.error = error.message || 'Erro ao adicionar favorito'
        throw error
      }
    },

    async removeFavorite(productId: string) {
      // Encontrar o favorito pelo productId
      const favorite = this.favorites.find(f => f.productId === productId)
      
      if (!favorite) {
        console.warn('Favorito não encontrado')
        return
      }

      try {
        await api.removeFavorite(productId)
        
        // Remover da lista local
        this.favorites = this.favorites.filter(f => f.productId !== productId)
      } catch (error: any) {
        this.error = error.message || 'Erro ao remover favorito'
        throw error
      }
    },

    async toggleFavorite(productId: string) {
      if (this.isFavorite(productId)) {
        await this.removeFavorite(productId)
        return false // Removeu
      } else {
        await this.addFavorite(productId)
        return true // Adicionou
      }
    },

    clearFavorites() {
      this.favorites = []
      this.products = []
      this.error = null
    },

    clearError() {
      this.error = null
    },
  },
})

