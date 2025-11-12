<template>
  <div class="freight-calculator">
    <h2>
      <i class="fas fa-shipping-fast"></i>
      Método de Entrega
    </h2>

    <!-- Se não tem endereço selecionado -->
    <div v-if="!addressSelected" class="no-address-warning">
      <i class="fas fa-info-circle"></i>
      <p>Selecione um endereço para calcular o frete</p>
    </div>

    <!-- Opções de entrega -->
    <div v-else class="delivery-options">
      <div 
        v-for="option in deliveryOptions"
        :key="option.value"
        class="delivery-option"
        :class="{ selected: selectedMethod === option.value, disabled: option.disabled }"
        @click="!option.disabled && selectMethod(option)"
      >
        <div class="option-header">
          <i :class="option.icon"></i>
          <div class="option-info">
            <h4>{{ option.name }}</h4>
            <p v-if="option.estimatedDays">
              {{ option.estimatedDays }}
            </p>
            <p v-else-if="option.description" class="description">
              {{ option.description }}
            </p>
          </div>
        </div>
        <div class="option-price">
          <span v-if="option.price === 0" class="free">GRÁTIS</span>
          <span v-else>R$ {{ option.price.toFixed(2) }}</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

const props = defineProps<{
  addressSelected: boolean
  cep?: string
  subtotal: number
}>()

const emit = defineEmits<{
  (e: 'update:method', method: string): void
  (e: 'update:fee', fee: number): void
  (e: 'update:estimatedDays', days: number): void
}>()

const selectedMethod = ref<string | null>(null)

// Opções de entrega (pode ser dinâmico baseado no CEP)
const deliveryOptions = computed(() => [
  {
    value: 'PICKUP',
    name: 'Retirar na Loja',
    icon: 'fas fa-store',
    description: 'Retire seu pedido em nossa loja',
    price: 0,
    estimatedDays: null,
    disabled: false,
  },
  {
    value: 'DELIVERY',
    name: 'Entrega Local',
    icon: 'fas fa-motorcycle',
    estimatedDays: 'Entrega em 1-2 dias úteis',
    price: calculateDeliveryFee(),
    disabled: false,
  },
  {
    value: 'PAC',
    name: 'PAC (Correios)',
    icon: 'fas fa-box',
    estimatedDays: 'Entrega em 5-7 dias úteis',
    price: 15.00,
    disabled: false,
  },
  {
    value: 'SEDEX',
    name: 'SEDEX (Correios)',
    icon: 'fas fa-plane',
    estimatedDays: 'Entrega em 2-3 dias úteis',
    price: 25.00,
    disabled: false,
  },
])

// Cálculo de frete local (pode ser baseado em tabela ou API)
function calculateDeliveryFee(): number {
  // Exemplo: frete grátis acima de R$ 100
  if (props.subtotal >= 100) {
    return 0
  }
  
  // Valor fixo ou pode ser calculado por CEP
  return 10.00
}

function selectMethod(option: any) {
  selectedMethod.value = option.value
  emit('update:method', option.value)
  emit('update:fee', option.price)
  
  // Extrair dias estimados do texto
  const daysMatch = option.estimatedDays?.match(/(\d+)-?(\d+)?/)
  if (daysMatch) {
    const maxDays = parseInt(daysMatch[2] || daysMatch[1])
    emit('update:estimatedDays', maxDays)
  }
}


// Auto-selecionar método de entrega mais barato quando endereço é selecionado
watch(() => props.addressSelected, (selected) => {
  if (selected && !selectedMethod.value) {
    // Auto-selecionar retirada na loja (grátis)
    const pickupOption = deliveryOptions.value[0]
    selectMethod(pickupOption)
  }
})
</script>

<style lang="scss" scoped>
.freight-calculator {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);

  h2 {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
    color: var(--primary);
    font-size: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #f0f0f0;

    i {
      font-size: 1.3rem;
    }
  }
}

.no-address-warning {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 8px;
  color: #856404;

  i {
    font-size: 1.5rem;
  }

  p {
    margin: 0;
    font-weight: 500;
  }
}

.delivery-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.delivery-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(.disabled) {
    border-color: var(--primary);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }

  &.selected {
    border-color: var(--primary);
    background: linear-gradient(135deg, #fff5f8 0%, #ffffff 100%);
    box-shadow: 0 4px 12px rgba(139, 0, 20, 0.15);
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .option-header {
    display: flex;
    align-items: center;
    gap: 1rem;

    i {
      font-size: 1.8rem;
      color: var(--primary);
      width: 40px;
      text-align: center;
    }

    .option-info {
      h4 {
        margin: 0 0 0.25rem 0;
        font-size: 1.1rem;
        color: #333;
      }

      p {
        margin: 0;
        font-size: 0.9rem;
        color: #666;

        &.description {
          font-style: italic;
        }
      }
    }
  }

  .option-price {
    font-size: 1.3rem;
    font-weight: 700;
    color: var(--primary);

    .free {
      color: #27ae60;
      font-weight: 800;
    }
  }
}


@media (max-width: 768px) {
  .delivery-option {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;

    .option-price {
      align-self: flex-end;
    }
  }
}
</style>

