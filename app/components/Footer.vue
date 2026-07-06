<template>
  <footer class="w-full flex flex-col items-center">
    <div class="w-full p-5 sm:px-8 md:px-10 lg:px-16 lg:py-9 xxl:px-32 ">
      <div class="xxl:max-w-[75rem] w-full flex flex-col items-end gap-2 xxl:mx-auto">
        <div class="w-full flex items-center justify-between">
          <NuxtImg src="/images/isotipo.svg" alt="Logo" class="h-6 lg:h-8" />
          <NuxtLink to="#" class="flex items-center gap-2">
            <p class="text-xs lg:text-sm text-green-dark">Descargar suma</p>
            <NuxtImg src="/images/download-dark.svg" alt="Logo" class="w-[10px] lg:w-[14px] h-[10px] lg:h-[14px]" />
          </NuxtLink>
        </div>
        <div class="flex items-center gap-2">
          <NuxtImg src="/images/instagram.svg" alt="Logo" width="20" height="20" />
          <NuxtImg src="/images/tiktok.svg" alt="Logo" width="20" height="20" />
        </div>
      </div>
    </div>
    <div class="w-full bg-primary px-5 py-2 lg:py-3">
      <p class="text-xs lg:text-sm text-light text-center">© Suma. Todos los derechos reservados.</p>
    </div>
  </footer>
</template>
