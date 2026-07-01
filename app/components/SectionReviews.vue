<template>
  <section class="relative w-full flex flex-col items-center gap-5 md:gap-6 px-5 sm:px-8 md:px-10 lg:px-16 xxl:px-32 py-12 overflow-hidden">

    <NuxtImg
      src="/images/gradient-stain.png"
      alt="Mancha gradiente"
      aria-hidden="true"
      class="absolute z-0 -top-4 -left-48 pointer-events-none select-none"
      style="width: 480px; max-width: none; transform: rotate(120deg)"
    />
    <NuxtImg
      src="/images/gradient-stain.png"
      alt="Mancha gradiente"
      aria-hidden="true"
      class="absolute z-0 top-64 -right-40 pointer-events-none select-none"
      style="width: 480px; max-width: none; transform: rotate(-20deg)"
    />
    <NuxtImg
      src="/images/gradient-stain.png"
      alt="Mancha gradiente"
      aria-hidden="true"
      class="hidden absolute z-0 top-2/3 -left-16 pointer-events-none select-none"
      style="width: 480px; max-width: none; transform: rotate(190deg)"
    />

    <h2 class="relative z-10 font-heading text-lg text-primary text-center leading-1">
      Lo que dicen quienes ya están sumando
    </h2>

    <div class="relative z-10 w-full max-w-[420px] md:max-w-[688px] flex flex-col items-center gap-3">
      <div
        v-for="review in reviews"
        :key="review.name + review.age"
        class="w-full flex flex-col gap-1 bg-light border border-green-light rounded-lg p-3"
      >
        <div class="flex justify-between">
          <div class="flex items-center gap-3">
            <div class="w-6 h-6 rounded-full bg-gradient-secondary flex items-center justify-center text-light text-xs font-semibold shrink-0">
              {{ review.name.charAt(0) }}
            </div>
            <span class="text-xs font-semibold">{{ review.name }}, {{ review.age }}</span>
          </div>
          <NuxtImg src="/images/brillo-primary.svg" alt="Brillo" aria-hidden="true" class="w-3 h-3" />
        </div>
        <p class="text-xs leading-1">"{{ review.quote }}"</p>
      </div>
    </div>

  </section>
</template>

<script setup lang="ts">
const reviews = [
  {
    name: 'Mica',
    age: 27,
    quote: 'Me ayudó a ser constante sin presionarme',
  },
  {
    name: 'Agus',
    age: 22,
    quote: 'Es la primera vez que puedo sostener un hábito más de una semana',
  },
  {
    name: 'Juan',
    age: 38,
    quote: 'Amo ver mis rachas, me motiva un montón',
  },
  {
    name: 'Dani',
    age: 52,
    quote: 'Cambié 3 hábitos simples en 2 semanas',
  },
  {
    name: 'Manu',
    age: 31,
    quote: 'Me encanta porque me motiva sin exigirme. Siento que voy avanzando de verdad',
  },
  {
    name: 'Caro',
    age: 29,
    quote: 'Nunca fui constante con nada, y con suma llevo dos meses sin fallar un día',
  },
]
</script>
