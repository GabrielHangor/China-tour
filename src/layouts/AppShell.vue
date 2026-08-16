<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import TourMap from '@/features/map/TourMap.vue'
import CreateTripModal from '@/features/trips/CreateTripModal.vue'

const route = useRoute()
const createOpen = ref(false)

provide('openCreateTrip', () => {
  createOpen.value = true
})

const items = computed(() => [
  {
    label: 'Карта',
    icon: 'i-lucide-map',
    to: '/',
    active: route.name === 'map' || route.name === 'place',
  },
  {
    label: 'Каталог',
    icon: 'i-lucide-building-2',
    to: '/catalog',
    active: route.name === 'catalog',
  },
  {
    label: 'Поездки',
    icon: 'i-lucide-list',
    to: '/trips',
    active: route.name === 'trips' || route.name === 'trip',
  },
])
</script>

<template>
  <div class="bg-default flex h-dvh flex-col">
    <header
      class="border-default hidden h-14 shrink-0 items-center justify-between border-b px-4 lg:flex"
    >
      <p class="text-highlighted font-semibold tracking-tight">China Tour</p>
      <nav class="flex items-center gap-1">
        <UButton
          v-for="item in items"
          :key="item.to"
          :to="item.to"
          :icon="item.icon"
          :label="item.label"
          :color="item.active ? 'primary' : 'neutral'"
          :variant="item.active ? 'soft' : 'ghost'"
          size="sm"
        />
      </nav>
    </header>

    <div class="relative min-h-0 flex-1">
      <TourMap />
      <RouterView />
    </div>

    <nav
      class="border-default/50 bg-default/75 z-30 border-t backdrop-blur-xl lg:hidden"
      style="padding-bottom: env(safe-area-inset-bottom)"
    >
      <div class="grid grid-cols-3">
        <RouterLink
          v-for="item in items"
          :key="item.to"
          :to="item.to"
          class="flex min-h-[50px] flex-col items-center justify-center gap-0.5 pt-1.5 pb-1 text-[10px] font-medium"
          :class="item.active ? 'text-primary' : 'text-muted'"
        >
          <UIcon :name="item.icon" class="size-6" />
          <span>{{ item.label }}</span>
        </RouterLink>
      </div>
    </nav>

    <CreateTripModal v-model:open="createOpen" />
  </div>
</template>
