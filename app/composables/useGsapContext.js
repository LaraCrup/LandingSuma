import { gsap } from 'gsap'

export function useGsapContext(root, setup) {
  let ctx = null

  onMounted(() => {
    if (!root.value) return
    ctx = gsap.context(() => {}, root.value)
    ctx.add(() => setup(ctx, gsap))
  })

  onBeforeUnmount(() => {
    ctx?.revert()
    ctx = null
  })

  return {
    getContext: () => ctx,
  }
}
