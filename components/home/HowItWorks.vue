<template>
  <section class="how-it-works">
    <div class="container">
      <div class="section-header">
        <span class="section-badge">Processo Simples</span>
        <h2>Como Funciona</h2>
        <p class="section-description">
          Do seu pedido até a sua casa, garantimos a melhor experiência em cada etapa
        </p>
      </div>

      <div class="steps">
        <!-- Etapa 1 -->
        <div class="step" data-step="1">
          <div class="step-number">01</div>
          <div class="icon-wrapper">
            <i class="fas fa-search"></i>
          </div>
          <h3>Escolha seus Cupcakes</h3>
          <p>Navegue pelo nosso cardápio completo e selecione seus sabores favoritos. Temos opções para todos os gostos!</p>
          <div class="step-arrow">
            <i class="fas fa-arrow-right"></i>
          </div>
        </div>

        <!-- Etapa 2 -->
        <div class="step" data-step="2">
          <div class="step-number">02</div>
          <div class="icon-wrapper">
            <i class="fas fa-heart"></i>
          </div>
          <h3>Preparamos com Carinho</h3>
          <p>Nossa equipe prepara cada cupcake artesanalmente, com ingredientes frescos e muita dedicação.</p>
          <div class="step-arrow">
            <i class="fas fa-arrow-right"></i>
          </div>
        </div>

        <!-- Etapa 3 -->
        <div class="step" data-step="3">
          <div class="step-number">03</div>
          <div class="icon-wrapper">
            <i class="fas fa-truck"></i>
          </div>
          <h3>Entregamos no seu Endereço</h3>
          <p>Seu pedido chega fresquinho e bem embalado, direto na sua casa ou onde você preferir receber.</p>
        </div>
      </div>

      <!-- CTA -->
      <div class="cta-wrapper">
        <NuxtLink to="/products" class="btn-start">
          <i class="fas fa-play-circle"></i>
          Começar Agora
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.how-it-works {
  padding: 8rem 2rem;
  background: linear-gradient(135deg, #FBE9E7 0%, #E9DFD7 100%);
  position: relative;
  overflow: hidden;

  // Background decorativo
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(139, 0, 20, 0.05) 0%, transparent 70%);
    z-index: 0;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -40%;
    left: -15%;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(211, 47, 47, 0.05) 0%, transparent 70%);
    z-index: 0;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }
}

// Section Header
.section-header {
  text-align: center;
  margin-bottom: 5rem;
  animation: fadeInUp 0.8s ease-out;

  .section-badge {
    display: inline-block;
    background: linear-gradient(45deg, var(--primary) 0%, var(--secondary) 100%);
    color: white;
    padding: 0.5rem 1.5rem;
    border-radius: 50px;
    font-weight: 600;
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 4px 12px rgba(139, 0, 20, 0.2);
    letter-spacing: 0.5px;
  }

  h2 {
    font-size: 3rem;
    color: var(--primary);
    margin-bottom: 1.5rem;
    font-weight: 800;
    line-height: 1.2;
  }

  .section-description {
    font-size: 1.2rem;
    color: #666;
    max-width: 700px;
    margin: 0 auto;
    line-height: 1.6;
  }
}

// Steps Grid
.steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3rem;
  margin-bottom: 4rem;
  position: relative;
}

