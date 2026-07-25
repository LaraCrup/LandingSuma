<template>
  <div>
    <form
      :class="['w-full flex flex-col gap-4 lg:gap-5 relative', card ? 'bg-light rounded-3xl shadow-[0_20px_50px_-20px_rgba(18,83,76,0.35)] p-5 sm:p-6 lg:p-7' : '']"
      @submit.prevent="handleSubmit">

      <div class="w-full flex flex-col gap-1.5">
        <label :for="`${uid}-email`" :class="['text-sm lg:text-base font-semibold', dark ? 'text-light' : 'text-green-dark']">
          Correo electrónico
        </label>
        <input :id="`${uid}-email`" v-model="email" type="email" autocomplete="email"
          placeholder="Ingresá tu correo electrónico" :disabled="isLoading"
          :class="['w-full rounded-full text-sm lg:text-base outline-none transition-colors duration-200 disabled:opacity-50 px-5 py-3 lg:py-3.5',
            dark
              ? 'bg-light/10 border border-light/25 focus:border-accent focus:ring-2 focus:ring-accent/20 text-light placeholder:text-light/40'
              : 'bg-midlight/60 border border-primary/25 focus:border-primary focus:bg-light focus:ring-2 focus:ring-primary/20 placeholder:text-gray']" />
      </div>

      <div class="w-full flex flex-col gap-1.5">
        <label :id="`${uid}-code-label`" :class="['text-sm lg:text-base font-semibold', dark ? 'text-light' : 'text-green-dark']">
          Número de corredor
        </label>
        <div class="w-full grid grid-cols-6 gap-2 lg:gap-2.5" role="group" :aria-labelledby="`${uid}-code-label`">
          <input v-for="(_, i) in runnerCode" :key="i" :ref="el => { if (el) inputs[i] = el }"
            v-model="runnerCode[i]" type="text" inputmode="numeric" maxlength="1"
            :aria-label="`Dígito ${i + 1} del número de corredor`" :disabled="isLoading"
            :class="['w-full h-16 lg:h-14 rounded-2xl text-center font-heading text-xl lg:text-2xl font-bold outline-none transition-colors duration-200 disabled:opacity-50',
              dark
                ? 'bg-light/10 border border-light/25 focus:border-accent focus:ring-2 focus:ring-accent/20 text-light'
                : 'bg-midlight/60 border border-primary/25 focus:border-primary focus:bg-light focus:ring-2 focus:ring-primary/20 text-green-dark']"
            @input="onDigitInput(i)" @keydown.backspace="onBackspace(i)" @paste.prevent="onPaste($event, i)" />
        </div>
      </div>

      <p v-if="formError" class="text-sm text-error" role="alert">{{ formError }}</p>

      <button type="submit" :disabled="isLoading"
        :class="['w-full flex justify-center items-center gap-2 rounded-full text-base lg:text-lg font-semibold transition-[background-color,transform] duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed py-3.5 lg:py-4',
          dark ? 'bg-accent hover:bg-light text-green-dark' : 'bg-primary hover:bg-green-dark text-light']">
        {{ isLoading ? 'Validando...' : 'Canjear mi premio' }}
      </button>
    </form>

    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showSuccessModal" class="fixed inset-0 z-50 flex items-center justify-center bg-green-dark/60 p-4"
          @click.self="closeSuccessModal">
          <div class="modal-card w-full max-w-md relative bg-light rounded-3xl text-center p-8 md:p-10">
            <button aria-label="Cerrar" @click="closeSuccessModal"
              class="w-10 h-10 flex items-center justify-center absolute top-3 right-3 text-gray hover:text-primary text-xl transition-colors duration-200">
              ✕
            </button>
            <div class="w-16 h-16 flex items-center justify-center bg-accent rounded-full mx-auto mb-5">
              <span class="text-3xl">🎉</span>
            </div>
            <h2 class="font-heading text-2xl text-green-dark font-bold mb-2">¡Felicidades!</h2>
            <p class="text-base text-dark/80 mb-6">
              Canjeá tu premio en el stand de <span class="text-primary font-semibold">suma</span> y seguí sumando
              hábitos a tu rutina.
            </p>
            <button @click="closeSuccessModal"
              class="w-full bg-primary hover:bg-green-dark rounded-full text-light text-base font-semibold transition-colors duration-200 active:scale-[0.98] py-3.5">
              ¡Voy al stand!
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showErrorModal" class="fixed inset-0 z-50 flex items-center justify-center bg-green-dark/60 p-4"
          @click.self="closeErrorModal">
          <div class="modal-card w-full max-w-md relative bg-light rounded-3xl text-center p-8 md:p-10">
            <button aria-label="Cerrar" @click="closeErrorModal"
              class="w-10 h-10 flex items-center justify-center absolute top-3 right-3 text-gray hover:text-primary text-xl transition-colors duration-200">
              ✕
            </button>
            <div class="w-16 h-16 flex items-center justify-center bg-midlight rounded-full mx-auto mb-5">
              <span class="text-3xl">ℹ️</span>
            </div>
            <h2 class="font-heading text-2xl text-green-dark font-bold mb-2">{{ errorContent[errorType].title }}</h2>
            <p class="text-base text-dark/80 mb-6">{{ errorContent[errorType].message }}</p>
            <button @click="closeErrorModal"
              class="w-full bg-primary hover:bg-green-dark rounded-full text-light text-base font-semibold transition-colors duration-200 active:scale-[0.98] py-3.5">
              Entendido
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
defineProps({
  card: { type: Boolean, default: true },
  dark: { type: Boolean, default: false },
})

