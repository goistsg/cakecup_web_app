<template>
  <section class="cta">
    <div class="cta-content">
      <h2>Pronto para experimentar?</h2>
      <p>Faça seu pedido agora e surpreenda-se com nossos sabores</p>
      <NuxtLink to="/products/" class="cta-button">
        Fazer Pedido
      </NuxtLink>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use 'sass:color' as color;

.cta {
  padding: 6rem 2rem;
  background: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/home/cakecups_action.jpg');
  background-size: cover;
  background-position: center;
  text-align: center;
  color: white;

  .cta-content {
    max-width: 600px;
    margin: 0 auto;

    h2 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    p {
      margin-bottom: 2rem;
    }

    .cta-button {
      padding: 1rem 2rem;
      background-color: var(--primary);
      color: white;
      border-radius: 30px;
      text-decoration: none;
      font-weight: bold;
      transition: background-color 0.3s;

      &:hover {
        box-shadow: 0 4px 16px rgba(255, 105, 180, 0.4);
      }
    }
  }
}
</style> 