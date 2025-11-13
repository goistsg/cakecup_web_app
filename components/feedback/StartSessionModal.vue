<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click="close">
        <div class="modal-content" @click.stop>
          <button class="close-btn" @click="close">
            <i class="fas fa-times"></i>
          </button>

          <div class="modal-header">
            <i class="fas fa-flask"></i>
            <h2>Modo de Teste</h2>
            <p class="subtitle">Ative o modo de teste para enviar feedbacks sobre a plataforma</p>
            
            <!-- Indicador de auto-preenchimento -->
            <div v-if="isAutoFilled" class="auto-filled-notice">
              <i class="fas fa-check-circle"></i>
              Dados preenchidos automaticamente da sua conta
            </div>
          </div>

          <form @submit.prevent="handleSubmit" class="session-form">
            <!-- Nome do Testador -->
            <div class="form-group">
              <label for="tester-name">
                <i class="fas fa-user"></i>
                Seu Nome
              </label>
              <input
                id="tester-name"
                v-model="formData.testerName"
                type="text"
                placeholder="Digite seu nome completo"
                required
                :disabled="loading"
              >
            </div>

            <!-- WhatsApp -->
            <div class="form-group">
              <label for="whatsapp">
                <i class="fab fa-whatsapp"></i>
                WhatsApp
              </label>
              <div class="phone-input-wrapper">
                <span class="phone-prefix">+55</span>
                <input
                  id="whatsapp"
                  v-model="phoneDisplay"
                  type="tel"
                  inputmode="numeric"
                  class="phone-input"
                  placeholder="(41) 99165-5745"
                  maxlength="15"
                  required
                  :disabled="loading"
                  @input="formatPhone"
                >
              </div>
              <small class="input-hint">
                Digite apenas números. Ex: 41991655745
              </small>
            </div>

            <!-- Botões -->
            <div class="form-actions">
              <button type="button" class="btn-secondary" @click="close" :disabled="loading">
                Cancelar
              </button>
              <button type="submit" class="btn-primary" :disabled="loading">
                <i class="fas" :class="loading ? 'fa-spinner fa-spin' : 'fa-play-circle'"></i>
                {{ loading ? 'Iniciando...' : 'Iniciar Sessão' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useFeedbackStore } from '~/stores/feedback'
import { useAuthStore } from '~/stores/auth'

const feedbackStore = useFeedbackStore()
const authStore = useAuthStore()

const isOpen = defineModel<boolean>({ default: false })
const loading = ref(false)

const formData = ref({
  testerName: '',
  whatsapp: '',
})

const phoneDisplay = ref('')
const isAutoFilled = ref(false)

// Preencher automaticamente se usuário estiver logado
watch(isOpen, (newValue) => {
  if (newValue && authStore.isLoggedIn && authStore.user) {
    isAutoFilled.value = false
    
    // Preencher nome se disponível
    if (authStore.user.name) {
      formData.value.testerName = authStore.user.name
      isAutoFilled.value = true
    }
    
    // Preencher WhatsApp se disponível
    if (authStore.user.whatsapp) {
      formData.value.whatsapp = authStore.user.whatsapp
      
      // Formatar para exibição
      const cleanNumber = authStore.user.whatsapp.replace(/\D/g, '')
      if (cleanNumber.length >= 11) {
        const localNumber = cleanNumber.slice(-11) // Últimos 11 dígitos
        phoneDisplay.value = `(${localNumber.slice(0, 2)}) ${localNumber.slice(2, 7)}-${localNumber.slice(7)}`
      }
      isAutoFilled.value = true
    }
  } else if (newValue) {
    // Reset se não estiver logado
    isAutoFilled.value = false
  }
})

// Formatar telefone
const formatPhone = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '')
  
  // Limitar a 11 dígitos
  value = value.substring(0, 11)
  
  // Formatar: (XX) XXXXX-XXXX
  let formatted = value
  if (value.length > 0) {
    formatted = '(' + value.substring(0, 2)
  }
  if (value.length >= 3) {
    formatted += ') ' + value.substring(2, 7)
  }
  if (value.length >= 8) {
    formatted += '-' + value.substring(7, 11)
  }
  
  phoneDisplay.value = formatted
  formData.value.whatsapp = '+55' + value
}

