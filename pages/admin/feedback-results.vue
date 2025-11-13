<template>
  <div class="feedback-results-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <i class="fas fa-comments"></i>
        <h1>Resultados de Feedback</h1>
        <p class="subtitle">Sessões de teste e feedbacks recebidos</p>
      </div>
    </section>

    <div class="results-container">
      <!-- Loading state -->
      <div v-if="loading" class="loading-state">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Carregando resultados...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="error-state">
        <i class="fas fa-exclamation-triangle"></i>
        <p>{{ error }}</p>
        <button @click="loadResults" class="btn-retry">
          <i class="fas fa-redo"></i>
          Tentar novamente
        </button>
      </div>

      <!-- Unauthorized -->
      <div v-else-if="!isCompanyAdmin" class="unauthorized-state">
        <i class="fas fa-lock"></i>
        <h2>Acesso Restrito</h2>
        <p>Apenas administradores podem acessar esta página</p>
        <NuxtLink to="/" class="btn-primary">
          <i class="fas fa-home"></i>
          Voltar para Home
        </NuxtLink>
      </div>

      <!-- Empty state -->
      <div v-else-if="sessions.length === 0" class="empty-state">
        <i class="fas fa-inbox"></i>
        <h2>Nenhuma sessão encontrada</h2>
        <p>Ainda não há resultados de feedback disponíveis</p>
      </div>

      <!-- Results list -->
      <div v-else class="results-content">
        <!-- Statistics -->
        <div class="stats-section">
          <div class="stat-card">
            <i class="fas fa-users"></i>
            <div class="stat-info">
              <span class="stat-value">{{ sessions.length }}</span>
              <span class="stat-label">Sessões</span>
            </div>
          </div>
          <div class="stat-card">
            <i class="fas fa-comment-dots"></i>
            <div class="stat-info">
              <span class="stat-value">{{ totalFeedbacks }}</span>
              <span class="stat-label">Feedbacks</span>
            </div>
          </div>
          <div class="stat-card">
            <i class="fas fa-check-circle"></i>
            <div class="stat-info">
              <span class="stat-value">{{ successRate }}%</span>
              <span class="stat-label">Taxa de Sucesso</span>
            </div>
          </div>
        </div>

        <!-- Sessions List -->
        <div class="sessions-list">
          <div 
            v-for="session in sessions"
            :key="session.sessionId"
            class="session-card"
          >
            <!-- Session Header -->
            <div class="session-header">
              <div class="session-info">
                <h3>
                  <i class="fas fa-user-circle"></i>
                  {{ session.testerName }}
                </h3>
                <div class="session-meta">
                  <span class="meta-item">
                    <i class="fab fa-whatsapp"></i>
                    {{ session.whatsapp }}
                  </span>
                  <span class="meta-item">
                    <i class="fas fa-calendar"></i>
                    {{ formatDate(session.createdAt) }}
                  </span>
                  <span class="meta-item">
                    <i class="fas fa-globe"></i>
                    {{ session.context?.browser || 'N/A' }}
                  </span>
                </div>
              </div>
              <div class="session-summary">
                <span class="feedback-count">
                  <i class="fas fa-comments"></i>
                  {{ session.feedbacks?.length || 0 }} feedbacks
                </span>
              </div>
            </div>

            <!-- Feedbacks -->
            <div v-if="session.feedbacks && session.feedbacks.length > 0" class="feedbacks-list">
              <div 
                v-for="feedback in session.feedbacks"
                :key="feedback.id"
                class="feedback-item"
                :class="{ 'worked': feedback.worked, 'failed': !feedback.worked }"
              >
                <div class="feedback-header">
                  <div class="feedback-status">
                    <i :class="feedback.worked ? 'fas fa-check-circle' : 'fas fa-times-circle'"></i>
                    <span class="status-text">
                      {{ feedback.worked ? 'Funcionou' : 'Não funcionou' }}
                    </span>
                  </div>
                  <div class="feedback-meta">
                    <span class="screen-name">
                      <i class="fas fa-desktop"></i>
                      {{ feedback.screen }}
                    </span>
                    <span class="feedback-date">
                      {{ formatTime(feedback.createdAt) }}
                    </span>
                  </div>
                </div>
                
                <div v-if="feedback.description" class="feedback-description">
                  <strong>Descrição:</strong>
                  <p>{{ feedback.description }}</p>
                </div>
                
                <div v-if="feedback.improvementSuggestion" class="feedback-suggestion">
                  <strong>Sugestão de Melhoria:</strong>
                  <p>{{ feedback.improvementSuggestion }}</p>
                </div>
              </div>
            </div>
            <div v-else class="no-feedbacks">
              <i class="fas fa-info-circle"></i>
              <span>Nenhum feedback nesta sessão</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import { api } from '~/utils/api'
import type { FeedbackSessionResult } from '~/types/api'

const router = useRouter()
const { isAuthenticated, isCompanyAdmin } = useAuth()

