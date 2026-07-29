<template>
  <footer class="w-full relative bg-green-dark border-t border-light/10 px-5 pt-5 pb-8 lg:pb-10">
    <div class="w-full max-w-[75rem] flex flex-col sm:flex-row justify-between items-center gap-2 mx-auto">
      <div class="flex items-center gap-2.5 order-2 sm:order-1">
        <img src="/images/isotipo.svg" alt="" class="h-6" />
        <p class="text-xs text-light/75">© {{ anio }} suma. Todos los derechos reservados.</p>
      </div>
      <nav aria-label="Redes sociales" class="flex items-center gap-5 order-1 sm:order-2">
        <NuxtLink to="#" class="text-sm text-light/80 hover:text-accent transition-colors duration-200">Instagram</NuxtLink>
        <NuxtLink to="#" class="text-sm text-light/80 hover:text-accent transition-colors duration-200">TikTok</NuxtLink>
      </nav>
    </div>
  </footer>
</template>

<script setup>
const anio = new Date().getFullYear()
</script>
