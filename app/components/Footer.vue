<template>
  <footer class="w-full flex flex-col items-center">
    <div class="w-full flex flex-col items-end gap-2 p-5">
      <div class="w-full flex items-center justify-between">
        <NuxtImg src="/images/isotipo.svg" alt="Logo" height="24" />
        <NuxtLink to="#" class="flex items-center gap-2">
          <p class="text-xs text-green-dark">Descargar suma</p>
          <NuxtImg
          src="/images/download-dark.svg"
          alt="Logo"
          width="10"
          height="10"/>
        </NuxtLink>
      </div>
      <div class="flex items-center gap-2">
        <NuxtImg src="/images/instagram.svg" alt="Logo" width="20" height="20" />
        <NuxtImg src="/images/tiktok.svg" alt="Logo" width="20" height="20" />
      </div>
    </div>
    <div class="w-full bg-primary px-5 py-2">
      <p class="text-xs text-light text-center">© Suma. Todos los derechos reservados.</p>
    </div>
  </footer>
</template>
