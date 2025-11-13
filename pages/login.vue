<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <!-- Etapa 1: Login -->
        <div v-if="!otpSent">
          <h1>Bem-vindo ao CakeCup</h1>
          <p class="subtitle">Entre com seu WhatsApp para continuar</p>

          <form @submit.prevent="handleLogin">
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
                  @input="formatPhone"
                  type="tel"
                  placeholder="(11) 91234-5678"
                  required
                  :disabled="loading"
                  autocomplete="tel"
                  maxlength="15"
                  class="phone-input"
                >
              </div>
              <small class="input-hint">
                Enviaremos um código de verificação via WhatsApp
              </small>
            </div>

            <button type="submit" class="btn-primary" :disabled="loading || !isPhoneValid">
              <i class="fas" :class="loading ? 'fa-spinner fa-spin' : 'fa-arrow-right'"></i>
              {{ loading ? 'Enviando...' : 'Continuar' }}
            </button>
          </form>

          <!-- Link para Cadastro -->
          <div class="signup-link">
            <p>Não tem conta?</p>
            <NuxtLink to="/signup" class="link">Cadastre-se</NuxtLink>
          </div>
        </div>

        <!-- Etapa 2: Verificação OTP -->
        <div v-else>
          <div class="otp-header">
            <i class="fas fa-mobile-alt"></i>
            <h1>Verificar WhatsApp</h1>
            <p class="subtitle">
              Enviamos um código para<br>
              <strong>+55 {{ phoneDisplay }}</strong>
            </p>
          </div>

          <form @submit.prevent="handleVerifyOtp">
            <div class="form-group">
              <label for="otp">
                <i class="fas fa-key"></i>
                Código de Verificação
              </label>
              <input
                id="otp"
                v-model="otp"
                type="tel"
                inputmode="numeric"
                pattern="[0-9]*"
                placeholder="000000"
                maxlength="6"
                required
                :disabled="loading"
                class="otp-input"
                autocomplete="one-time-code"
              >
              <small class="input-hint">
                Digite o código de 6 dígitos
              </small>
            </div>

            <button type="submit" class="btn-primary" :disabled="loading">
              <i class="fas" :class="loading ? 'fa-spinner fa-spin' : 'fa-check-circle'"></i>
              {{ loading ? 'Verificando...' : 'Confirmar' }}
            </button>

            <button 
              type="button" 
              class="btn-secondary" 
              @click="resetForm"
              :disabled="loading"
            >
              <i class="fas fa-arrow-left"></i>
              Voltar
            </button>
          </form>

          <div class="resend-section">
            <p>Não recebeu o código?</p>
            <button 
              @click="resendOtp" 
              class="btn-link"
              :disabled="loading || resendCooldown > 0"
            >
              {{ resendCooldown > 0 ? `Reenviar em ${resendCooldown}s` : 'Reenviar código' }}
            </button>
          </div>
        </div>

        <!-- Mensagem de Erro -->
        <div v-if="error" class="error-message">
          <i class="fas fa-exclamation-circle"></i>
          {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const { login, verifyOtp, error, loading } = useAuth()

const whatsapp = ref('') // Formato para API: +5541999999999
const phoneDisplay = ref('') // Formato visual: (41) 99999-9999
const otp = ref('')
const otpSent = ref(false)
const resendCooldown = ref(0)

// Validação do telefone
const isPhoneValid = computed(() => {
  const cleaned = phoneDisplay.value.replace(/\D/g, '')
  return cleaned.length === 11 // DDD (2) + número (9)
})

// Formatar telefone visualmente
const formatPhone = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '') // Remove tudo que não é número
  
  // Limita a 11 dígitos (DDD + número)
  value = value.substring(0, 11)
  
  // Formata: (##) #####-####
  if (value.length > 0) {
    if (value.length <= 2) {
      phoneDisplay.value = `(${value}`
    } else if (value.length <= 7) {
      phoneDisplay.value = `(${value.substring(0, 2)}) ${value.substring(2)}`
    } else {
      phoneDisplay.value = `(${value.substring(0, 2)}) ${value.substring(2, 7)}-${value.substring(7)}`
    }
  }
  
  // Atualiza o valor para API: +55 + números
  whatsapp.value = value ? `+55${value}` : ''
}

// Cooldown de 60 segundos para reenvio
const startResendCooldown = () => {
  resendCooldown.value = 60
  const interval = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0) {
      clearInterval(interval)
    }
  }, 1000)
}

const handleLogin = async () => {
  try {
    await login(whatsapp.value)
    otpSent.value = true
    startResendCooldown()
  } catch (err) {
    console.error('Erro ao enviar OTP:', err)
  }
}

const handleVerifyOtp = async () => {
  try {
    await verifyOtp(whatsapp.value, otp.value)
    
    // Verificar se há redirect na query
    const redirect = route.query.redirect as string || '/'
    
    router.push(redirect)
  } catch (err) {
    console.error('Erro ao verificar OTP:', err)
  }
}

