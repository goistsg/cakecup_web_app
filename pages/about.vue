<template>
  <div class="about-page">
    <!-- Hero Section com Imagem -->
    <section class="hero-section">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1>
          <i class="fas fa-heart"></i>
          Sobre a CakeCup
        </h1>
        <p class="hero-subtitle">Adoçando momentos desde 2025</p>
      </div>
    </section>

    <!-- Nossa História -->
    <section class="historia-section">
      <div class="container">
        <div class="section-header">
          <span class="section-badge">Nossa Jornada</span>
          <h2>Uma História Doce</h2>
          <p class="section-description">
            Fundada em 2025, a CakeCup nasceu da paixão por criar momentos doces e especiais. 
            Nossa jornada começou em uma pequena cozinha familiar e cresceu para se tornar uma 
            referência em bolos artesanais e cupcakes personalizados.
          </p>
        </div>

        <!-- Cards de Valores -->
        <div class="valores-grid">
          <div class="valor-card" data-aos="fade-up" data-aos-delay="0">
            <div class="card-icon">
              <i class="fas fa-bullseye"></i>
            </div>
            <h3>Missão</h3>
            <p>Adoçar a vida das pessoas com produtos artesanais de qualidade, criando momentos memoráveis em cada ocasião especial.</p>
          </div>

          <div class="valor-card" data-aos="fade-up" data-aos-delay="100">
            <div class="card-icon">
              <i class="fas fa-eye"></i>
            </div>
            <h3>Visão</h3>
            <p>Ser reconhecida como referência em confeitaria artesanal, inovando constantemente e mantendo a qualidade que nos destaca.</p>
          </div>

          <div class="valor-card" data-aos="fade-up" data-aos-delay="200">
            <div class="card-icon">
              <i class="fas fa-star"></i>
            </div>
            <h3>Valores</h3>
            <ul class="valores-lista">
              <li><i class="fas fa-check-circle"></i> Qualidade sem compromissos</li>
              <li><i class="fas fa-check-circle"></i> Atendimento personalizado</li>
              <li><i class="fas fa-check-circle"></i> Inovação constante</li>
              <li><i class="fas fa-check-circle"></i> Compromisso com o cliente</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Diferenciais -->
    <section class="diferenciais-section">
      <div class="container">
        <div class="section-header">
          <span class="section-badge">Por Que Escolher a CakeCup?</span>
          <h2>Nossos Diferenciais</h2>
        </div>

        <div class="diferenciais-grid">
          <div class="diferencial-card" data-aos="zoom-in" data-aos-delay="0">
            <div class="diferencial-icon">
              <i class="fas fa-leaf"></i>
            </div>
            <h3>Ingredientes Selecionados</h3>
            <p>Utilizamos apenas ingredientes de alta qualidade em nossas receitas, garantindo sabor e frescor em cada mordida.</p>
          </div>

          <div class="diferencial-card" data-aos="zoom-in" data-aos-delay="100">
            <div class="diferencial-icon">
              <i class="fas fa-user-chef"></i>
            </div>
            <h3>Equipe Especializada</h3>
            <p>Nossa equipe é formada por profissionais apaixonados e qualificados, dedicados à arte da confeitaria.</p>
          </div>

          <div class="diferencial-card" data-aos="zoom-in" data-aos-delay="200">
            <div class="diferencial-icon">
              <i class="fas fa-palette"></i>
            </div>
            <h3>Personalização</h3>
            <p>Cada produto é único e personalizado de acordo com seu desejo, transformando suas ideias em realidade.</p>
          </div>

          <div class="diferencial-card" data-aos="zoom-in" data-aos-delay="300">
            <div class="diferencial-icon">
              <i class="fas fa-shipping-fast"></i>
            </div>
            <h3>Entrega Rápida</h3>
            <p>Garantimos a entrega pontual dos seus pedidos, mantendo a qualidade e frescor dos produtos.</p>
          </div>

          <div class="diferencial-card" data-aos="zoom-in" data-aos-delay="400">
            <div class="diferencial-icon">
              <i class="fas fa-award"></i>
            </div>
            <h3>Qualidade Garantida</h3>
            <p>Produtos testados e aprovados por centenas de clientes satisfeitos em toda a cidade.</p>
          </div>

          <div class="diferencial-card" data-aos="zoom-in" data-aos-delay="500">
            <div class="diferencial-icon">
              <i class="fas fa-headset"></i>
            </div>
            <h3>Suporte Personalizado</h3>
            <p>Atendimento dedicado para te ajudar a escolher o produto perfeito para sua ocasião especial.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2>Pronto para adoçar seu dia?</h2>
          <p>Conheça nossos produtos e faça seu pedido agora mesmo!</p>
          <div class="cta-buttons">
            <NuxtLink to="/products" class="btn-primary">
              <i class="fas fa-shopping-bag"></i>
              Ver Produtos
            </NuxtLink>
            <NuxtLink to="/contact" class="btn-secondary">
              <i class="fas fa-phone-alt"></i>
              Entre em Contato
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Metadados da página
useHead({
  title: 'Sobre - CakeCup',
  meta: [
    { name: 'description', content: 'Conheça a história da CakeCup, nossa missão, visão e valores.' }
  ]
})
</script>

<style lang="scss" scoped>
.about-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #FBE9E7 0%, #E9DFD7 100%);
}

