<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PlaceImage from '@/features/catalog/PlaceImage.vue'
import PanelShell from '@/layouts/PanelShell.vue'
import { useTripsStore } from '@/features/trips/tripsStore'
import {
  categoryLabels,
  cities,
  getCity,
  placeImages,
  places,
  routeImages,
  routes,
} from '@/shared/catalog'
import type { Place, Route } from '@/shared/types'

const openCreateTrip = inject<() => void>('openCreateTrip', () => {})
const route = useRoute()
const router = useRouter()
const trips = useTripsStore()

const query = ref('')
const tab = ref<'places' | 'routes'>('places')

const cityItems = computed(() => [
  { label: 'Все города', value: 'all' },
  ...cities.map((city) => ({ label: `${city.nameRu} · ${city.nameZh}`, value: city.id })),
])

const categoryItems = computed(() => [
  { label: 'Все категории', value: 'all' },
  ...Object.entries(categoryLabels).map(([value, label]) => ({
    label,
    value,
  })),
])

const selectedCity = ref('all')
const selectedCategory = ref('all')

const filteredPlaces = computed(() => {
  const needle = query.value.trim().toLowerCase()
  return places.filter((place) => {
    if (selectedCity.value !== 'all' && place.cityId !== selectedCity.value) {
      return false
    }
    if (selectedCategory.value !== 'all' && place.category !== selectedCategory.value) {
      return false
    }
    if (!needle) {
      return true
    }
    return (
      place.nameRu.toLowerCase().includes(needle) ||
      place.nameZh.includes(needle) ||
      place.description.toLowerCase().includes(needle)
    )
  })
})

const filteredRoutes = computed(() => {
  const needle = query.value.trim().toLowerCase()
  return routes.filter((item) => {
    if (selectedCity.value !== 'all' && !item.cityIds.includes(selectedCity.value)) {
      return false
    }
    if (!needle) {
      return true
    }
    return (
      item.nameRu.toLowerCase().includes(needle) || item.description.toLowerCase().includes(needle)
    )
  })
})

function openPlace(place: Place): void {
  void router.push({ name: 'place', params: { placeId: place.id } })
}

function cityName(id: string): string {
  return getCity(id)?.nameRu ?? id
}

async function addRouteToTrip(item: Route): Promise<void> {
  let tripId = trips.activeTripId
  if (!tripId) {
    const trip = await trips.createTrip(item.nameRu)
    tripId = trip.id
  }
  await trips.addRoutePlaces(tripId, item.placeIds)
  void router.push({ name: 'trip', params: { tripId } })
}

const highlightedRouteId = computed(() => {
  const value = route.query.route
  return typeof value === 'string' ? value : null
})
</script>

<template>
  <PanelShell>
    <div class="flex items-center justify-between gap-2 px-4 pt-2 pb-2 lg:pt-4">
      <div>
        <h1
          class="text-highlighted text-[28px] font-bold tracking-tight lg:text-xl lg:font-semibold"
        >
          Каталог
        </h1>
        <p class="text-muted text-sm">Точки и готовые маршруты по Китаю</p>
      </div>
      <UButton icon="i-lucide-plus" size="sm" label="Поездка" @click="openCreateTrip" />
    </div>

    <div class="flex flex-col gap-3 px-4 pb-3">
      <UInput
        v-model="query"
        icon="i-lucide-search"
        placeholder="Поиск места или маршрута"
        :ui="{ base: 'rounded-full' }"
      />
      <div class="grid grid-cols-2 gap-2">
        <USelectMenu v-model="selectedCity" :items="cityItems" value-key="value" />
        <USelectMenu v-model="selectedCategory" :items="categoryItems" value-key="value" />
      </div>
      <UTabs
        v-model="tab"
        :items="[
          { label: 'Места', value: 'places' },
          { label: 'Маршруты', value: 'routes' },
        ]"
        :content="false"
      />
    </div>

    <UScrollArea class="min-h-0 flex-1 px-4 pb-4">
      <div v-if="tab === 'places'" class="flex flex-col gap-3">
        <UEmpty
          v-if="filteredPlaces.length === 0"
          icon="i-lucide-map-pin-off"
          title="Ничего не найдено"
          description="Смените город, категорию или запрос"
        />
        <button
          v-for="place in filteredPlaces"
          :key="place.id"
          type="button"
          class="text-left"
          @click="openPlace(place)"
        >
          <UCard :ui="{ root: 'overflow-hidden rounded-2xl', body: 'p-0' }">
            <PlaceImage :src="placeImages(place)[0]" :alt="place.nameRu" class="h-36 w-full" />
            <div class="flex flex-col gap-1 p-3">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <p class="text-highlighted font-medium">{{ place.nameRu }}</p>
                  <p class="text-muted text-sm">
                    {{ place.nameZh }} · {{ cityName(place.cityId) }}
                  </p>
                </div>
                <UBadge color="neutral" variant="subtle">{{
                  categoryLabels[place.category]
                }}</UBadge>
              </div>
              <p class="text-muted line-clamp-2 text-sm">{{ place.description }}</p>
            </div>
          </UCard>
        </button>
      </div>

      <div v-else class="flex flex-col gap-3">
        <UCard
          v-for="item in filteredRoutes"
          :key="item.id"
          :class="highlightedRouteId === item.id ? 'ring-2 ring-primary' : ''"
          :ui="{ root: 'overflow-hidden rounded-2xl' }"
        >
          <PlaceImage
            :src="routeImages(item)[0]"
            :alt="item.nameRu"
            class="mb-3 h-36 w-full rounded-lg"
          />
          <div class="flex flex-col gap-2">
            <p class="text-highlighted font-medium">{{ item.nameRu }}</p>
            <p class="text-muted text-sm">{{ item.description }}</p>
            <p class="text-muted text-xs">{{ item.cityIds.map(cityName).join(' · ') }}</p>
            <UButton
              size="sm"
              icon="i-lucide-plus"
              label="Добавить в поездку"
              @click="addRouteToTrip(item)"
            />
          </div>
        </UCard>
      </div>
    </UScrollArea>
  </PanelShell>
</template>
