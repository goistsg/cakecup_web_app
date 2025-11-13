<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-section">
        <p class="copyright">© {{ currentYear }} CakeCup. Todos os direitos reservados.</p>
      </div>
      
      <div class="footer-section">
        <nav class="footer-nav">
          <ul>
            <li><a href="/about">Sobre</a></li>
            <li><a href="/contact">Contato</a></li>
            <li><a href="/privacy">Privacidade</a></li>
            <li>
              <a 
                href="#" 
                @click.prevent="toggleTestMode"
                :class="{ 'test-mode-active': feedbackStore.isSessionActive }"
              >
                <i class="fas" :class="feedbackStore.isSessionActive ? 'fa-flask' : 'fa-flask'"></i>
                {{ feedbackStore.isSessionActive ? 'Desativar Testes' : 'Modo de Teste' }}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- Modal de Início de Sessão -->
    <StartSessionModal v-model="showStartModal" />
  </footer>
</template>

<script setup lang="ts">
import { useFeedbackStore } from '~/stores/feedback'
import StartSessionModal from '~/components/feedback/StartSessionModal.vue'

const currentYear = new Date().getFullYear()
const feedbackStore = useFeedbackStore()
const showStartModal = ref(false)

// Carregar sessão ao montar
onMounted(() => {
  feedbackStore.loadSession()
})

const toggleTestMode = () => {
  if (feedbackStore.isSessionActive) {
    // Desativar sessão
    if (confirm('Deseja realmente desativar o modo de teste?')) {
      feedbackStore.stopSession()
    }
  } else {
    // Abrir modal para iniciar sessão
    showStartModal.value = true
  }
}
</script>

<style lang="scss" scoped>
.footer {
  background-color: #f8f9fa;
  padding: 2rem 0;
  margin-top: auto;
  
  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    @media (max-width: 768px) {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }
  }
  
  .footer-nav {
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      gap: 2rem;
      
      @media (max-width: 768px) {
        gap: 1rem;
        flex-wrap: wrap;
        justify-content: center;
      }
    }
    
    a {
      color: #666;
      text-decoration: none;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      
      &:hover {
        color: #333;
      }

      &.test-mode-active {
        color: var(--primary);
        font-weight: 600;

        i {
          animation: pulse 2s infinite;
        }
      }

      i {
        font-size: 0.9rem;
      }
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.7;
      transform: scale(1.1);
    }
  }
  
  .copyright {
    color: #666;
    margin: 0;
  }
}
</style> 