<template>
  <div
    ref="root"
    class="w-full overflow-hidden relative"
    :class="$attrs.class"
    :aria-label="ariaLabel"
    role="marquee"
  >
    <div
      ref="track"
      class="w-max flex items-center"
    >
      <div
        ref="copyA"
        class="flex shrink-0 items-center"
        :class="copyClass"
      >
        <template v-for="(item, i) in items" :key="`a-${i}`">
          <div class="shrink-0" :class="itemClass">
            <slot name="item" :item="item" :index="i">{{ item }}</slot>
          </div>
          <span
            v-if="separator"
            class="shrink-0 select-none"
            :class="separatorClass"
            aria-hidden="true"
          >{{ separator }}</span>
        </template>
      </div>

      <div
        aria-hidden="true"
        class="flex shrink-0 items-center"
        :class="copyClass"
      >
        <template v-for="(item, i) in items" :key="`b-${i}`">
          <div class="shrink-0" :class="itemClass">
            <slot name="item" :item="item" :index="i">{{ item }}</slot>
          </div>
          <span
            v-if="separator"
            class="shrink-0 select-none"
            :class="separatorClass"
          >{{ separator }}</span>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { gsap } from 'gsap'

const props = defineProps({
  items: { type: Array, required: true },
  speed: { type: Number, default: 80 },
  direction: { type: String, default: 'left', validator: v => ['left', 'right'].includes(v) },
  separator: { type: String, default: '•' },
  velocityFactor: { type: Number, default: 0.3 },
  copyClass: { type: String, default: 'gap-12' },
  itemClass: { type: String, default: '' },
  separatorClass: { type: String, default: 'opacity-40' },
  ariaLabel: { type: String, default: 'Contenido en movimiento continuo' },
})

defineOptions({ inheritAttrs: false })

const root = useTemplateRef('root')
const track = useTemplateRef('track')
const copyA = useTemplateRef('copyA')

useGsapContext(root, (ctx) => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) {
    return
  }

  const isMobile = window.matchMedia('(max-width: 767px)').matches
  const effectiveVelocityFactor = props.velocityFactor * (isMobile ? 0.5 : 1)

  const baseScale = 1

  const initialCopyWidth = copyA.value?.offsetWidth ?? 0
  const initialDuration = initialCopyWidth > 0 ? initialCopyWidth / props.speed : 1


  const from = props.direction === 'left' ? 0 : -50
  const to = props.direction === 'left' ? -50 : 0

  const tl = gsap.timeline({ repeat: -1, defaults: { ease: 'none' } })
  const scrollTween = tl.fromTo(
    track.value,
    { xPercent: from },
    { xPercent: to, duration: initialDuration }
  ).getChildren()[0]

  function setDuration() {
    const copyWidth = copyA.value?.offsetWidth ?? 0
    if (copyWidth <= 0) return
    const newDur = copyWidth / props.speed
    if (Math.abs(scrollTween.duration() - newDur) < 0.001) return
    const progress = scrollTween.progress()
    scrollTween.duration(newDur)
    scrollTween.progress(progress)
  }

  setDuration()

  const ro = new ResizeObserver(() => setDuration())
  if (copyA.value) ro.observe(copyA.value)

  const setTimeScale = gsap.quickTo(tl, 'timeScale', {
    duration: 0.6,
    ease: 'power3.out',
  })
  tl.timeScale(baseScale)

  const clampScale = gsap.utils.clamp(-2, 2)

  const { subscribe } = useScrollVelocity()
  const unsubscribe = subscribe((velocity) => {
    const target = clampScale(baseScale + (velocity * effectiveVelocityFactor) / 100)
    setTimeScale(target)
  })

  ctx.add(() => {
    ro.disconnect()
    unsubscribe()
  })
})
</script>
