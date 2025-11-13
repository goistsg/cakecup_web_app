<template>
  <Teleport to="body">
    <Transition name="fade-slide">
      <button
        v-if="feedbackStore.isSessionActive"
        class="floating-feedback-btn"
        @click="feedbackStore.openModal()"
        title="Enviar Feedback"
      >
        <i class="fas fa-comment-dots"></i>
        <span class="btn-text">Feedback</span>
      </button>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useFeedbackStore } from '~/stores/feedback'

const feedbackStore = useFeedbackStore()

// Carregar sessão ao montar
onMounted(() => {
  feedbackStore.loadSession()
})
</script>

<style scoped lang="scss">
.floating-feedback-btn {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  color: white;
  border: none;
  box-shadow: 0 8px 24px rgba(139, 0, 20, 0.3);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  z-index: 9999;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: scale(1.1) translateY(-2px);
    box-shadow: 0 12px 32px rgba(139, 0, 20, 0.4);
  }

  &:active {
    transform: scale(0.95);
  }

  i {
    font-size: 1.5rem;
  }

  .btn-text {
    font-size: 0.65rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  @media (max-width: 768px) {
    bottom: 1rem;
    right: 1rem;
    width: 56px;
    height: 56px;

    i {
      font-size: 1.3rem;
    }

    .btn-text {
      font-size: 0.6rem;
    }
  }
}

// Animações
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}
</style>

