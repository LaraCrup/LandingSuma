<template>
  <section class="w-full flex flex-col items-center gap-5 lg:gap-6 md:gap-6 px-6 sm:px-8 md:px-10 lg:px-16 xxl:px-32 py-12">

    <div class="flex flex-col items-center gap-2 lg:gap-3 text-center">
      <h2 class="font-heading text-lg lg:text-2xl font-medium leading-none text-primary">
        ¿Por qué descargarte <span class="text-green-dark">suma</span>?
      </h2>
      <p class="text-xs lg:text-base">Pequeños pasos, grandes cambios. Esto es lo que vas a lograr con la app.</p>
    </div>

    <template v-for="(beneficio, i) in beneficios" :key="i">
      <NuxtImg src="/images/brillo-primary.svg" alt="" class="w-5 h-5 lg:w-8 lg:h-8" />

      <div class="flex flex-col items-center gap-2 lg:gap-3 text-center">
        <div class="flex items-center gap-2 lg:gap-4">
          <div class="w-7 lg:w-11 h-7 lg:h-11 rounded-full bg-gradient-secondary flex items-center justify-center text-xs lg:text-xl shrink-0">
            {{ beneficio.emoji }}
          </div>
          <h3 class="font-heading text-primary text-base lg:text-xl text-left">{{ beneficio.titulo }}</h3>
        </div>
        <p class="text-xs lg:text-base">{{ beneficio.descripcion }}</p>
      </div>
    </template>

  </section>
</template>

<script setup lang="ts">
const beneficios = [
  {
    emoji: '📈',
    titulo: 'Medí tu progreso real',
    descripcion: 'Llevá registro de tus hábitos y mirá tus avances con estadísticas simples y motivadoras.',
  },
  {
    emoji: '🤝',
    titulo: 'Comunidad que te acompaña',
    descripcion: 'Unite a grupos con objetivos similares y compartí tus logros con otras personas que también están sumando.',
  },
  {
    emoji: '🎁',
    titulo: 'Recompensas reales',
    descripcion: 'Accedé a beneficios y descuentos de marcas saludables asociadas por mantener tu constancia.',
  },
]
</script>
