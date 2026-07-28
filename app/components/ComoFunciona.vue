<template>
  <section ref="root"
    class="w-full lg:min-h-dvh flex flex-col justify-center relative bg-midlight px-5 sm:px-8 md:px-10 lg:px-16 xxl:px-32 py-8 lg:pt-[110px] lg:short:pt-[100px] lg:pb-16 lg:short:pb-8">
    <div ref="filaRef"
      class="xxl:max-w-[75rem] w-full flex flex-col lg:flex-row items-center lg:justify-between gap-8 lg:gap-12 short:gap-6 lg:short:gap-8 relative xxl:mx-auto">

      <svg class="hidden lg:block absolute inset-0 w-full h-full z-0 pointer-events-none overflow-visible"
        aria-hidden="true">
        <path ref="hiloPath" fill="none" stroke="#157A6E" stroke-width="2.5" stroke-linecap="round" opacity="0.5" />
      </svg>

      <div class="w-full lg:w-[42%] xxl:w-[38%] flex flex-col items-center lg:items-stretch gap-8 lg:gap-7 short:gap-6 lg:short:gap-5 relative z-10 order-1">
        <h2 ref="titleRef"
          class="font-heading text-3xl lg:text-5xl short:text-4xl text-primary font-medium leading-[1.05] text-center lg:text-left order-1 lg:order-none">
          Así funciona <span class="text-green-dark">suma</span>
        </h2>

        <ul class="flex justify-center items-center gap-3 order-2 lg:hidden">
          <li v-for="(p, i) in pasos" :key="i">
            <button @click="activo = i" :aria-current="activo === i" :aria-label="p.titulo"
              :class="['w-14 h-14 short:w-12 short:h-12 flex justify-center items-center border border-transparent rounded-full font-heading text-xl short:text-lg font-medium tabular-nums transition-all duration-300',
                activo === i
                  ? 'bg-green-dark text-accent shadow-[0_16px_34px_-24px_rgba(18,83,76,0.5)]'
                  : i < activo
                    ? 'bg-green-dark/45 text-accent'
                    : 'bg-light text-primary hover:bg-light/80']">
              0{{ i + 1 }}
            </button>
          </li>
        </ul>

        <Transition name="pantalla" mode="out-in">
          <p :key="activo"
            class="max-w-[24ch] font-heading text-xl short:text-lg text-green-dark font-semibold text-center order-3 lg:hidden">
            {{ pasos[activo].titulo }}
          </p>
        </Transition>

        <ul class="hidden lg:flex flex-col gap-2.5 short:gap-2">
          <li v-for="(p, i) in pasos" :key="i" :ref="el => { if (el) pasoEls[i] = el }">
            <button @click="activo = i" :aria-current="activo === i" :class="['w-full flex items-center gap-4 lg:gap-5 border rounded-2xl transition-all duration-300 px-4 lg:px-5 py-8 lg:py-10 short:py-8',
              activo === i
                ? 'border-transparent bg-green-dark shadow-[0_16px_34px_-24px_rgba(18,83,76,0.5)]'
                : i < activo
                  ? 'border-transparent bg-green-dark/45'
                  : 'border-transparent bg-light hover:bg-light/80']">
              <span :class="['font-heading text-2xl font-medium leading-none tabular-nums',
                i <= activo ? 'text-accent' : 'text-primary']">
                0{{ i + 1 }}
              </span>
              <span :class="['font-heading text-lg lg:text-xl font-semibold',
                i <= activo ? 'text-light' : 'text-green-dark']">
                {{ p.titulo }}
              </span>
            </button>
          </li>
        </ul>
      </div>

      <div class="w-full lg:w-auto flex justify-center lg:justify-end relative z-10 order-2">
        <PhoneShell ref="phoneWrap" :toast="toast" :nivel="nivel" :frase="pasos[activo].frase"
          width="w-[240px] lg:w-[264px] short:w-[248px] xxl:w-[320px] xxl:short:w-[270px]">
          <Transition name="pantalla" mode="out-in">
            <div :key="activo" class="flex flex-col gap-3.5">

              <template v-if="activo === 0">
                <p class="font-heading text-base text-green-dark font-semibold">Nuevo hábito</p>
                <input v-model="nuevoNombre" placeholder="Ej: Meditar 10 min"
                  class="w-full border border-gray/60 rounded-xl text-sm font-semibold outline-none focus:border-primary px-3.5 py-3" />
                <div class="flex justify-center gap-3">
                  <button v-for="emoji in emojis" :key="emoji" @click="nuevoEmoji = emoji" :class="['w-9 h-9 flex items-center justify-center rounded-full text-base transition-colors duration-150',
                    nuevoEmoji === emoji ? 'bg-accent' : 'bg-light']">
                    {{ emoji }}
                  </button>
                </div>
                <button @click="crearHabito" :disabled="!nuevoNombre.trim()"
                  class="w-full bg-primary hover:bg-green-dark rounded-full text-sm text-light font-semibold transition-colors duration-200 active:scale-[0.98] disabled:opacity-40 py-3.5">
                  Crear hábito
                </button>
              </template>

              <template v-else-if="activo === 1">
                <p class="font-heading text-base text-green-dark font-semibold">Mis hábitos</p>
                <HabitCard v-for="habito in habitosVisibles" :key="habito.name" :habit="habito" v-model="habito.done"
                  @completed="onCompletado" />
              </template>

              <template v-else-if="activo === 2">
                <p class="font-heading text-base text-green-dark font-semibold">Tu racha</p>
                <div class="flex flex-col gap-3.5 bg-green-dark rounded-2xl p-4">
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-light/80">Racha actual</span>
                    <span class="flex items-center gap-1.5 text-base text-accent font-bold">
                      <NuxtImg src="/images/brillo-accent.svg" alt="" class="w-4 h-4" />
                      {{ diasRacha }} días
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <div v-for="(d, i) in ['L', 'M', 'M', 'J', 'V', 'S', 'D']" :key="i"
                      class="flex flex-col items-center gap-1.5">
                      <span class="text-[11px] text-light/50">{{ d }}</span>
                      <div
                        :class="['w-5 h-5 lg:w-6 lg:h-6 flex items-center justify-center rounded-full transition-colors duration-300', i < diasRacha ? 'bg-accent' : 'border border-light/25']">
                        <NuxtImg v-if="i < diasRacha" src="/images/brillo-dark-green.svg" alt="" class="w-2.5 lg:w-3" />
                      </div>
                    </div>
                  </div>
                </div>
                <button @click="next"
                  class="pulso-color w-full flex justify-center items-center rounded-full text-sm text-light font-semibold active:scale-[0.98] py-3">
                  Ver mis recompensas
                </button>
              </template>

              <template v-else>
                <p class="font-heading text-base text-green-dark font-semibold">Beneficios</p>
                <div class="flex justify-between items-center bg-green-dark rounded-2xl p-3.5 short:p-2.5">
                  <span class="text-sm text-accent font-bold">Tus puntos</span>
                  <span class="flex items-center gap-1.5 text-base text-accent font-bold">
                    <NuxtImg src="/images/brillo-light-green.svg" alt="" class="w-4 h-4" />
                    {{ puntos }} XP
                  </span>
                </div>
                <button v-for="premio in premios.slice(0, 2)" :key="premio.nombre" @click="canjear(premio)"
                  :disabled="puntos < premio.pts || canjeados.includes(premio.nombre)"
                  :class="['w-full flex flex-col gap-2.5 bg-light rounded-2xl transition-all duration-200 active:scale-[0.98] p-4 short:p-3',
                    puntos < premio.pts || canjeados.includes(premio.nombre) ? '' : 'hover:shadow-[0_10px_24px_-14px_rgba(18,83,76,0.5)]']">
                  <div class="w-full min-w-0 flex items-center gap-3">
                    <div class="w-10 h-10 short:w-9 short:h-9 flex flex-shrink-0 items-center justify-center rounded-full bg-gradient-secondary text-lg">
                      {{ premio.emoji }}
                    </div>
                    <p class="min-w-0 flex-1 text-sm text-dark font-semibold text-left">{{ premio.nombre }}</p>
                  </div>
                  <span :class="['w-full rounded-full text-xs font-bold text-center whitespace-nowrap transition-colors duration-300 px-3 py-2',
                    canjeados.includes(premio.nombre) ? 'bg-green-light text-light' : puntos >= premio.pts ? 'bg-accent text-green-dark' : 'bg-gray text-dark']">
                    {{ canjeados.includes(premio.nombre) ? 'Canjeado' : puntos >= premio.pts ? 'Canjear' : premio.pts + ' pts' }}
                  </span>
                </button>
              </template>

            </div>
          </Transition>
        </PhoneShell>
      </div>
    </div>
  </section>
