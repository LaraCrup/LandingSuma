<template>
  <div class="w-full relative">
    <button v-if="arrows && !isAtStart" @click="scrollPrev" aria-label="Anterior"
      class="w-11 h-11 hidden md:flex justify-center items-center absolute top-1/2 left-0 lg:-left-5 z-10 -translate-y-1/2 bg-light hover:bg-accent rounded-full text-primary text-2xl shadow-[0_10px_24px_-12px_rgba(18,83,76,0.6)] transition-colors duration-200">
      ‹
    </button>

    <div ref="container" @scroll.passive="updateArrows"
      @mousedown="startDrag" @mousemove="drag" @mouseup="endDrag" @mouseleave="endDrag"
      @touchstart.passive="startDrag" @touchmove.passive="drag" @touchend="endDrag"
      :class="['w-full flex items-start overflow-x-auto scrollbar-hide select-none bordes', trackClass, isDragging ? 'cursor-grabbing' : 'cursor-grab lg:cursor-auto']">
      <slot />
    </div>

    <button v-if="arrows && !isAtEnd" @click="scrollNext" aria-label="Siguiente"
      class="w-11 h-11 hidden md:flex justify-center items-center absolute top-1/2 right-0 lg:-right-5 z-10 -translate-y-1/2 bg-light hover:bg-accent rounded-full text-primary text-2xl shadow-[0_10px_24px_-12px_rgba(18,83,76,0.6)] transition-colors duration-200">
      ›
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  arrows: { type: Boolean, default: false },
  gap: { type: Number, default: 20 },
  trackClass: { type: String, default: '' },
  slidesPerView: {
    type: Object,
    default: () => ({ base: 1, sm: 2, tab: 2, md: 2, mdlg: 3, lg: 3, xl: 3, xxl: 3 }),
  },
  edge: { type: String, default: '1.25rem' },
  edgeLg: { type: String, default: '4rem' },
})

const BREAKPOINTS = ['base', 'sm', 'tab', 'md', 'mdlg', 'lg', 'xl', 'xxl']

const spv = computed(() => {
  const out = {}
  let ultimo = props.slidesPerView.base ?? 1
  for (const bp of BREAKPOINTS) {
    ultimo = props.slidesPerView[bp] ?? ultimo
    out[bp] = ultimo
  }
  return out
})

const gapPx = computed(() => `${props.gap}px`)

const container = ref(null)
const isAtStart = ref(true)
const isAtEnd = ref(true)
const isDragging = ref(false)

let startX = 0
let startY = 0
let scrollStart = 0
let gestoDefinido = false
let esHorizontal = false

function updateArrows() {
  const el = container.value
  if (!el) return
  const max = el.scrollWidth - el.clientWidth
  isAtStart.value = el.scrollLeft <= 2
  isAtEnd.value = el.scrollLeft >= max - 2
}

function paso() {
  const el = container.value
  if (!el) return 0
  const primero = el.firstElementChild
  if (!primero) return el.clientWidth
  const segundo = primero.nextElementSibling
  return segundo ? segundo.offsetLeft - primero.offsetLeft : primero.offsetWidth
}

function scrollPrev() {
  container.value?.scrollBy({ left: -paso(), behavior: 'smooth' })
}

function scrollNext() {
  container.value?.scrollBy({ left: paso(), behavior: 'smooth' })
}

function startDrag(e) {
  isDragging.value = true
  gestoDefinido = false
  esHorizontal = false
  startX = e.pageX ?? e.touches[0].pageX
  startY = e.pageY ?? e.touches[0].pageY
  scrollStart = container.value.scrollLeft
  if (e.type === 'mousedown') e.preventDefault()
}

function drag(e) {
  if (!isDragging.value) return
  const x = e.pageX ?? e.touches[0].pageX
  const y = e.pageY ?? e.touches[0].pageY
  const dx = Math.abs(x - startX)
  const dy = Math.abs(y - startY)

  if (!gestoDefinido && (dx > 5 || dy > 5)) {
    gestoDefinido = true
    esHorizontal = dx > dy
  }

  if (!gestoDefinido) return
  if (!esHorizontal) return endDrag()

  if (e.cancelable) e.preventDefault()
  container.value.scrollLeft = scrollStart - (x - startX) * 1.2
}

function endDrag() {
  isDragging.value = false
  gestoDefinido = false
  esHorizontal = false
}

let ro = null
onMounted(() => {
  nextTick(updateArrows)
  if (window.ResizeObserver && container.value) {
    ro = new ResizeObserver(updateArrows)
    ro.observe(container.value)
  }
})

onBeforeUnmount(() => ro?.disconnect())
</script>

<style scoped>
.bordes {
  container-type: inline-size;
  gap: v-bind('gapPx');
}

.bordes > :deep(*) {
  flex-shrink: 0;
  width: calc((100cqw - v-bind('props.edge') - (v-bind('spv.base') - 1) * v-bind('gapPx')) / v-bind('spv.base'));
}

.bordes > :deep(:first-child) {
  margin-left: v-bind('props.edge');
}

.bordes > :deep(:last-child) {
  margin-right: v-bind('props.edge');
}

@media (min-width: 480px) {
  .bordes > :deep(*) {
    width: calc((100cqw - v-bind('props.edge') - (v-bind('spv.sm') - 1) * v-bind('gapPx')) / v-bind('spv.sm'));
  }
}

@media (min-width: 600px) {
  .bordes > :deep(*) {
    width: calc((100cqw - v-bind('props.edge') - (v-bind('spv.tab') - 1) * v-bind('gapPx')) / v-bind('spv.tab'));
  }
}

@media (min-width: 768px) {
  .bordes > :deep(*) {
    width: calc((100cqw - v-bind('props.edge') - (v-bind('spv.md') - 1) * v-bind('gapPx')) / v-bind('spv.md'));
  }
}

@media (min-width: 992px) {
  .bordes > :deep(*) {
    width: calc((100cqw - v-bind('props.edge') - (v-bind('spv.mdlg') - 1) * v-bind('gapPx')) / v-bind('spv.mdlg'));
  }
}

@media (min-width: 1080px) {
  .bordes > :deep(*) {
    width: calc((100cqw - v-bind('props.edgeLg') - (v-bind('spv.lg') - 1) * v-bind('gapPx')) / v-bind('spv.lg'));
  }

  .bordes > :deep(:first-child) {
    margin-left: v-bind('props.edgeLg');
  }

  .bordes > :deep(:last-child) {
    margin-right: v-bind('props.edgeLg');
  }
}

@media (min-width: 1280px) {
  .bordes > :deep(*) {
    width: calc((100cqw - v-bind('props.edgeLg') - (v-bind('spv.xl') - 1) * v-bind('gapPx')) / v-bind('spv.xl'));
  }
}

@media (min-width: 1440px) {
  .bordes > :deep(*) {
    width: calc((100cqw - v-bind('props.edgeLg') - (v-bind('spv.xxl') - 1) * v-bind('gapPx')) / v-bind('spv.xxl'));
  }
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
