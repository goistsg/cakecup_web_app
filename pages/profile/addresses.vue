<template>
  <div class="addresses-page">
    <div class="container">
      <div class="page-header">
        <h1>
          <i class="fas fa-map-marker-alt"></i>
          Meus Endereços
        </h1>
        <p class="subtitle">Gerencie seus endereços de entrega</p>
      </div>

      <div class="addresses-content">
        <!-- Lista de Endereços -->
        <div v-if="!loading && addresses.length > 0" class="addresses-grid">
          <div 
            v-for="address in addresses"
            :key="address.id"
            class="address-card"
          >
            <div class="address-header">
              <h3>
                <i class="fas fa-home"></i>
                {{ address.name || 'Endereço' }}
              </h3>
              <div class="address-actions">
                <button 
                  v-if="!address.isPrimary"
                  @click="setPrimary(address.id)" 
                  class="btn-icon"
                  title="Definir como principal"
                >
                  <i class="far fa-star"></i>
                </button>
                <button 
                  @click="editAddress(address)" 
                  class="btn-icon"
                  title="Editar"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button 
                  @click="confirmDelete(address.id)" 
                  class="btn-icon btn-delete"
                  title="Excluir"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>

            <div v-if="address.isPrimary" class="primary-badge">
              <i class="fas fa-star"></i>
              Principal
            </div>

            <div class="address-info">
              <p><strong>{{ address.street }}, {{ address.number }}</strong></p>
              <p v-if="address.complement">{{ address.complement }}</p>
              <p>{{ address.district }}</p>
              <p>{{ address.city }}/{{ address.state }}</p>
              <p class="cep">
                <i class="fas fa-barcode"></i>
                CEP: {{ formatCep(address.zipCode) }}
              </p>
            </div>
          </div>

          <!-- Card Adicionar Novo -->
          <div class="address-card add-new" @click="showForm = true">
            <i class="fas fa-plus-circle"></i>
            <span>Adicionar Novo Endereço</span>
          </div>
        </div>

        <!-- Nenhum Endereço -->
        <div v-else-if="!loading && addresses.length === 0" class="empty-state">
          <div class="empty-message">
            <i class="fas fa-map-marked-alt"></i>
            <h3>Nenhum endereço cadastrado</h3>
            <p>Adicione seu primeiro endereço de entrega</p>
          </div>

          <!-- Card Adicionar (mesmo estilo da lista) -->
          <div class="address-card add-new" @click="showForm = true">
            <i class="fas fa-plus-circle"></i>
            <span>Adicionar Novo Endereço</span>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="loading">
          <i class="fas fa-spinner fa-spin"></i>
          <p>Carregando endereços...</p>
        </div>
      </div>

      <!-- Modal de Formulário -->
      <div v-if="showForm" class="modal-overlay" @click="closeForm">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h2>
              <i class="fas fa-map-pin"></i>
              {{ editingAddress ? 'Editar Endereço' : 'Novo Endereço' }}
            </h2>
            <button @click="closeForm" class="btn-close">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <form @submit.prevent="handleSubmit" class="address-form">
            <!-- CEP -->
            <div class="form-group">
              <label for="zipCode">
                <i class="fas fa-barcode"></i>
                CEP
              </label>
              <input
                id="zipCode"
                v-model="formData.zipCode"
                type="text"
                placeholder="00000-000"
                maxlength="9"
                required
                @blur="searchCep"
              >
              <small v-if="searchingCep" class="input-hint">
                <i class="fas fa-spinner fa-spin"></i>
                Buscando CEP...
              </small>
            </div>

            <!-- Nome do Endereço -->
            <div class="form-group">
              <label for="name">
                <i class="fas fa-tag"></i>
                Nome do Endereço (opcional)
              </label>
              <input
                id="name"
                v-model="formData.name"
                type="text"
                placeholder="Ex: Casa, Trabalho, Apartamento"
              >
            </div>

            <!-- Rua -->
            <div class="form-group">
              <label for="street">
                <i class="fas fa-road"></i>
                Rua
              </label>
              <input
                id="street"
                v-model="formData.street"
                type="text"
                placeholder="Nome da rua"
                required
              >
            </div>

            <!-- Número e Complemento -->
            <div class="form-row">
              <div class="form-group">
                <label for="number">
                  <i class="fas fa-hashtag"></i>
                  Número
                </label>
                <input
                  id="number"
                  v-model="formData.number"
                  type="text"
                  placeholder="123"
                  required
                >
              </div>

              <div class="form-group">
                <label for="complement">
                  <i class="fas fa-info-circle"></i>
                  Complemento
                </label>
                <input
                  id="complement"
                  v-model="formData.complement"
                  type="text"
                  placeholder="Apto, Bloco, etc"
                >
              </div>
            </div>

            <!-- Bairro -->
            <div class="form-group">
              <label for="district">
                <i class="fas fa-map"></i>
                Bairro
              </label>
              <input
                id="district"
                v-model="formData.district"
                type="text"
                placeholder="Nome do bairro"
                required
              >
            </div>

            <!-- Cidade e Estado -->
            <div class="form-row">
              <div class="form-group">
                <label for="city">
                  <i class="fas fa-city"></i>
                  Cidade
                </label>
                <input
                  id="city"
                  v-model="formData.city"
                  type="text"
                  placeholder="Cidade"
                  required
                >
              </div>

              <div class="form-group">
                <label for="state">
                  <i class="fas fa-flag"></i>
                  Estado
                </label>
                <input
                  id="state"
                  v-model="formData.state"
                  type="text"
                  placeholder="UF"
                  maxlength="2"
                  required
                >
              </div>
            </div>

            <!-- Principal -->
            <div class="form-group checkbox-group">
              <label>
                <input
                  v-model="formData.isPrimary"
                  type="checkbox"
                >
                <span>
                  <i class="fas fa-star"></i>
                  Definir como endereço principal
                </span>
              </label>
            </div>

            <!-- Mensagem de Erro -->
            <div v-if="error" class="error-message">
              <i class="fas fa-exclamation-circle"></i>
              {{ error }}
            </div>

            <!-- Botões -->
            <div class="form-actions">
              <button type="button" @click="closeForm" class="btn-secondary">
                <i class="fas fa-times"></i>
                Cancelar
              </button>
              <button type="submit" class="btn-primary" :disabled="submitting">
                <i class="fas" :class="submitting ? 'fa-spinner fa-spin' : 'fa-check'"></i>
                {{ submitting ? 'Salvando...' : 'Salvar Endereço' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useClientsStore } from '~/stores/clients'
import type { Address } from '~/types/api'

definePageMeta({
  middleware: 'auth'
})

const clientsStore = useClientsStore()

const addresses = ref<Address[]>([])
const loading = ref(false)
const showForm = ref(false)
const searchingCep = ref(false)
const submitting = ref(false)
const error = ref('')
const editingAddress = ref<Address | null>(null)

const formData = ref({
  name: '',
  zipCode: '',
  street: '',
  number: '',
  complement: '',
  district: '',
  city: '',
  state: '',
  isPrimary: false
})

// Buscar endereços
const fetchAddresses = async () => {
  loading.value = true
  try {
    const data = await (clientsStore as any).fetchAddresses()
    addresses.value = data || []
  } catch (err: any) {
    console.error('Erro ao buscar endereços:', err)
    error.value = 'Erro ao carregar endereços'
  } finally {
    loading.value = false
  }
}

// Buscar CEP via ViaCEP
const searchCep = async () => {
  const cep = formData.value.zipCode.replace(/\D/g, '')
  
  if (cep.length !== 8) return

  searchingCep.value = true
  try {
    const response = await $fetch(`https://viacep.com.br/ws/${cep}/json/`)
    
    if (response.erro) {
      error.value = 'CEP não encontrado'
      return
    }

    formData.value.street = response.logradouro || ''
    formData.value.district = response.bairro || ''
    formData.value.city = response.localidade || ''
    formData.value.state = response.uf || ''
  } catch (err) {
    console.error('Erro ao buscar CEP:', err)
    error.value = 'Erro ao buscar CEP'
  } finally {
    searchingCep.value = false
  }
}

// Formatar CEP
const formatCep = (cep: string) => {
  const cleaned = cep.replace(/\D/g, '')
  return cleaned.replace(/(\d{5})(\d{3})/, '$1-$2')
}

// Editar endereço
const editAddress = (address: Address) => {
  editingAddress.value = address
  formData.value = {
    name: address.name || '',
    zipCode: address.zipCode,
    street: address.street,
    number: address.number,
    complement: address.complement || '',
    district: address.district,
    city: address.city,
    state: address.state,
    isPrimary: address.isPrimary || false
  }
  showForm.value = true
}

// Definir como principal
const setPrimary = async (addressId: string) => {
  try {
    await (clientsStore as any).updateAddress(addressId, { isPrimary: true })
    await fetchAddresses()
  } catch (err: any) {
    console.error('Erro ao definir endereço principal:', err)
    error.value = 'Erro ao atualizar endereço'
  }
}

// Confirmar exclusão
const confirmDelete = (addressId: string) => {
  if (confirm('Deseja realmente excluir este endereço?')) {
    deleteAddress(addressId)
  }
}

// Excluir endereço
const deleteAddress = async (addressId: string) => {
  try {
    await (clientsStore as any).deleteAddress(addressId)
    await fetchAddresses()
  } catch (err: any) {
    console.error('Erro ao excluir endereço:', err)
    error.value = 'Erro ao excluir endereço'
  }
}

// Salvar endereço
const handleSubmit = async () => {
  submitting.value = true
  error.value = ''

  try {
    const addressData = {
      name: formData.value.name || undefined,
      zipCode: formData.value.zipCode.replace(/\D/g, ''),
      street: formData.value.street,
      number: formData.value.number,
      complement: formData.value.complement || undefined,
      district: formData.value.district,
      city: formData.value.city,
      state: formData.value.state.toUpperCase(),
      isPrimary: formData.value.isPrimary
    }

    if (editingAddress.value) {
      await (clientsStore as any).updateAddress(editingAddress.value.id, addressData)
    } else {
      await (clientsStore as any).createAddress(addressData)
    }

    await fetchAddresses()
    closeForm()
  } catch (err: any) {
    console.error('Erro ao salvar endereço:', err)
    error.value = err.message || 'Erro ao salvar endereço'
  } finally {
    submitting.value = false
  }
}

// Fechar formulário
const closeForm = () => {
  showForm.value = false
  editingAddress.value = null
  formData.value = {
    name: '',
    zipCode: '',
    street: '',
    number: '',
    complement: '',
    district: '',
    city: '',
    state: '',
    isPrimary: false
  }
  error.value = ''
}

onMounted(() => {
  fetchAddresses()
})
</script>

<style lang="scss" scoped>
.addresses-page {
  min-height: calc(100vh - 80px);
  background: linear-gradient(135deg, #FBE9E7 0%, #E9DFD7 100%);
  padding: 2rem 0 4rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
  animation: fadeInDown 0.6s ease-out;

  h1 {
    color: var(--primary);
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;

    i {
      font-size: 2rem;
    }
  }

  .subtitle {
    color: #666;
    font-size: 1.1rem;
  }
}

.addresses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  animation: fadeInUp 0.6s ease-out;
}

.address-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  position: relative;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(139, 0, 20, 0.15);
  }

  &.add-new {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    cursor: pointer;
    border: 2px dashed var(--primary);
    background: rgba(139, 0, 20, 0.02);

    i {
      font-size: 3rem;
      color: var(--primary);
    }

    span {
      color: var(--primary);
      font-weight: 600;
    }

    &:hover {
      background: rgba(139, 0, 20, 0.05);
    }
  }
}

