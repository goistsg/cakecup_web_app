<template>
  <div class="home">
    <HeroSection />
    <FeaturedProducts v-if="isMounted" />
    <div v-else style="padding: 4rem 2rem; background-color: #f9f9f9; text-align: center;">
      <p style="color: #666;">Carregando produtos em destaque...</p>
    </div>
    <HowItWorks />
    <Testimonials />
    <CallToAction />
  </div>
</template>

<script setup lang="ts">
import { useClientMounted } from '~/composables/useClientMounted'
import HeroSection from '~/components/home/HeroSection.vue'
import FeaturedProducts from '~/components/home/FeaturedProducts.vue'
import HowItWorks from '~/components/home/HowItWorks.vue'
import Testimonials from '~/components/home/Testimonials.vue'
import CallToAction from '~/components/home/CallToAction.vue'

const { isMounted } = useClientMounted()
</script> 