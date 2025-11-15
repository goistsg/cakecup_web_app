/**
 * Composable para Store Pública
 * 
 * Fornece acesso fácil aos produtos e categorias públicos
 * sem necessidade de autenticação.
 */

import { computed } from 'vue'
import { useStorePublicStore } from '~/stores/storePublic'

export function useStorePublic() {
  const store = useStorePublicStore()

  return {
    // Estado
    products: computed(() => store.products),
    featuredProducts: computed(() => store.featuredProducts),
    currentProduct: computed(() => store.currentProduct),
    categories: computed(() => store.categories),
    currentCategory: computed(() => store.currentCategory),
    
    // Filtros
    searchQuery: computed(() => store.searchQuery),
    selectedCategoryId: computed(() => store.selectedCategoryId),
    priceRange: computed(() => store.priceRange),
    sortBy: computed(() => store.sortBy),
    
    // Estados
    loading: computed(() => store.loading),
    error: computed(() => store.error),
    
    // Paginação
    currentPage: computed(() => store.currentPage),
    totalPages: computed(() => store.totalPages),
    itemsPerPage: computed(() => store.itemsPerPage),
    
    // Getters
    filteredProducts: computed(() => store.filteredProducts),
    paginatedProducts: computed(() => store.paginatedProducts),
    availableProducts: computed(() => store.availableProducts),
    highlightedProducts: computed(() => store.highlightedProducts),
    activeCategories: computed(() => store.activeCategories),
    hasProducts: computed(() => store.hasProducts),
    hasCategories: computed(() => store.hasCategories),
    
    // Métodos auxiliares
    getProductsByCategory: (categoryId: string) => store.getProductsByCategory(categoryId),
    
    // Actions
    fetchProducts: (companyId?: string, categoryId?: string, search?: string, orderBy?: string) => 
      store.fetchProducts(companyId, categoryId, search, orderBy),
    fetchProduct: (id: string) => store.fetchProduct(id),
    fetchCategories: (companyId?: string) => store.fetchCategories(companyId),
    fetchCategory: (id: string) => store.fetchCategory(id),
    fetchProductsByCategory: (categoryId: string, companyId?: string) => 
      store.fetchProductsByCategory(categoryId, companyId),
    
    // Filtros
    setSelectedCategory: (categoryId: string | null) => store.setSelectedCategory(categoryId),
    setSearchQuery: (query: string) => store.setSearchQuery(query),
    setPriceRange: (min: number, max: number) => store.setPriceRange(min, max),
    clearPriceRange: () => store.clearPriceRange(),
    setSortBy: (sortBy: 'name' | 'price' | 'newest' | null) => store.setSortBy(sortBy),
    
    // Paginação
    setCurrentPage: (page: number) => store.setCurrentPage(page),
    nextPage: () => store.nextPage(),
    previousPage: () => store.previousPage(),
    
    // Utilitários
    clearFilters: () => store.clearFilters(),
    clearError: () => store.clearError(),
  }
}