const resendOtp = async () => {
  try {
    await login(whatsapp.value)
    startResendCooldown()
  } catch (err) {
    console.error('Erro ao reenviar OTP:', err)
  }
}

const resetForm = () => {
  otpSent.value = false
  otp.value = ''
  resendCooldown.value = 0
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #FBE9E7 0%, #E9DFD7 100%);
}

.login-container {
  width: 100%;
  max-width: 500px;
}

.login-card {
  background: white;
  border-radius: 24px;
  padding: 3rem;
  box-shadow: 0 20px 60px rgba(139, 0, 20, 0.15);
  animation: fadeInUp 0.6s ease-out;

  h1 {
    text-align: center;
    margin-bottom: 0.75rem;
    color: var(--primary);
    font-size: 2rem;
    font-weight: 700;
  }

  .subtitle {
    text-align: center;
    color: #666;
    margin-bottom: 2.5rem;
    font-size: 1.05rem;
    line-height: 1.6;

    strong {
      color: var(--primary);
      font-weight: 600;
    }
  }
}

// OTP Header (igual ao signup)
.otp-header {
  text-align: center;
  margin-bottom: 2.5rem;

  i {
    font-size: 4rem;
    color: var(--primary);
    margin-bottom: 1.5rem;
    display: block;
    animation: pulse 2s infinite;
  }

  h1 {
    font-size: 1.75rem;
    margin-bottom: 0.75rem;
  }

  .subtitle {
    margin-bottom: 0;
  }
}

.form-group {
  margin-bottom: 1.75rem;

  label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    color: var(--text);
    font-weight: 600;
    font-size: 0.95rem;

    i {
      color: var(--primary);
      font-size: 1.1rem;
    }
  }

  input {
    width: 100%;
    padding: 1rem 1.25rem;
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    font-size: 1rem;
    transition: all 0.3s;
    background: #fafafa;
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: var(--primary);
      background: white;
      box-shadow: 0 0 0 3px rgba(139, 0, 20, 0.1);
    }

    &:disabled {
      background-color: #f5f5f5;
      cursor: not-allowed;
      opacity: 0.7;
    }

    &.otp-input {
      text-align: center;
      font-size: 2rem;
      font-weight: 700;
      letter-spacing: 0.75rem;
      padding: calc(1.125rem - 2px);
      background: #fafafa;
      border: 2px solid #e0e0e0;
      
      &:focus {
        background: white;
        border-color: var(--primary);
        letter-spacing: 0.75rem;
      }

      &::placeholder {
        letter-spacing: 0.75rem;
        opacity: 0.3;
      }
    }
  }

  // Wrapper do input de telefone
  .phone-input-wrapper {
    display: flex;
    align-items: center;
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    background: #fafafa;
    transition: all 0.3s;
    overflow: hidden;

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

  .input-hint {
    display: block;
    margin-top: 0.5rem;
    color: #999;
    font-size: 0.875rem;
  }
}

.btn-primary,
.btn-secondary {
  width: 100%;
  padding: 1.125rem;
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

  i {
    font-size: 1.1rem;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }
}

.btn-primary {
  background: var(--primary);
  color: white;
  margin-bottom: 1rem;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(139, 0, 20, 0.3);
  }
}

.btn-secondary {
  background: #f5f5f5;
  color: #666;

  &:hover:not(:disabled) {
    background: #e0e0e0;
  }
}

// Resend Section (igual ao signup)
.resend-section {
  text-align: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e0e0e0;

  p {
    color: #666;
    margin-bottom: 0.75rem;
    font-size: 0.95rem;
  }

  .btn-link {
    background: none;
    border: none;
    color: var(--primary);
    font-weight: 600;
    cursor: pointer;
    text-decoration: underline;
    transition: color 0.3s;
    font-size: 1rem;

    &:hover:not(:disabled) {
      color: var(--secondary);
    }

    &:disabled {
      color: #999;
      cursor: not-allowed;
      text-decoration: none;
    }
  }
}

.error-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem;
  background-color: #ffebee;
  border: 2px solid #f44336;
  border-radius: 12px;
  color: #c62828;
  text-align: center;
  margin-top: 1.5rem;
  font-weight: 500;

  i {
    font-size: 1.2rem;
  }
}

.signup-link {
  text-align: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e0e0e0;

  p {
    color: #666;
    margin-bottom: 0.5rem;
  }

  .link {
    color: var(--primary);
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s;

    &:hover {
      color: var(--secondary);
      text-decoration: underline;
    }
  }
}

// Animations
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

// Responsive
@media (max-width: 768px) {
  .login-page {
    padding: 1rem;
  }

  .login-card {
    padding: 2rem 1.5rem;
  }

  h1 {
    font-size: 1.5rem !important;
  }

  .otp-header i {
    font-size: 3rem;
  }
}
</style>

