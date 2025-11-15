<template>
  <div class="profile-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">
          <i class="fas fa-user-circle"></i>
        </div>
        <h1>Meu Perfil</h1>
        <p class="subtitle">Gerencie suas informações e preferências</p>
      </div>
    </section>

    <!-- Content -->
    <div class="profile-container">
      <div v-if="!isMounted || !isAuthenticated" class="not-authenticated">
        <i class="fas fa-lock"></i>
        <h2>Acesso Restrito</h2>
        <p>Você precisa estar logado para acessar seu perfil</p>
        <NuxtLink to="/login" class="btn-login">
          <i class="fas fa-sign-in-alt"></i>
          Fazer Login
        </NuxtLink>
      </div>

      <div v-else class="profile-content">
        <!-- User Info Card -->
        <div class="profile-card">
          <div class="card-header">
            <h2>
              <i class="fas fa-user"></i>
              Informações Pessoais
            </h2>
          </div>

          <div class="card-body">
            <form @submit.prevent="handleUpdateProfile">
              <div class="form-group">
                <label for="name">
                  <i class="fas fa-signature"></i>
                  Nome
                </label>
                <input
                  id="name"
                  v-model="profileForm.name"
                  type="text"
                  placeholder="Seu nome completo"
                  required
                  :disabled="updatingProfile"
                />
              </div>

              <div class="form-group">
                <label for="email">
                  <i class="fas fa-envelope"></i>
                  Email
                </label>
                <input
                  id="email"
                  :value="user?.email"
                  type="email"
                  disabled
                  class="disabled-input"
                />
                <small class="help-text">O email não pode ser alterado</small>
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
                    placeholder="(##) #####-####"
                    maxlength="15"
                    :disabled="updatingProfile"
                  />
                </div>
              </div>

              <div v-if="profileError" class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                {{ profileError }}
              </div>

              <div v-if="profileSuccess" class="success-message">
                <i class="fas fa-check-circle"></i>
                {{ profileSuccess }}
              </div>

              <button
                type="submit"
                class="btn-submit"
                :disabled="updatingProfile || !isProfileFormValid"
              >
                <i v-if="updatingProfile" class="fas fa-spinner fa-spin"></i>
                <i v-else class="fas fa-save"></i>
                {{ updatingProfile ? 'Salvando...' : 'Salvar Alterações' }}
              </button>
            </form>
          </div>
        </div>

        <!-- Change Password Card -->
        <div class="profile-card">
          <div class="card-header">
            <h2>
              <i class="fas fa-lock"></i>
              Alterar Senha
            </h2>
          </div>

          <div class="card-body">
            <form @submit.prevent="handleChangePassword">
              <div class="form-group">
                <label for="currentPassword">
                  <i class="fas fa-key"></i>
                  Senha Atual
                </label>
                <input
                  id="currentPassword"
                  v-model="passwordForm.currentPassword"
                  type="password"
                  placeholder="Digite sua senha atual"
                  required
                  :disabled="changingPassword"
                />
              </div>

              <div class="form-group">
                <label for="newPassword">
                  <i class="fas fa-lock"></i>
                  Nova Senha
                </label>
                <input
                  id="newPassword"
                  v-model="passwordForm.newPassword"
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  minlength="8"
                  required
                  :disabled="changingPassword"
                />
              </div>

              <div class="form-group">
                <label for="confirmPassword">
                  <i class="fas fa-lock"></i>
                  Confirmar Nova Senha
                </label>
                <input
                  id="confirmPassword"
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  placeholder="Digite novamente a nova senha"
                  minlength="8"
                  required
                  :disabled="changingPassword"
                />
              </div>

              <!-- Password Strength -->
              <PasswordStrength
                v-if="passwordForm.newPassword"
                :password="passwordForm.newPassword"
              />

              <div v-if="passwordError" class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                {{ passwordError }}
              </div>

              <div v-if="passwordSuccess" class="success-message">
                <i class="fas fa-check-circle"></i>
                {{ passwordSuccess }}
              </div>

              <button
                type="submit"
                class="btn-submit"
                :disabled="changingPassword || !isPasswordFormValid"
              >
                <i v-if="changingPassword" class="fas fa-spinner fa-spin"></i>
                <i v-else class="fas fa-sync-alt"></i>
                {{ changingPassword ? 'Alterando...' : 'Alterar Senha' }}
              </button>
            </form>
          </div>
        </div>

        <!-- Admin Badge -->
        <div v-if="isCompanyAdmin" class="admin-badge-card">
          <i class="fas fa-crown"></i>
          <div>
            <strong>Administrador</strong>
            <p>Você tem privilégios de administrador</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useClientMounted } from '~/composables/useClientMounted'
