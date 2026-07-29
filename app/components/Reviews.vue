<template>
  <section ref="root" class="w-full relative bg-light overflow-hidden py-14 lg:py-24">
    <div class="w-full flex flex-col items-center gap-8 lg:gap-12">
      <div class="flex flex-col items-center gap-3 text-center px-5 sm:px-8">
        <h2 ref="titleRef" class="font-heading text-2xl lg:text-4xl text-primary font-medium leading-tight">
          Lo que dicen quienes ya están sumando
        </h2>
      </div>

      <div class="w-full flex flex-col gap-4 mdlg:gap-5">
        <MarqueeReactive :items="filaA" :speed="45" copy-class="gap-5 pr-5"
          aria-label="Reseñas de usuarios de suma"
          style="mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent)">
          <template #item="{ item }">
            <figure class="w-[280px] mdlg:w-[360px] h-40 mdlg:h-44 flex flex-col justify-between bg-light border border-green-light/40 rounded-3xl p-5">
              <blockquote class="text-base mdlg:text-lg text-dark/85 leading-snug line-clamp-3">“{{ item.quote }}”</blockquote>
              <!-- figcaption tiene que colgar de figure: anidado en un div el HTML no valida -->
              <figcaption class="flex justify-between items-center">
                <span class="flex items-center gap-2.5">
                  <span class="w-8 h-8 flex flex-shrink-0 items-center justify-center rounded-full bg-gradient-secondary text-light text-sm font-semibold">
                    {{ item.name.charAt(0) }}
                  </span>
                  <span class="text-sm text-green-dark font-semibold">{{ item.name }}, {{ item.age }}</span>
                </span>
                <img src="/images/brillo-primary.svg" alt="" class="w-4 h-4" />
              </figcaption>
            </figure>
          </template>
        </MarqueeReactive>

        <MarqueeReactive :items="filaB" :speed="45" direction="right" copy-class="gap-5 pr-5"
          aria-label="Más reseñas de usuarios de suma"
          style="mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent)">
          <template #item="{ item }">
            <figure class="w-[280px] mdlg:w-[360px] h-40 mdlg:h-44 flex flex-col justify-between bg-midlight rounded-3xl p-5">
              <blockquote class="text-base mdlg:text-lg text-dark/85 leading-snug line-clamp-3">“{{ item.quote }}”</blockquote>
              <figcaption class="flex justify-between items-center">
                <span class="flex items-center gap-2.5">
                  <span class="w-8 h-8 flex flex-shrink-0 items-center justify-center rounded-full bg-gradient-secondary text-light text-sm font-semibold">
                    {{ item.name.charAt(0) }}
                  </span>
                  <span class="text-sm text-green-dark font-semibold">{{ item.name }}, {{ item.age }}</span>
                </span>
                <img src="/images/brillo-primary.svg" alt="" class="w-4 h-4" />
              </figcaption>
            </figure>
          </template>
        </MarqueeReactive>
      </div>

      <div class="w-full max-w-[80rem] grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 px-5 sm:px-8 md:px-10 lg:px-16 xxl:px-0 mx-auto">
        <div v-for="stat in stats" :key="stat.label"
          class="stat-card h-full flex flex-col justify-between items-center gap-3 bg-green-dark rounded-3xl text-center p-6 lg:p-8">
          <span class="font-heading text-4xl lg:text-5xl text-accent font-bold tabular-nums">
            <span class="stat-num" :data-target="stat.valor">0</span>{{ stat.sufijo }}
          </span>
          <span class="text-base lg:text-lg text-light">{{ stat.label }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'

const reviews = [
  { name: 'Mica', age: 27, quote: 'Me ayudó a ser constante sin presionarme' },
  { name: 'Agus', age: 22, quote: 'Es la primera vez que puedo sostener un hábito más de una semana' },
  { name: 'Juan', age: 38, quote: 'Amo ver mis rachas, me motiva un montón' },
  { name: 'Dani', age: 52, quote: 'Cambié 3 hábitos simples en 2 semanas' },
  { name: 'Manu', age: 31, quote: 'Me encanta porque me motiva sin exigirme. Siento que voy avanzando de verdad' },
  { name: 'Caro', age: 29, quote: 'Nunca fui constante con nada, y con suma llevo dos meses sin fallar un día' },
  { name: 'Fede', age: 34, quote: 'Lo que más me sirvió es que no te reta si fallás un día, te invita a volver' },
  { name: 'Vale', age: 25, quote: 'Empecé por tomar más agua y terminé sumando el gimnasio sin darme cuenta' },
  { name: 'Nico', age: 41, quote: 'Canjeé mi primer beneficio a las tres semanas y ahí me enganché de verdad' },
  { name: 'Sol', age: 19, quote: 'Me lo bajé por las recompensas y me quedé por la sensación de cumplir' },
  { name: 'Tomás', age: 47, quote: 'Tres meses seguidos entrenando, algo que nunca había logrado solo' },
  { name: 'Flor', age: 30, quote: 'Ver la racha en el celular a la mañana me ordena todo el día' },
]

// Cada fila con reseñas distintas: con 12 ya no hace falta repetirlas entre las dos
const filaA = reviews.slice(0, 6)
const filaB = reviews.slice(6)

const stats = [
  { valor: 12400, sufijo: '+', label: 'hábitos completados' },
  { valor: 92, sufijo: '%', label: 'de los usuarios sostiene su racha más de una semana' },
  { valor: 30, sufijo: '+', label: 'marcas aliadas con beneficios' },
]

const root = useTemplateRef('root')
const titleRef = useTemplateRef('titleRef')

useGsapContext(root, (ctx) => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const nums = gsap.utils.toArray('.stat-num')
  if (reduced) {
    nums.forEach(el => { el.textContent = Number(el.dataset.target).toLocaleString('es-AR') })
    return
  }

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

  gsap.from('.stat-card', {
    y: 50, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power4.out',
    scrollTrigger: { trigger: '.stat-card', start: 'top 85%' },
  })

  const tl = gsap.timeline({ scrollTrigger: { trigger: '.stat-card', start: 'top 85%' } })
  nums.forEach((el) => {
    const target = Number(el.dataset.target)
    const obj = { v: 0 }
    tl.to(obj, {
      v: target,
      duration: 0.9,
      ease: 'power2.out',
      onUpdate: () => { el.textContent = Math.round(obj.v).toLocaleString('es-AR') },
    })
  })
})
</script>
