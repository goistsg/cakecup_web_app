<template>
  <div class="forgot-password-page">
    <div class="forgot-password-container">
      <div class="forgot-password-card">
        <!-- Logo -->
        <div class="logo-section">
          <img src="/cakecup_logo.png" alt="CakeCup" class="logo" />
          <h1>Esqueceu a senha?</h1>
          <p>Digite seu e-mail para receber instruções de recuperação</p>
        </div>

        <!-- Success State -->
        <div v-if="emailSent" class="success-state">
          <div class="success-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <h2>E-mail enviado!</h2>
          <p>
            Enviamos as instruções para redefinir sua senha para
            <strong>{{ email }}</strong>
          </p>
          <p class="hint">Verifique sua caixa de entrada e spam.</p>
          
          <NuxtLink to="/login" class="btn-back">
            <i class="fas fa-arrow-left"></i>
            Voltar para o login
          </NuxtLink>
        </div>

        <!-- Form State -->
        <form v-else @submit.prevent="handleSubmit" class="forgot-password-form">
          <div class="form-group">
            <label for="email">
              <i class="fas fa-envelope"></i>
              E-mail
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="seu@email.com"
              required
              :disabled="loading"
            />
          </div>

          <button type="submit" class="btn-submit" :disabled="loading || !email">
            <i v-if="loading" class="fas fa-spinner fa-spin"></i>
            <span v-else>Enviar instruções</span>
          </button>

          <NuxtLink to="/login" class="btn-cancel">
            <i class="fas fa-arrow-left"></i>
            Voltar para o login
          </NuxtLink>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '~/composables/useAuth'

const { forgotPassword, loading, error, clearError } = useAuth()

const email = ref('')
const emailSent = ref(false)

const handleSubmit = async () => {
  clearError()

  try {
    await forgotPassword(email.value)
    emailSent.value = true
  } catch (err: any) {
    console.error('Erro ao solicitar recuperação:', err)
    alert(err.message || 'Erro ao enviar e-mail de recuperação. Tente novamente.')
  }
}
</script>

<style lang="scss" scoped>
.forgot-password-page {
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

.forgot-password-container {
  width: 100%;
  max-width: 450px;
  position: relative;
  z-index: 1;
}

.forgot-password-card {
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

.success-state {
  text-align: center;
  padding: 2rem 0;

  .success-icon {
    i {
      font-size: 5rem;
      color: #4CAF50;
      margin-bottom: 1.5rem;
      animation: scaleIn 0.5s ease;
    }
  }

  @keyframes scaleIn {
    from {
      transform: scale(0);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  h2 {
    color: var(--text);
    margin-bottom: 1rem;
    font-size: 1.75rem;
  }

  p {
    color: var(--text-light);
    margin-bottom: 1rem;
    line-height: 1.6;

    strong {
      color: var(--primary);
      font-weight: 600;
    }
  }

  .hint {
    font-size: 0.9rem;
    font-style: italic;
    margin-bottom: 2rem;
  }

  .btn-back {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    padding: 1rem 2rem;
    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 700;
    box-sizing: border-box;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(255, 105, 180, 0.3);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(255, 105, 180, 0.4);
    }
  }
}

.forgot-password-form {
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

.btn-submit {
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

.btn-cancel {
  width: 100%;
  padding: 1rem 2rem;
  background: white;
  color: var(--text-light);
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    border-color: var(--primary);
    color: var(--primary);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

@media (max-width: 768px) {
  .forgot-password-page {
    padding: 1rem;
  }

  .forgot-password-card {
    padding: 2rem 1.5rem;
  }

  .logo-section {
    h1 {
      font-size: 1.75rem;
    }
  }
}
</style>

