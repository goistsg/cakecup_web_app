<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="feedbackStore.isModalOpen" class="modal-overlay" @click="close">
        <div class="modal-content" @click.stop>
          <button class="close-btn" @click="close">
            <i class="fas fa-times"></i>
          </button>

          <div class="modal-header">
            <i class="fas fa-bug"></i>
            <h2>Enviar Feedback</h2>
            <p class="subtitle">Ajude-nos a melhorar a plataforma!</p>
          </div>

          <form @submit.prevent="handleSubmit" class="feedback-form">
            <!-- Tela Atual -->
            <div class="form-group">
              <label>
                <i class="fas fa-desktop"></i>
                Tela Atual
              </label>
              <input
                v-model="currentScreen"
                type="text"
                readonly
                disabled
                class="screen-input"
              >
            </div>

            <!-- Status (Funcionou?) -->
            <div class="form-group">
              <label>
                <i class="fas fa-check-circle"></i>
                Esta funcionalidade está funcionando?
              </label>
              <div class="radio-group">
                <label class="radio-option" :class="{ active: formData.worked === true }">
                  <input
                    type="radio"
                    :value="true"
                    v-model="formData.worked"
                    required
                  >
                  <span class="radio-custom"></span>
                  <span class="radio-label">
                    <i class="fas fa-thumbs-up"></i>
                    Sim, funcionou!
                  </span>
                </label>
                <label class="radio-option" :class="{ active: formData.worked === false }">
                  <input
                    type="radio"
                    :value="false"
                    v-model="formData.worked"
                    required
                  >
                  <span class="radio-custom"></span>
                  <span class="radio-label">
                    <i class="fas fa-thumbs-down"></i>
                    Não, tem problema
                  </span>
                </label>
              </div>
            </div>

            <!-- Descrição -->
            <div class="form-group">
              <label>
                <i class="fas fa-comment"></i>
                Descrição
                <span class="optional">(opcional)</span>
              </label>
              <textarea
                v-model="formData.description"
                placeholder="Descreva o que você testou ou o problema encontrado..."
                rows="4"
              ></textarea>
            </div>

            <!-- Sugestão de Melhoria -->
            <div class="form-group">
              <label>
                <i class="fas fa-lightbulb"></i>
                Sugestão de Melhoria
                <span class="optional">(opcional)</span>
              </label>
              <textarea
                v-model="formData.improvementSuggestion"
                placeholder="Como podemos melhorar essa funcionalidade?"
                rows="3"
              ></textarea>
            </div>

            <!-- Botões -->
            <div class="form-actions">
              <button type="button" class="btn-secondary" @click="close" :disabled="loading">
                Cancelar
              </button>
              <button type="submit" class="btn-primary" :disabled="loading">
                <i class="fas" :class="loading ? 'fa-spinner fa-spin' : 'fa-paper-plane'"></i>
                {{ loading ? 'Enviando...' : 'Enviar Feedback' }}
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
import { useRoute } from 'vue-router'

const feedbackStore = useFeedbackStore()
const route = useRoute()
const loading = ref(false)

const formData = ref({
  worked: null as boolean | null,
  description: '',
  improvementSuggestion: '',
})

// Detectar tela atual
const currentScreen = computed(() => {
  const path = route.path
  const screenMap: Record<string, string> = {
    '/': 'Página Inicial',
    '/products': 'Produtos',
    '/cart': 'Carrinho',
    '/checkout': 'Checkout',
    '/orders': 'Pedidos',
    '/profile': 'Perfil',
    '/login': 'Login',
    '/signup': 'Cadastro',
  }

  // Verificar se é uma rota dinâmica
  if (path.startsWith('/products/')) {
    return 'Detalhes do Produto'
  }
  if (path.startsWith('/orders/')) {
    return 'Detalhes do Pedido'
  }

  return screenMap[path] || path
})

const handleSubmit = async () => {
  if (formData.value.worked === null) {
    alert('Por favor, informe se a funcionalidade está funcionando')
    return
  }

  loading.value = true

  try {
    await feedbackStore.submitFeedback({
      screen: currentScreen.value,
      worked: formData.value.worked,
      description: formData.value.description || undefined,
      improvementSuggestion: formData.value.improvementSuggestion || undefined,
    })

    // Reset form
    formData.value = {
      worked: null,
      description: '',
      improvementSuggestion: '',
    }

    alert('Feedback enviado com sucesso! Obrigado pela contribuição! 🎉')
  } catch (error) {
    console.error('Erro ao enviar feedback:', error)
    alert('Erro ao enviar feedback. Tente novamente.')
  } finally {
    loading.value = false
  }
}

const close = () => {
  if (!loading.value) {
    feedbackStore.closeModal()
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
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
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
  }
}

.feedback-form {
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

    .optional {
      color: #999;
      font-weight: 400;
      font-size: 0.85rem;
      margin-left: auto;
    }
  }

  input[type="text"],
  textarea {
    width: 100%;
    padding: 1rem;
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    font-size: 1rem;
    font-family: inherit;
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

  .screen-input {
    background: linear-gradient(135deg, rgba(139, 0, 20, 0.05) 0%, rgba(233, 30, 99, 0.05) 100%);
    font-weight: 600;
    color: var(--primary);
  }

  textarea {
    resize: vertical;
    min-height: 80px;
  }
}

.radio-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.radio-option {
  flex: 1;
  min-width: 200px;
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;

  input[type="radio"] {
    position: absolute;
    opacity: 0;
  }

  .radio-custom {
    width: 24px;
    height: 24px;
    border: 2px solid #e0e0e0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;

    &::after {
      content: '';
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--primary);
      opacity: 0;
      transform: scale(0);
      transition: all 0.3s;
    }
  }

  .radio-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 500;
    color: #666;
    transition: all 0.3s;

    i {
      font-size: 1.1rem;
    }
  }

  &:hover {
    border-color: var(--primary);
    background: rgba(139, 0, 20, 0.02);
  }

  &.active {
    border-color: var(--primary);
    background: rgba(139, 0, 20, 0.05);

    .radio-custom {
      border-color: var(--primary);

      &::after {
        opacity: 1;
        transform: scale(1);
      }
    }

    .radio-label {
      color: var(--primary);
      font-weight: 600;
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
  .modal-content {
    max-height: 95vh;
  }

  .modal-header {
    padding: 2rem 1.5rem 1.5rem;

    i {
      font-size: 2.5rem;
    }

    h2 {
      font-size: 1.5rem;
    }
  }

  .feedback-form {
    padding: 1.5rem;
  }

  .radio-option {
    min-width: 100%;
  }

  .form-actions {
    flex-direction: column;

    button {
      width: 100%;
    }
  }
}
</style>

