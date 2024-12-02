<template>
  <section class="how-it-works">
    <h2>Como Funciona</h2>
    <div class="steps">
      <div class="step">
        <div class="icon">🎂</div>
        <h3>Escolha seu Cupcake</h3>
        <p>Navegue pelo nosso cardápio e escolha seu cupcake favorito</p>
      </div>
      <div class="step">
        <div class="icon">📅</div>
        <h3>Agende a Entrega</h3>
        <p>Selecione a data e horário que melhor te atende</p>
      </div>
      <div class="step">
        <div class="icon">🚚</div>
        <h3>Receba em Casa</h3>
        <p>Entregamos seu pedido fresquinho no conforto da sua casa</p>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.how-it-works {
  padding: 4rem 2rem;
  text-align: center;

  h2 {
    margin-bottom: 3rem;
  }

  .steps {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .step {
    padding: 2rem;

    .icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    h3 {
      margin-bottom: 1rem;
    }
  }
}
</style> 