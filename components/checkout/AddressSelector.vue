<template>
  <div class="address-selector">
    <h2>
      <i class="fas fa-map-marker-alt"></i>
      Endereço de Entrega
    </h2>

    <!-- Lista de Endereços -->
    <div v-if="addresses.length > 0" class="addresses-grid">
      <div 
        v-for="address in addresses"
        :key="address.id"
        class="address-card"
        :class="{ selected: selectedAddressId === address.id }"
        @click="selectAddress(address.id)"
      >
        <div class="address-header">
          <h4>
            <i class="fas fa-home"></i>
            {{ address.name || 'Endereço' }}
          </h4>
          <span v-if="address.isPrimary" class="primary-badge">
            <i class="fas fa-star"></i>
            Principal
          </span>
        </div>
        <div class="address-info">
          <p><strong>{{ address.street }}, {{ address.number }}</strong></p>
          <p v-if="address.complement">{{ address.complement }}</p>
          <p>{{ address.district }} - {{ address.city }}/{{ address.state }}</p>
          <p class="cep">
            <i class="fas fa-barcode"></i>
            CEP: {{ formatCep(address.zipCode) }}
          </p>
        </div>
        <div v-if="selectedAddressId === address.id" class="selected-indicator">
          <i class="fas fa-check-circle"></i>
        </div>
      </div>

      <!-- Botão Adicionar Novo -->
      <div class="address-card add-new" @click="showForm = true">
        <i class="fas fa-plus-circle"></i>
        <span>Adicionar Novo Endereço</span>
      </div>
    </div>

    <!-- Nenhum Endereço -->
    <div v-else class="no-addresses">
      <i class="fas fa-map-marked-alt"></i>
      <p>Você ainda não tem endereços cadastrados</p>
      <button @click="showForm = true" class="btn-add">
        <i class="fas fa-plus"></i>
        Cadastrar Primeiro Endereço
      </button>
    </div>

    <!-- Modal de Formulário -->
    <div v-if="showForm" class="modal-overlay" @click.self="closeForm">
      <div class="modal-content">
        <div class="modal-header">
          <h3>
            <i class="fas fa-edit"></i>
            Novo Endereço
          </h3>
          <button @click="closeForm" class="btn-close">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <form @submit.prevent="saveAddress" class="address-form">
          <div class="form-group">
            <label>
              <i class="fas fa-tag"></i>
              Nome do Endereço
            </label>
            <input 
              v-model="formData.name" 
              type="text"
              placeholder="Ex: Casa, Trabalho, Casa da Vó..."
              @input="clearError"
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>
                <i class="fas fa-barcode"></i>
                CEP *
              </label>
              <input 
                v-model="formData.zipCode" 
                type="text"
                placeholder="00000-000"
                required
                maxlength="9"
                @blur="searchCep"
                @input="clearError"
              />
            </div>
            <div class="form-group">
              <button 
                type="button"
                @click="searchCep"
                :disabled="searchingCep || formData.zipCode.length < 8"
                class="btn-search-cep"
              >
                <i class="fas" :class="searchingCep ? 'fa-spinner fa-spin' : 'fa-search'"></i>
                {{ searchingCep ? 'Buscando...' : 'Buscar' }}
              </button>
            </div>
          </div>

          <div class="form-group">
            <label>
              <i class="fas fa-road"></i>
              Rua *
            </label>
            <input 
              v-model="formData.street" 
              type="text"
              placeholder="Nome da rua"
              required
              @input="clearError"
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>
                <i class="fas fa-hashtag"></i>
                Número
              </label>
              <input 
                v-model="formData.number" 
                type="text"
                placeholder="123"
                @input="clearError"
              />
            </div>
            <div class="form-group">
              <label>
                <i class="fas fa-door-open"></i>
                Complemento
              </label>
              <input 
                v-model="formData.complement" 
                type="text"
                placeholder="Apto, Bloco..."
                @input="clearError"
              />
            </div>
          </div>

          <div class="form-group">
            <label>
              <i class="fas fa-map"></i>
              Bairro
            </label>
            <input 
              v-model="formData.district" 
              type="text"
              placeholder="Nome do bairro"
              @input="clearError"
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>
                <i class="fas fa-city"></i>
                Cidade *
              </label>
              <input 
                v-model="formData.city" 
                type="text"
                placeholder="Cidade"
                required
                @input="clearError"
              />
            </div>
            <div class="form-group">
              <label>
                <i class="fas fa-flag"></i>
                Estado *
              </label>
              <input 
                v-model="formData.state" 
                type="text"
                placeholder="UF"
                maxlength="2"
                required
                @input="clearError"
              />
            </div>
          </div>

          <div class="form-group checkbox-group">
            <label>
              <input 
                v-model="formData.isPrimary" 
                type="checkbox"
              />
              <span>Definir como endereço principal</span>
            </label>
          </div>

          <p v-if="error" class="form-error">
            <i class="fas fa-exclamation-circle"></i>
            {{ error }}
          </p>

          <div class="form-actions">
            <button 
              type="submit" 
              class="btn-save"
              :disabled="saving"
            >
              <i class="fas" :class="saving ? 'fa-spinner fa-spin' : 'fa-check'"></i>
              {{ saving ? 'Salvando...' : 'Salvar Endereço' }}
            </button>
            <button 
              type="button" 
              class="btn-cancel"
              @click="closeForm"
              :disabled="saving"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Address } from '~/types/api'

