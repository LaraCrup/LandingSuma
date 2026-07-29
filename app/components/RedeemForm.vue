<template>
  <div>
    <form
      class="w-full flex flex-col gap-4 lg:gap-5 relative bg-light rounded-3xl shadow-[0_20px_50px_-20px_rgba(18,83,76,0.35)] p-5 sm:p-6 lg:p-7"
      novalidate @submit.prevent="handleSubmit">

      <div class="w-full flex flex-col gap-1.5">
        <label :for="`${uid}-email`" class="text-sm lg:text-base text-green-dark font-semibold">
          Correo electrónico
        </label>
        <input :id="`${uid}-email`" ref="emailInput" v-model="email" type="email" autocomplete="email" required
          placeholder="Ingresá tu correo electrónico" :disabled="isLoading"
          :aria-invalid="campoConError === 'email' || undefined"
          :aria-describedby="formError ? `${uid}-error` : undefined"
          class="w-full bg-midlight/60 border border-primary/25 rounded-full text-sm lg:text-base outline-none transition-colors duration-200 focus:border-primary focus:bg-light focus:ring-2 focus:ring-primary/20 placeholder:text-dark/55 disabled:opacity-50 px-5 py-3 lg:py-3.5" />
      </div>

      <div class="w-full flex flex-col gap-1.5">
        <span :id="`${uid}-code-label`" class="text-sm lg:text-base text-green-dark font-semibold">
          Número de corredor
        </span>
        <div class="w-full grid grid-cols-6 gap-2 lg:gap-2.5" role="group" :aria-labelledby="`${uid}-code-label`">
          <input v-for="(_, i) in runnerCode" :key="i" :ref="el => { if (el) inputs[i] = el }"
            v-model="runnerCode[i]" type="text" inputmode="numeric" maxlength="1" autocomplete="off"
            :aria-label="`Dígito ${i + 1} del número de corredor`" :disabled="isLoading"
            :aria-invalid="campoConError === 'codigo' || undefined"
            :aria-describedby="formError ? `${uid}-error` : undefined"
            class="w-full h-12 lg:h-14 bg-midlight/60 border border-primary/25 rounded-2xl text-center font-heading text-xl lg:text-2xl text-green-dark font-bold outline-none transition-colors duration-200 focus:border-primary focus:bg-light focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
            @input="onDigitInput(i)" @keydown.backspace="onBackspace(i)" @paste.prevent="onPaste($event, i)" />
        </div>
      </div>

      <p :id="`${uid}-error`" role="alert" class="text-sm text-error empty:hidden">{{ formError }}</p>

      <button type="submit" :disabled="isLoading" :aria-busy="isLoading"
        class="w-full flex justify-center items-center gap-2 bg-primary hover:bg-green-dark rounded-full text-light text-base lg:text-lg font-semibold transition-[background-color,transform] duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed py-3.5 lg:py-4">
        {{ isLoading ? 'Validando…' : 'Canjeá tu premio' }}
      </button>
    </form>

    <ModalDialog :open="showSuccessModal" titulo="¡Felicitaciones!" accion="¡Voy al stand!" icono="🎉"
      icono-fondo="bg-accent" @close="closeSuccessModal">
      Retirá tu premio en el stand de <span class="text-primary font-semibold">suma</span> y seguí sumando
      hábitos a tu rutina.
    </ModalDialog>

    <ModalDialog :open="showErrorModal" :titulo="errorContent[errorType].title"
      :mensaje="errorContent[errorType].message" @close="closeErrorModal" />
  </div>
</template>

<script setup>
const TIMEOUT_MS = 15000
const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const uid = useId()

const supabase = useSupabaseClient()
const email = ref('')
const runnerCode = ref(Array(6).fill(''))
const inputs = ref([])
const emailInput = useTemplateRef('emailInput')
const isLoading = ref(false)
const formError = ref('')
const campoConError = ref('')
const showSuccessModal = ref(false)
const showErrorModal = ref(false)

const errorContent = {
  not_found: {
    title: 'Datos no encontrados',
    message: 'Tus datos de contacto no figuran en el listado de la carrera. ¡Acercate de todas formas al stand de suma para poder comenzar a sumar hábitos!',
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

function fallar(mensaje, campo, el) {
  formError.value = mensaje
  campoConError.value = campo
  el?.focus()
}

async function handleSubmit() {
  if (isLoading.value) return

  const runnerNumber = runnerCode.value.join('')
  // Normalizado: si en la base el mail está en minúscula, un "Juan@Gmail.com" no matchearía
  const correo = email.value.trim().toLowerCase()
  formError.value = ''
  campoConError.value = ''

  if (!RE_EMAIL.test(correo)) {
    return fallar('Ingresá un correo electrónico válido.', 'email', emailInput.value)
  }

  if (!/^\d{6}$/.test(runnerNumber)) {
    return fallar('Completá los 6 dígitos de tu número de corredor.', 'codigo', inputs.value[0])
  }

  isLoading.value = true

  try {
    const consulta = supabase.rpc('redeem_prize', {
      p_email: correo,
      p_runner_number: runnerNumber,
    })

    // Sin esto, una red caída deja el form bloqueado en "Validando…" hasta recargar la página
    const corte = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), TIMEOUT_MS))

    const { data, error } = await Promise.race([consulta, corte])

    if (error) throw error

    if (data === 'ok') {
      showSuccessModal.value = true
      return
    }

    // Todo valor no contemplado es un error nuestro, no un "no figurás en el listado"
    errorType.value = data === 'already_redeemed'
      ? 'already_redeemed'
      : data === 'not_found' ? 'not_found' : 'error'
    showErrorModal.value = true
  } catch {
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
  if (errorType.value !== 'error') resetForm()
}

function resetForm() {
  email.value = ''
  runnerCode.value = Array(6).fill('')
  formError.value = ''
  campoConError.value = ''
}
</script>
