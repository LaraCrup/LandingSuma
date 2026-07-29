<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center bg-green-dark/60 p-4"
        @click.self="emit('close')">
        <div ref="card" role="dialog" aria-modal="true" :aria-labelledby="`${uid}-titulo`"
          :aria-describedby="`${uid}-desc`" tabindex="-1"
          class="modal-card w-full max-w-md relative bg-light rounded-3xl text-center outline-none p-8 md:p-10"
          @keydown.esc="emit('close')" @keydown.tab="atraparFoco">

          <button ref="cerrar" type="button" aria-label="Cerrar" @click="emit('close')"
            class="w-10 h-10 flex items-center justify-center absolute top-3 right-3 text-primary hover:text-green-dark text-xl transition-colors duration-200">
            <span aria-hidden="true">✕</span>
          </button>

          <div :class="['w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-5', iconoFondo]">
            <span class="text-3xl" aria-hidden="true">{{ icono }}</span>
          </div>

          <h2 :id="`${uid}-titulo`" class="font-heading text-2xl text-green-dark font-bold mb-2">{{ titulo }}</h2>
          <p :id="`${uid}-desc`" class="text-base text-dark/80 mb-6">
            <slot>{{ mensaje }}</slot>
          </p>

          <button type="button" @click="emit('close')"
            class="w-full bg-primary hover:bg-green-dark rounded-full text-light text-base font-semibold transition-colors duration-200 active:scale-[0.98] py-3.5">
            {{ accion }}
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  open: { type: Boolean, default: false },
  titulo: { type: String, required: true },
  mensaje: { type: String, default: '' },
  accion: { type: String, default: 'Entendido' },
  icono: { type: String, default: 'ℹ️' },
  iconoFondo: { type: String, default: 'bg-midlight' },
})
const emit = defineEmits(['close'])

const uid = useId()
const card = useTemplateRef('card')
const cerrar = useTemplateRef('cerrar')

const FOCUSABLES = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
let disparador = null

// Ciclar el foco dentro del modal: sin esto se tabula al formulario de atrás
function atraparFoco(e) {
  const els = [...(card.value?.querySelectorAll(FOCUSABLES) ?? [])].filter(el => !el.disabled)
  if (!els.length) return
  const primero = els[0]
  const ultimo = els[els.length - 1]

  if (e.shiftKey && document.activeElement === primero) {
    e.preventDefault()
    ultimo.focus()
  } else if (!e.shiftKey && document.activeElement === ultimo) {
    e.preventDefault()
    primero.focus()
  }
}

watch(() => props.open, async (abierto) => {
  if (abierto) {
    disparador = document.activeElement
    document.body.style.overflow = 'hidden'
    await nextTick()
    cerrar.value?.focus()
  } else {
    document.body.style.overflow = ''
    // El disparador suele quedar deshabilitado mientras carga: recién ahí vuelve a aceptar foco
    await nextTick()
    disparador?.focus?.()
    disparador = null
  }
})

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<style scoped>
.modal-enter-active {
  transition: opacity 0.25s cubic-bezier(0.23, 1, 0.32, 1);
}

.modal-leave-active {
  transition: opacity 0.15s ease;
}

.modal-enter-active .modal-card {
  transition: transform 0.25s cubic-bezier(0.23, 1, 0.32, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-card {
  transform: scale(0.95) translateY(8px);
}
</style>
