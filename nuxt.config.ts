export default defineNuxtConfig({
  compatibilityDate: '2025-01-15',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'Les Humeurs à la Funes',
      meta: [
        { name: 'description', content: 'Un petit espace pour prendre le temps de voir comment tu vas.' },
        { name: 'theme-color', content: '#f5efe5' }
      ]
    }
  }
})