<template>
  <section class="featured">
    <h2>Nossos Destaques</h2>
    <div class="products-grid">
      <div v-for="product in featuredProducts" :key="product.id" class="product-card">
        <img :src="product.image" :alt="product.name">
        <h3>{{ product.name }}</h3>
        <p>{{ product.description }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const featuredProducts = [
  {
    id: 1,
    name: 'Cupcake de Chocolate Belga',
    description: 'Cupcake de chocolate belga com cobertura de ganache',
    image: '/products/CCB001.png'
  },
  {
    id: 2,
    name: 'Red Velvet Tradicional',
    description: 'Cupcake red velvet com cream cheese',
    image: '/products/RVT002.png'
  },
  {
    id: 3,
    name: 'Pistache Premium',
    description: 'Cupcake de pistache com cobertura de creme de pistache',
    image: '/products/PST006.png'
  }
]
</script>

<style lang="scss" scoped>
.featured {
  padding: 4rem 2rem;
  background-color: #f9f9f9;

  h2 {
    text-align: center;
    margin-bottom: 3rem;
  }

  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .product-card {
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    transition: transform 0.3s;

    &:hover {
      transform: translateY(-5px);
    }

    img {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }

    h3, p {
      padding: 0.5rem 1rem;
    }

    .price {
      display: block;
      padding: 1rem;
      font-weight: bold;
      color: #ff4081;
    }
  }
}
</style> 