// Hero Section
.hero-section {
  position: relative;
  height: 70vh;
  min-height: 500px;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
              url('/about/bakery.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  .hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(139, 0, 20, 0.8) 0%, rgba(211, 47, 47, 0.6) 100%);
    z-index: 1;
  }

  .hero-content {
    position: relative;
    z-index: 2;
    text-align: center;
    color: white;
    animation: fadeInUp 1s ease-out;

    h1 {
      font-size: 4rem;
      font-weight: 800;
      margin-bottom: 1rem;
      text-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;

      i {
        font-size: 3.5rem;
        animation: pulse 2s infinite;
      }
    }

    .hero-subtitle {
      font-size: 1.5rem;
      font-weight: 300;
      letter-spacing: 2px;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }
  }
}

// Container
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 4rem 2rem;
}

// Section Header
.section-header {
  text-align: center;
  margin-bottom: 4rem;
  animation: fadeInUp 0.8s ease-out;

  .section-badge {
    display: inline-block;
    padding: 0.5rem 1.5rem;
    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
    color: white;
    border-radius: 50px;
    font-size: 0.9rem;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 1.5rem;
    box-shadow: 0 4px 12px rgba(139, 0, 20, 0.3);
  }

  h2 {
    font-size: 3rem;
    color: var(--primary);
    margin-bottom: 1.5rem;
    font-weight: 800;
  }

  .section-description {
    font-size: 1.2rem;
    color: #666;
    max-width: 800px;
    margin: 0 auto;
    line-height: 1.8;
  }
}

// História Section
.historia-section {
  background: transparent;
}

// Valores Grid
.valores-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.valor-card {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
    transform: scaleX(0);
    transition: transform 0.4s ease;
  }

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 12px 40px rgba(139, 0, 20, 0.15);

    &::before {
      transform: scaleX(1);
    }

    .card-icon {
      transform: scale(1.1) rotate(5deg);
    }
  }

  .card-icon {
    width: 70px;
    height: 70px;
    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.5rem;
    transition: all 0.4s ease;

    i {
      font-size: 2rem;
      color: white;
    }
  }

  h3 {
    font-size: 1.5rem;
    color: var(--primary);
    margin-bottom: 1rem;
    font-weight: 700;
  }

  p {
    color: #666;
    line-height: 1.8;
    margin: 0;
  }

  .valores-lista {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 0;
      color: #666;
      font-weight: 500;
      border-bottom: 1px solid #f0f0f0;

      &:last-child {
        border-bottom: none;
      }

      i {
        color: var(--primary);
        font-size: 1.1rem;
      }
    }
  }
}

// Diferenciais Section
.diferenciais-section {
  background: white;
  padding: 4rem 0;
}

.diferenciais-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.diferencial-card {
  text-align: center;
  padding: 2.5rem 2rem;
  background: linear-gradient(135deg, #FBE9E7 0%, #E9DFD7 100%);
  border-radius: 20px;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: 0;
  }

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 12px 40px rgba(139, 0, 20, 0.2);

    &::before {
      opacity: 0.05;
    }

    .diferencial-icon {
      transform: scale(1.15) rotate(10deg);
      background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);

      i {
        color: white;
      }
    }
  }

  > * {
    position: relative;
    z-index: 1;
  }

  .diferencial-icon {
    width: 90px;
    height: 90px;
    background: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.5rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    transition: all 0.4s ease;

    i {
      font-size: 2.5rem;
      color: var(--primary);
      transition: color 0.4s ease;
    }
  }

  h3 {
    font-size: 1.3rem;
    color: var(--primary);
    margin-bottom: 1rem;
    font-weight: 700;
  }

  p {
    color: #666;
    line-height: 1.8;
    margin: 0;
  }
}

// CTA Section
.cta-section {
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  padding: 5rem 0;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="rgba(255,255,255,0.1)" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,165.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>') no-repeat bottom;
    background-size: cover;
    opacity: 0.5;
  }

  .cta-content {
    position: relative;
    z-index: 1;
    animation: fadeInUp 0.8s ease-out;

    h2 {
      font-size: 2.5rem;
      color: white;
      margin-bottom: 1rem;
      font-weight: 800;
    }

    p {
      font-size: 1.2rem;
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 2.5rem;
    }

    .cta-buttons {
      display: flex;
      gap: 1.5rem;
      justify-content: center;
      flex-wrap: wrap;

      .btn-primary,
      .btn-secondary {
        padding: 1.25rem 2.5rem;
        border-radius: 50px;
        font-size: 1.1rem;
        font-weight: 600;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 0.75rem;
        transition: all 0.3s ease;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);

        i {
          font-size: 1.2rem;
        }

        &:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
        }
      }

      .btn-primary {
        background: white;
        color: var(--primary);
      }

      .btn-secondary {
        background: transparent;
        color: white;
        border: 2px solid white;
      }
    }
  }
}

// Animations
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

// Responsive
@media (max-width: 1024px) {
  .container {
    padding: 3rem 1.5rem;
  }

  .section-header h2 {
    font-size: 2.5rem;
  }

  .diferenciais-grid,
  .valores-grid {
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  }
}

@media (max-width: 768px) {
  .hero-section {
    height: 60vh;
    background-attachment: scroll;

    .hero-content {
      h1 {
        font-size: 2.5rem;

        i {
          font-size: 2rem;
        }
      }

      .hero-subtitle {
        font-size: 1.1rem;
      }
    }
  }

  .container {
    padding: 2rem 1rem;
  }

  .section-header {
    h2 {
      font-size: 2rem;
    }

    .section-description {
      font-size: 1rem;
    }
  }

  .diferenciais-grid,
  .valores-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .cta-section {
    padding: 3rem 0;

    .cta-content {
      h2 {
        font-size: 2rem;
      }

      p {
        font-size: 1rem;
      }

      .cta-buttons {
        flex-direction: column;
        align-items: stretch;

        .btn-primary,
        .btn-secondary {
          width: 100%;
          justify-content: center;
        }
      }
    }
  }
}
</style>
