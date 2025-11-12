<template>
  <div class="payment-selector">
    <h2>
      <i class="fas fa-credit-card"></i>
      Forma de Pagamento
    </h2>

    <div class="payment-methods">
      <div 
        v-for="method in paymentMethods"
        :key="method.value"
        class="payment-method"
        :class="{ selected: selectedMethod === method.value }"
        @click="selectMethod(method.value)"
      >
        <div class="method-icon">
          <i :class="method.icon"></i>
        </div>
        <div class="method-info">
          <h4>{{ method.name }}</h4>
          <p>{{ method.description }}</p>
        </div>
        <div v-if="selectedMethod === method.value" class="selected-indicator">
          <i class="fas fa-check-circle"></i>
        </div>
      </div>
    </div>

    <!-- Informações extras baseadas no método selecionado -->
    <div v-if="selectedMethod" class="payment-info">
      <div v-if="selectedMethod === 'PIX'" class="pix-info">
        <i class="fas fa-info-circle"></i>
        <p>
          <strong>QR Code PIX será gerado</strong> após a confirmação do pedido.
          Você terá 15 minutos para realizar o pagamento.
        </p>
      </div>

      <div v-if="selectedMethod === 'CASH'" class="cash-info">
        <i class="fas fa-info-circle"></i>
        <p>
          <strong>Pagamento na entrega.</strong>
          Por favor, tenha o valor exato ou próximo para facilitar.
        </p>
      </div>

      <div v-if="selectedMethod === 'BILL'" class="bill-info">
        <i class="fas fa-info-circle"></i>
        <p>
          <strong>Boleto bancário</strong> será enviado por e-mail após a confirmação do pedido.
          Prazo de pagamento: 3 dias úteis.
        </p>
      </div>

      <div v-if="selectedMethod === 'CREDIT_CARD' || selectedMethod === 'DEBIT_CARD'" class="card-info">
        <i class="fas fa-info-circle"></i>
        <p>
          <strong>Pagamento seguro</strong> processado via gateway de pagamento.
          Você será redirecionado para finalizar a compra.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { PaymentMethod } from '~/types/api'

const emit = defineEmits<{
  (e: 'update:method', method: PaymentMethod): void
}>()

const selectedMethod = ref<PaymentMethod | null>(null)

const paymentMethods = [
  {
    value: 'PIX' as PaymentMethod,
    name: 'PIX',
    description: 'Pagamento instantâneo via QR Code',
    icon: 'fas fa-qrcode',
  },
  {
    value: 'CREDIT_CARD' as PaymentMethod,
    name: 'Cartão de Crédito',
    description: 'Parcelamento em até 3x sem juros',
    icon: 'fas fa-credit-card',
  },
  {
    value: 'DEBIT_CARD' as PaymentMethod,
    name: 'Cartão de Débito',
    description: 'Débito à vista',
    icon: 'far fa-credit-card',
  },
  {
    value: 'CASH' as PaymentMethod,
    name: 'Dinheiro',
    description: 'Pagamento na entrega',
    icon: 'fas fa-money-bill-wave',
  },
  {
    value: 'BILL' as PaymentMethod,
    name: 'Boleto Bancário',
    description: 'Vencimento em 3 dias úteis',
    icon: 'fas fa-barcode',
  },
]

function selectMethod(method: PaymentMethod) {
  selectedMethod.value = method
  emit('update:method', method)
}
</script>

<style lang="scss" scoped>
.payment-selector {
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

.payment-methods {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1rem;
}

.payment-method {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--primary);
    transform: translateY(-4px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.12);
  }

  &.selected {
    border-color: var(--primary);
    background: linear-gradient(135deg, #fff5f8 0%, #ffffff 100%);
    box-shadow: 0 4px 16px rgba(139, 0, 20, 0.2);
  }

  .method-icon {
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #fff5f8 0%, #ffffff 100%);
    border-radius: 12px;
    flex-shrink: 0;

    i {
      font-size: 1.8rem;
      color: var(--primary);
    }
  }

  .method-info {
    flex: 1;

    h4 {
      margin: 0 0 0.25rem 0;
      font-size: 1.05rem;
      color: #333;
    }

    p {
      margin: 0;
      font-size: 0.85rem;
      color: #666;
      line-height: 1.4;
    }
  }

  .selected-indicator {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    color: var(--primary);
    font-size: 1.3rem;
    animation: checkPop 0.3s ease-out;
  }
}

@keyframes checkPop {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.payment-info {
  margin-top: 1.5rem;
  padding: 1.5rem;
  border-radius: 12px;
  animation: slideDown 0.3s ease-out;

  .pix-info {
    background: linear-gradient(135deg, #e8f5e9 0%, #ffffff 100%);
    border: 2px solid #66bb6a;
  }

  .cash-info {
    background: linear-gradient(135deg, #fff3e0 0%, #ffffff 100%);
    border: 2px solid #ffa726;
  }

  .bill-info {
    background: linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%);
    border: 2px solid #42a5f5;
  }

  .card-info {
    background: linear-gradient(135deg, #f3e5f5 0%, #ffffff 100%);
    border: 2px solid #ab47bc;
  }

  > div {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1.5rem;
    border-radius: 12px;

    i {
      font-size: 1.5rem;
      flex-shrink: 0;
      margin-top: 0.25rem;
    }

    p {
      margin: 0;
      line-height: 1.6;
      color: #333;

      strong {
        display: block;
        margin-bottom: 0.5rem;
        font-size: 1.05rem;
      }
    }
  }

  .pix-info {
    i { color: #388e3c; }
  }

  .cash-info {
    i { color: #ef6c00; }
  }

  .bill-info {
    i { color: #1976d2; }
  }

  .card-info {
    i { color: #7b1fa2; }
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 1024px) {
  .payment-methods {
    grid-template-columns: 1fr;
  }

  .payment-method {
    .method-icon {
      width: 40px;
      height: 40px;

      i {
        font-size: 1.5rem;
      }
    }
  }
}

@media (max-width: 768px) {
  .payment-selector {
    padding: 1.5rem;
  }

  .payment-method {
    padding: 1rem;
  }

  .payment-info > div {
    padding: 1rem;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}
</style>

