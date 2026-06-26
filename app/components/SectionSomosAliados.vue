<template>
    <section class="w-full flex flex-col items-center gap-5 bg-green-dark px-5 py-12">

        <div class="w-full flex flex-col items-center gap-2 text-center">
            <h2 class="text-lg font-heading text-accent font-medium">¿Qué es suma?</h2>
            <p class="text-xs text-light leading-1">
                <span class="text-accent">suma</span> es una app que te impulsa y motiva a crear hábitos saludables, que premia tu constancia con recompensas de marcas aliadas
            </p>
        </div>

        <div class="w-full flex flex-col items-center gap-2">
            <button
                ref="cardRef"
                @touchstart="handleTouchStart"
                @touchend="handleTouchEnd"
                :class="['w-full relative overflow-hidden flex justify-between rounded-lg p-3 transition-colors', isCompleted ? 'bg-accent' : 'bg-midlight']">

                <!-- swipe fill overlay -->
                <div
                    v-if="showSwipeFill"
                    class="absolute inset-y-0 pointer-events-none"
                    :class="[
                        swipeDirection === 'right' ? 'left-0 bg-accent' : 'right-0 bg-midlight',
                        pendingDirection ? 'transition-[width] duration-150' : ''
                    ]"
                    :style="{ width: swipeFillPercent + '%' }"
                />

                <div class="relative flex gap-3 items-center min-w-0 flex-1">
                    <div class="w-8 h-8 flex flex-shrink-0 items-center justify-center rounded-full bg-gradient-secondary">
                        <p class="text-md">🏃</p>
                    </div>
                    <div>
                        <p class="text-xs text-start truncate text-dark">Correr una carrera</p>
                        <p class="w-fit text-xs text-green-dark" :class="isCompleted ? 'font-bold' : 'font-normal'">
                            {{ isCompleted ? 1 : 0 }}/1
                        </p>
                    </div>
                </div>

                <div class="relative flex items-center gap-2 flex-shrink-0">
                    <div :class="['w-6 h-6 flex justify-center items-center rounded-full', isCompleted ? 'bg-green-dark' : 'border-gray border-[1px]']">
                        <NuxtImg
                            :src="isCompleted ? '/images/brillo-light-green.svg' : '/images/brillo.svg'"
                            :alt="isCompleted ? 'Completado' : 'Brillo'"
                            class="w-3"
                        />
                    </div>
                </div>
            </button>

            <p class="text-light text-xs">Deslizá hacia la derecha &nbsp;→</p>
        </div>

        <NuxtImg src="/images/brillo-accent.svg" alt="Brillo" class="w-5 h-5" />

        <div class="w-full flex flex-col gap-3">
            <h3 class="text-lg font-heading text-accent text-center leading-1">
                Sumando hábitos accedés a beneficios de nuestros aliados
            </h3>

            <Carousel
                :slidesPerView="{ base: 2.3, sm: 3, md: 4, lg: 5 }"
                :gap="8"
                :showArrows="false"
                :showDots="false">
                <div
                    v-for="brand in brands"
                    :key="brand.id"
                    class="bg-light rounded-2xl flex items-center justify-center p-3">
                    <NuxtImg
                        v-if="brand.image_url"
                        :src="brand.image_url"
                        :alt="brand.name"
                        class="w-full h-9 object-contain"
                    />
                    <p v-else class="text-xs font-semibold text-dark text-center leading-tight">{{ brand.name }}</p>
                </div>
            </Carousel>
        </div>

    </section>
</template>

<script setup>
const cardRef = ref(null)
const touchStartX = ref(0)
const touchStartY = ref(0)
const touchStartTime = ref(0)
const touchDeltaX = ref(0)
const isHorizontalGesture = ref(false)
const pendingDirection = ref(null)
const isCompleted = ref(false)

const SWIPE_THRESHOLD = 40
const FILL_FULL_DISTANCE = 60

const swipeDirection = computed(() => {
    if (pendingDirection.value) return pendingDirection.value
    if (touchDeltaX.value > 0) return 'right'
    if (touchDeltaX.value < 0) return 'left'
    return null
})

const isActionable = computed(() => {
    const dir = swipeDirection.value
    if (dir === 'right') return !isCompleted.value
    if (dir === 'left') return isCompleted.value
    return false
})

const swipeFillPercent = computed(() => {
    if (pendingDirection.value) return 100
    if (!isHorizontalGesture.value) return 0
    return Math.min((Math.abs(touchDeltaX.value) / FILL_FULL_DISTANCE) * 100, 100)
})

const showSwipeFill = computed(() => isActionable.value && swipeFillPercent.value > 0)

const handleTouchMove = (e) => {
    const dx = e.touches[0].clientX - touchStartX.value
    const dy = e.touches[0].clientY - touchStartY.value
    if (!isHorizontalGesture.value && Math.abs(dy) > Math.abs(dx) + 5) return
    if (Math.abs(dx) > 8) {
        isHorizontalGesture.value = true
        e.preventDefault()
        touchDeltaX.value = dx
    }
}

onMounted(() => {
    cardRef.value?.addEventListener('touchmove', handleTouchMove, { passive: false })
})

onUnmounted(() => {
    cardRef.value?.removeEventListener('touchmove', handleTouchMove)
})

const handleTouchStart = (e) => {
    touchStartX.value = e.touches[0].clientX
    touchStartY.value = e.touches[0].clientY
    touchStartTime.value = Date.now()
    touchDeltaX.value = 0
    isHorizontalGesture.value = false
}

const handleTouchEnd = async (e) => {
    const touchEndX = e.changedTouches[0].clientX
    const swipeDistance = Math.abs(touchEndX - touchStartX.value)
    const swipeTime = Date.now() - touchStartTime.value
    const direction = touchEndX > touchStartX.value ? 'right' : 'left'

    const isValidSwipe = swipeDistance > SWIPE_THRESHOLD && swipeTime < 800
    const willAct = isValidSwipe && (
        (direction === 'right' && !isCompleted.value) ||
        (direction === 'left' && isCompleted.value)
    )

    if (willAct) pendingDirection.value = direction

    touchDeltaX.value = 0
    isHorizontalGesture.value = false

    if (willAct) {
        await nextTick()
        if (direction === 'right') isCompleted.value = true
        else isCompleted.value = false
        pendingDirection.value = null
    }
}

const supabase = useSupabaseClient()
const brands = ref([])

onMounted(async () => {
    const { data } = await supabase.from('brands').select('id, name, image_url').order('created_at')
    if (data) brands.value = data
})
</script>
