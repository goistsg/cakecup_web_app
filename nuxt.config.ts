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

  // Configuração para produção (Render)
  nitro: {
    preset: 'node-server'
  },

  // Vite config para permitir FontAwesome
  vite: {
    server: {
      fs: {
        allow: [
          // Permitir acesso aos node_modules
          process.cwd(),
          process.cwd() + '/node_modules',
        ]
      }
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
      link: [
        {
          rel: 'stylesheet',
          href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
          integrity: 'sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==',
          crossorigin: 'anonymous',
          referrerpolicy: 'no-referrer'
        }
      ]
    }
  },

  css: [
    '~/assets/styles/colors.css',
    '~/assets/styles/_variables.scss'
  ],
})
