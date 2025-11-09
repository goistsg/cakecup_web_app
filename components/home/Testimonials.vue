<template>
  <section class="testimonials">
    <h2>O que nossos clientes dizem</h2>
    <div class="testimonials-grid">
      <div v-for="testimonial in testimonials" :key="testimonial.id" class="testimonial-card">
        <div class="quote">"</div>
        <p>{{ testimonial.text }}</p>
        <div class="author">
          <img :src="testimonial.avatar" :alt="testimonial.name">
          <span>{{ testimonial.name }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const testimonials = [
  {
    id: 1,
    text: 'O melhor cupcake que já provei! Superou todas as expectativas.',
    name: 'Maria Silva',
    avatar: '/users/user_default.jpg'
  },
  {
    id: 2,
    text: 'Atendimento impecável e o cupcake estava maravilhoso!',
    name: 'João Santos',
    avatar: '/users/user_default.jpg'
  },
  {
    id: 3,
    text: 'Sempre peço para ocasiões especiais. Nunca decepciona!',
    name: 'Ana Oliveira',
    avatar: '/users/user_default.jpg'
  }
]
</script>

<style lang="scss" scoped>
.testimonials {
  padding: 4rem 2rem;
  background-color: #f9f9f9;

  h2 {
    text-align: center;
    margin-bottom: 3rem;
  }

  .testimonials-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .testimonial-card {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    position: relative;

    .quote {
      font-size: 4rem;
      position: absolute;
      top: -10px;
      left: 10px;
      color: var(--primary);
      opacity: 0.2;
    }

    .author {
      display: flex;
      align-items: center;
      margin-top: 1rem;

      img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin-right: 1rem;
      }
    }
  }
}
</style> 