const handleSubmit = async () => {
  if (!formData.value.testerName || !formData.value.whatsapp) {
    alert('Preencha todos os campos')
    return
  }

  // Extrair apenas dígitos para validação
  const cleanWhatsApp = formData.value.whatsapp.replace(/\D/g, '')
  
  // Validar WhatsApp (deve ter 13 dígitos: 55 + 11 dígitos)
  if (cleanWhatsApp.length < 13) {
    alert('WhatsApp inválido. Digite DDD + número completo (11 dígitos)')
    return
  }

  // Garantir formato +55XXXXXXXXXXX
  const formattedWhatsApp = '+' + cleanWhatsApp.slice(0, 13)

  loading.value = true

  try {
    await feedbackStore.startSession(
      formData.value.testerName,
      formattedWhatsApp
    )

    // Fechar modal primeiro
    isOpen.value = false
    
    // Resetar form
    formData.value = {
      testerName: '',
      whatsapp: '',
    }
    phoneDisplay.value = ''
    isAutoFilled.value = false

    // Mostrar mensagem de sucesso
    alert('Sessão de teste iniciada! 🎉\n\nAgora você pode enviar feedbacks usando o botão flutuante.')
  } catch (error) {
    console.error('Erro ao iniciar sessão:', error)
    alert('Erro ao iniciar sessão. Tente novamente.')
  } finally {
    loading.value = false
  }
}

const close = () => {
  if (!loading.value) {
    isOpen.value = false
    // Reset form
    formData.value = {
      testerName: '',
      whatsapp: '',
    }
    phoneDisplay.value = ''
    isAutoFilled.value = false
  }
}

// Fechar com ESC
onMounted(() => {
  const handleEsc = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      close()
    }
  }
  document.addEventListener('keydown', handleEsc)
  onUnmounted(() => {
    document.removeEventListener('keydown', handleEsc)
  })
})
</script>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: #f5f5f5;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  z-index: 1;

  &:hover {
    background: #e0e0e0;
    color: #333;
    transform: rotate(90deg);
  }

  i {
    font-size: 1.2rem;
  }
}

.modal-header {
  text-align: center;
  padding: 3rem 3rem 2rem;
  border-bottom: 2px solid #f0f0f0;

  i {
    font-size: 3rem;
    color: var(--primary);
    margin-bottom: 1rem;
    display: block;
  }

  h2 {
    font-size: 1.75rem;
    color: #333;
    margin-bottom: 0.5rem;
  }

  .subtitle {
    color: #666;
    font-size: 1rem;
    line-height: 1.5;
  }

  .auto-filled-notice {
    margin-top: 1rem;
    padding: 0.75rem 1rem;
    background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(139, 195, 74, 0.1) 100%);
    border: 2px solid rgba(76, 175, 80, 0.3);
    border-radius: 12px;
    color: #4caf50;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-weight: 600;

    i {
      font-size: 1rem;
    }
  }
}

.session-form {
  padding: 2rem 3rem 3rem;
}

.form-group {
  margin-bottom: 1.5rem;

  label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    color: #333;
    font-weight: 600;
    font-size: 0.95rem;

    i {
      color: var(--primary);
      font-size: 1rem;
    }
  }

  input {
    width: 100%;
    padding: 1rem;
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    font-size: 1rem;
    transition: all 0.3s;
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(139, 0, 20, 0.1);
    }

    &:disabled {
      background: #f5f5f5;
      cursor: not-allowed;
    }

    &::placeholder {
      color: #999;
    }
  }

  .input-hint {
    display: block;
    margin-top: 0.5rem;
    color: #999;
    font-size: 0.85rem;
  }
}

.phone-input-wrapper {
  display: flex;
  align-items: center;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s;
  background: #fafafa;

  &:focus-within {
    border-color: var(--primary);
    background: white;
    box-shadow: 0 0 0 3px rgba(139, 0, 20, 0.1);
  }

  .phone-prefix {
    padding: 1rem 1rem 1rem 1.25rem;
    font-size: 1rem;
    font-weight: 600;
    color: var(--primary);
    background: linear-gradient(135deg, rgba(139, 0, 20, 0.05) 0%, rgba(233, 30, 99, 0.05) 100%);
    border-right: 2px solid #e0e0e0;
    user-select: none;
  }

  .phone-input {
    flex: 1;
    padding: 1rem 1.25rem;
    border: none;
    background: transparent;
    font-size: 1rem;

    &:focus {
      outline: none;
      box-shadow: none;
    }

    &:disabled {
      background-color: transparent;
      cursor: not-allowed;
      opacity: 0.7;
    }
  }
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
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    box-sizing: border-box;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    i {
      font-size: 1.1rem;
    }
  }

  .btn-primary {
    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
    color: white;
    box-shadow: 0 4px 16px rgba(139, 0, 20, 0.25);

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(139, 0, 20, 0.35);
    }
  }

  .btn-secondary {
    background: #f5f5f5;
    color: #666;

    &:hover:not(:disabled) {
      background: #e0e0e0;
    }
  }
}

// Animação da modal
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9) translateY(20px);
  opacity: 0;
}

// Responsivo
@media (max-width: 768px) {
  .modal-header {
    padding: 2rem 1.5rem 1.5rem;

    i {
      font-size: 2.5rem;
    }

    h2 {
      font-size: 1.5rem;
    }
  }

  .session-form {
    padding: 1.5rem;
  }

  .form-actions {
    flex-direction: column;

    button {
      width: 100%;
    }
  }
}
</style>

