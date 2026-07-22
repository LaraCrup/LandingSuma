<template>
  <button ref="cardRef" type="button" :aria-pressed="modelValue"
    :aria-label="`${habit.name}: ${modelValue ? 'completado' : 'pendiente'}. Tocá o deslizá para ${modelValue ? 'desmarcar' : 'completar'}`"
    :class="['w-full relative overflow-hidden flex justify-between items-center rounded-2xl transition-colors touch-pan-y',
      modelValue ? 'bg-accent' : 'bg-midlight',
      grande ? 'p-4 lg:p-5' : 'p-3']"
    @click="onTap" @touchstart="onTouchStart" @touchend="onTouchEnd">

    <div v-if="fillVisible" class="absolute inset-y-0 left-0 bg-accent pointer-events-none"
      :class="soltando ? 'transition-[width] duration-150' : ''" :style="{ width: fillPercent + '%' }" />

    <div class="min-w-0 flex flex-1 items-center relative" :class="grande ? 'gap-4' : 'gap-3'">
      <div
        :class="['flex flex-shrink-0 items-center justify-center rounded-full bg-gradient-secondary', grande ? 'w-12 lg:w-14 h-12 lg:h-14 text-2xl lg:text-3xl' : 'w-8 h-8 text-sm']">
        {{ habit.icon }}
      </div>
      <div class="min-w-0">
        <p :class="['text-start text-dark truncate', grande ? 'text-base lg:text-lg font-semibold' : 'text-sm font-semibold']">
          {{ habit.name }}
        </p>
        <p :class="['text-start text-green-dark', modelValue ? 'font-bold' : 'font-normal', grande ? 'text-sm' : 'text-xs']">
          {{ modelValue ? habit.goal ?? 1 : 0 }}/{{ habit.goal ?? 1 }}
        </p>
      </div>
    </div>

    <div class="flex items-center relative flex-shrink-0" :class="grande ? 'gap-3' : 'gap-2'">
      <div v-if="habit.streak" class="flex items-center gap-1">
        <svg :class="grande ? 'w-3.5' : 'w-2'" viewBox="0 0 8 10" fill="#157A6E" aria-hidden="true">
          <path d="M4.5 0C4.5 2 6.8 3.2 7.5 5.4 8.2 7.7 6.6 10 4 10 1.6 10 0 8.2 0 6.2 0 4.6 1 3.4 1.8 2.6c0 1 .4 1.7 1 2.1C2.6 3 3.4 1.2 4.5 0Z" />
        </svg>
        <p :class="['text-green-dark font-semibold', grande ? 'text-sm' : 'text-xs']">{{ streakActual }}</p>
      </div>
      <div
        :class="['flex justify-center items-center rounded-full transition-colors',
          modelValue ? 'bg-green-dark' : 'border border-gray',
          grande ? 'w-9 lg:w-10 h-9 lg:h-10' : 'w-6 h-6']">
        <NuxtImg :src="modelValue ? '/images/brillo-light-green.svg' : '/images/brillo.svg'" alt=""
          :class="grande ? 'w-4' : 'w-3'" />
      </div>
    </div>
  </button>
</template>

<script setup>
const props = defineProps({
  habit: { type: Object, required: true },
  modelValue: { type: Boolean, default: false },
  grande: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue', 'completed'])

const streakActual = computed(() => (props.habit.streak ?? 0) + (props.modelValue ? 1 : 0))

const cardRef = ref(null)
const touchX = ref(0)
const touchY = ref(0)
const deltaX = ref(0)
const horizontal = ref(false)
const soltando = ref(false)

const SWIPE_MIN = 40
const FILL_FULL = 60

const fillPercent = computed(() => {
  if (soltando.value) return 100
  if (!horizontal.value || props.modelValue || deltaX.value <= 0) return 0
  return Math.min((deltaX.value / FILL_FULL) * 100, 100)
})
const fillVisible = computed(() => fillPercent.value > 0)

function setValue(v) {
  emit('update:modelValue', v)
  if (v) emit('completed', props.habit)
}

function onTap() {
  if (horizontal.value) return
  setValue(!props.modelValue)
}

function onTouchStart(e) {
  touchX.value = e.touches[0].clientX
  touchY.value = e.touches[0].clientY
  deltaX.value = 0
  horizontal.value = false
}

function onTouchMove(e) {
  const dx = e.touches[0].clientX - touchX.value
  const dy = e.touches[0].clientY - touchY.value
  if (!horizontal.value && Math.abs(dy) > Math.abs(dx) + 5) return
  if (Math.abs(dx) > 8) {
    horizontal.value = true
    e.preventDefault()
    deltaX.value = dx
  }
}

async function onTouchEnd(e) {
  const dx = e.changedTouches[0].clientX - touchX.value
  const esSwipe = horizontal.value && Math.abs(dx) > SWIPE_MIN
  if (esSwipe) {
    const derecha = dx > 0
    if (derecha && !props.modelValue) {
      soltando.value = true
      await nextTick()
      setValue(true)
      soltando.value = false
    } else if (!derecha && props.modelValue) {
      setValue(false)
    }
  }
  deltaX.value = 0
  setTimeout(() => { horizontal.value = false }, 50)
}

onMounted(() => {
  cardRef.value?.addEventListener('touchmove', onTouchMove, { passive: false })
})
onUnmounted(() => {
  cardRef.value?.removeEventListener('touchmove', onTouchMove)
})
</script>
