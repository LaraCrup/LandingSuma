<template>
  <section
    class="relative px-5 sm:px-8 md:px-10 lg:px-16 xxl:px-32 py-12 overflow-hidden">

    <NuxtImg src="/images/gradient-stain.png" alt="" aria-hidden="true"
      class="absolute z-0 -top-4 xxl:-top-28 -left-48 xxl:left-40 pointer-events-none select-none"
      style="width: 480px; max-width: none; transform: rotate(120deg)" />
    <NuxtImg src="/images/gradient-stain.png" alt="" aria-hidden="true"
      class="absolute z-0 top-64 md:-top-20 -right-40 xxl:right-40 pointer-events-none select-none"
      style="width: 480px; max-width: none; transform: rotate(-20deg)" />
    <NuxtImg src="/images/gradient-stain.png" alt="" aria-hidden="true"
      class="hidden md:inline absolute z-0 top-64 lg:top-0 xxl:-top-6 left-40 lg:left-64 xxl:left-1/3 pointer-events-none select-none"
      style="width: 500px; max-width: none; transform: rotate(190deg)" />

    <div class="xxl:max-w-[75rem] w-full flex flex-col items-center gap-5 md:gap-6 xxl:mx-auto">
      <h2 class="relative z-10 font-heading text-lg lg:text-2xl text-primary text-center leading-none">
        Lo que dicen quienes ya están sumando
      </h2>

      <div class="relative z-10 w-full max-w-[420px] md:max-w-[688px] flex flex-col items-center gap-3 lg:hidden">
        <div v-for="review in reviews" :key="review.name + review.age"
          class="w-full flex flex-col gap-1 bg-light border border-green-light rounded-lg p-3">
          <div class="flex justify-between">
            <div class="flex items-center gap-3">
              <div
                class="w-6 h-6 rounded-full bg-gradient-secondary flex items-center justify-center text-light text-xs font-semibold shrink-0">
                {{ review.name.charAt(0) }}
              </div>
              <span class="text-xs font-semibold">{{ review.name }}, {{ review.age }}</span>
            </div>
            <NuxtImg src="/images/brillo-primary.svg" alt="" aria-hidden="true" class="w-3 h-3" />
          </div>
          <p class="text-xs leading-none">"{{ review.quote }}"</p>
        </div>
      </div>

      <div class="hidden lg:block relative z-10 w-full">
        <Carousel :slidesPerView="{ lg: 3, xl: 3, xxl: 3 }" :gap="{ lg: 12, xl: 16, xxl: 16 }"
          :showArrows="{ lg: true }" :showDots="false"
          :buttonPosition="{ top: '50%', transform: 'translateY(-50%)', left: { lg: '-1.5rem', xl: '-1.5rem', xxl: '-1.5rem' }, right: { lg: '-1.5rem', xl: '-1.5rem', xxl: '-1.5rem' } }">
          <div v-for="review in reviews" :key="review.name + review.age"
            class="h-[130px] xl:h-28 flex flex-col justify-between gap-1 lg:gap-2 bg-light border border-green-light rounded-lg p-3">
            <div class="flex justify-between">
              <div class="flex items-center gap-3">
                <div
                  class="w-6 lg:w-7 h-6 lg:h-7 rounded-full bg-gradient-secondary flex items-center justify-center text-light text-xs font-semibold shrink-0">
                  {{ review.name.charAt(0) }}
                </div>
                <span class="text-xs lg:text-sm font-semibold">{{ review.name }}, {{ review.age }}</span>
              </div>
              <NuxtImg src="/images/brillo-primary.svg" alt="" aria-hidden="true" class="w-3 lg:w-4 h-3 lg:h-4" />
            </div>
            <p class="text-xs lg:text-base leading-none">"{{ review.quote }}"</p>
          </div>
        </Carousel>
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
