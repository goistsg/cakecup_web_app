import { defineStore } from 'pinia'
import { api } from '~/utils/api'

interface FeedbackSession {
  sessionId: string
  testerName: string
  whatsapp: string
  isActive: boolean
}

export const useFeedbackStore = defineStore('feedback', {
  state: () => ({
    session: null as FeedbackSession | null,
    isModalOpen: false,
  }),

  getters: {
    isSessionActive: (state) => state.session?.isActive || false,
    sessionId: (state) => state.session?.sessionId || null,
  },

  actions: {
    async startSession(testerName: string, whatsapp: string) {
      try {
        // Detectar browser e versão
        const userAgent = navigator.userAgent
        let browser = 'Unknown'
        
        if (userAgent.indexOf('Firefox') > -1) {
          browser = 'Firefox'
        } else if (userAgent.indexOf('Chrome') > -1) {
          browser = 'Chrome'
        } else if (userAgent.indexOf('Safari') > -1) {
          browser = 'Safari'
        } else if (userAgent.indexOf('Edge') > -1) {
          browser = 'Edge'
        }

        const version = '1.0.0' // Pode ser dinâmico se quiser

        const response = await api.startTestSession({
          testerName,
          whatsapp,
          context: {
            browser,
            version,
          },
        })

        this.session = {
          sessionId: response.sessionId,
          testerName,
          whatsapp,
          isActive: true,
        }

        // Salvar no localStorage para persistir entre reloads
        if (process.client) {
          localStorage.setItem('feedback_session', JSON.stringify(this.session))
        }

        return response.sessionId
      } catch (error) {
        console.error('Erro ao iniciar sessão de feedback:', error)
        throw error
      }
    },

    stopSession() {
      this.session = null
      this.isModalOpen = false

      if (process.client) {
        localStorage.removeItem('feedback_session')
      }
    },

    toggleSession() {
      if (this.session?.isActive) {
        this.stopSession()
      }
      // Se não estiver ativa, precisa abrir modal para iniciar
    },

    loadSession() {
      if (process.client) {
        const saved = localStorage.getItem('feedback_session')
        if (saved) {
          try {
            this.session = JSON.parse(saved)
          } catch (error) {
            console.error('Erro ao carregar sessão:', error)
            localStorage.removeItem('feedback_session')
          }
        }
      }
    },

    openModal() {
      this.isModalOpen = true
    },

    closeModal() {
      this.isModalOpen = false
    },

    async submitFeedback(data: {
      screen: string
      worked: boolean
      description?: string
      improvementSuggestion?: string
    }) {
      if (!this.session) {
        throw new Error('Sessão de feedback não iniciada')
      }

      const authStore = useAuthStore()

      try {
        await api.submitTestFeedback({
          sessionId: this.session.sessionId,
          testerName: this.session.testerName,
          whatsapp: this.session.whatsapp,
          screen: data.screen,
          worked: data.worked,
          description: data.description,
          improvementSuggestion: data.improvementSuggestion,
          userId: authStore.user?.id,
        })

        this.closeModal()
      } catch (error) {
        console.error('Erro ao enviar feedback:', error)
        throw error
      }
    },
  },
})

