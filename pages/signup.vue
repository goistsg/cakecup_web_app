<template>
  <div class="signup-page">
    <div class="signup-container">
      <div class="signup-card">
        <!-- Logo -->
        <div class="logo-section">
          <img src="/cakecup_logo.png" alt="CakeCup" class="logo" />
          <h1>Criar Conta</h1>
          <p>Cadastre-se para começar a fazer seus pedidos</p>
        </div>

        <!-- Signup Form -->
        <form @submit.prevent="handleSignup" class="signup-form">
          <div class="form-group">
            <label for="name">
              <i class="fas fa-user"></i>
              Nome Completo
            </label>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              placeholder="Seu nome completo"
              required
              :disabled="loading"
            />
          </div>

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
                inputmode="numeric"
                class="phone-input"
                placeholder="(41) 99999-9999"
                maxlength="15"
                required
                :disabled="loading"
              />
            </div>
            <small class="input-hint">
              Digite apenas números. Ex: 41999999999
            </small>
          </div>

          <div class="form-group">
            <label for="email">
              <i class="fas fa-envelope"></i>
              E-mail
            </label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              placeholder="seu@email.com"
              required
              :disabled="loading"
            />
          </div>

          <div class="form-group">
            <label for="password">
              <i class="fas fa-lock"></i>
              Senha
            </label>
            <div class="password-input-wrapper">
              <input
                id="password"
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Mínimo 8 caracteres"
                required
                minlength="8"
                :disabled="loading"
              />
              <button
                type="button"
                class="toggle-password"
                @click="showPassword = !showPassword"
                :disabled="loading"
              >
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <PasswordStrength :password="formData.password" ref="passwordStrengthRef" />
          </div>

          <div class="form-group">
            <label for="confirmPassword">
              <i class="fas fa-lock"></i>
              Confirmar Senha
            </label>
            <div class="password-input-wrapper">
              <input
                id="confirmPassword"
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="Digite a senha novamente"
                required
                :disabled="loading"
              />
              <button
                type="button"
                class="toggle-password"
                @click="showConfirmPassword = !showConfirmPassword"
                :disabled="loading"
              >
                <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </div>

          <button type="submit" class="btn-signup" :disabled="loading || !isFormValid">
            <i v-if="loading" class="fas fa-spinner fa-spin"></i>
            <span v-else>Criar Conta</span>
          </button>

          <div class="divider">
            <span>ou</span>
          </div>

          <NuxtLink to="/login" class="btn-login">
            <i class="fas fa-sign-in-alt"></i>
            Já tenho uma conta
          </NuxtLink>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import PasswordStrength from '~/components/common/PasswordStrength.vue'

const router = useRouter()
const { signup, loading, error, clearError } = useAuth()

const formData = ref({
  name: '',
  whatsapp: '+55',
  email: '',
  password: '',
})

const phoneDisplay = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const passwordStrengthRef = ref<InstanceType<typeof PasswordStrength> | null>(null)

const isPhoneValid = computed(() => {
  const clean = formData.value.whatsapp.replace(/\D/g, '')
  return clean.length === 13 // 55 + 11 dígitos
})

const isPasswordValid = computed(() => {
  return passwordStrengthRef.value?.isValid ?? false
})

const isFormValid = computed(() => {
  return (
    formData.value.name.trim() &&
    isPhoneValid.value &&
    formData.value.email &&
    isPasswordValid.value &&
    formData.value.password === confirmPassword.value
  )
})

const formatPhone = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '')
  
  // Limitar a 11 dígitos (DDD + número)
  value = value.substring(0, 11)
  
  // Formatar (XX) XXXXX-XXXX
  if (value.length <= 2) {
    phoneDisplay.value = value
  } else if (value.length <= 7) {
    phoneDisplay.value = `(${value.slice(0, 2)}) ${value.slice(2)}`
  } else {
    phoneDisplay.value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`
  }
  
  // Atualizar o valor real com +55
  formData.value.whatsapp = '+55' + value
}

const handleSignup = async () => {
  if (!isFormValid.value) {
    alert('Por favor, preencha todos os campos corretamente.')
    return
  }

  clearError()

  try {
    await signup(formData.value)
    
    alert('Conta criada com sucesso! Bem-vindo!')
    router.push('/')
  } catch (err: any) {
    console.error('Erro ao criar conta:', err)
    alert(err.message || 'Erro ao criar conta. Tente novamente.')
  }
}
</script>

<style lang="scss" scoped>
.signup-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    opacity: 0.3;
  }
}

.signup-container {
  width: 100%;
  max-width: 500px;
  position: relative;
  z-index: 1;
}

.signup-card {
  background: white;
  border-radius: 24px;
  padding: 3rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.5s ease;

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
}

.logo-section {
  text-align: center;
  margin-bottom: 2.5rem;

  .logo {
    width: 80px;
    height: 80px;
    margin-bottom: 1.5rem;
    animation: bounce 1s ease;
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  h1 {
    font-size: 2rem;
    color: var(--text);
    margin-bottom: 0.5rem;
    font-weight: 700;
  }

  p {
    color: var(--text-light);
    font-size: 1rem;
  }
}

.signup-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    color: var(--text);
    font-size: 0.95rem;

    i {
      color: var(--primary);
    }
  }

  input {
    padding: 1rem 1.25rem;
    border: 2px solid rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    font-size: 1rem;
    transition: all 0.3s ease;
    width: 100%;
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
}

.phone-input-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 0 1rem;
  transition: all 0.3s ease;

  &:focus-within {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(255, 105, 180, 0.1);
  }

  .phone-prefix {
    font-weight: 600;
    color: var(--text);
    font-size: 1rem;
    padding-right: 0.5rem;
    border-right: 2px solid rgba(0, 0, 0, 0.1);
  }

  .phone-input {
    flex: 1;
    border: none;
    padding: 1rem 0.5rem;

    &:focus {
      box-shadow: none;
      border: none;
    }
  }
}

.input-hint {
  font-size: 0.85rem;
  color: var(--text-light);
  margin-top: -0.25rem;
}

.password-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;

  input {
    padding-right: 3rem;
  }

  .toggle-password {
    position: absolute;
    right: 1rem;
    background: none;
    border: none;
    color: var(--text-light);
    cursor: pointer;
    padding: 0.5rem;
    transition: all 0.3s ease;

    &:hover {
      color: var(--primary);
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }
}

.btn-signup {
  width: 100%;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(255, 105, 180, 0.3);
  box-sizing: border-box;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(255, 105, 180, 0.4);
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  i {
    font-size: 1.2rem;
  }
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 0.5rem 0;

  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 2px solid #e0e0e0;
  }

  span {
    padding: 0 1rem;
    color: var(--text-light);
    font-weight: 600;
    font-size: 0.9rem;
    text-transform: uppercase;
  }
}

.btn-login {
  width: 100%;
  padding: 1rem 2rem;
  background: white;
  color: var(--primary);
  border: 2px solid var(--primary);
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  text-decoration: none;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-sizing: border-box;

  &:hover {
    background: var(--primary);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 105, 180, 0.3);
  }
}

@media (max-width: 768px) {
  .signup-page {
    padding: 1rem;
  }

  .signup-card {
    padding: 2rem 1.5rem;
  }

  .logo-section {
    h1 {
      font-size: 1.75rem;
    }
  }
}
</style>
