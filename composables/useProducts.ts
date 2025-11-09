import { useProductsStore } from '~/stores/products'
import { computed } from 'vue'

export function useProducts() {
  const productsStore = useProductsStore()

  return {
    // State
    products: computed(() => productsStore.products),
    categories: computed(() => productsStore.categories),
    selectedProduct: computed(() => productsStore.selectedProduct),
    selectedCategory: computed(() => productsStore.selectedCategory),
    filteredProducts: computed(() => productsStore.filteredProducts),
    featuredProducts: computed(() => productsStore.featuredProducts),
    loading: computed(() => productsStore.loading),
    error: computed(() => productsStore.error),

    // Actions
    fetchProducts: (companyId?: string, categoryId?: string) => 
      productsStore.fetchProducts(companyId, categoryId),
    fetchProduct: (id: string) => productsStore.fetchProduct(id),
    fetchCategories: (companyId?: string) => productsStore.fetchCategories(companyId),
    setSelectedCategory: (categoryId: string | null) => 
      productsStore.setSelectedCategory(categoryId),
    getProductById: (id: string) => productsStore.getProductById(id),
    clearError: () => productsStore.clearError(),
  }
} 