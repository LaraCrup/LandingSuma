<template>
  <section ref="root" class="w-full relative bg-midlight overflow-hidden py-14 lg:py-24">
    <div class="xxl:max-w-[75rem] w-full flex flex-col items-center gap-8 lg:gap-12 xxl:mx-auto">
      <div class="flex flex-col items-center text-center px-5 sm:px-8 md:px-10 lg:px-16 xxl:px-32">
        <h2 ref="titleRef" class="max-w-[20ch] font-heading text-3xl lg:text-5xl text-primary font-medium leading-[1.05]">
          Rascá y descubrí tu beneficio
        </h2>
      </div>

      <div class="w-full flex flex-col gap-6 mdlg:hidden px-5 sm:px-8 md:px-10">
        <RascaCard v-for="premio in premios" :key="premio.nombre" :premio="premio" />
      </div>

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
  { nombre: '5% OFF en zapatillas deportivas', requisito: 'Nivel 1', marca: { nombre: 'Nike', logo: '/images/marcas/nike.webp' } },
  { nombre: 'Clase privada de yoga personalizada', requisito: 'Nivel 4', marca: { nombre: 'Bhumi Yoga Studio', logo: '/images/marcas/bhumi.webp' } },
  { nombre: 'Programa de nutrición personalizado', requisito: 'Nivel 8', marca: { nombre: 'Star Nutrition', logo: '/images/marcas/star-nutrition.webp' } },
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
