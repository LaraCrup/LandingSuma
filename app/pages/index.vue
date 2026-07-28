<template>
  <div>
    <Header />

    <main>
      <Hero />

      <div class="hidden lg:block h-dvh" aria-hidden="true" />

      <div class="w-full flex flex-col relative bg-light z-10">
        <ComoFunciona />
        <Recompensas />
        <Reviews />
        <Cierre />
      </div>
    </main>
  </div>
</template>

<script setup>
const APP_URL = 'https://suma-proyecto-final.vercel.app'

const { origin } = useRequestURL()
const canonica = `${origin}/`
const imagen = `${origin}/og-suma.jpg`

useHead({
  link: [{ rel: 'canonical', href: canonica }],
  meta: [
    { property: 'og:url', content: canonica },
    { property: 'og:image', content: imagen },
    { name: 'twitter:image', content: imagen },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Organization',
            '@id': `${origin}/#organizacion`,
            name: 'suma',
            url: origin,
            logo: `${origin}/images/isotipo.svg`,
          },
          {
            '@type': 'WebSite',
            '@id': `${origin}/#sitio`,
            url: origin,
            name: 'suma',
            inLanguage: 'es-AR',
            publisher: { '@id': `${origin}/#organizacion` },
          },
          {
            '@type': 'MobileApplication',
            name: 'suma',
            applicationCategory: 'HealthApplication',
            operatingSystem: 'Web',
            url: APP_URL,
            inLanguage: 'es-AR',
            description: 'App de hábitos saludables que premia tu constancia con recompensas canjeables de marcas aliadas.',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'ARS' },
            publisher: { '@id': `${origin}/#organizacion` },
          },
        ],
      }),
    },
  ],
})
</script>
