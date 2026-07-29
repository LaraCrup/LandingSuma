<template>
  <section ref="root" class="w-full min-h-dvh lg:h-dvh flex flex-col relative lg:fixed lg:inset-0 lg:z-[1] bg-light overflow-hidden">
    <div class="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div
        class="blob w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] absolute top-[6%] left-[4%] bg-primary/35 blur-[55px]" />
      <div
        class="blob w-[28vw] h-[28vw] max-w-[380px] max-h-[380px] absolute top-[30%] right-[6%] bg-accent/45 blur-[60px]" />
      <div
        class="blob w-[24vw] h-[24vw] max-w-[320px] max-h-[320px] absolute bottom-[4%] left-[26%] bg-green-light/40 blur-[55px]" />
    </div>

    <div
      class="min-h-dvh w-full max-w-[75rem] flex flex-col lg:flex-row items-center gap-10 lg:gap-8 relative z-10 px-5 sm:px-8 md:px-10 lg:px-16 xxl:px-0 pt-[80px] lg:pt-[92px] pb-10 lg:pb-0 mx-auto">

      <div
        class="w-full lg:w-[52%] flex flex-col justify-center items-center lg:items-start gap-6 lg:gap-8 relative z-10">
        <div class="flex flex-col items-center lg:items-start gap-3 lg:gap-4">
          <h1 ref="titleRef"
            class="font-heading text-3xl sm:text-4xl xl:text-5xl xxl:short:text-5xl text-green-dark font-medium leading-tight text-center lg:text-left">
            La constancia en tu bienestar merece
            <span class="text-primary">recompensas</span>
          </h1>
          <p class="col-in max-w-[42ch] text-lg lg:text-xl text-green-dark font-semibold text-center lg:text-left">
            Completá tus datos y canjeá tu premio ahora.
          </p>
        </div>
        <div class="col-in w-full max-w-[470px]">
          <RedeemForm />
        </div>
      </div>

      <div class="w-full flex flex-shrink-0 flex-col justify-center gap-3 lg:hidden overflow-x-hidden"
        style="mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent)"
        aria-hidden="true">
        <div v-for="(fila, c) in filas.slice(0, 2)" :key="c" class="fila w-max flex gap-3"
          :data-dir="c % 2 === 0 ? 1 : -1">
          <div v-for="(foto, f) in [...fila, ...fila, ...fila]" :key="f"
            class="w-[130px] sm:w-[150px] shrink-0 relative rounded-2xl overflow-hidden">
            <NuxtImg :src="`/images/habitos/${foto.src}.webp`" :alt="foto.alt" width="300" height="400"
              format="webp" decoding="async" class="w-full aspect-[3/4] object-cover" />
            <div class="absolute inset-0 bg-green-dark/25 mix-blend-multiply" />
          </div>
        </div>
      </div>

      <div
        class="lg:w-[48%] hidden lg:flex h-dvh justify-center gap-4 absolute right-0 top-0"
        style="mask-image: linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)"
        aria-hidden="true">
        <div v-for="(col, c) in filas" :key="c"
          class="columna w-[220px] xxl:w-[240px] flex flex-col gap-4"
          :data-dir="c % 2 === 0 ? 1 : -1">
          <div v-for="(foto, f) in [...col, ...col, ...col]" :key="f"
            class="shrink-0 relative rounded-3xl overflow-hidden">
            <NuxtImg :src="`/images/habitos/${foto.src}.webp`" :alt="foto.alt" width="480" height="640"
              format="webp" decoding="async" class="w-full aspect-[3/4] object-cover" />
            <div class="absolute inset-0 bg-green-dark/25 mix-blend-multiply" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'

const filas = [
  [
    { src: 'correr-parque', alt: 'Hombre corriendo por un camino arbolado de un parque' },
    { src: 'leer-libro-cafe', alt: 'Libro abierto sobre una mesa junto a una taza y un señalador de suma' },
    { src: 'plancha-parque', alt: 'Mujer haciendo plancha sobre el césped de un parque' },
    { src: 'meditar-terraza', alt: 'Hombre meditando sentado sobre una colchoneta al aire libre' },
    { src: 'amigos-parque', alt: 'Tres amigos charlando sentados en el césped de un parque' },
    { src: 'entregar-bolsa', alt: 'Mujer joven entregándole una bolsa a una mujer mayor' },
    { src: 'pasear-perro', alt: 'Hombre paseando a su perro golden retriever por un camino arbolado' },
  ],
  [
    { src: 'escritorio-ordenado', alt: 'Escritorio junto a una ventana con una notebook, una planta y una taza' },
    { src: 'meditar-amanecer', alt: 'Mujer meditando sentada en el césped de un parque al amanecer' },
    { src: 'desayuno-granola', alt: 'Mano sirviendo miel sobre un bowl de granola con frutas' },
    { src: 'andar-en-bici', alt: 'Hombre con casco andando en bicicleta por un parque' },
    { src: 'rutina-de-piel', alt: 'Mujer aplicándose crema frente al espejo del baño' },
    { src: 'escribir-diario', alt: 'Mano escribiendo en un cuaderno junto a un café y una medialuna' },
    { src: 'elongar-en-grupo', alt: 'Grupo de personas elongando en el césped de un parque' },
  ],
  [
    { src: 'leer-en-la-plaza', alt: 'Hombre leyendo un libro sentado en un banco de plaza' },
    { src: 'regar-plantas', alt: 'Mujer regando las plantas de su balcón' },
    { src: 'picnic-en-pareja', alt: 'Pareja compartiendo frutas sentada en el césped' },
    { src: 'preparar-viandas', alt: 'Manos guardando pollo con brócoli y arroz en un tupper' },
    { src: 'brindis-con-limonada', alt: 'Tres amigos brindando con limonada al aire libre' },
    { src: 'elongar-en-balcon', alt: 'Hombre elongando la pierna en el balcón después de entrenar' },
  ],
]

