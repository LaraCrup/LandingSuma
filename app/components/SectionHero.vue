<template>
  <section class="relative w-full flex flex-col items-center justify-center gap-5 md:gap-6 px-5 sm:px-8 md:px-10 lg:px-16 xxl:px-32 pt-6 pb-[224px]">
    <NuxtImg src="/images/brillo-primary.svg" alt="Logo" width="20" height="20" />
    <div class="w-full flex flex-col items-center justify-center gap-2">
      <h1 class="text-lg font-heading text-primary font-medium text-center leading-1">La constancia en tu bienestar
        merece recompensas</h1>
      <p class="text-xs text-center">Completá tus datos y retirás tu premio ahora.</p>
    </div>
    <form class="w-full max-w-[420px] md:max-w-[688px] flex flex-col items-center gap-3" @submit.prevent="handleSubmit">

      <div class="w-full flex flex-col gap-1">
        <label class="text-xs text-primary">Correo electrónico</label>
        <input v-model="email" type="email" placeholder="Ingresá tu correo electrónico"
          class="w-full text-xs bg-light border border-primary rounded-full px-5 py-3 placeholder:text-gray outline-none focus:ring-2 focus:ring-primary/30" />
      </div>

      <div class="w-full flex flex-col gap-1">
        <label class="text-xs  text-primary">Número de corredor</label>
        <div class="flex gap-2">
          <input v-for="(_, i) in runnerCode" :key="i" :ref="el => { if (el) inputs[i] = el as HTMLInputElement }"
            v-model="runnerCode[i]" type="text" inputmode="numeric" maxlength="1"
            class="w-10 md:w-full h-10 text-center text-xs bg-light rounded-full border border-primary outline-none focus:ring-2 focus:ring-primary/30"
            @input="onDigitInput(i)" @keydown.backspace="onBackspace(i)" />
        </div>
      </div>

      <button type="submit" class="w-full md:w-fit max-w-64 bg-primary text-light text-xs rounded-full py-3 px-12">
        Canjear premio
      </button>

    </form>
    <NuxtImg src="/images/mujer-sorpresa-suma.png" alt="Mujer Hero Sorprendida Suma" class="absolute bottom-0 left-1/2 -translate-x-1/2" />

  </section>
</template>

<script setup lang="ts">
const email = ref('')
const runnerCode = ref<string[]>(Array(6).fill(''))
const inputs = ref<HTMLInputElement[]>([])

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

function handleSubmit() {
  const code = runnerCode.value.join('')
  console.log({ email: email.value, runnerCode: code })
}
</script>
