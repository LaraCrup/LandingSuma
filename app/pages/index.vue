<template>
  <div>
    <a href="#contenido"
      class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-green-dark focus:rounded-full focus:text-light focus:text-sm focus:font-semibold focus:px-5 focus:py-3">
      Saltar al contenido
    </a>

    <Header />

    <main id="contenido">
      <Hero />

      <div class="hidden lg:block h-dvh" aria-hidden="true" />

      <div class="w-full flex flex-col relative bg-light z-10">
        <ComoFunciona />
        <Recompensas />
        <Reviews />
        <Cierre />
      </div>
    </main>

    <!-- Fuera de <main> para que mapee al landmark contentinfo -->
    <AppFooter class="relative z-10" />
  </div>
</template>

<script setup>
const { siteUrl: siteUrlRaw, appUrl } = useRuntimeConfig().public
const siteUrl = sinBarraFinal(siteUrlRaw)

useHead({
  link: [{ rel: 'canonical', href: `${siteUrl}/` }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Organization',
            '@id': `${siteUrl}/#organizacion`,
            name: 'suma',
            url: siteUrl,
            logo: `${siteUrl}/apple-touch-icon.png`,
            description: 'App de hábitos saludables que premia la constancia con recompensas de marcas aliadas.',
          },
          {
            '@type': 'WebSite',
            '@id': `${siteUrl}/#sitio`,
            url: siteUrl,
            name: 'suma',
            inLanguage: 'es-AR',
            publisher: { '@id': `${siteUrl}/#organizacion` },
          },
          {
            '@type': 'WebApplication',
            '@id': `${siteUrl}/#app`,
            name: 'suma',
            applicationCategory: 'HealthApplication',
            operatingSystem: 'Web',
            browserRequirements: 'Requiere JavaScript',
            url: appUrl,
            installUrl: appUrl,
            inLanguage: 'es-AR',
            description: 'App de hábitos saludables que premia tu constancia con recompensas canjeables de marcas aliadas.',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'ARS' },
            publisher: { '@id': `${siteUrl}/#organizacion` },
          },
        ],
      }),
    },
  ],
})
</script>
