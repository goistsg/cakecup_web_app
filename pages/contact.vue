<template>
  <div class="contato-page">
    <header class="page-header">
      <h1>Entre em Contato</h1>
    </header>

    <section class="contato-content">
      <div class="content-wrapper">
        <div class="contato-grid">
          <div class="contato-info">
            <h2>Informações de Contato</h2>
            
            <div class="info-item">
              <i class="icon">📞</i>
              <div>
                <h3>Telefone</h3>
                <p>(11) 99999-9999</p>
              </div>
            </div>

            <div class="info-item">
              <i class="icon">✉️</i>
              <div>
                <h3>E-mail</h3>
                <p>contato@cakecup.com.br</p>
              </div>
            </div>

            <div class="info-item">
              <i class="icon">📍</i>
              <div>
                <h3>Endereço</h3>
                <p>Rua das Delícias, 123<br>
                   Bairro Doce - São Paulo/SP</p>
              </div>
            </div>

            <div class="social-media">
              <h3>Redes Sociais</h3>
              <div class="social-links">
                <a href="#" target="_blank" rel="noopener">Instagram</a>
                <a href="#" target="_blank" rel="noopener">Facebook</a>
                <a href="#" target="_blank" rel="noopener">WhatsApp</a>
              </div>
            </div>
          </div>

          <div class="contato-form">
            <h2>Envie sua Mensagem</h2>
            <form @submit.prevent="enviarMensagem">
              <div class="form-group">
                <label for="nome">Nome</label>
                <input 
                  type="text" 
                  id="nome" 
                  v-model="formData.nome" 
                  required
                >
              </div>

              <div class="form-group">
                <label for="email">E-mail</label>
                <input 
                  type="email" 
                  id="email" 
                  v-model="formData.email" 
                  required
                >
              </div>

              <div class="form-group">
                <label for="assunto">Assunto</label>
                <input 
                  type="text" 
                  id="assunto" 
                  v-model="formData.assunto" 
                  required
                >
              </div>

              <div class="form-group">
                <label for="mensagem">Mensagem</label>
                <textarea 
                  id="mensagem" 
                  v-model="formData.mensagem" 
                  rows="5" 
                  required
                ></textarea>
              </div>

              <AppButton type="submit" class="submit-btn">
                Enviar Mensagem
              </AppButton>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const formData = ref({
  nome: '',
  email: '',
  assunto: '',
  mensagem: ''
})

const enviarMensagem = async () => {
  // Aqui você implementará a lógica de envio do formulário
  console.log('Dados do formulário:', formData.value)
  // Exemplo de feedback:
  alert('Mensagem enviada com sucesso!')
  // Limpar formulário
  formData.value = {
    nome: '',
    email: '',
    assunto: '',
    mensagem: ''
  }
}
</script>

<style lang="scss" scoped>
.contato-page {
  .page-header {
    background: var(--primary-color);
    color: white;
    padding: 1rem 2rem;
    text-align: center;
    
    h1 {
      font-size: 2.5rem;
      margin: 0;
    }
  }

  .content-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .contato-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin: 3rem 0;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  .contato-info {
    h2 {
      color: var(--primary-color);
      margin-bottom: 2rem;
    }

    .info-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 2rem;

      .icon {
        font-size: 1.5rem;
        margin-right: 1rem;
      }

      h3 {
        margin: 0 0 0.5rem 0;
        color: var(--primary-color);
      }

      p {
        margin: 0;
        color: #666;
      }
    }

    .social-media {
      margin-top: 3rem;

      h3 {
        color: var(--primary-color);
        margin-bottom: 1rem;
      }

      .social-links {
        display: flex;
        gap: 1rem;

        a {
          color: #666;
          text-decoration: none;
          transition: color 0.2s;

          &:hover {
            color: var(--primary-color);
          }
        }
      }
    }
  }

  .contato-form {
    h2 {
      color: var(--primary-color);
      margin-bottom: 2rem;
    }

    .form-group {
      margin-bottom: 1.5rem;

      label {
        display: block;
        margin-bottom: 0.5rem;
        color: #666;
      }

      input, textarea {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-family: inherit;

        &:focus {
          outline: none;
          border-color: var(--primary-color);
        }
      }
    }

    .submit-btn {
      width: 100%;
    }
  }
}
</style> 