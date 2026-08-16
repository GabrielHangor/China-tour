<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import TourMap from '@/features/map/TourMap.vue'
import CreateTripModal from '@/features/trips/CreateTripModal.vue'
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()
const createOpen = ref(false)

provide('openCreateTrip', () => {
  createOpen.value = true
})

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Карта',
    icon: 'i-lucide-map',
    to: '/',
    active: route.name === 'map',
  },
  {
    label: 'Каталог',
    icon: 'i-lucide-landmark',
    to: '/catalog',
    active: route.name === 'catalog' || route.name === 'place',
  },
  {
    label: 'Поездки',
    icon: 'i-lucide-suitcase',
    to: '/trips',
    active: route.name === 'trips' || route.name === 'trip',
  },
])
</script>

<template>
  <div class="bg-default flex h-dvh flex-col">
    <div class="relative min-h-0 flex-1">
      <TourMap />
      <RouterView />
    </div>
    <nav class="border-default bg-default z-30 border-t pb-[env(safe-area-inset-bottom)]">
      <UNavigationMenu :items="items" class="w-full justify-around" />
    </nav>
    <CreateTripModal v-model:open="createOpen" />
  </div>
</template>