</template>

<script setup>
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'

const emojis = ['🧘', '💧', '🏃', '📖']

const premios = [
  { emoji: '🥤', nombre: '2x1 smoothies', marca: 'Marca aliada', pts: 250 },
  { emoji: '🏋️', nombre: 'Pase de gym', marca: 'Marca aliada', pts: 400 },
  { emoji: '🧦', nombre: '20% running', marca: 'Marca aliada', pts: 300 },
]

const habitos = ref([
  { icon: '🚶', name: 'Caminar', goal: 1, streak: 0, done: false },
  { icon: '💧', name: 'Agua', goal: 2, streak: 0, done: false },
])

const activo = ref(0)
const nuevoNombre = ref('')
const nuevoEmoji = ref('🧘')
const creado = ref(false)
const toast = ref(null)
let toastTimer = null

const RACHA_BASE = 5
const PUNTOS_BASE = 280
const PUNTOS_POR_HABITO = 40

// Tras crear el hábito, el paso 2 muestra solo ese (el último pusheado). Si el usuario
// saltó directo al paso 2 sin crear nada, mostramos los de ejemplo para que no quede vacío.
const habitosVisibles = computed(() => creado.value ? habitos.value.slice(-1) : habitos.value)

const completados = computed(() => habitosVisibles.value.filter(h => h.done).length)
const todosHechos = computed(() => completados.value === habitosVisibles.value.length)
const diasRacha = computed(() => RACHA_BASE + (todosHechos.value ? 1 : 0))
const puntos = computed(() => PUNTOS_BASE + completados.value * PUNTOS_POR_HABITO)
const xp = computed(() => 210 + completados.value * 30)
const nivel = computed(() => Math.floor(xp.value / 300) + 3)

