<template>
  <section class="w-full flex flex-col items-center gap-5 px-6 sm:px-8 md:px-10 lg:px-16 xxl:px-32 py-12">

    <div class="flex flex-col items-center gap-2 text-center">
      <h2 class="font-heading text-lg font-medium leading-1 text-primary">
        ¿Por qué descargarte <span class="text-green-dark">suma</span>?
      </h2>
      <p class="text-xs">Pequeños pasos, grandes cambios. Esto es lo que vas a lograr con la app.</p>
    </div>

    <template v-for="(beneficio, i) in beneficios" :key="i">
      <NuxtImg src="/images/brillo-primary.svg" alt="Brillo" width="20" height="20" />

      <div class="flex flex-col items-center gap-2 text-center">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-full bg-gradient-secondary flex items-center justify-center text-xs shrink-0">
            {{ beneficio.emoji }}
          </div>
          <h3 class="font-heading text-primary text-base text-left">{{ beneficio.titulo }}</h3>
        </div>
        <p class="text-xs">{{ beneficio.descripcion }}</p>
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
