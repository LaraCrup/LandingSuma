<template>
  <section class="w-full flex flex-col items-center gap-5 md:gap-6 bg-green-dark px-5 sm:px-8 md:px-10 lg:px-16 xxl:px-32 py-12">
    <NuxtImg src="/images/brillo-accent.svg" alt="Brillo" width="20" height="20" />
    <div class="flex flex-col items-center gap-2 text-center">
      <h2 class="font-heading text-lg text-accent text-center leading-1">
        ¿Listo para empezar a sumar?
      </h2>
      <p class="text-xs text-light">Descargá <span class="text-accent">suma</span> y empezá a construir tus hábitos de forma simple y motivadora.</p>
    </div>
    <NuxtLink to="#"
      class="w-full md:w-fit max-w-64 flex items-center justify-center gap-2 bg-accent text-green-dark text-xs rounded-full px-12 py-3 hover:opacity-90 transition-opacity">
        <NuxtImg
        src="/images/download-dark.svg"
        alt="Logo"
        width="10"
        height="10"/>
      Empezar ahora
    </NuxtLink>
  </section>
</template>
