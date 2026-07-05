<template>
  <section class="w-full flex flex-col items-center gap-5 md:gap-6 bg-green-dark px-5 sm:px-8 md:px-10 lg:px-16 xxl:px-32 py-12 lg:py-16">
    <NuxtImg src="/images/brillo-accent.svg" alt="Brillo" class="w-5 lg:w-8 h-5 lg:h-8" />
    <div class="flex flex-col items-center gap-2 lg:gap-3 text-center">
      <h2 class="font-heading text-lg lg:text-2xl text-accent text-center leading-1">
        ¿Listo para empezar a sumar?
      </h2>
      <p class="text-xs lg:text-base text-light">Descargá <span class="text-accent">suma</span> y empezá a construir tus hábitos de forma simple y motivadora.</p>
    </div>
    <NuxtLink to="#"
      class="w-full md:w-fit max-w-64 flex items-center justify-center gap-2 lg:gap-3 bg-accent text-green-dark text-xs lg:text-base rounded-full px-12 py-3 hover:opacity-90 transition-opacity">
        <NuxtImg
        src="/images/download-dark.svg"
        alt="Logo" class="w-[10px] lg:w-4 h-[10px] lg:h-4"/>
      Descargar app
    </NuxtLink>
  </section>
</template>
