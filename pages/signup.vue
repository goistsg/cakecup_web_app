<template>
  <div class="signup-page">
    <div class="signup-container">
      <div class="signup-card">
        <!-- Etapa 1: Cadastro -->
        <div v-if="!otpSent">
          <h1>Criar Conta</h1>
          <p class="subtitle">Preencha seus dados para começar</p>

          <form @submit.prevent="handleSignup" autocomplete="off">
            <div class="form-group">
              <label for="name">
                <i class="fas fa-user"></i>
                Nome Completo
              </label>
              <input
                id="name"
                v-model="formData.name"
                type="text"
                placeholder="Digite seu nome completo"
                required
                :disabled="loading"
                autocomplete="name"
              >
            </div>

            <div class="form-group">
              <label for="whatsapp">
                <i class="fab fa-whatsapp"></i>
                WhatsApp
              </label>
              <input
                id="whatsapp"
                v-model="formData.whatsapp"
                type="tel"
                placeholder="+55 11 99999-9999"
                required
                :disabled="loading"
                autocomplete="tel"
              >
              <small class="input-hint">
                Enviaremos um código de verificação via WhatsApp
              </small>
            </div>

            <button 
              type="submit" 
              class="btn-primary" 
              :disabled="loading"
              @click.prevent="handleSignup"
            >
              <i class="fas" :class="loading ? 'fa-spinner fa-spin' : 'fa-arrow-right'"></i>
              {{ loading ? 'Enviando...' : 'Continuar' }}
            </button>
          </form>

          <!-- Link para Login (apenas na etapa 1) -->
          <div class="login-link">
            <p>Já tem uma conta?</p>
            <NuxtLink to="/login" class="link">Fazer Login</NuxtLink>
          </div>
        </div>

        <!-- Etapa 2: Verificação OTP -->
        <div v-else>
          <div class="otp-header">
            <i class="fas fa-mobile-alt"></i>
            <h1>Verificar WhatsApp</h1>
            <p class="subtitle">
              Enviamos um código para<br>
              <strong>{{ formData.whatsapp }}</strong>
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
                type="text"
                placeholder="000000"
                maxlength="6"
                required
                :disabled="loading"
                class="otp-input"
              >
              <small class="input-hint">
                Digite o código de 6 dígitos
              </small>
            </div>

            <button type="submit" class="btn-primary" :disabled="loading">
              <i class="fas" :class="loading ? 'fa-spinner fa-spin' : 'fa-check-circle'"></i>
              {{ loading ? 'Verificando...' : 'Confirmar Cadastro' }}
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

const router = useRouter()
const { api } = useApi()
const authStore = useAuthStore()

const formData = ref({
  name: '',
  whatsapp: '',
})

const otp = ref('')
const otpSent = ref(false)
const loading = ref(false)
const error = ref('')
const resendCooldown = ref(0)

// Enviar código OTP
const handleSignup = async () => {
  loading.value = true
  error.value = ''

  try {
    console.log('🚀 Iniciando cadastro para:', formData.value.whatsapp)
    
    // Validar campos obrigatórios
    if (!formData.value.name || !formData.value.whatsapp) {
      throw new Error('Por favor, preencha todos os campos')
    }

    // 1. Criar usuário consumidor ANTES de enviar OTP
    const config = useRuntimeConfig()
    const companyId = config.public.companyId as string

    if (!companyId) {
      throw new Error('Company ID não configurado')
    }

    try {
      console.log('📝 Criando usuário consumidor...')
      await api.createUserConsumer({
        name: formData.value.name,
        whatsapp: formData.value.whatsapp,
        companyId: companyId,
      })
      console.log('✅ Usuário criado com sucesso')
    } catch (err: any) {
      // Se usuário já existe, apenas continua o fluxo
      console.log('ℹ️ Usuário já existe, continuando...')
    }

    // 2. Enviar OTP via WhatsApp
    console.log('📱 Enviando OTP via WhatsApp...')
    const response = await api.login(formData.value.whatsapp)
    console.log('✅ OTP enviado com sucesso:', response)
    
    otpSent.value = true
    
    // Iniciar cooldown de reenvio
    startResendCooldown()
  } catch (err: any) {
    console.error('❌ Erro no cadastro:', err)
    error.value = err.message || 'Erro ao enviar código de verificação'
  } finally {
    loading.value = false
  }
}

