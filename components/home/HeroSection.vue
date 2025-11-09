<template>
  <section class="hero">
    <div class="hero-content">
      <h1>Cupcakes Artesanais para Momentos Especiais</h1>
      <p>Descubra sabores únicos feitos com amor e dedicação</p>
      <NuxtLink to="/products/" class="cta-button">
        Ver Cardápio
      </NuxtLink>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use 'sass:color' as color;

.hero {
  min-height: 80vh;
  background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/home/cakecups.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;

  .hero-content {
    max-width: 800px;
    padding: 2rem;

    h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    p {
      font-size: 1.5rem;
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