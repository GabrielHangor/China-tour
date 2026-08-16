<template>
  <div
    class="absolute inset-0 z-20 flex min-h-0 flex-col overflow-hidden bg-default/80 pt-[env(safe-area-inset-top)] backdrop-blur-xl lg:inset-y-4 lg:left-4 lg:right-auto lg:w-[27rem] lg:rounded-3xl lg:border lg:border-default lg:bg-default lg:pt-0 lg:shadow-2xl lg:backdrop-blur-none"
  >
    <div class="bg-muted mx-auto mt-1.5 mb-0.5 h-1 w-9 shrink-0 rounded-full lg:hidden" />
    <slot />
  </div>
</template>
