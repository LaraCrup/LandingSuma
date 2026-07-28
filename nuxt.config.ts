const TITULO = 'suma — La constancia en tu bienestar merece recompensas'
const DESCRIPCION = 'suma es una app que te impulsa a crear hábitos saludables y premia tu constancia con recompensas de marcas aliadas. Completá tus datos y canjeá tu premio.'
const DESCRIPCION_CORTA = 'Creá hábitos saludables y canjeá recompensas de marcas aliadas.'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase',
    '@nuxt/image',
  ],
  css: ['~/assets/css/main.css'],
  vite: {
    optimizeDeps: {
      include: ['gsap', 'gsap/ScrollTrigger', 'gsap/SplitText', 'lenis'],
    },
  },
  supabase: {
    redirect: false,
    options: {
      auth: {
        persistSession: false,
      },
    },
  },
  image: {
    quality: 72,
    screens: {
      sm: 480,
      tab: 600,
      md: 768,
      mdlg: 992,
      lg: 1080,
      xl: 1280,
      xxl: 1440,
    },
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'es-AR',
      },
      title: TITULO,
      meta: [
        { name: 'description', content: DESCRIPCION },
        { name: 'robots', content: 'index, follow, max-image-preview:large' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'theme-color', content: '#12534C' },
        { name: 'apple-mobile-web-app-title', content: 'suma' },

        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'suma' },
        { property: 'og:locale', content: 'es_AR' },
        { property: 'og:title', content: TITULO },
        { property: 'og:description', content: DESCRIPCION_CORTA },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:type', content: 'image/jpeg' },
        { property: 'og:image:alt', content: 'suma — La constancia en tu bienestar merece recompensas' },

        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: TITULO },
        { name: 'twitter:description', content: DESCRIPCION_CORTA },
        { name: 'twitter:image:alt', content: 'suma — La constancia en tu bienestar merece recompensas' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
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
          href: 'https://fonts.googleapis.com/css2?family=Montserrat+Alternates:wght@500;600;700&family=Quicksand:wght@400;500;600;700&display=swap',
        },
      ],
    },
  },
})
