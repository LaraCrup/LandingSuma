<template>
  <div
    v-if="enabled"
    ref="cursor"
    class="w-[18px] h-[18px] fixed top-0 left-0 z-[200] bg-green-dark box-border rounded-full opacity-0 pointer-events-none -translate-x-1/2 -translate-y-1/2"
    :style="transition"
    aria-hidden="true"
  />
</template>

<script setup>
const HOVER_SELECTOR = 'a, button, [role="button"], input, textarea, select, label, summary, [data-cursor-hover]'

const cursor = ref(null)
const enabled = ref(false)

const transition = 'transition:width .18s,height .18s,background .18s'

onMounted(() => {
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  if (!canHover) return
  enabled.value = true

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
  const lag = { x: mouse.x, y: mouse.y }
  let isHover = false
  let onDark = false
  let visible = false
  let raf = null
  let lastX = lag.x
  let lastY = lag.y

  document.documentElement.classList.add('custom-cursor')

  const onMove = (e) => {
    mouse.x = e.clientX
    mouse.y = e.clientY
    const el = cursor.value
    if (!el) return
    if (!visible) {
      visible = true
      lag.x = mouse.x
      lag.y = mouse.y
      lastX = mouse.x
      lastY = mouse.y
      el.style.opacity = '1'
    }
    const nextHover = !!e.target.closest?.(HOVER_SELECTOR)
    const nextDark = !!e.target.closest?.('[data-cursor-dark]')

    if (nextHover !== isHover || nextDark !== onDark) {
      isHover = nextHover
      onDark = nextDark
      el.style.width = isHover ? '26px' : '18px'
      el.style.height = isHover ? '26px' : '18px'
      el.style.background = onDark
        ? (isHover ? '#12534C' : '#D7F560')
        : (isHover ? '#D7F560' : '#12534C')
    }
  }

  const onLeave = () => {
    if (cursor.value) cursor.value.style.opacity = '0'
    visible = false
  }

  window.addEventListener('pointermove', onMove, { passive: true })
  document.addEventListener('pointerleave', onLeave)

  if (reduce) {
    const loop = () => {
      const el = cursor.value
      if (el) {
        el.style.left = mouse.x + 'px'
        el.style.top = mouse.y + 'px'
      }
      raf = requestAnimationFrame(loop)
    }
    loop()
  } else {
    const loop = () => {
      lag.x += (mouse.x - lag.x) * 0.35
      lag.y += (mouse.y - lag.y) * 0.35
      const el = cursor.value
      if (el) {
        el.style.left = lag.x + 'px'
        el.style.top = lag.y + 'px'
        if (isHover) {
          el.style.transform = 'translate(-50%,-50%)'
        } else {
          const dx = lag.x - lastX
          const dy = lag.y - lastY
          const v = Math.min(Math.hypot(dx, dy) / 14, 1)
          const ang = (Math.atan2(dy, dx) * 180) / Math.PI
          el.style.transform = `translate(-50%,-50%) rotate(${ang}deg) scale(${1 + v * 0.9},${1 - v * 0.4})`
        }
        lastX = lag.x
        lastY = lag.y
      }
      raf = requestAnimationFrame(loop)
    }
    loop()
  }

  onBeforeUnmount(() => {
    if (raf) cancelAnimationFrame(raf)
    window.removeEventListener('pointermove', onMove)
    document.removeEventListener('pointerleave', onLeave)
    document.documentElement.classList.remove('custom-cursor')
  })
})
</script>
