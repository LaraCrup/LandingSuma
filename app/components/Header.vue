<template>
  <header class="w-full flex justify-between items-center bg-light px-5 sm:px-8 md:px-10 lg:px-16 xxl:px-32 py-3 lg:py-6 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]">
    <NuxtImg
      src="/images/isotipo.svg"
      alt="Logo"
      class="h-[30px] lg:h-12 w-9 lg:w-10"/>
    <NuxtLink to="#" target="_blank" class="flex items-center gap-2 lg:gap-3 text-light bg-primary rounded-full px-5 lg:px-8 py-2 lg:py-3">
      <NuxtImg
        src="/images/download.svg"
        alt="Logo"
        class="w-[10px] lg:w-4 h-[10px] lg:h-4"/>
      <span class="text-xs lg:text-base">Descargar suma</span>
    </NuxtLink>
  </header>
</template>
 