import { api } from '~/utils/api'
import PasswordStrength from '~/components/common/PasswordStrength.vue'

// Client mounted state
const { isMounted } = useClientMounted()

// Auth
const { user, isAuthenticated, isCompanyAdmin, fetchProfile } = useAuth()

// Profile Form
const profileForm = ref({
  name: '',
  whatsapp: '',
})

const phoneDisplay = ref('')
const updatingProfile = ref(false)
const profileError = ref('')
const profileSuccess = ref('')

// Password Form
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const changingPassword = ref(false)
const passwordError = ref('')
const passwordSuccess = ref('')

// Initialize profile form with user data
watch(() => user.value, (newUser) => {
  if (newUser) {
    profileForm.value.name = newUser.name || ''
    profileForm.value.whatsapp = newUser.whatsapp || ''
    
    // Format phone display
    if (newUser.whatsapp) {
      const numbers = newUser.whatsapp.replace(/\D/g, '').substring(2) // Remove +55
      if (numbers.length === 11) {
        phoneDisplay.value = `(${numbers.substring(0, 2)}) ${numbers.substring(2, 7)}-${numbers.substring(7)}`
      } else {
        phoneDisplay.value = numbers
      }
    }
  }
}, { immediate: true })

// Format phone input
const formatPhone = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '')
  
  // Limit to 11 digits
  if (value.length > 11) {
    value = value.substring(0, 11)
  }
  
  // Format as (##) #####-####
  if (value.length <= 2) {
    phoneDisplay.value = value
  } else if (value.length <= 7) {
    phoneDisplay.value = `(${value.substring(0, 2)}) ${value.substring(2)}`
  } else {
    phoneDisplay.value = `(${value.substring(0, 2)}) ${value.substring(2, 7)}-${value.substring(7)}`
  }
  
  // Store clean number with +55 prefix
  profileForm.value.whatsapp = value.length > 0 ? `+55${value}` : ''
}

// Validation
const isProfileFormValid = computed(() => {
  const nameValid = profileForm.value.name.trim().length > 0
  const whatsappValid = profileForm.value.whatsapp.length >= 12 // +55 + 10 or 11 digits (celular ou fixo)
  return nameValid && whatsappValid
})

const isPasswordValid = computed(() => {
  const password = passwordForm.value.newPassword
  return password.length >= 8 &&
         /[A-Z]/.test(password) &&
         /[a-z]/.test(password) &&
         /[0-9!@#$%^&*(),.?":{}|<>]/.test(password)
})

const isPasswordFormValid = computed(() => {
  return passwordForm.value.currentPassword.length > 0 &&
         isPasswordValid.value &&
         passwordForm.value.newPassword === passwordForm.value.confirmPassword
})

// Handle profile update
const handleUpdateProfile = async () => {
  if (!isProfileFormValid.value) return
  
  updatingProfile.value = true
  profileError.value = ''
  profileSuccess.value = ''
  
  try {
    await api.updateProfile(
      user.value?.id || '',
      {
        name: profileForm.value.name,
        whatsapp: profileForm.value.whatsapp,
      }
    )
    
    // Refresh user data
    await fetchProfile()
    
    profileSuccess.value = 'Perfil atualizado com sucesso!'
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      profileSuccess.value = ''
    }, 3000)
  } catch (err: any) {
    profileError.value = err.message || 'Erro ao atualizar perfil'
  } finally {
    updatingProfile.value = false
  }
}

// Handle password change
const handleChangePassword = async () => {
  if (!isPasswordFormValid.value) return
  
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordError.value = 'As senhas não coincidem'
    return
  }
  
  changingPassword.value = true
  passwordError.value = ''
  passwordSuccess.value = ''
  
  try {
    await api.changePassword(
      passwordForm.value.currentPassword,
      passwordForm.value.newPassword
    )
    
    passwordSuccess.value = 'Senha alterada com sucesso!'
    
    // Reset form
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      passwordSuccess.value = ''
    }, 3000)
  } catch (err: any) {
    passwordError.value = err.message || 'Erro ao alterar senha'
  } finally {
    changingPassword.value = false
  }
}