const root = useTemplateRef('root')
const titleRef = useTemplateRef('titleRef')

useGsapContext(root, (ctx) => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const formas = [
    '42% 58% 63% 37% / 41% 44% 56% 59%',
    '67% 33% 47% 53% / 37% 62% 38% 63%',
    '38% 62% 55% 45% / 63% 34% 66% 37%',
    '55% 45% 34% 66% / 58% 63% 37% 42%',
  ]
  const colores = [
    'rgba(21,122,110,0.38)',
    'rgba(215,245,96,0.45)',
    'rgba(73,159,104,0.40)',
    'rgba(18,83,76,0.34)',
  ]
  gsap.utils.toArray('.blob').forEach((blob, i) => {
    gsap.set(blob, { borderRadius: formas[i % formas.length] })
    gsap.to(blob, {
      x: gsap.utils.random(-150, 150),
      y: gsap.utils.random(-140, 140),
      scale: gsap.utils.random(1.2, 1.5),
      rotation: gsap.utils.random(-50, 50),
      duration: gsap.utils.random(3.5, 5),
      yoyo: true, repeat: -1, ease: 'sine.inOut', delay: i * 0.3,
    })
    gsap.to(blob, {
      borderRadius: formas[(i + 2) % formas.length],
      duration: gsap.utils.random(3, 4.5),
      yoyo: true, repeat: -1, ease: 'sine.inOut', delay: i * 0.4,
    })
    const orden = [...colores.slice(i % colores.length), ...colores.slice(0, i % colores.length)]
    gsap.to(blob, {
      keyframes: { backgroundColor: [...orden, orden[0]] },
      duration: gsap.utils.random(14, 18),
      repeat: -1, ease: 'none',
    })
  })

  gsap.set('.col-in', { opacity: 0, y: 24 })

  // El form de canje vive dentro de .col-in: si SplitText o las fuentes fallan, tiene que aparecer igual
  let revelado = false
  const revelarColumna = () => {
    if (revelado) return
    revelado = true
    gsap.to('.col-in', { opacity: 1, y: 0, duration: 0.8, stagger: 0.12 })
  }
  const salvavidas = setTimeout(revelarColumna, 2500)
  ctx.add(() => () => clearTimeout(salvavidas))

  document.fonts.ready.then(() => {
    if (!titleRef.value) return revelarColumna()
    const split = new SplitText(titleRef.value, { type: 'words' })
    ctx.add(() => {
      revelado = true
      clearTimeout(salvavidas)
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
      tl.from(split.words, { yPercent: 110, opacity: 0, duration: 0.9, stagger: 0.05 }, 0.1)
        .to('.col-in', { opacity: 1, y: 0, duration: 0.8, stagger: 0.12 }, 0.35)
    })
  }).catch(revelarColumna)

  gsap.from('.columna', { opacity: 0, x: 60, duration: 1.1, stagger: 0.12, ease: 'power3.out', delay: 0.3 })
  gsap.from('.fila', { opacity: 0, y: 40, duration: 1.1, stagger: 0.12, ease: 'power3.out', delay: 0.3 })

  const pistas = [
    { els: gsap.utils.toArray('.fila'), eje: 'x', medida: 'offsetLeft' },
    { els: gsap.utils.toArray('.columna'), eje: 'y', medida: 'offsetTop' },
  ]
  const loops = []
  function armarLoops() {
    // Re-armar sin restaurar el progreso hace que el loop salte de vuelta al principio
    const progresos = loops.map(t => t.progress())
    loops.forEach(t => t.kill())
    loops.length = 0
    pistas.forEach(({ els, eje, medida }) => {
      els.forEach((el, i) => {
        if (!el.offsetParent) return
        const hijos = el.children
        const n = hijos.length / 3
        const dist = hijos[n][medida] - hijos[0][medida]
        if (!dist) return
        const dir = Number(el.dataset.dir)
        const dur = 26 + i * 6
        const wrap = gsap.utils.wrap(-dist, 0)
        const v = { p: 0 }
        loops.push(gsap.to(v, {
          p: dir === 1 ? -dist : dist,
          duration: dur, ease: 'none', repeat: -1,
          onUpdate: () => gsap.set(el, { [eje]: wrap(v.p) }),
        }))
      })
    })
    loops.forEach((t, i) => { if (progresos[i] != null) t.progress(progresos[i]) })
  }

  armarLoops()

  // Una sola re-medición, cuando ya cargaron todas: re-armar en cada carga suelta
  // reinicia el loop y se ve como un salto.
  const imgs = [...root.value.querySelectorAll('.fila img, .columna img')]
  let pendientes = imgs.filter(img => !img.complete).length
  const alCargar = () => { if (--pendientes === 0) armarLoops() }
  imgs.forEach((img) => {
    if (img.complete) return
    img.addEventListener('load', alCargar, { once: true })
    img.addEventListener('error', alCargar, { once: true })
  })

  const alCambiarViewport = () => armarLoops()
  window.addEventListener('resize', alCambiarViewport)
  ctx.add(() => () => window.removeEventListener('resize', alCambiarViewport))
})
</script>
