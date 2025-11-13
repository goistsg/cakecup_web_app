<template>
  <div class="contact-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <h1>
          <i class="fas fa-comments"></i>
          Entre em Contato
        </h1>
        <p class="hero-subtitle">Estamos aqui para ajudar você!</p>
      </div>
    </section>

    <!-- Contact Info -->
    <section class="contact-section">
      <div class="container">
        <div class="section-header">
          <span class="section-badge">Fale Conosco</span>
          <h2>Como Podemos Te Ajudar?</h2>
          <p class="section-description">
            Entre em contato através de um dos nossos canais. 
            Nossa equipe está pronta para atender você!
          </p>
        </div>

        <!-- Contact Cards -->
        <div class="contact-grid">
          <!-- WhatsApp -->
          <a href="https://wa.me/5541999999999" target="_blank" class="contact-card whatsapp-card">
            <div class="card-icon">
              <i class="fab fa-whatsapp"></i>
            </div>
            <h3>WhatsApp</h3>
            <p class="contact-info">(41) 99999-9999</p>
            <p class="contact-description">Atendimento rápido e direto pelo WhatsApp</p>
            <div class="card-badge">
              <i class="fas fa-external-link-alt"></i>
              Clique para conversar
            </div>
          </a>

          <!-- Telefone -->
          <a href="tel:+554199999-9999" class="contact-card phone-card">
            <div class="card-icon">
              <i class="fas fa-phone-alt"></i>
            </div>
            <h3>Telefone</h3>
            <p class="contact-info">(41) 99999-9999</p>
            <p class="contact-description">Ligue para nós durante o horário comercial</p>
            <div class="card-badge">
              <i class="fas fa-clock"></i>
              Seg-Sex: 9h às 18h
            </div>
          </a>

          <!-- E-mail -->
          <a href="mailto:contato@cakecup.com.br" class="contact-card email-card">
            <div class="card-icon">
              <i class="fas fa-envelope"></i>
            </div>
            <h3>E-mail</h3>
            <p class="contact-info">contato@cakecup.com.br</p>
            <p class="contact-description">Envie sua mensagem que responderemos em breve</p>
            <div class="card-badge">
              <i class="fas fa-reply"></i>
              Resposta em até 24h
            </div>
          </a>

          <!-- Localização -->
          <div class="contact-card location-card">
            <div class="card-icon">
              <i class="fas fa-map-marker-alt"></i>
            </div>
            <h3>Localização</h3>
            <p class="contact-info">Rua das Delícias, 123</p>
            <p class="contact-description">Bairro Doce - São Paulo/SP<br>CEP: 01234-567</p>
            <div class="card-badge">
              <i class="fas fa-store"></i>
              Visite nossa loja
            </div>
          </div>
        </div>

        <!-- Social Media -->
        <div class="social-section">
          <h3>Siga-nos nas Redes Sociais</h3>
          <div class="social-links">
            <a href="https://instagram.com/cakecup" target="_blank" class="social-link instagram">
              <i class="fab fa-instagram"></i>
              <span>Instagram</span>
            </a>
            <a href="https://facebook.com/cakecup" target="_blank" class="social-link facebook">
              <i class="fab fa-facebook-f"></i>
              <span>Facebook</span>
            </a>
            <a href="https://wa.me/5541999999999" target="_blank" class="social-link whatsapp">
              <i class="fab fa-whatsapp"></i>
              <span>WhatsApp</span>
            </a>
            <a href="https://twitter.com/cakecup" target="_blank" class="social-link twitter">
              <i class="fab fa-twitter"></i>
              <span>Twitter</span>
            </a>
          </div>
        </div>

        <!-- Horário de Funcionamento -->
        <div class="horario-section">
          <div class="horario-card">
            <div class="horario-header">
              <i class="fas fa-clock"></i>
              <h3>Horário de Funcionamento</h3>
            </div>
            <div class="horario-grid">
              <div class="horario-item">
                <span class="dia">Segunda a Sexta</span>
                <span class="hora">09:00 - 18:00</span>
              </div>
              <div class="horario-item">
                <span class="dia">Sábado</span>
                <span class="hora">09:00 - 14:00</span>
              </div>
              <div class="horario-item">
                <span class="dia">Domingo</span>
                <span class="hora">Fechado</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <i class="fas fa-shopping-bag cta-icon"></i>
          <h2>Pronto para fazer seu pedido?</h2>
          <p>Explore nossos produtos e encontre o doce perfeito para sua ocasião especial!</p>
          <NuxtLink to="/products" class="btn-cta">
            <i class="fas fa-arrow-right"></i>
            Ver Produtos
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Metadados da página
useHead({
  title: 'Contato - CakeCup',
  meta: [
    { name: 'description', content: 'Entre em contato com a CakeCup. Estamos aqui para ajudar você!' }
  ]
})
</script>

<style lang="scss" scoped>
.contact-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #FBE9E7 0%, #E9DFD7 100%);
}

