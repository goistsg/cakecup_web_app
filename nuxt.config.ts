// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt'
  ],
  
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'https://vendabela.onrender.com/app/v1',
      companyId: process.env.NUXT_PUBLIC_COMPANY_ID || '',
    }
  },

  app: {
    head: {
      title: 'CakeCup - Cupcakes Artesanais',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Cupcakes artesanais deliciosos' }
      ],
    }
  },

  css: [
    '~/assets/styles/colors.css',
    '~/assets/styles/_variables.scss'
  ],
})