const sessions = ref<FeedbackSessionResult[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const totalFeedbacks = computed(() => {
  return sessions.value.reduce((total, session) => {
    return total + (session.feedbacks?.length || 0)
  }, 0)
})

const successRate = computed(() => {
  const total = totalFeedbacks.value
  if (total === 0) return 0
  
  const successful = sessions.value.reduce((count, session) => {
    return count + (session.feedbacks?.filter(f => f.worked).length || 0)
  }, 0)
  
  return Math.round((successful / total) * 100)
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatTime = (dateString: string | undefined) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

const loadResults = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await api.getAllSessionResults()
    console.log('📊 Resultados de feedback recebidos:', response)
    
    const data = response.data || response
    sessions.value = Array.isArray(data) ? data : []
    
    console.log('✅ Sessões processadas:', sessions.value.length)
  } catch (err: any) {
    console.error('❌ Erro ao carregar resultados:', err)
    error.value = err.message || 'Erro ao carregar resultados de feedback'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (!isAuthenticated.value) {
    router.push('/login?redirect=/admin/feedback-results')
    return
  }

  if (!isCompanyAdmin.value) {
    loading.value = false
    return
  }

  await loadResults()
})
</script>

<style lang="scss" scoped>
.feedback-results-page {
  min-height: 100vh;
  background: var(--background);
  padding-bottom: 3rem;
}

.hero-section {
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  padding: 3rem 1rem;
  text-align: center;
  color: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
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

  .hero-content {
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
    z-index: 1;

    i {
      font-size: 4rem;
      margin-bottom: 1rem;
      opacity: 0.9;
    }

    h1 {
      font-size: 2.5rem;
      margin: 0 0 0.5rem 0;
      font-weight: 700;
    }

    .subtitle {
      font-size: 1.1rem;
      opacity: 0.9;
      margin: 0;
    }
  }
}

.results-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.loading-state,
.error-state,
.empty-state,
.unauthorized-state {
  background: white;
  border-radius: 16px;
  padding: 4rem 2rem;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);

  i {
    font-size: 4rem;
    color: var(--primary);
    margin-bottom: 1.5rem;
  }

  h2 {
    color: var(--text);
    margin-bottom: 0.5rem;
  }

  p {
    color: var(--text-light);
    margin-bottom: 2rem;
  }
}

.loading-state i {
  color: var(--primary);
}

.error-state i {
  color: var(--error-color);
}

.btn-retry,
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 2rem;
  background: var(--primary);
  color: white;
  text-decoration: none;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: var(--primary-dark);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
    border-color: var(--primary);
  }

  i {
    font-size: 3rem;
    color: var(--primary);
    background: linear-gradient(135deg, rgba(255, 105, 180, 0.1), rgba(139, 0, 20, 0.1));
    padding: 1rem;
    border-radius: 16px;
  }

  .stat-info {
    display: flex;
    flex-direction: column;
  }

  .stat-value {
    font-size: 2rem;
    font-weight: 700;
    color: var(--text);
  }

  .stat-label {
    font-size: 0.9rem;
    color: var(--text-light);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
}

.sessions-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.session-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-left: 5px solid var(--primary);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
    border-left-color: var(--secondary);
  }
}

.session-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid var(--surface);

  .session-info {
    h3 {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin: 0 0 0.75rem 0;
      color: var(--text);
      font-size: 1.5rem;

      i {
        color: var(--primary);
      }
    }

    .session-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;

      .meta-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--text-light);
        font-size: 0.9rem;

        i {
          color: var(--primary);
        }
      }
    }
  }

  .session-summary {
    .feedback-count {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.25rem;
      background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
      color: white;
      border-radius: 50px;
      font-weight: 600;
      font-size: 0.95rem;
      box-shadow: 0 4px 12px rgba(255, 105, 180, 0.3);
    }
  }
}

.feedbacks-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.feedback-item {
  background: #f8f9fa;
  border-radius: 16px;
  padding: 1.5rem;
  border-left: 4px solid #dee2e6;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);

  &.worked {
    border-left-color: #4CAF50;
    background: #f1f8f4;
    
    .feedback-status i {
      color: #4CAF50;
    }
  }

  &.failed {
    border-left-color: #F44336;
    background: #fef5f5;
    
    .feedback-status i {
      color: #F44336;
    }
  }

  &:hover {
    transform: translateX(4px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
}

.feedback-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  .feedback-status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;

    i {
      font-size: 1.2rem;
    }
  }

  .feedback-meta {
    display: flex;
    align-items: center;
    gap: 1rem;
    color: var(--text-light);
    font-size: 0.9rem;

    .screen-name {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  }
}

.feedback-description,
.feedback-suggestion {
  margin-top: 1rem;

  strong {
    display: block;
    color: var(--text);
    margin-bottom: 0.5rem;
  }

  p {
    color: var(--text-light);
    line-height: 1.6;
    margin: 0;
  }
}

.feedback-suggestion {
  padding: 1rem;
  background: linear-gradient(135deg, rgba(255, 105, 180, 0.05), rgba(139, 0, 20, 0.05));
  border-radius: 12px;
  border: 2px solid rgba(255, 105, 180, 0.2);
  margin-top: 1rem;

  strong {
    color: var(--primary);
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &::before {
      content: '💡';
      font-size: 1.2rem;
    }
  }
}

.no-feedbacks {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 2rem;
  color: var(--text-light);
  font-style: italic;

  i {
    color: var(--primary);
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 2rem 1rem;

    .hero-content {
      i {
        font-size: 3rem;
      }

      h1 {
        font-size: 2rem;
      }

      .subtitle {
        font-size: 1rem;
      }
    }
  }

  .stats-section {
    grid-template-columns: 1fr;
  }

  .session-header {
    flex-direction: column;
    gap: 1rem;

    .session-summary {
      width: 100%;
      
      .feedback-count {
        width: 100%;
        justify-content: center;
      }
    }
  }

  .feedback-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
}
</style>