// Hero Section
.hero-section {
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  padding: 6rem 2rem;
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

  .hero-content {
    position: relative;
    z-index: 1;
    animation: fadeInUp 0.8s ease-out;

    h1 {
      font-size: 3.5rem;
      color: white;
      margin-bottom: 1rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      text-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

      i {
        font-size: 3rem;
        animation: pulse 2s infinite;
      }
    }

    .hero-subtitle {
      font-size: 1.3rem;
      color: rgba(255, 255, 255, 0.95);
      font-weight: 300;
      letter-spacing: 1px;
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
    max-width: 700px;
    margin: 0 auto;
    line-height: 1.8;
  }
}

// Contact Section
.contact-section {
  padding: 2rem 0;
}

// Contact Grid
.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.contact-card {
  background: white;
  border-radius: 20px;
  padding: 2.5rem 2rem;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.4s ease;
  text-decoration: none;
  color: inherit;
  display: block;
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
      transform: scale(1.15) rotate(10deg);
    }
  }

  .card-icon {
    width: 90px;
    height: 90px;
    margin: 0 auto 1.5rem;
    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 20px rgba(139, 0, 20, 0.2);
    transition: all 0.4s ease;

    i {
      font-size: 2.5rem;
      color: white;
    }
  }

  h3 {
    font-size: 1.5rem;
    color: var(--primary);
    margin-bottom: 1rem;
    font-weight: 700;
  }

  .contact-info {
    font-size: 1.2rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 1rem;
  }

  .contact-description {
    color: #666;
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }

  .card-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1.25rem;
    background: linear-gradient(135deg, #FBE9E7 0%, #E9DFD7 100%);
    border-radius: 50px;
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--primary);

    i {
      font-size: 0.85rem;
    }
  }
}

// Social Section
.social-section {
  text-align: center;
  padding: 4rem 0;
  margin: 4rem 0;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

  h3 {
    font-size: 2rem;
    color: var(--primary);
    margin-bottom: 2.5rem;
    font-weight: 700;
  }

  .social-links {
    display: flex;
    gap: 2rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .social-link {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    padding: 1.5rem 2rem;
    background: linear-gradient(135deg, #FBE9E7 0%, #E9DFD7 100%);
    border-radius: 16px;
    text-decoration: none;
    transition: all 0.3s ease;
    min-width: 140px;

    i {
      font-size: 2.5rem;
      transition: all 0.3s ease;
    }

    span {
      font-size: 1rem;
      font-weight: 600;
      transition: color 0.3s ease;
    }

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }

    &.instagram {
      i { color: #E1306C; }
      span { color: #E1306C; }
      &:hover { background: linear-gradient(135deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%); i, span { color: white; } }
    }

    &.facebook {
      i { color: #1877F2; }
      span { color: #1877F2; }
      &:hover { background: #1877F2; i, span { color: white; } }
    }

    &.whatsapp {
      i { color: #25D366; }
      span { color: #25D366; }
      &:hover { background: #25D366; i, span { color: white; } }
    }

    &.twitter {
      i { color: #1DA1F2; }
      span { color: #1DA1F2; }
      &:hover { background: #1DA1F2; i, span { color: white; } }
    }
  }
}

// Horário Section
.horario-section {
  margin-top: 4rem;
}

.horario-card {
  background: white;
  border-radius: 20px;
  padding: 3rem 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  max-width: 800px;
  margin: 0 auto;

  .horario-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 2.5rem;

    i {
      font-size: 2.5rem;
      color: var(--primary);
    }

    h3 {
      font-size: 2rem;
      color: var(--primary);
      margin: 0;
      font-weight: 700;
    }
  }

  .horario-grid {
    display: grid;
    gap: 1.5rem;
  }

  .horario-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    background: linear-gradient(135deg, #FBE9E7 0%, #E9DFD7 100%);
    border-radius: 12px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateX(5px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .dia {
      font-weight: 600;
      color: #333;
      font-size: 1.1rem;
    }

    .hora {
      font-weight: 700;
      color: var(--primary);
      font-size: 1.1rem;
    }
  }
}

// CTA Section
.cta-section {
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  padding: 5rem 0;
  text-align: center;
  margin-top: 4rem;

  .cta-content {
    animation: fadeInUp 0.8s ease-out;

    .cta-icon {
      font-size: 4rem;
      color: white;
      margin-bottom: 1.5rem;
      animation: bounce 2s infinite;
    }

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
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .btn-cta {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1.25rem 2.5rem;
      background: white;
      color: var(--primary);
      border-radius: 50px;
      font-size: 1.1rem;
      font-weight: 700;
      text-decoration: none;
      transition: all 0.3s ease;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);

      i {
        font-size: 1.2rem;
        transition: transform 0.3s ease;
      }

      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);

        i {
          transform: translateX(5px);
        }
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

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
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

  .contact-grid {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 4rem 1rem;

    .hero-content {
      h1 {
        font-size: 2.5rem;
        flex-direction: column;
        gap: 0.5rem;

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

  .contact-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .social-section {
    padding: 2rem 1rem;

    h3 {
      font-size: 1.5rem;
    }

    .social-links {
      gap: 1rem;

      .social-link {
        min-width: 120px;
        padding: 1rem 1.5rem;
      }
    }
  }

  .horario-card {
    padding: 2rem 1rem;

    .horario-header {
      flex-direction: column;
      gap: 0.75rem;

      i {
        font-size: 2rem;
      }

      h3 {
        font-size: 1.5rem;
        text-align: center;
      }
    }

    .horario-item {
      flex-direction: column;
      gap: 0.5rem;
      text-align: center;
    }
  }

  .cta-section {
    padding: 3rem 0;

    .cta-content {
      .cta-icon {
        font-size: 3rem;
      }

      h2 {
        font-size: 2rem;
      }

      p {
        font-size: 1rem;
      }

      .btn-cta {
        width: calc(100% - 2rem);
        justify-content: center;
      }
    }
  }
}
</style>