const pasos = [
  { titulo: 'Creá tu primer hábito', frase: 'Pequeños pasos, grandes cambios' },
  { titulo: 'Completalo cada día', frase: 'Hoy es un buen día para sumar' },
  { titulo: 'Subí tu racha y nivel', frase: 'Cada hábito te acerca a quien querés ser' },
  { titulo: 'Canjeá tus recompensas', frase: 'Tu constancia vale' },
]

function next() { if (activo.value < pasos.length - 1) activo.value++ }
function prev() { if (activo.value > 0) activo.value-- }

const canjeados = ref([])
function canjear(premio) {
  if (canjeados.value.includes(premio.nombre)) return
  canjeados.value.push(premio.nombre)
  mostrarToast(0, `¡Canjeaste ${premio.nombre}!`)
}

function mostrarToast(xpGanado, label) {
  clearTimeout(toastTimer)
  toast.value = { xp: xpGanado, label }
  toastTimer = setTimeout(() => { toast.value = null }, 2200)
}

let avanceTimer = null
function onCompletado() {
  const faltan = habitos.value.length - completados.value
  mostrarToast(30, faltan > 0 ? `¡Bien! Faltan ${faltan}` : '¡Todos completos! 🎉')
  if (activo.value === 1 && todosHechos.value) {
    clearTimeout(avanceTimer)
    avanceTimer = setTimeout(next, 900)
  }
}

function crearHabito() {
  habitos.value.push({ icon: nuevoEmoji.value, name: nuevoNombre.value.trim(), goal: 1, streak: 0, done: false })
  creado.value = true
  nuevoNombre.value = ''
  mostrarToast(15, '¡Nuevo hábito creado!')
  clearTimeout(avanceTimer)
  avanceTimer = setTimeout(next, 900)
}

onUnmounted(() => {
  clearTimeout(toastTimer)
  clearTimeout(avanceTimer)
})

const root = useTemplateRef('root')
const titleRef = useTemplateRef('titleRef')
const filaRef = useTemplateRef('filaRef')
const phoneWrap = useTemplateRef('phoneWrap')
const hiloPath = useTemplateRef('hiloPath')
const pasoEls = ref([])

function actualizarHilo() {
  if (!filaRef.value || !hiloPath.value || !phoneWrap.value) return
  const el = pasoEls.value[activo.value]
  const phoneEl = phoneWrap.value?.$el ?? phoneWrap.value
  if (!el || !phoneEl || !el.offsetParent) return
  const base = filaRef.value.getBoundingClientRect()
  const paso = el.getBoundingClientRect()
  const phone = phoneEl.getBoundingClientRect()

  const x1 = paso.right - base.left
  const y1 = paso.top + paso.height / 2 - base.top
  const x2 = phone.left - base.left + 8
  const y2 = phone.top + phone.height / 2 - base.top

  const dx = (x2 - x1) * 0.5
  const d = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`
  hiloPath.value.setAttribute('d', d)
}

function pintarHilo() {
  actualizarHilo()
  const path = hiloPath.value
  if (!path || !path.getAttribute('d')) return
  const len = path.getTotalLength()
  gsap.fromTo(path,
    { strokeDasharray: len, strokeDashoffset: len },
    { strokeDashoffset: 0, duration: 0.7, ease: 'power2.inOut' })
}

watch(activo, () => nextTick(pintarHilo))

useGsapContext(root, (ctx) => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  nextTick(pintarHilo)
  const onResize = () => actualizarHilo()
  window.addEventListener('resize', onResize)
  ctx.add(() => () => window.removeEventListener('resize', onResize))

  if (reduced) return

  document.fonts.ready.then(() => {
    if (!titleRef.value) return
    const split = new SplitText(titleRef.value, { type: 'words' })
    ctx.add(() => {
      gsap.from(split.words, {
        yPercent: 110, opacity: 0, duration: 0.8, stagger: 0.05, ease: 'power4.out',
        scrollTrigger: { trigger: root.value, start: 'top 75%' },
      })
    })
    nextTick(pintarHilo)
  })
})
</script>

<style scoped>
.pantalla-enter-active,
.pantalla-leave-active {
  transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.23, 1, 0.32, 1);
}

.pantalla-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.pantalla-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.pulso-color {
  background-image: linear-gradient(100deg, #12534C, #157A6E, #499F68, #157A6E, #12534C);
  background-size: 300% 100%;
  background-position: 0% 50%;
  animation: flujo-color 4s linear infinite;
}

@keyframes flujo-color {
  to { background-position: -300% 50%; }
}

@media (prefers-reduced-motion: reduce) {
  .pulso-color { animation: none; background-image: none; background-color: #157A6E; }
}
</style>
