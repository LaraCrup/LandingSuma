// Dominio canónico fijo: derivarlo del request hace que cada preview de Vercel se
// auto-canonicalice a su propio host y compita en el índice con producción.
const SITE_URL = (process.env.NUXT_PUBLIC_SITE_URL || 'https://landing-suma.vercel.app').replace(/\/+$/, '')
const APP_URL = 'https://suma-proyecto-final.vercel.app'

const TITULO = 'suma — La constancia en tu bienestar merece recompensas'
const DESCRIPCION = 'suma es una app que te impulsa a crear hábitos saludables y premia tu constancia con recompensas de marcas aliadas. Completá tus datos y canjeá tu premio.'
const DESCRIPCION_CORTA = 'Creá hábitos saludables y canjeá recompensas de marcas aliadas.'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase',
    '@nuxt/image',
    '@nuxt/fonts',
  ],
  css: ['~/assets/css/main.css'],
  // Sin los .map Lighthouse no puede auditar el JS de primera parte
  sourcemap: { client: true },
  vite: {
    optimizeDeps: {
      include: ['gsap', 'gsap/ScrollTrigger', 'gsap/SplitText', 'lenis'],
    },
  },
  // Landing sin login: sin cookies de sesión se evita cargar @supabase/ssr en el bundle
  supabase: {
    redirect: false,
    types: false,
    useSsrCookies: false,
    clientOptions: {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    },
  },
  fonts: {
    families: [
      { name: 'Montserrat Alternates', provider: 'google', weights: [500, 600, 700] },
      { name: 'Quicksand', provider: 'google', weights: [400, 500, 600, 700] },
    ],
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
  runtimeConfig: {
    public: {
      siteUrl: SITE_URL,
      appUrl: APP_URL,
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
        { property: 'og:url', content: `${SITE_URL}/` },
        { property: 'og:image', content: `${SITE_URL}/og-suma.jpg` },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:type', content: 'image/jpeg' },
        { property: 'og:image:alt', content: 'suma — La constancia en tu bienestar merece recompensas' },

        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: TITULO },
        { name: 'twitter:description', content: DESCRIPCION_CORTA },
        { name: 'twitter:image', content: `${SITE_URL}/og-suma.jpg` },
        { name: 'twitter:image:alt', content: 'suma — La constancia en tu bienestar merece recompensas' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico', sizes: '32x32' },
        // isotipo.svg es apaisado y transparente: en la pestaña quedaba diminuto e ilegible
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg', sizes: 'any' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
      ],
    },
  },
})
