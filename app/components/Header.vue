<template>
  <header
    class="sticky top-3 lg:top-5 z-40 pointer-events-none px-4 sm:px-8 md:px-10 lg:px-16 xxl:px-32">
    <div
      class="max-w-[75rem] w-full flex justify-between items-center pointer-events-auto bg-light border border-primary/20 rounded-full shadow-sm pl-5 lg:pl-7 pr-2 lg:pr-2.5 py-2 lg:py-2.5 mx-auto">
      <NuxtImg src="/images/isotipo.svg" alt="suma" class="w-9 lg:w-10 h-[30px] lg:h-12" />
      <NuxtLink to="https://suma-proyecto-final.vercel.app/iniciar-sesion" target="_blank" rel="noopener"
        class="flex items-center gap-2 lg:gap-3 bg-primary hover:bg-green-dark rounded-full text-light text-sm lg:text-base font-semibold transition-colors duration-200 active:scale-[0.97] px-5 lg:px-7 py-2.5 lg:py-3">
        <NuxtImg src="/images/download.svg" alt="" class="w-3 lg:w-4 h-3 lg:h-4" />
        <span>Descargar suma</span>
      </NuxtLink>
    </div>
  </header>
</template>
