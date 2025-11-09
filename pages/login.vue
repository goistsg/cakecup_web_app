<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <h1>Bem-vindo ao CakeCup</h1>
        <p class="subtitle">Entre com seu WhatsApp para continuar</p>

        <div v-if="!otpSent" class="form-section">
          <form @submit.prevent="handleLogin">
            <div class="form-group">
              <label for="whatsapp">WhatsApp</label>
              <input
                id="whatsapp"
                v-model="whatsapp"
                type="tel"
                placeholder="+55 11 99999-9999"
                required
                :disabled="loading"
              >
            </div>

            <button type="submit" class="btn-primary" :disabled="loading">
              {{ loading ? 'Enviando...' : 'Enviar Código' }}
            </button>
          </form>
        </div>

        <div v-else class="form-section">
          <form @submit.prevent="handleVerifyOtp">
            <p class="otp-info">
              Enviamos um código para <strong>{{ whatsapp }}</strong>
            </p>

            <div class="form-group">
              <label for="otp">Código OTP</label>
              <input
                id="otp"
                v-model="otp"
                type="text"
                placeholder="000000"
                maxlength="6"
                required
                :disabled="loading"
              >
            </div>

            <button type="submit" class="btn-primary" :disabled="loading">
              {{ loading ? 'Verificando...' : 'Verificar Código' }}
            </button>

            <button 
              type="button" 
              class="btn-secondary" 
              @click="resetForm"
              :disabled="loading"
            >
              Voltar
            </button>
          </form>
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useRouter } from 'vue-router'

const router = useRouter()
const { login, verifyOtp, error, loading } = useAuth()

const whatsapp = ref('')
const otp = ref('')
const otpSent = ref(false)

const handleLogin = async () => {
  try {
    await login(whatsapp.value)
    otpSent.value = true
  } catch (err) {
    console.error('Erro ao enviar OTP:', err)
  }
}

const handleVerifyOtp = async () => {
  try {
    await verifyOtp(whatsapp.value, otp.value)
    
    // Verificar se há redirect na query
    const route = useRoute()
    const redirect = route.query.redirect as string || '/'
    
    router.push(redirect)
  } catch (err) {
    console.error('Erro ao verificar OTP:', err)
  }
}

const resetForm = () => {
  otpSent.value = false
  otp.value = ''
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-container {
  width: 100%;
  max-width: 450px;
}

.login-card {
  background: white;
  border-radius: 16px;
  padding: 3rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);

  h1 {
    text-align: center;
    margin-bottom: 0.5rem;
    color: #333;
    font-size: 2rem;
  }

  .subtitle {
    text-align: center;
    color: #666;
    margin-bottom: 2rem;
  }
}

.form-section {
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #333;
    font-weight: 500;
  }

  input {
    width: 100%;
    padding: 0.875rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s;

    &:focus {
      outline: none;
      border-color: var(--primary);
    }

    &:disabled {
      background-color: #f5f5f5;
      cursor: not-allowed;
    }
  }
}

.otp-info {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #666;
  line-height: 1.6;

  strong {
    color: #333;
  }
}

.btn-primary,
.btn-secondary {
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.btn-primary {
  background: var(--primary);
  color: white;
  margin-bottom: 1rem;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px var(--primary);
  }
}

.btn-secondary {
  background: #f5f5f5;
  color: #666;

  &:hover:not(:disabled) {
    background: #e0e0e0;
  }
}

.error-message {
  padding: 1rem;
  background-color: var(--error-light);
  border: 1px solid var(--error);
  border-radius: 8px;
  color: var(--error);
  text-align: center;
  margin-top: 1rem;
}
</style>

