<template>
  <div :class="['relative select-none', width]">
    <div class="w-full aspect-[390/830] relative rounded-[52px] p-[10px]"
      style="background: linear-gradient(160deg, #2a2a2c 0%, #1a1a1c 50%, #0e0e10 100%); box-shadow: 0 0 0 1px rgba(255,255,255,0.05) inset, 0 0 0 2px #000 inset, 0 40px 80px -16px rgba(18,83,76,0.5), 0 12px 24px -8px rgba(0,0,0,0.35);">

      <div class="w-[80px] h-[24px] absolute top-[20px] left-1/2 -translate-x-1/2 z-10 bg-black rounded-full" />

      <div class="w-full h-full flex flex-col relative bg-light rounded-[42px] overflow-hidden">
        <div class="h-[40px] flex-shrink-0" />

        <div class="w-full bg-green-light px-4 py-1.5">
          <p class="text-[11px] text-center text-light">{{ frase }}</p>
        </div>
        <div class="w-full flex justify-between items-center px-4 pt-3 pb-2">
          <div class="flex gap-2 items-center">
            <NuxtImg src="/images/isotipo.svg" alt="" class="w-5" />
            <p class="text-sm">Hola, <span class="font-bold text-primary">vos</span></p>
          </div>
          <div class="flex items-center gap-1.5">
            <p class="text-xs">Nivel</p>
            <div class="w-6 h-6 flex justify-center items-center bg-primary rounded-full">
              <p class="text-xs text-light font-bold">{{ nivel }}</p>
            </div>
          </div>
        </div>

        <div class="flex-1 flex flex-col min-h-0 overflow-y-auto px-4 pt-1.5 pb-2">
          <slot />
        </div>

        <div class="flex justify-center items-center relative bg-primary rounded-t-[26px] py-3.5">
          <div class="w-11 h-11 flex items-center justify-center bg-accent rounded-full -mt-8 shadow-lg">
            <NuxtImg src="/images/brillo.svg" alt="" class="w-5" />
          </div>
        </div>
      </div>

      <Transition name="xp-toast">
        <div v-if="toast"
          class="max-w-[calc(100%-32px)] flex items-center gap-2 absolute top-[64px] right-[16px] z-20 bg-green-dark rounded-2xl lg:rounded-xl shadow-2xl px-4 lg:px-3 py-3 lg:py-2">
          <NuxtImg src="/images/brillo-accent.svg" alt="" class="w-4 h-4 md:w-5 md:h-5 lg:w-3.5 lg:h-3.5 flex-shrink-0" />
          <div class="min-w-0">
            <p v-if="toast.xp > 0" class="font-heading text-xs md:text-sm lg:text-[11px] text-accent font-bold leading-tight">+{{ toast.xp }} XP</p>
            <p class="text-xs md:text-sm lg:text-[9px] text-light/85 lg:text-light/80 leading-snug">{{ toast.label }}</p>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
defineProps({
  width: { type: String, default: 'w-[280px] lg:w-[310px] xxl:w-[330px] lg:short:w-[290px]' },
  nivel: { type: Number, default: 3 },
  frase: { type: String, default: 'Hoy es un buen día para sumar' },
  toast: { type: Object, default: null },
})
</script>

<style scoped>
.xp-toast-enter-active {
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.4s ease;
}

.xp-toast-leave-active {
  transition: transform 0.3s ease-in, opacity 0.3s ease;
}

.xp-toast-enter-from,
.xp-toast-leave-to {
  transform: translateX(110%);
  opacity: 0;
}
</style>
