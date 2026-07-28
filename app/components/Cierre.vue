<template>
  <section ref="root" class="w-full relative bg-green-dark overflow-hidden" data-cursor-dark>
    <img v-for="(b, i) in brillos" :key="i" :ref="el => { if (el) brilloEls[i] = el }"
      src="/images/brillo-accent.svg" alt="" aria-hidden="true"
      :class="['brillo absolute z-0 pointer-events-none', b.desdeSm ? 'hidden sm:block' : '']"
      :style="{ width: b.size + 'px', left: b.left, top: b.top, '--op': b.op }" />

    <div class="w-full max-w-[75rem] flex flex-col items-center gap-8 lg:gap-14 relative z-[1] text-center px-5 sm:px-8 pt-20 lg:pt-32 mx-auto">
      <h2 ref="titleRef"
        class="font-heading text-[17vw] lg:text-[10rem] xxl:text-[12rem] text-light font-medium leading-[0.95] tracking-tight">
        suma
      </h2>

      <NuxtLink to="https://suma-proyecto-final.vercel.app/iniciar-sesion" target="_blank" rel="noopener"
        class="tipo-in flex items-center gap-2.5 relative bg-accent hover:bg-light rounded-full text-green-dark text-base lg:text-lg font-bold transition-colors duration-200 px-8 lg:px-10 py-3.5 lg:py-4">
        <NuxtImg src="/images/download-dark.svg" alt="" class="w-4 h-4" />
        Descargar
      </NuxtLink>
    </div>

    <footer class="w-full border-t border-light/10 mt-16 lg:mt-24 px-5 pt-5 pb-8 lg:pb-10 relative z-[1]">
      <div class="w-full max-w-[75rem] flex flex-col sm:flex-row justify-between items-center gap-2 mx-auto">
        <div class="flex items-center gap-2.5 order-2 sm:order-1">
          <NuxtImg src="/images/isotipo.svg" alt="suma" class="h-6" />
          <p class="text-xs text-light/50">© {{ anio }} Suma. Todos los derechos reservados.</p>
        </div>
        <nav aria-label="Redes sociales" class="flex items-center gap-5 order-1 sm:order-2">
          <NuxtLink to="#" class="text-sm text-light/70 hover:text-accent transition-colors duration-200">Instagram</NuxtLink>
          <NuxtLink to="#" class="text-sm text-light/70 hover:text-accent transition-colors duration-200">TikTok</NuxtLink>
        </nav>
      </div>
    </footer>
  </section>
</template>

<script setup>
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'

const brillos = [
  { left: '8%', top: '16%', size: 64, op: 0.9 },
  { left: '25%', top: '42%', size: 24, op: 0.5 },
  { left: '12%', top: '52%', size: 46, op: 0.6 },
  { left: '32%', top: '68%', size: 18, op: 0.4 },
  { left: '80%', top: '10%', size: 70, op: 0.85 },
  { left: '80%', top: '40%', size: 30, op: 0.55 },
  { left: '86%', top: '52%', size: 52, op: 0.6 },
  { left: '78%', top: '70%', size: 20, op: 0.45 },
  { left: '3%', top: '36%', size: 30, op: 0.5, desdeSm: true },
  { left: '17%', top: '6%', size: 22, op: 0.45, desdeSm: true },
  { left: '5%', top: '72%', size: 36, op: 0.5, desdeSm: true },
  { left: '22%', top: '26%', size: 14, op: 0.35, desdeSm: true },
  { left: '38%', top: '9%', size: 18, op: 0.4, desdeSm: true },
  { left: '20%', top: '52%', size: 12, op: 0.3, desdeSm: true },
  { left: '58%', top: '5%', size: 14, op: 0.35, desdeSm: true },
  { left: '70%', top: '10%', size: 26, op: 0.5, desdeSm: true },
  { left: '96%', top: '34%', size: 22, op: 0.45, desdeSm: true },
  { left: '76%', top: '54%', size: 16, op: 0.4, desdeSm: true },
  { left: '66%', top: '74%', size: 24, op: 0.45, desdeSm: true },
  { left: '84%', top: '76%', size: 28, op: 0.45, desdeSm: true },
]

const anio = new Date().getFullYear()

const root = useTemplateRef('root')
const titleRef = useTemplateRef('titleRef')
const brilloEls = ref([])

useGsapContext(root, (ctx) => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) return

  nextTick(() => {
    brilloEls.value.forEach((el, i) => {
      if (!el) return
      gsap.to(el, {
        y: -12 - (i % 4) * 3,
        duration: 3.2 + (i % 5) * 0.45,
        yoyo: true, repeat: -1, ease: 'sine.inOut',
        delay: (i % 7) * 0.35,
      })
    })
  })

  gsap.set('.tipo-in', { opacity: 0, y: 30 })

  document.fonts.ready.then(() => {
    if (!titleRef.value) return
    const split = new SplitText(titleRef.value, { type: 'chars' })
    ctx.add(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.value, start: 'top 70%' },
        defaults: { ease: 'power4.out' },
      })
      tl.from(split.chars, { yPercent: 120, opacity: 0, rotation: 6, duration: 1, stagger: 0.06 })
        .to('.tipo-in', { opacity: 1, y: 0, duration: 0.8, stagger: 0.15 }, 0.5)
    })
  })
})
</script>

<style scoped>
.brillo {
  opacity: calc(var(--op) * 0.45);
}

@media (min-width: 1080px) {
  .brillo {
    opacity: var(--op);
  }
}
</style>
