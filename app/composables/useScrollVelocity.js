import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let subscribers = new Set()
let scrollTrigger = null
let lastVelocity = 0

function ensureStarted() {
  if (scrollTrigger) return

  scrollTrigger = ScrollTrigger.create({
    trigger: document.body,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      lastVelocity = self.getVelocity()
    },
  })
}

function ensureStopped() {
  if (subscribers.size > 0) return
  scrollTrigger?.kill()
  scrollTrigger = null
  lastVelocity = 0
}

export function useScrollVelocity() {
  function subscribe(fn) {
    subscribers.add(fn)
    ensureStarted()

    fn(lastVelocity)

    return () => {
      subscribers.delete(fn)
      ensureStopped()
    }
  }

  return { subscribe }
}

if (typeof window !== 'undefined') {
  gsap.ticker.add(() => {
    if (subscribers.size === 0) return
    for (const fn of subscribers) fn(lastVelocity)
  })
}
