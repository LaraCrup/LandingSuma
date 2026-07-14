export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase',
    '@nuxt/image',
  ],
  supabase: {
    redirect: false,
    options: {
      auth: {
        persistSession: false,
      },
    },
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'es',
      },
      title: 'suma — La constancia en tu bienestar merece recompensas',
      meta: [
        {
          name: 'description',
          content: 'suma es una app que te impulsa a crear hábitos saludables y premia tu constancia con recompensas de marcas aliadas. Completá tus datos y canjeá tu premio.',
        },
      ],
      link: [
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Montserrat+Alternates:wght@600;700&family=Quicksand:wght@400;500;600;700&display=swap',
        },
      ],
    },
  },
})