// Individual Step
.step {
  background: white;
  padding: 3rem 2rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transition: all 0.4s ease;
  position: relative;
  overflow: visible;
  animation: fadeInUp 0.8s ease-out;
  animation-fill-mode: both;

  &[data-step="1"] { animation-delay: 0.1s; }
  &[data-step="2"] { animation-delay: 0.2s; }
  &[data-step="3"] { animation-delay: 0.3s; }

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(139, 0, 20, 0.15);

    .icon-wrapper {
      transform: scale(1.1) rotateY(360deg);
    }

    .step-number {
      transform: scale(1.1);
    }
  }

  // Step Number
  .step-number {
    position: absolute;
    top: -20px;
    left: 2rem;
    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
    color: white;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    font-weight: 800;
    box-shadow: 0 4px 12px rgba(139, 0, 20, 0.3);
    transition: transform 0.3s ease;
    z-index: 2;
  }

  // Icon Wrapper
  .icon-wrapper {
    width: 90px;
    height: 90px;
    margin: 1.5rem auto 2rem;
    background: linear-gradient(135deg, #FBE9E7 0%, #FFE5E5 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.5s ease;
    box-shadow: 0 4px 15px rgba(139, 0, 20, 0.1);

    i {
      font-size: 2.5rem;
      color: var(--primary);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
    }
  }

  // Title
  h3 {
    font-size: 1.5rem;
    color: var(--primary);
    margin-bottom: 1rem;
    font-weight: 700;
    line-height: 1.3;
  }

  // Description
  p {
    font-size: 1rem;
    color: #666;
    line-height: 1.6;
    margin: 0;
  }

  // Arrow between steps
  .step-arrow {
    position: absolute;
    top: 50%;
    right: -3rem;
    transform: translateY(-50%);
    font-size: 2rem;
    color: var(--primary);
    opacity: 0.3;
    z-index: 1;

    i {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
      animation: slideRight 2s ease-in-out infinite;
    }
  }

  &[data-step="3"] .step-arrow {
    display: none; // Hide arrow on last step
  }
}

// CTA Button
.cta-wrapper {
  text-align: center;
  margin-top: 4rem;
  animation: fadeInUp 0.8s ease-out 0.4s;
  animation-fill-mode: both;

  .btn-start {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1.25rem 3rem;
    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
    color: white;
    text-decoration: none;
    border-radius: 50px;
    font-size: 1.2rem;
    font-weight: 700;
    transition: all 0.3s ease;
    box-shadow: 0 6px 20px rgba(139, 0, 20, 0.3);
    border: none;
    cursor: pointer;

    i {
      font-size: 1.3rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
      vertical-align: middle;
      transition: transform 0.3s ease;
    }

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 30px rgba(139, 0, 20, 0.4);

      i {
        transform: scale(1.2);
      }
    }

    &:active {
      transform: translateY(-1px);
    }
  }
}

// Animations
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideRight {
  0%, 100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(10px);
  }
}

// Responsive Design
@media (max-width: 1024px) {
  .how-it-works {
    padding: 6rem 2rem;
  }

  .section-header {
    h2 {
      font-size: 2.5rem;
    }

    .section-description {
      font-size: 1.1rem;
    }
  }

  .steps {
    gap: 2rem;
  }

  .step {
    .step-arrow {
      right: -2rem;
      font-size: 1.5rem;
    }
  }
}

@media (max-width: 768px) {
  .how-it-works {
    padding: 5rem 1.5rem;

    &::before,
    &::after {
      display: none;
    }
  }

  .section-header {
    margin-bottom: 3rem;

    h2 {
      font-size: 2rem;
    }

    .section-description {
      font-size: 1rem;
    }
  }

  .steps {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .step {
    padding: 2.5rem 1.5rem;

    .step-arrow {
      display: none !important; // Hide all arrows on mobile
    }

    // Add vertical arrow after each step (except last)
    &[data-step="1"]::after,
    &[data-step="2"]::after {
      content: '\f063'; // fa-arrow-down
      font-family: "Font Awesome 6 Free";
      font-weight: 900;
      position: absolute;
      bottom: -2.5rem;
      left: 50%;
      transform: translateX(-50%);
      font-size: 2rem;
      color: var(--primary);
      opacity: 0.3;
      animation: slideDown 2s ease-in-out infinite;
    }

    h3 {
      font-size: 1.3rem;
    }

    p {
      font-size: 0.95rem;
    }

    .icon-wrapper {
      width: 80px;
      height: 80px;

      i {
        font-size: 2rem;
      }
    }
  }

  .cta-wrapper {
    .btn-start {
      padding: 1.125rem 2.5rem;
      font-size: 1.1rem;
    }
  }
}

@keyframes slideDown {
  0%, 100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(10px);
  }
}
</style> 