const props = defineProps<{
  addresses: Address[]
  selectedAddressId: string | null
  userId: string
}>()

const emit = defineEmits<{
  (e: 'update:selectedAddressId', id: string): void
  (e: 'addressSaved'): void
}>()

const showForm = ref(false)
const saving = ref(false)
const searchingCep = ref(false)
const error = ref('')

const formData = ref({
  name: '',
  zipCode: '',
  street: '',
  number: '',
  complement: '',
  district: '',
  city: '',
  state: '',
  isPrimary: false,
})

function selectAddress(id: string) {
  emit('update:selectedAddressId', id)
}

function formatCep(cep: string) {
  return cep.replace(/(\d{5})(\d{3})/, '$1-$2')
}

function clearError() {
  error.value = ''
}

function closeForm() {
  if (!saving.value) {
    showForm.value = false
    resetForm()
  }
}

function resetForm() {
  formData.value = {
    name: '',
    zipCode: '',
    street: '',
    number: '',
    complement: '',
    district: '',
    city: '',
    state: '',
    isPrimary: false,
  }
  error.value = ''
}

async function searchCep() {
  const cep = formData.value.zipCode.replace(/\D/g, '')
  
  if (cep.length !== 8) {
    error.value = 'CEP inválido'
    return
  }

  searchingCep.value = true
  error.value = ''

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
    const data = await response.json()

    if (data.erro) {
      error.value = 'CEP não encontrado'
      return
    }

    // Preencher campos automaticamente
    formData.value.street = data.logradouro || ''
    formData.value.district = data.bairro || ''
    formData.value.city = data.localidade || ''
    formData.value.state = data.uf || ''
  } catch (err) {
    error.value = 'Erro ao buscar CEP'
    console.error(err)
  } finally {
    searchingCep.value = false
  }
}

async function saveAddress() {
  saving.value = true
  error.value = ''

  try {
    const { api } = useApi()
    
    await api.createAddress({
      ...formData.value,
      clientId: props.userId,
    })

    emit('addressSaved')
    closeForm()
  } catch (err: any) {
    error.value = err.message || 'Erro ao salvar endereço'
    console.error(err)
  } finally {
    saving.value = false
  }
}
</script>

<style lang="scss" scoped>
.address-selector {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);

  h2 {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
    color: var(--primary);
    font-size: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #f0f0f0;

    i {
      font-size: 1.3rem;
    }
  }
}

