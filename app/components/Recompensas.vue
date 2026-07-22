<template>
  <section ref="root" class="w-full relative bg-midlight overflow-hidden py-14 lg:py-24">
    <div class="xxl:max-w-[75rem] w-full flex flex-col items-center gap-8 lg:gap-12 xxl:mx-auto">
      <div class="flex flex-col items-center text-center px-5 sm:px-8 md:px-10 lg:px-16 xxl:px-32">
        <h2 ref="titleRef" class="max-w-[20ch] font-heading text-3xl lg:text-5xl text-primary font-bold leading-[1.05]">
          Rascá tu racha y descubrí el beneficio
        </h2>
      </div>

      <CarouselStatic arrows :gap="20" :slides-per-view="{ base: 1.3, sm: 1.8, tab: 2.2, md: 2.6 }" track-class="pb-7" class="w-full mdlg:hidden">
        <RascaCard v-for="premio in premios" :key="premio.nombre" :premio="premio" />
      </CarouselStatic>

      <div class="w-full hidden mdlg:grid grid-cols-3 gap-7 px-5 sm:px-8 md:px-10 lg:px-16 xxl:px-32">
        <RascaCard v-for="premio in premios" :key="premio.nombre" :premio="premio" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'

const premios = [
  { emoji: '🥤', nombre: '2x1 en smoothies', detalle: 'En cafés y juguerías aliadas.', requisito: 'Racha de 7 días', marca: { nombre: 'Vita Bar', inicial: 'V' } },
  { emoji: '🏋️', nombre: 'Semana de gym gratis', detalle: 'Pase libre en gimnasios aliados.', requisito: 'Racha de 15 días', marca: { nombre: 'FitClub', inicial: 'F' } },
  { emoji: '🎟️', nombre: 'Experiencias sorpresa', detalle: 'Clases y actividades para probar.', requisito: 'Racha de 30 días', marca: { nombre: 'Andar', inicial: 'A' } },
]

const root = useTemplateRef('root')
const titleRef = useTemplateRef('titleRef')

useGsapContext(root, (ctx) => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  document.fonts.ready.then(() => {
    if (!titleRef.value) return
    const split = new SplitText(titleRef.value, { type: 'words' })
    ctx.add(() => {
      gsap.from(split.words, {
        yPercent: 110, opacity: 0, duration: 0.8, stagger: 0.04, ease: 'power4.out',
        scrollTrigger: { trigger: root.value, start: 'top 75%' },
      })
    })
  })

  gsap.from('.rasca-card', {
    y: 60, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power4.out',
    scrollTrigger: { trigger: root.value, start: 'top 65%' },
  })
})
</script>
