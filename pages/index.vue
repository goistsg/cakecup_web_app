<template>
  <div class="home">
    <HeroSection />
    <FeaturedProducts />
    <HowItWorks />
    <Testimonials />
    <CallToAction />
  </div>
</template>

<script setup lang="ts">
import HeroSection from '~/components/home/HeroSection.vue'
import FeaturedProducts from '~/components/home/FeaturedProducts.vue'
import HowItWorks from '~/components/home/HowItWorks.vue'
import Testimonials from '~/components/home/Testimonials.vue'
import CallToAction from '~/components/home/CallToAction.vue'
</script> 