// Verificar OTP e fazer login
const handleVerifyOtp = async () => {
  loading.value = true
  error.value = ''

  try {
    console.log('🔑 Verificando código OTP...')
    
    // Usar o authStore para verificar OTP e autenticar o usuário
    await authStore.verifyOtp(formData.value.whatsapp, otp.value)
    
    console.log('✅ OTP verificado e usuário autenticado com sucesso')

    // Redirecionar
    const route = useRoute()
    const redirect = route.query.redirect as string || '/'
    console.log('🚀 Redirecionando para:', redirect)
    await router.push(redirect)
  } catch (err: any) {
    console.error('❌ Erro na verificação OTP:', err)
    error.value = err.message || 'Código inválido ou expirado'
  } finally {
    loading.value = false
  }
}

// Reenviar OTP
const resendOtp = async () => {
  loading.value = true
  error.value = ''

  try {
    await api.login(formData.value.whatsapp)
    startResendCooldown()
    
    // Feedback visual
    const tempError = error.value
    error.value = ''
    setTimeout(() => {
      if (!tempError) {
        // Poderia adicionar uma mensagem de sucesso aqui
      }
    }, 100)
  } catch (err: any) {
    error.value = err.message || 'Erro ao reenviar código'
    console.error(err)
  } finally {
    loading.value = false
  }
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

// Voltar para o formulário de cadastro
const resetForm = () => {
  otpSent.value = false
  otp.value = ''
  error.value = ''
}
</script>

<style lang="scss" scoped>
.signup-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #f9f9f9 0%, #ffffff 100%);
}

.signup-container {
  width: 100%;
  max-width: 480px;
}

.signup-card {
  background: white;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);

  h1 {
    text-align: center;
    margin-bottom: 0.5rem;
    color: var(--primary);
    font-size: 2rem;
  }

  .subtitle {
    text-align: center;
    color: #666;
    margin-bottom: 2rem;
    line-height: 1.6;

    strong {
      color: var(--primary);
      font-weight: 700;
    }
  }
}

// Header OTP
.otp-header {
  text-align: center;
  margin-bottom: 2rem;

  > i {
    font-size: 3rem;
    color: var(--primary);
    margin-bottom: 1rem;
    display: block;
  }

  h1 {
    margin-bottom: 0.75rem;
  }
}

// Form Groups
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

    &:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(139, 0, 20, 0.1);
    }

    &:disabled {
      background-color: #f5f5f5;
      cursor: not-allowed;
    }

    &.otp-input {
      text-align: center;
      font-size: 1.5rem;
      letter-spacing: 0.5rem;
      font-weight: 700;
    }
  }

  .input-hint {
    display: block;
    margin-top: 0.5rem;
    color: #999;
    font-size: 0.85rem;
    line-height: 1.4;
  }
}

// Buttons
.btn-primary,
.btn-secondary {
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 12px;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;

  i {
    font-size: 1.2rem;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  color: white;
  margin-bottom: 1rem;
  box-shadow: 0 4px 16px rgba(139, 0, 20, 0.25);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(139, 0, 20, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
}

.btn-secondary {
  background: #f5f5f5;
  color: #666;

  &:hover:not(:disabled) {
    background: #e0e0e0;
  }
}

.btn-link {
  background: none;
  border: none;
  color: var(--primary);
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
  transition: color 0.3s;

  &:hover:not(:disabled) {
    color: var(--secondary);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

// Resend Section
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
}

// Error Message
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

// Login Link
.login-link {
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

// Responsividade
@media (max-width: 768px) {
  .signup-page {
    padding: 1rem;
  }

  .signup-card {
    padding: 2rem 1.5rem;
    border-radius: 16px;

    h1 {
      font-size: 1.75rem;
    }
  }

  .otp-header > i {
    font-size: 2.5rem;
  }
}
</style>

