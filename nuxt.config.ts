export default defineNuxtConfig({
  compatibilityDate: '2025-01-15',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  modules: ['nuxt-auth-utils'],
  runtimeConfig: {
    mongodbUri: '',
    mongodbDbName: 'humeurs_funes',
    mongodbCollection: 'humeurs',
    brevoApiKey: '',
    brevoSenderEmail: '',
    brevoSenderName: 'Les Humeurs à la Funes',
    public: {
      siteUrl: ''
    }
  },
  app: {
    head: {
      title: 'Les Humeurs à la Funes',
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
      ],
      meta: [
        { name: 'description', content: 'Un petit espace pour prendre le temps de voir comment tu vas.' },
        { name: 'theme-color', content: '#f5efe5' }
      ]
    }
  }
})
