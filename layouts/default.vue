<template>
  <div>
    <TheHeader />
    <main>
      <slot />
    </main>
    <CartModal />
    <TheFooter />
  </div>
</template>

<script setup>
defineComponent({
  name: 'DefaultLayout'
})

// Importações explícitas
import TheHeader from '~/components/layout/TheHeader.vue'
import TheFooter from '~/components/layout/TheFooter.vue'
import CartModal from '~/components/cart/CartModal.vue'
</script>

<style lang="scss">
.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 2rem 0;
}
</style> 