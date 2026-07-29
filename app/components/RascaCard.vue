<template>
  <div
    class="rasca-card flex flex-col bg-light border border-primary/20 rounded-[28px] overflow-hidden shadow-[0_24px_50px_-30px_rgba(18,83,76,0.55)]">
    <div class="w-full relative overflow-hidden">
      <div class="w-full h-32 flex flex-col items-center justify-center bg-gradient-secondary p-5">
        <p class="min-h-[2lh] flex items-center justify-center font-heading text-xl text-light font-bold text-center leading-tight">{{ premio.nombre }}</p>
      </div>
      <!-- La marca solo existía pintada en el canvas: invisible para lectores de pantalla y buscadores -->
      <span class="sr-only">Beneficio de {{ premio.marca.nombre }}. {{ premio.requisito }}.</span>
      <canvas ref="canvas" aria-hidden="true"
        class="absolute inset-0 w-full h-full touch-pan-y cursor-grab active:cursor-grabbing"
        :class="revelado ? 'pointer-events-none' : ''" />

      <!-- Rascar es un gesto de trayectoria: hace falta una alternativa accesible por teclado -->
      <button v-if="!revelado" type="button" @click="revelarTodo"
        class="sr-only focus:not-sr-only focus:absolute focus:z-10 focus:inset-x-4 focus:top-4 focus:bg-green-dark focus:rounded-full focus:text-light focus:text-sm focus:font-semibold focus:px-4 focus:py-2">
        Revelar el beneficio de {{ premio.marca.nombre }}
      </button>
    </div>

    <div class="h-[62px] border-t border-primary/10" role="status">
      <Transition name="listo" mode="out-in">
        <span v-if="revelado"
          class="w-full h-full flex items-center justify-center bg-accent text-base text-green-dark font-bold px-4">
          Desbloqueado
        </span>
        <span v-else class="w-full h-full flex items-center justify-center text-base text-green-dark font-semibold px-4">
          {{ premio.requisito }}
        </span>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { gsap } from 'gsap'

const props = defineProps({
  premio: { type: Object, required: true },
})

const BRUSH = 34
const canvas = ref(null)
const revelado = ref(false)
let logoImg = null

function pintarFoil() {
  const el = canvas.value
  if (!el) return
  const dpr = Math.min(window.devicePixelRatio || 1, 3)
  const rect = el.getBoundingClientRect()
  if (!rect.width || !rect.height) return
  el.width = Math.round(rect.width * dpr)
  el.height = Math.round(rect.height * dpr)
  const ctx2d = el.getContext('2d', { willReadFrequently: true })
  ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0)

  const cx = rect.width / 2
  const cy = rect.height / 2 - 16

  const foil = ctx2d.createLinearGradient(0, 0, rect.width, rect.height)
  foil.addColorStop(0, '#9fb3ab')
  foil.addColorStop(0.45, '#c3d3cb')
  foil.addColorStop(0.55, '#d5e2da')
  foil.addColorStop(1, '#93a9a1')
  ctx2d.fillStyle = foil
  ctx2d.fillRect(0, 0, rect.width, rect.height)

  ctx2d.fillStyle = 'rgba(18,83,76,0.07)'
  for (let x = 6; x < rect.width; x += 14) {
    for (let y = 6; y < rect.height; y += 14) {
      ctx2d.beginPath()
      ctx2d.arc(x, y, 1, 0, Math.PI * 2)
      ctx2d.fill()
    }
  }

  ctx2d.textAlign = 'center'
  ctx2d.textBaseline = 'middle'
  ctx2d.fillStyle = 'rgba(18,83,76,0.85)'
  ctx2d.font = '700 20px Quicksand, sans-serif'
  ctx2d.fillText('Rascá acá', cx, cy + 46)
  ctx2d.textBaseline = 'alphabetic'

  if (logoImg?.complete && logoImg.naturalWidth) {
    const max = 96
    const escala = Math.min(max / logoImg.naturalWidth, 52 / logoImg.naturalHeight)
    const w = logoImg.naturalWidth * escala
    const h = logoImg.naturalHeight * escala
    ctx2d.globalAlpha = 0.55
    ctx2d.drawImage(logoImg, cx - w / 2, cy - h / 2, w, h)
    ctx2d.globalAlpha = 1
  }
}

function revelarTodo() {
  if (revelado.value) return
  revelado.value = true
  if (canvas.value) gsap.to(canvas.value, { opacity: 0, duration: 0.5, ease: 'power2.out' })
}

let cleanup = null

function conectarRasca() {
  const el = canvas.value
  if (!el) return
  const ctx2d = el.getContext('2d', { willReadFrequently: true })

  let rascando = false
  let ultimo = null

  const punto = (e) => {
    const r = el.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top }
  }

  const borrar = (p) => {
    ctx2d.globalCompositeOperation = 'destination-out'
    ctx2d.lineWidth = BRUSH * 2
    ctx2d.lineCap = 'round'
    ctx2d.lineJoin = 'round'
    ctx2d.beginPath()
    ctx2d.arc(p.x, p.y, BRUSH, 0, Math.PI * 2)
    ctx2d.fill()
    if (ultimo) {
      ctx2d.beginPath()
      ctx2d.moveTo(ultimo.x, ultimo.y)
      ctx2d.lineTo(p.x, p.y)
      ctx2d.stroke()
    }
    ultimo = p
  }

  const medirRevelado = () => {
    const data = ctx2d.getImageData(0, 0, el.width, el.height).data
    let transparentes = 0
    for (let i = 3; i < data.length; i += 64) {
      if (data[i] === 0) transparentes++
    }
    if (transparentes / (data.length / 64) > 0.60) revelarTodo()
  }

  const empezar = (e) => { rascando = true; ultimo = null; borrar(punto(e)) }
  const mover = (e) => {
    if (!rascando) return
    e.preventDefault()
    borrar(punto(e))
    medirRevelado()
  }
  const soltar = () => {
    if (!rascando) return
    rascando = false
    ultimo = null
    medirRevelado()
  }

  el.addEventListener('pointerdown', empezar)
  el.addEventListener('pointermove', mover)
  window.addEventListener('pointerup', soltar)
  cleanup = () => {
    el.removeEventListener('pointerdown', empezar)
    el.removeEventListener('pointermove', mover)
    window.removeEventListener('pointerup', soltar)
  }
}

let ro = null

onMounted(() => {
  conectarRasca()
  const repintar = () => { if (!revelado.value) pintarFoil() }
  document.fonts.ready.then(() => requestAnimationFrame(repintar))

  logoImg = new Image()
  logoImg.onload = () => requestAnimationFrame(repintar)
  logoImg.src = props.premio.marca.logo

  ro = new ResizeObserver(() => requestAnimationFrame(repintar))
  if (canvas.value) ro.observe(canvas.value)
})

onBeforeUnmount(() => {
  cleanup?.()
  ro?.disconnect()
})
</script>

<style scoped>
.listo-enter-active {
  transition: transform 0.4s cubic-bezier(0.34, 1.4, 0.64, 1), opacity 0.3s ease;
}

.listo-leave-active {
  transition: opacity 0.15s ease;
}

.listo-enter-from,
.listo-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
