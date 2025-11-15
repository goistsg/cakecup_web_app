<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
        <div class="modal-container">
          <div class="modal-header">
            <h2>
              <i :class="isEditMode ? 'fas fa-edit' : 'fas fa-plus-circle'"></i>
              {{ isEditMode ? 'Editar Produto' : 'Novo Produto' }}
            </h2>
            <button @click="closeModal" class="close-btn">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <form @submit.prevent="handleSubmit" class="modal-body">
            <!-- Nome -->
            <div class="form-group">
              <label for="name">
                <i class="fas fa-cupcake"></i>
                Nome do Produto *
              </label>
              <input
                id="name"
                v-model="formData.name"
                type="text"
                placeholder="Ex: Nutella com Avelã"
                required
                :disabled="loading"
              />
            </div>

            <!-- SKU e Categoria -->
            <div class="form-row">
              <div class="form-group">
                <label for="sku">
                  <i class="fas fa-barcode"></i>
                  SKU
                </label>
                <input
                  id="sku"
                  v-model="formData.sku"
                  type="text"
                  placeholder="Ex: NTA010"
                  :disabled="loading"
                />
              </div>

              <div class="form-group">
                <label for="category">
                  <i class="fas fa-tag"></i>
                  Categoria *
                </label>
                <input
                  id="category"
                  v-model="formData.category"
                  type="text"
                  placeholder="Ex: Chocolate"
                  required
                  :disabled="loading"
                />
              </div>
            </div>

            <!-- Descrição -->
            <div class="form-group">
              <label for="description">
                <i class="fas fa-align-left"></i>
                Descrição
              </label>
              <textarea
                id="description"
                v-model="formData.description"
                rows="3"
                placeholder="Descreva o produto..."
                :disabled="loading"
              ></textarea>
            </div>

            <!-- Preços -->
            <div class="form-row">
              <div class="form-group">
                <label for="costPrice">
                  <i class="fas fa-dollar-sign"></i>
                  Preço de Custo
                </label>
                <input
                  id="costPrice"
                  v-model.number="formData.costPrice"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  :disabled="loading"
                />
              </div>

              <div class="form-group">
                <label for="salePrice">
                  <i class="fas fa-dollar-sign"></i>
                  Preço de Venda *
                </label>
                <input
                  id="salePrice"
                  v-model.number="formData.salePrice"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  required
                  :disabled="loading"
                />
              </div>

              <div class="form-group">
                <label for="lastPrice">
                  <i class="fas fa-dollar-sign"></i>
                  Preço Anterior
                </label>
                <input
                  id="lastPrice"
                  v-model.number="formData.lastPrice"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  :disabled="loading"
                />
              </div>
            </div>

            <!-- Estoque -->
            <div class="form-group">
              <label for="stock">
                <i class="fas fa-boxes"></i>
                Estoque
              </label>
              <input
                id="stock"
                v-model.number="formData.stock"
                type="number"
                min="0"
                placeholder="0"
                :disabled="loading"
              />
            </div>

            <!-- URLs das Imagens -->
            <div class="form-group">
              <label>
                <i class="fas fa-images"></i>
                URLs das Imagens
              </label>
              <div class="image-urls-container">
                <div v-for="(url, index) in (formData.imageUrls || [])" :key="index" class="image-url-row">
                  <input
                    v-model="formData.imageUrls![index]"
                    type="url"
                    placeholder="https://exemplo.com/imagem.jpg"
                    :disabled="loading"
                  />
                  <button
                    type="button"
                    @click="removeImageUrl(index)"
                    class="btn-remove-url"
                    :disabled="loading"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                </div>
                <button
                  type="button"
                  @click="addImageUrl"
                  class="btn-add-url"
                  :disabled="loading"
                >
                  <i class="fas fa-plus"></i>
                  Adicionar URL
                </button>
              </div>
            </div>

            <!-- Ingredientes -->
            <div class="form-group">
              <label>
                <i class="fas fa-list"></i>
                Ingredientes
              </label>
              <div class="ingredients-container">
                <div v-for="(ingredient, index) in (formData.ingredients || [])" :key="index" class="ingredient-row">
                  <input
                    v-model="formData.ingredients![index]"
                    type="text"
                    placeholder="Ex: Farinha de trigo"
                    :disabled="loading"
                  />
                  <button
                    type="button"
                    @click="removeIngredient(index)"
                    class="btn-remove-ingredient"
                    :disabled="loading"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                </div>
                <button
                  type="button"
                  @click="addIngredient"
                  class="btn-add-ingredient"
                  :disabled="loading"
                >
                  <i class="fas fa-plus"></i>
                  Adicionar Ingrediente
                </button>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="error-message">
              <i class="fas fa-exclamation-circle"></i>
              {{ error }}
            </div>

            <!-- Actions -->
            <div class="modal-actions">
              <button
                type="button"
                @click="closeModal"
                class="btn-cancel"
                :disabled="loading"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="btn-submit"
                :disabled="loading || !isFormValid"
              >
                <i v-if="loading" class="fas fa-spinner fa-spin"></i>
                <i v-else :class="isEditMode ? 'fas fa-save' : 'fas fa-plus-circle'"></i>
                {{ loading ? 'Salvando...' : (isEditMode ? 'Salvar' : 'Criar') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Product, CreateProductDto } from '~/types/api'
import { api } from '~/utils/api'

const props = defineProps<{
  isOpen: boolean
  product?: Product | null
  companyId: string
}>()

const emit = defineEmits<{
  close: []
  success: []
}>()

const loading = ref(false)
const error = ref('')

const isEditMode = computed(() => !!props.product)

const formData = ref<CreateProductDto>({
  name: '',
  sku: '',
  category: '',
  description: '',
  costPrice: undefined,
  salePrice: undefined,
  lastPrice: undefined,
  stock: 0,
  imageUrls: [''],
  ingredients: [''],
  companyId: props.companyId
})

const isFormValid = computed(() => {
  return formData.value.name.trim() && 
         formData.value.category && 
         formData.value.salePrice !== undefined && 
         formData.value.salePrice > 0
})

// Watch for product changes to populate form
watch(() => props.product, (newProduct) => {
  if (newProduct) {
    formData.value = {
      name: newProduct.name,
      sku: newProduct.sku || '',
      category: typeof newProduct.category === 'string' ? newProduct.category : newProduct.category?.name || '',
      description: newProduct.description || '',
      costPrice: newProduct.costPrice,
      salePrice: newProduct.salePrice || newProduct.price,
      lastPrice: newProduct.lastPrice,
      stock: newProduct.stock || 0,
      imageUrls: newProduct.imageUrls && newProduct.imageUrls.length > 0 ? [...newProduct.imageUrls] : [''],
      ingredients: newProduct.ingredients && newProduct.ingredients.length > 0 ? [...newProduct.ingredients] : [''],
      companyId: props.companyId
    }
  } else {
    resetForm()
  }
}, { immediate: true, deep: true })

// Watch for modal opening to reload form data
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    if (props.product) {
      // Edição: Recarregar dados do formulário quando a modal abre
      formData.value = {
        name: props.product.name,
        sku: props.product.sku || '',
        category: typeof props.product.category === 'string' ? props.product.category : props.product.category?.name || '',
        description: props.product.description || '',
        costPrice: props.product.costPrice,
        salePrice: props.product.salePrice || props.product.price,
        lastPrice: props.product.lastPrice,
        stock: props.product.stock || 0,
        imageUrls: props.product.imageUrls && props.product.imageUrls.length > 0 ? [...props.product.imageUrls] : [''],
        ingredients: props.product.ingredients && props.product.ingredients.length > 0 ? [...props.product.ingredients] : [''],
        companyId: props.companyId
      }
    } else {
      // Criação: Resetar o formulário
      resetForm()
    }
    // Limpar erro ao abrir a modal
    error.value = ''
  }
})

