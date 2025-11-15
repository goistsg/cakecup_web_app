<template>
  <div class="password-strength">
    <div class="strength-requirements">
      <div 
        class="requirement-item"
        :class="{ met: hasMinLength }"
      >
        <i :class="hasMinLength ? 'fas fa-check-circle' : 'far fa-circle'"></i>
        <span>Mínimo 8 caracteres</span>
      </div>
      
      <div 
        class="requirement-item"
        :class="{ met: hasUppercase }"
      >
        <i :class="hasUppercase ? 'fas fa-check-circle' : 'far fa-circle'"></i>
        <span>Uma letra maiúscula</span>
      </div>
      
      <div 
        class="requirement-item"
        :class="{ met: hasLowercase }"
      >
        <i :class="hasLowercase ? 'fas fa-check-circle' : 'far fa-circle'"></i>
        <span>Uma letra minúscula</span>
      </div>
      
      <div 
        class="requirement-item"
        :class="{ met: hasNumberOrSpecial }"
      >
        <i :class="hasNumberOrSpecial ? 'fas fa-check-circle' : 'far fa-circle'"></i>
        <span>Um número ou caractere especial</span>
      </div>
    </div>
    
    <div class="strength-bar">
      <div class="strength-bar-fill" :style="{ width: strengthPercentage + '%' }" :class="strengthClass"></div>
    </div>
    
    <div class="strength-label" :class="strengthClass">
      {{ strengthLabel }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  password: string
}>()

const hasMinLength = computed(() => props.password.length >= 8)
const hasUppercase = computed(() => /[A-Z]/.test(props.password))
const hasLowercase = computed(() => /[a-z]/.test(props.password))
const hasNumberOrSpecial = computed(() => /[\d\W]/.test(props.password))

const isValid = computed(() => {
  return hasMinLength.value && hasUppercase.value && hasLowercase.value && hasNumberOrSpecial.value
})

const requirementsMet = computed(() => {
  let count = 0
  if (hasMinLength.value) count++
  if (hasUppercase.value) count++
  if (hasLowercase.value) count++
  if (hasNumberOrSpecial.value) count++
  return count
})

const strengthPercentage = computed(() => {
  return (requirementsMet.value / 4) * 100
})

const strengthClass = computed(() => {
  const met = requirementsMet.value
  if (met === 0) return 'strength-none'
  if (met === 1) return 'strength-weak'
  if (met === 2) return 'strength-fair'
  if (met === 3) return 'strength-good'
  return 'strength-strong'
})

const strengthLabel = computed(() => {
  if (props.password.length === 0) return ''
  const met = requirementsMet.value
  if (met === 1) return 'Muito fraca'
  if (met === 2) return 'Fraca'
  if (met === 3) return 'Boa'
  if (met === 4) return 'Forte'
  return ''
})

defineExpose({
  isValid
})
</script>

<style lang="scss" scoped>
.password-strength {
  margin-top: 0.75rem;
}

.strength-requirements {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.requirement-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-light);
  transition: all 0.3s ease;

  i {
    font-size: 1rem;
    color: #ccc;
    transition: all 0.3s ease;
  }

  &.met {
    color: #4CAF50;
    
    i {
      color: #4CAF50;
    }
  }
}

.strength-bar {
  width: 100%;
  height: 6px;
  background: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.strength-bar-fill {
  height: 100%;
  transition: all 0.3s ease;
  border-radius: 3px;
  
  &.strength-none {
    width: 0%;
  }
  
  &.strength-weak {
    background: #F44336;
  }
  
  &.strength-fair {
    background: #FF9800;
  }
  
  &.strength-good {
    background: #FFC107;
  }
  
  &.strength-strong {
    background: #4CAF50;
  }
}

.strength-label {
  font-size: 0.875rem;
  font-weight: 600;
  text-align: center;
  
  &.strength-weak {
    color: #F44336;
  }
  
  &.strength-fair {
    color: #FF9800;
  }
  
  &.strength-good {
    color: #FFC107;
  }
  
  &.strength-strong {
    color: #4CAF50;
  }
}
</style>