.address-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;

  h3 {
    color: var(--primary);
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .address-actions {
    display: flex;
    gap: 0.5rem;
  }
}

.btn-icon {
  background: #f5f5f5;
  border: none;
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  color: #666;

  &:hover {
    background: #e0e0e0;
    color: var(--primary);
  }

  &.btn-delete {
    &:hover {
      background: #ffebee;
      color: #f44336;
    }
  }
}

.primary-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: white;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1rem;

  i {
    font-size: 0.875rem;
  }
}

.address-info {
  color: #666;
  line-height: 1.6;

  p {
    margin-bottom: 0.5rem;

    &.cep {
      color: #999;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  }

  strong {
    color: #333;
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 600px;
  margin: 0 auto;
  animation: fadeInUp 0.6s ease-out;

  .empty-message {
    text-align: center;
    padding: 3rem 2rem;
    background: white;
    border-radius: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

    i {
      font-size: 4rem;
      color: var(--primary);
      margin-bottom: 1.5rem;
      opacity: 0.8;
    }

    h3 {
      color: var(--primary);
      margin-bottom: 0.75rem;
      font-size: 1.5rem;
    }

    p {
      color: #666;
      font-size: 1.05rem;
      line-height: 1.6;
    }
  }

  // Usar o mesmo card de adicionar da lista
  .address-card.add-new {
    min-height: 200px;
  }
}

.loading {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--primary);

  i {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.1rem;
  }
}

// Modal
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  animation: fadeIn 0.3s;
}

.modal-content {
  background: white;
  border-radius: 20px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.3s;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid #e0e0e0;

  h2 {
    color: var(--primary);
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .btn-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #666;
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
      color: var(--primary);
    }
  }
}