.addresses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.address-card {
  position: relative;
  padding: 1.5rem;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--primary);
    transform: translateY(-4px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.12);
  }

  &.selected {
    border-color: var(--primary);
    background: linear-gradient(135deg, #fff5f8 0%, #ffffff 100%);
    box-shadow: 0 4px 16px rgba(139, 0, 20, 0.2);
  }

  &.add-new {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    min-height: 200px;
    border-style: dashed;
    color: var(--primary);

    i {
      font-size: 3rem;
    }

    span {
      font-weight: 600;
      font-size: 1.1rem;
    }

    &:hover {
      background: #fff5f8;
    }
  }

  .address-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;

    h4 {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0;
      color: #333;
      font-size: 1.1rem;

      i {
        color: var(--primary);
      }
    }

    .primary-badge {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.25rem 0.75rem;
      background: #ffc107;
      color: #333;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 700;

      i {
        font-size: 0.7rem;
      }
    }
  }

  .address-info {
    p {
      margin: 0.5rem 0;
      color: #666;
      font-size: 0.95rem;
      line-height: 1.5;

      &.cep {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid #f0f0f0;
        font-family: monospace;
        font-weight: 600;
        color: #999;

        i {
          color: var(--primary);
        }
      }
    }
  }

  .selected-indicator {
    position: absolute;
    top: 1rem;
    right: 1rem;
    color: var(--primary);
    font-size: 1.5rem;
    animation: checkPop 0.3s ease-out;
  }
}

@keyframes checkPop {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.no-addresses {
  text-align: center;
  padding: 3rem 2rem;
  color: #999;

  i {
    font-size: 4rem;
    color: #ddd;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
  }

  .btn-add {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 2rem;
    background: var(--primary);
    color: white;
    border: none;
    border-radius: 50px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      background: var(--secondary);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(139, 0, 20, 0.3);
    }
  }
}

// Modal Styles
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
  animation: fadeIn 0.3s ease-out;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease-out;
  box-shadow: 0 10px 40px rgba(0,0,0,0.3);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 2px solid #f0f0f0;

  h3 {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 0;
    color: var(--primary);
    font-size: 1.5rem;

    i {
      font-size: 1.3rem;
    }
  }

  .btn-close {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    background: #f5f5f5;
    color: #666;
    font-size: 1.5rem;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: #fee;
      color: #f44336;
    }
  }
}

.address-form {
  padding: 2rem;

  .form-group {
    margin-bottom: 1.5rem;

    label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
      color: #333;
      font-weight: 600;
      font-size: 0.95rem;

      i {
        color: var(--primary);
        font-size: 0.9rem;
      }
    }

    input[type="text"] {
      width: 100%;
      padding: 0.875rem 1rem;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s;

      &:focus {
        outline: none;
        border-color: var(--primary);
      }
    }

    &.checkbox-group {
      label {
        cursor: pointer;
        user-select: none;

        input[type="checkbox"] {
          margin-right: 0.5rem;
          width: 18px;
          height: 18px;
          cursor: pointer;
        }
      }
    }
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .btn-search-cep {
    width: 100%;
    height: 42px;
    margin-top: 1.85rem;
    padding: 0.75rem 1rem;
    background: var(--primary);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;

    &:hover:not(:disabled) {
      background: var(--secondary);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .form-error {
    padding: 1rem;
    background: #ffebee;
    border: 1px solid #ef5350;
    border-radius: 8px;
    color: #c62828;
    font-size: 0.95rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .form-actions {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;

    button {
      flex: 1;
      padding: 1rem;
      border: none;
      border-radius: 12px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;

      &.btn-save {
        background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
        color: white;

        &:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(139, 0, 20, 0.3);
        }

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      }

      &.btn-cancel {
        background: #f5f5f5;
        color: #666;

        &:hover:not(:disabled) {
          background: #e0e0e0;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .addresses-grid {
    grid-template-columns: 1fr;
  }

  .modal-content {
    max-height: 100vh;
    border-radius: 0;
  }

  .address-form {
    .form-row {
      grid-template-columns: 1fr;
    }

    .btn-search-cep {
      margin-top: 0;
    }

    .form-actions {
      flex-direction: column;
    }
  }
}
</style>

