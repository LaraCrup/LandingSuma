<template>
  <section
    class="px-5 sm:px-8 md:px-10 lg:px-16 xxl:px-32 pt-6 md:pt-8 lg:pt-12">
    <div class="xxl:max-w-[75rem] w-full flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 xxl:mx-auto">
      <div class="w-full lg:w-1/2 flex flex-col items-center lg:items-start justify-center gap-5 md:gap-6 pb-8">
        <NuxtImg src="/images/brillo-primary.svg" alt="Logo" width="20" height="20" class="lg:hidden" />
        <div class="w-full flex flex-col items-center lg:items-start justify-center gap-2 lg:gap-3">
          <h1 class="text-lg lg:text-[28px] font-heading text-primary font-medium text-center lg:text-left leading-1">La
            constancia en tu bienestar
            merece recompensas</h1>
          <p class="text-xs lg:text-base text-center lg:text-left">Completá tus datos y retirás tu premio ahora.</p>
        </div>
        <form
          class="w-full max-w-[420px] md:max-w-[688px] lg:max-w-full flex flex-col items-center lg:items-start gap-3 lg:gap-5"
          @submit.prevent="handleSubmit">

          <div class="w-full flex flex-col gap-1">
            <label class="text-xs lg:text-base text-primary">Correo electrónico</label>
            <input v-model="email" type="email" placeholder="Ingresá tu correo electrónico"
              :disabled="isLoading"
              class="w-full text-xs lg:text-sm bg-light border border-primary rounded-full px-5 py-3 placeholder:text-gray outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50" />
          </div>

          <div class="w-full flex flex-col gap-1">
            <label class="text-xs lg:text-base text-primary">Número de corredor</label>
            <div class="flex gap-2">
              <input v-for="(_, i) in runnerCode" :key="i" :ref="el => { if (el) inputs[i] = el as HTMLInputElement }"
                v-model="runnerCode[i]" type="text" inputmode="numeric" maxlength="1"
                :disabled="isLoading"
                class="w-10 md:w-full h-10 text-center text-xs bg-light rounded-full border border-primary outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
                @input="onDigitInput(i)" @keydown.backspace="onBackspace(i)" />
            </div>
          </div>

          <button type="submit" :disabled="isLoading"
            class="w-full md:w-fit max-w-64 bg-primary text-light text-xs lg:text-sm rounded-full py-3 px-12 disabled:opacity-50 disabled:cursor-not-allowed">
            {{ isLoading ? 'Validando...' : 'Canjear premio' }}
          </button>

        </form>
      </div>

      <div class="w-full lg:w-1/2 flex items-center justify-center">
        <NuxtImg src="/images/mujer-sorpresa-suma.png" alt="Mujer Hero Sorprendida Suma"
          class="h-auto lg:h-[405px] max-w-full" />
      </div>
    </div>

    <!-- Modal de éxito -->
    <Teleport to="body" v-if="showSuccessModal">
      <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
        <div class="bg-light rounded-2xl shadow-lg p-8 md:p-12 max-w-md w-full text-center animate-scaleIn relative">
          <button
            @click="closeSuccessModal"
            class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray hover:text-primary transition-colors text-xl">
            ✕
          </button>
          <div class="mb-6 flex justify-center">
            <div class="w-16 h-16 bg-accent rounded-full flex items-center justify-center animate-bounce">
              <span class="text-4xl">🎉</span>
            </div>
          </div>
          <h2 class="text-xl lg:text-2xl font-heading text-primary mb-3">¡Felicidades!</h2>
          <p class="font-body text-sm lg:text-base mb-4 lg:mb-8 leading-1">
            ¡Canjea tu premio en el stand de <span class="text-primary">suma</span> y seguí sumando habitos a tu rutina!
          </p>
          <button
            @click="closeSuccessModal"
            class="w-fit bg-primary text-light text-sm lg:text-base rounded-full py-3 px-12 font-body hover:bg-primary/90 transition-colors">
            Cerrar
          </button>
        </div>
      </div>
    </Teleport>

    <Teleport to="body" v-if="showErrorModal">
      <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
        <div class="bg-light rounded-2xl shadow-lg p-8 md:p-12 max-w-md w-full text-center animate-scaleIn relative">
          <button
            @click="closeErrorModal"
            class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray hover:text-primary transition-colors text-xl">
            ✕
          </button>
          <div class="mb-6 flex justify-center">
            <div class="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
              <span class="text-4xl">ℹ️</span>
            </div>
          </div>
          <h2 class="text-xl lg:text-2xl font-heading text-primary mb-3">Datos no encontrados</h2>
          <p class="font-body text-sm lg:text-base mb-4 lg:mb-8 leading-1">
            Tus datos de contacto no figuran en el listado de la carrera. ¡Acercate igualmente al stand de Suma para poder comenzar a sumar habitos!
          </p>
          <button
            @click="closeErrorModal"
            class="w-fit bg-primary text-light text-sm lg:text-base rounded-full py-3 px-12 font-body hover:bg-primary/90 transition-colors">
            Cerrar
          </button>
        </div>
      </div>
    </Teleport>

  </section>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient()
const email = ref('')
const runnerCode = ref<string[]>(Array(6).fill(''))
const inputs = ref<HTMLInputElement[]>([])
const isLoading = ref(false)
const showSuccessModal = ref(false)
const showErrorModal = ref(false)

function onDigitInput(index: number) {
  const val = runnerCode.value[index]
  if (val && index < 5) {
    inputs.value[index + 1]?.focus()
  }
}

function onBackspace(index: number) {
  if (!runnerCode.value[index] && index > 0) {
    inputs.value[index - 1]?.focus()
  }
}

async function handleSubmit() {
  const runnerNumber = runnerCode.value.join('')

  if (!email.value.trim() || !runnerNumber.trim()) {
    return
  }

  isLoading.value = true

  try {
    const { data, error } = await supabase
      .from('race_participants')
      .select('id')
      .eq('email', email.value)
      .eq('runner_number', runnerNumber)

    if (error) {
      throw error
    }

    if (data && data.length > 0) {
      showSuccessModal.value = true
    } else {
      showErrorModal.value = true
    }
  } catch (err) {
    console.error('Error validating participant:', err)
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
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-0.5rem);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

.animate-scaleIn {
  animation: scaleIn 0.4s ease-out;
}

.animate-bounce {
  animation: bounce 2s infinite;
}
</style>
