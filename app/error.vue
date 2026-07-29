<template>
  <div class="min-h-dvh flex flex-col justify-center items-center bg-light font-body text-dark antialiased text-center px-5">
    <img src="/images/isotipo.svg" alt="suma" class="w-14 mb-8" />

    <h1 class="font-heading text-5xl lg:text-7xl text-primary font-medium leading-none mb-4">
      {{ error?.statusCode ?? 500 }}
    </h1>
    <p class="max-w-[38ch] text-lg lg:text-xl text-green-dark font-semibold mb-8">
      {{ mensaje }}
    </p>

    <button type="button" @click="handleError"
      class="bg-primary hover:bg-green-dark rounded-full text-light text-base font-semibold transition-colors duration-200 active:scale-[0.98] px-8 py-3.5">
      Volver al inicio
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  error: { type: Object, default: null },
})

const mensaje = computed(() => props.error?.statusCode === 404
  ? 'No encontramos la página que estabas buscando.'
  : 'Algo salió mal de nuestro lado. Probá de nuevo en unos segundos.')

useHead({
  title: computed(() => `${props.error?.statusCode ?? 500} — suma`),
  meta: [{ name: 'robots', content: 'noindex' }],
})

const handleError = () => clearError({ redirect: '/' })
</script>
