import { useWishlistStore } from '~/stores/wishlist'
import { computed } from 'vue'

export function useWishlist() {
  const wishlistStore = useWishlistStore()

  return {
    // State
    favorites: computed(() => wishlistStore.favorites),
    favoriteIds: computed(() => wishlistStore.favoriteIds),
    favoritesCount: computed(() => wishlistStore.favoritesCount),
    loading: computed(() => wishlistStore.loading),
    error: computed(() => wishlistStore.error),
    productsWithFavorites: computed(() => wishlistStore.productsWithFavorites),

    // Methods
    isFavorite: (productId: string) => wishlistStore.isFavorite(productId),
    fetchFavorites: () => wishlistStore.fetchFavorites(),
    addFavorite: (productId: string) => wishlistStore.addFavorite(productId),
    removeFavorite: (productId: string) => wishlistStore.removeFavorite(productId),
    toggleFavorite: (productId: string) => wishlistStore.toggleFavorite(productId),
    clearFavorites: () => wishlistStore.clearFavorites(),
    clearError: () => wishlistStore.clearError(),
  }
}