const resetForm = () => {
  formData.value = {
    name: '',
    sku: '',
    category: '',
    description: '',
    costPrice: undefined,
    salePrice: undefined,
    lastPrice: undefined,
    stock: 0,
    imageUrls: [''],
    ingredients: [''],
    companyId: props.companyId
  }
  error.value = ''
}

const addImageUrl = () => {
  formData.value.imageUrls?.push('')
}

const removeImageUrl = (index: number) => {
  if (formData.value.imageUrls && formData.value.imageUrls.length > 1) {
    formData.value.imageUrls.splice(index, 1)
  }
}

const addIngredient = () => {
  formData.value.ingredients?.push('')
}

const removeIngredient = (index: number) => {
  if (formData.value.ingredients && formData.value.ingredients.length > 1) {
    formData.value.ingredients.splice(index, 1)
  }
}

const closeModal = () => {
  if (!loading.value) {
    resetForm()
    emit('close')
  }
}

const handleSubmit = async () => {
  if (!isFormValid.value || loading.value) return

  loading.value = true
  error.value = ''

  try {
    // Clean empty values
    const cleanedData = {
      ...formData.value,
      imageUrls: formData.value.imageUrls?.filter(url => url.trim()) || [],
      ingredients: formData.value.ingredients?.filter(ing => ing.trim()) || []
    }

    if (isEditMode.value && props.product) {
      await api.updateProduct(props.product.id, cleanedData)
    } else {
      await api.createProduct(cleanedData)
    }

    emit('success')
    closeModal()
  } catch (err: any) {
    error.value = err.message || 'Erro ao salvar produto'
    console.error('Error saving product:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
  overflow-y: auto;
}

.modal-container {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  border-bottom: 2px solid #f0f0f0;

  h2 {
    font-size: 1.5rem;
    color: var(--text);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 0;

    i {
      color: var(--primary);
    }
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: var(--text-light);
    cursor: pointer;
    padding: 0.5rem;
    transition: all 0.3s ease;
    border-radius: 50%;

    &:hover {
      background: #f5f5f5;
      color: var(--primary);
    }
  }
}

.modal-body {
  padding: 2rem;
  overflow-y: auto;
  flex: 1;
}

.form-group {
  margin-bottom: 1.5rem;

  label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 0.5rem;
    font-size: 0.95rem;

    i {
      color: var(--primary);
      font-size: 0.9rem;
    }
  }

  input,
  textarea {
    width: 100%;
    padding: 0.875rem 1rem;
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    font-size: 1rem;
    transition: all 0.3s ease;
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(255, 105, 180, 0.1);
    }

    &:disabled {
      background: #f5f5f5;
      cursor: not-allowed;
    }

    &::placeholder {
      color: #999;
    }
  }

  textarea {
    resize: vertical;
    min-height: 80px;
  }
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.image-urls-container,
.ingredients-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.image-url-row,
.ingredient-row {
  display: flex;
  gap: 0.5rem;
  align-items: center;

  input {
    flex: 1;
  }

  .btn-remove-url,
  .btn-remove-ingredient {
    background: #ff4444;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 0.875rem 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 1rem;

    &:hover:not(:disabled) {
      background: #cc0000;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}

.btn-add-url,
.btn-add-ingredient {
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 105, 180, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.error-message {
  background: #ffe6e6;
  color: #cc0000;
  padding: 1rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;

  i {
    font-size: 1.2rem;
  }
}

.modal-actions {
  display: flex;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 2px solid #f0f0f0;
  margin-top: 1.5rem;

  button {
    flex: 1;
    padding: 1rem 2rem;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    box-sizing: border-box;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  .btn-cancel {
    background: white;
    color: var(--text-light);
    border: 2px solid #e0e0e0;

    &:hover:not(:disabled) {
      background: #f5f5f5;
      border-color: #ccc;
    }
  }

  .btn-submit {
    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
    color: white;
    border: none;
    box-shadow: 0 4px 12px rgba(255, 105, 180, 0.3);

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(255, 105, 180, 0.4);
    }
  }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .modal-container {
    max-width: 100%;
    max-height: 100vh;
    border-radius: 0;
  }

  .modal-header {
    padding: 1rem 1.5rem;
  }

  .modal-body {
    padding: 1.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .modal-actions {
    flex-direction: column;

    button {
      width: 100%;
    }
  }
}
</style>

