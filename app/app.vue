<template>
  <div class="w-full overflow-x-clip bg-light font-body text-dark antialiased">
    <AppCursor />
    <NuxtPage />
  </div>
</template>

<style>
::selection {
  background: #D7F560;
  color: #12534C;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-float {
  animation: float 5s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .animate-float {
    animation: none;
  }
}
</style>