// SEO
useHead({
  title: 'Meu Perfil | Cakecup',
  meta: [
    { name: 'description', content: 'Gerencie seu perfil e preferências' }
  ]
})
</script>

<style scoped lang="scss">
.profile-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #FBE9E7 0%, #E9DFD7 100%);
}

.hero-section {
  padding: 6rem 1.5rem 4rem;
  color: var(--primary);
  text-align: center;
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
  }

  .hero-content {
    max-width: 600px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }

  .hero-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    animation: float 3s ease-in-out infinite;
  }

  h1 {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  }

  .subtitle {
    font-size: 1.25rem;
    opacity: 0.95;
  }
}

.profile-container {
  max-width: 800px;
  margin: -3rem auto 4rem;
  padding: 0 1.5rem;
  position: relative;
  z-index: 10;
}

.not-authenticated {
  background: white;
  border-radius: 20px;
  padding: 4rem 2rem;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);

  i {
    font-size: 4rem;
    color: var(--primary);
    margin-bottom: 1.5rem;
  }

  h2 {
    color: var(--text-dark);
    margin-bottom: 1rem;
  }

  p {
    color: var(--text-light);
    margin-bottom: 2rem;
  }

  .btn-login {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--background);
    color: white;
    padding: 1rem 2rem;
    border-radius: 12px;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;

    &:hover {
      background: var(--primary-dark);
      transform: translateY(-2px);
      box-shadow: 0 5px 20px rgba(231, 73, 102, 0.3);
    }
  }
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.profile-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 15px 50px rgba(0, 0, 0, 0.15);
  }

  .card-header {
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    color: white;
    padding: 1.5rem 2rem;

    h2 {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0;

      i {
        font-size: 1.75rem;
      }
    }
  }

  .card-body {
    padding: 2rem;
  }
}

.form-group {
  margin-bottom: 1.5rem;

  &:last-of-type {
    margin-bottom: 2rem;
  }

  label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    color: var(--text-dark);
    margin-bottom: 0.5rem;

    i {
      color: var(--primary);
    }
  }

  input,
  textarea {
    width: 100%;
    padding: 0.875rem 1rem;
    border: 2px solid var(--border-light);
    border-radius: 12px;
    font-size: 1rem;
    transition: all 0.3s ease;
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(231, 73, 102, 0.1);
    }

    &:disabled {
      background: var(--bg-light);
      cursor: not-allowed;
      opacity: 0.7;
    }
  }

  .disabled-input {
    background: var(--bg-light);
    cursor: not-allowed;
    opacity: 0.7;
  }

  .help-text {
    display: block;
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: var(--text-light);
  }
}

.phone-input-wrapper {
  display: flex;
  align-items: center;
  border: 2px solid var(--border-light);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-sizing: border-box;

  &:focus-within {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(231, 73, 102, 0.1);
  }

  .phone-prefix {
    padding: 0.875rem 0.75rem 0.875rem 1rem;
    background: var(--bg-light);
    color: var(--text-dark);
    font-weight: 600;
    border-right: 2px solid var(--border-light);
  }

  input {
    flex: 1;
    border: none;
    padding: 0.875rem 1rem;
    box-shadow: none;

    &:focus {
      box-shadow: none;
    }
  }
}

.error-message,
.success-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  font-weight: 500;
}

.error-message {
  background: #fee;
  color: #c33;
  border: 1px solid #fcc;

  i {
    color: #c33;
  }
}

.success-message {
  background: #efe;
  color: #3c3;
  border: 1px solid #cfc;

  i {
    color: #3c3;
  }
}

.btn-submit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-sizing: border-box;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(231, 73, 102, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  i {
    font-size: 1.1rem;
  }
}

.admin-badge-card {
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  border-radius: 20px;
  padding: 1.5rem 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 10px 40px rgba(255, 215, 0, 0.2);

  i {
    font-size: 2.5rem;
    color: #ff8c00;
  }

  strong {
    display: block;
    font-size: 1.25rem;
    color: #d97706;
    margin-bottom: 0.25rem;
  }

  p {
    margin: 0;
    color: #92400e;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 5rem 1rem 3rem;

    .hero-icon {
      font-size: 3rem;
    }

    h1 {
      font-size: 2rem;
    }

    .subtitle {
      font-size: 1rem;
    }
  }

  .profile-container {
    margin: -2rem auto 2rem;
    padding: 0 1rem;
  }

  .profile-card .card-body {
    padding: 1.5rem;
  }
}
</style>

