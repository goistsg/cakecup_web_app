<template>
  <div class="sobre-page">
    <header class="page-header">
      <div class="header-content">
        <h1>Sobre a CakeCup</h1>
      </div>
    </header>

    <section class="nossa-historia">
      <div class="content-wrapper">
        <h2>Nossa História</h2>
        <p>Fundada em 2025, a CakeCup nasceu da paixão por criar momentos doces e especiais. Nossa jornada começou em uma pequena cozinha familiar e cresceu para se tornar uma referência em bolos artesanais e cupcakes personalizados.</p>
        
        <div class="valores-grid">
          <div class="valor-card">
            <h3>Missão</h3>
            <p>Adoçar a vida das pessoas com produtos artesanais de qualidade, criando momentos memoráveis em cada ocasião especial.</p>
          </div>
          
          <div class="valor-card">
            <h3>Visão</h3>
            <p>Ser reconhecida como referência em confeitaria artesanal, inovando constantemente e mantendo a qualidade que nos destaca.</p>
          </div>
          
          <div class="valor-card">
            <h3>Valores</h3>
            <ul>
              <li>Qualidade sem compromissos</li>
              <li>Atendimento personalizado</li>
              <li>Inovação constante</li>
              <li>Compromisso com o cliente</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="diferenciais">
      <div class="content-wrapper">
        <h2>Nossos Diferenciais</h2>
        <div class="diferenciais-grid">
          <div class="diferencial-item">
            <i class="icon">🧁</i>
            <h3>Ingredientes Selecionados</h3>
            <p>Utilizamos apenas ingredientes de alta qualidade em nossas receitas.</p>
          </div>
          
          <div class="diferencial-item">
            <i class="icon">👨‍🍳</i>
            <h3>Equipe Especializada</h3>
            <p>Nossa equipe é formada por profissionais apaixonados e qualificados.</p>
          </div>
          
          <div class="diferencial-item">
            <i class="icon">🎨</i>
            <h3>Personalização</h3>
            <p>Cada produto é único e personalizado de acordo com seu desejo.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.sobre-page {
  position: relative;

  .page-header {
    position: relative;
    background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
                url('/about/bakery.jpg');
    background-size: cover;
    background-position: center;
    color: white;
    padding: 12rem 2rem;
    text-align: center;
    min-height: 60vh;
    
    .header-content {
      position: absolute;
      top: 20%;
      left: 50%;
      transform: translateX(-50%);
      z-index: 2;
      max-width: 800px;
      
      h1 {
        font-size: 3.5rem;
        margin: 0;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
      }
    }
  }

  .nossa-historia {
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(255, 255, 255, 0.9);
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    max-width: 1200px;
    width: 90%;
    z-index: 3;
  }

  .content-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    position: relative;
    z-index: 1;
  }

  section {
    margin: 4rem 0;

    h2 {
      text-align: center;
      margin-bottom: 2rem;
      color: var(--primary-color);
    }
  }

  .valores-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 3rem;

    .valor-card {
      padding: 2rem;
      background: rgba(248, 249, 250, 0.95);
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      backdrop-filter: blur(5px);

      h3 {
        color: var(--primary-color);
        margin-bottom: 1rem;
      }

      ul {
        list-style-type: none;
        padding: 0;

        li {
          margin-bottom: 0.5rem;
          &:before {
            content: "•";
            color: var(--primary-color);
            margin-right: 0.5rem;
          }
        }
      }
    }
  }

  .diferenciais-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    text-align: center;

    .diferencial-item {
      padding: 2rem;

      .icon {
        font-size: 3rem;
        margin-bottom: 1rem;
        display: block;
      }

      h3 {
        color: var(--primary-color);
        margin-bottom: 1rem;
      }
    }
  }
}

@media (max-width: 768px) {
  .sobre-page {
    .page-header {
      padding: 8rem 1rem;
      min-height: 40vh;
      
      .header-content {
        top: 15%;
        
        h1 {
          font-size: 2.5rem;
        }
      }
    }

    .nossa-historia {
      top: 60%;
      padding: 1rem;
    }

    .valores-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style> 