.address-form {
  padding: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;

  label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    color: var(--text);
    font-weight: 600;
    font-size: 0.95rem;

    i {
      color: var(--primary);
    }
  }

  input[type="text"] {
    width: 100%;
    padding: 0.875rem 1rem;
    border: 2px solid #e0e0e0;
    border-radius: 10px;
    font-size: 1rem;
    transition: all 0.3s;

    &:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(139, 0, 20, 0.1);
    }
  }

  .input-hint {
    display: block;
    margin-top: 0.5rem;
    color: #999;
    font-size: 0.875rem;
  }

  &.checkbox-group {
    label {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;

      input[type="checkbox"] {
        width: 20px;
        height: 20px;
        cursor: pointer;
      }

      span {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
    }
  }
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1rem;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #ffebee;
  border: 2px solid #f44336;
  border-radius: 10px;
  color: #c62828;
  margin-bottom: 1.5rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;

  button {
    flex: 1;
    padding: 1rem;
    border: none;
    border-radius: 10px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}

.btn-primary {
  background: var(--primary);
  color: white;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(139, 0, 20, 0.3);
  }
}

.btn-secondary {
  background: #f5f5f5;
  color: #666;

  &:hover {
    background: #e0e0e0;
  }
}

// Animations
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

// Responsive
@media (max-width: 768px) {
  .addresses-grid {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .page-header h1 {
    font-size: 2rem;
  }

  .modal-content {
    max-height: 95vh;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>

