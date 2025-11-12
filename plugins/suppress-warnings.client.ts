/**
 * Plugin para suprimir warnings específicos do Vue em desenvolvimento
 * O warning do Suspense é esperado pois o Nuxt 3 usa Suspense internamente
 */
export default defineNuxtPlugin(() => {
  if (process.dev) {
    // Salvar o console.warn original
    const originalWarn = console.warn

    // Substituir console.warn para filtrar warnings específicos
    console.warn = (...args: any[]) => {
      const message = args[0]
      
      // Filtrar warning do Suspense (é esperado no Nuxt 3)
      if (typeof message === 'string' && message.includes('<Suspense> is an experimental feature')) {
        return
      }
      
      // Filtrar warning do preload do dev.json (normal em desenvolvimento)
      if (typeof message === 'string' && message.includes('dev.json was preloaded')) {
        return
      }

      // Chamar o warn original para outros casos
      originalWarn.apply(console, args)
    }
  }
})

