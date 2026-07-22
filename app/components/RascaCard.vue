<template>
  <div
    class="rasca-card flex flex-col bg-white border border-primary/10 rounded-[28px] overflow-hidden shadow-[0_24px_50px_-30px_rgba(18,83,76,0.55)]">
    <div class="w-full relative overflow-hidden">
      <div class="w-full aspect-[4/3] flex flex-col items-center justify-center gap-2.5 bg-gradient-to-b from-midlight to-white p-6">
        <div class="w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-secondary text-3xl shadow-[0_8px_20px_-8px_rgba(18,83,76,0.5)]">
          {{ premio.emoji }}
        </div>
        <p class="min-h-[2lh] font-heading text-2xl text-green-dark font-bold text-center leading-tight">{{ premio.nombre }}</p>
        <p class="min-h-[2lh] text-base text-dark/75 text-center leading-snug">{{ premio.detalle }}</p>
      </div>
      <canvas ref="canvas"
        class="absolute inset-0 w-full h-full touch-pan-y cursor-grab active:cursor-grabbing"
        :class="revelado ? 'pointer-events-none' : ''" />
    </div>

    <div class="flex items-center justify-between border-t border-primary/8 px-4 py-3.5">
      <span class="flex items-center gap-1.5 text-base text-green-dark font-semibold">
        <span class="w-7 h-7 flex items-center justify-center bg-green-dark rounded-full text-sm">🔥</span>
        {{ premio.requisito }}
      </span>
      <Transition name="listo">
        <span v-if="revelado" class="flex items-center gap-1 bg-accent rounded-full text-xs text-green-dark font-bold px-3 py-1.5">
          ✓ Desbloqueado
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

  const marca = props.premio.marca
  const cx = rect.width / 2
  const cy = rect.height / 2 - 16

  const foil = ctx2d.createLinearGradient(0, 0, rect.width, rect.height)
  foil.addColorStop(0, '#1c6b62')
  foil.addColorStop(0.45, '#2f8a7d')
  foil.addColorStop(0.55, '#3fa08f')
  foil.addColorStop(1, '#12534C')
  ctx2d.fillStyle = foil
  ctx2d.fillRect(0, 0, rect.width, rect.height)

  ctx2d.fillStyle = 'rgba(255,255,255,0.06)'
  for (let x = 6; x < rect.width; x += 14) {
    for (let y = 6; y < rect.height; y += 14) {
      ctx2d.beginPath()
      ctx2d.arc(x, y, 1, 0, Math.PI * 2)
      ctx2d.fill()
    }
  }

  const r = 30
  ctx2d.strokeStyle = 'rgba(255,255,255,0.35)'
  ctx2d.lineWidth = 2
  ctx2d.beginPath()
  ctx2d.arc(cx, cy, r + 7, 0, Math.PI * 2)
  ctx2d.stroke()

  ctx2d.fillStyle = 'rgba(243,252,247,0.95)'
  ctx2d.beginPath()
  ctx2d.arc(cx, cy, r, 0, Math.PI * 2)
  ctx2d.fill()

  ctx2d.textAlign = 'center'
  ctx2d.textBaseline = 'middle'
  ctx2d.fillStyle = '#12534C'
  ctx2d.font = '600 28px "Montserrat Alternates", sans-serif'
  ctx2d.fillText(marca.inicial, cx, cy + 2)

  ctx2d.fillStyle = 'rgba(243,252,247,0.95)'
  ctx2d.font = '700 20px Quicksand, sans-serif'
  ctx2d.fillText(marca.nombre, cx, cy + r + 30)

  ctx2d.textBaseline = 'alphabetic'
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
    if (transparentes / (data.length / 64) > 0.60) {
      revelado.value = true
      gsap.to(el, { opacity: 0, duration: 0.5, ease: 'power2.out' })
    }
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
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
}

.listo-enter-from {
  transform: scale(0.5);
  opacity: 0;
}
</style>