const uid = useId()

const supabase = useSupabaseClient()
const email = ref('')
const runnerCode = ref(Array(6).fill(''))
const inputs = ref([])
const isLoading = ref(false)
const formError = ref('')
const showSuccessModal = ref(false)
const showErrorModal = ref(false)

const errorContent = {
  not_found: {
    title: 'Datos no encontrados',
    message: 'Tus datos de contacto no figuran en el listado de la carrera. ¡Acercate igualmente al stand de suma para poder comenzar a sumar hábitos!',
  },
  already_redeemed: {
    title: 'Premio ya canjeado',
    message: 'Este premio ya fue canjeado anteriormente. Si creés que hubo un error, acercate al stand de suma.',
  },
  error: {
    title: 'Algo salió mal',
    message: 'No pudimos validar tus datos. Esperá unos segundos y volvé a intentarlo.',
  },
}
const errorType = ref('not_found')

function onDigitInput(index) {
  const digits = (runnerCode.value[index] ?? '').replace(/\D/g, '')
  runnerCode.value[index] = digits.slice(-1)
  if (runnerCode.value[index] && index < 5) {
    inputs.value[index + 1]?.focus()
  }
}

function onBackspace(index) {
  if (!runnerCode.value[index] && index > 0) {
    inputs.value[index - 1]?.focus()
  }
}

function onPaste(event, index) {
  const digits = (event.clipboardData?.getData('text') ?? '').replace(/\D/g, '')
  if (!digits) return
  for (let i = 0; i < digits.length && index + i < 6; i++) {
    runnerCode.value[index + i] = digits[i]
  }
  inputs.value[Math.min(index + digits.length, 5)]?.focus()
}

async function handleSubmit() {
  const runnerNumber = runnerCode.value.join('')
  formError.value = ''

  if (!email.value.trim()) {
    formError.value = 'Ingresá tu correo electrónico.'
    return
  }

  if (runnerNumber.length !== 6) {
    formError.value = 'Completá los 6 dígitos de tu número de corredor.'
    return
  }

  isLoading.value = true

  try {
    const { data, error } = await supabase.rpc('redeem_prize', {
      p_email: email.value,
      p_runner_number: runnerNumber,
    })

    if (error) {
      throw error
    }

    if (data === 'ok') {
      showSuccessModal.value = true
    } else {
      errorType.value = data === 'already_redeemed' ? 'already_redeemed' : 'not_found'
      showErrorModal.value = true
    }
  } catch (err) {
    console.error('Error validating participant:', err)
    errorType.value = 'error'
    showErrorModal.value = true
  } finally {
    isLoading.value = false
  }
}

function closeSuccessModal() {
  showSuccessModal.value = false
  resetForm()
}

function closeErrorModal() {
  showErrorModal.value = false
  resetForm()
}

function resetForm() {
  email.value = ''
  runnerCode.value = Array(6).fill('')
}
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
