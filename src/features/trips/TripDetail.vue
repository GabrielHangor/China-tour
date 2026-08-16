<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { collectOfflineUrls, prefetchUrls } from '@/features/map/useOfflineTiles'
import { useTripsStore } from '@/features/trips/tripsStore'
import { getCity, getPlace, placeImages } from '@/shared/catalog'

const route = useRoute()
const router = useRouter()
const trips = useTripsStore()
const toast = useToast()

const confirmOpen = ref(false)
const downloading = ref(false)
const progress = ref({ done: 0, total: 0 })

const trip = computed(() => {
  const id = route.params.tripId
  return typeof id === 'string' ? trips.trips.find((item) => item.id === id) : undefined
})

const timelineItems = computed(() => {
  if (!trip.value) {
    return []
  }
  return trip.value.stops.map((stop, index) => {
    const place = getPlace(stop.placeId)
    return {
      value: stop.placeId,
      title: place?.nameRu ?? stop.placeId,
      description: place ? `${place.nameZh} · ${getCity(place.cityId)?.nameRu ?? ''}` : '',
      icon: stop.status === 'visited' ? 'i-lucide-check' : 'i-lucide-map-pin',
      color: stop.status === 'visited' ? 'success' : 'neutral',
      index,
      status: stop.status,
    }
  })
})

const progressPercent = computed(() => {
  if (progress.value.total === 0) {
    return 0
  }
  return Math.round((progress.value.done / progress.value.total) * 100)
})

function goBack(): void {
  void router.push({ name: 'trips' })
}

async function prepareOffline(): Promise<void> {
  if (!trip.value) {
    return
  }
  const tripPlaces = trip.value.stops
    .map((stop) => getPlace(stop.placeId))
    .filter((place) => place !== undefined)
  if (tripPlaces.length === 0) {
    toast.add({
      title: 'Сначала добавьте точки',
      color: 'warning',
      icon: 'i-lucide-map-pin-off',
    })
    return
  }

  downloading.value = true
  progress.value = { done: 0, total: 0 }
  const urls = [
    ...collectOfflineUrls(tripPlaces),
    ...tripPlaces.flatMap((place) => placeImages(place)),
  ]
  await prefetchUrls(urls, (value) => {
    progress.value = value
  })
  downloading.value = false
  toast.add({
    title: 'Офлайн-пакет готов',
    description: 'Тайлы и фото стопов сохранены в кэше браузера',
    color: 'success',
    icon: 'i-lucide-download',
  })
}

async function removeTrip(): Promise<void> {
  if (!trip.value) {
    return
  }
  const id = trip.value.id
  confirmOpen.value = false
  await trips.deleteTrip(id)
  toast.add({ title: 'Поездка удалена', color: 'neutral' })
  goBack()
}
</script>

<template>
  <div class="absolute inset-0 z-20 flex flex-col bg-default/95 backdrop-blur-sm">
    <div class="flex items-center gap-2 px-3 pt-3 pb-2">
      <UButton color="neutral" variant="ghost" icon="i-lucide-arrow-left" square @click="goBack" />
      <div class="min-w-0 flex-1">
        <h1 class="text-highlighted truncate text-lg font-medium">{{ trip?.name ?? 'Поездка' }}</h1>
        <p class="text-muted text-sm">{{ trip?.stops.length ?? 0 }} точек</p>
      </div>
      <UButton
        v-if="trip && trips.activeTripId !== trip.id"
        size="sm"
        color="neutral"
        variant="outline"
        label="Сделать активной"
        @click="trips.setActiveTrip(trip.id)"
      />
    </div>

    <UScrollArea class="min-h-0 flex-1 px-4 pb-4">
      <UEmpty
        v-if="!trip"
        icon="i-lucide-suitcase"
        title="Поездка не найдена"
        description="Возможно, она была удалена"
      />

      <div v-else class="flex flex-col gap-4">
        <UCard>
          <div class="flex flex-col gap-3">
            <p class="text-sm font-medium">Подготовить офлайн</p>
            <p class="text-muted text-sm">
              Скачает тайлы вокруг стопов и фото. Сделайте это на Wi‑Fi до вылета.
            </p>
            <UProgress v-if="downloading" :model-value="progressPercent" />
            <UButton
              icon="i-lucide-download"
              :loading="downloading"
              :label="downloading ? `${progress.done} / ${progress.total}` : 'Скачать для офлайна'"
              @click="prepareOffline"
            />
          </div>
        </UCard>

        <UEmpty
          v-if="trip.stops.length === 0"
          icon="i-lucide-map-pin-plus"
          title="Нет точек"
          description="Добавьте места из каталога"
        >
          <template #actions>
            <UButton label="К каталогу" to="/catalog" />
          </template>
        </UEmpty>

        <div v-else class="flex flex-col gap-2">
          <div
            v-for="item in timelineItems"
            :key="item.value"
            class="border-muted rounded-lg border p-3"
          >
            <div class="flex items-start justify-between gap-2">
              <button
                type="button"
                class="min-w-0 text-left"
                @click="router.push({ name: 'place', params: { placeId: item.value } })"
              >
                <p class="text-highlighted font-medium">{{ item.title }}</p>
                <p class="text-muted text-sm">{{ item.description }}</p>
              </button>
              <UBadge :color="item.status === 'visited' ? 'success' : 'neutral'" variant="subtle">
                {{ item.status === 'visited' ? 'посещено' : 'план' }}
              </UBadge>
            </div>
            <div class="mt-3 flex flex-wrap gap-1">
              <UButton
                size="xs"
                color="neutral"
                variant="ghost"
                icon="i-lucide-chevron-up"
                square
                :disabled="item.index === 0"
                @click="trips.moveStop(trip.id, item.value, -1)"
              />
              <UButton
                size="xs"
                color="neutral"
                variant="ghost"
                icon="i-lucide-chevron-down"
                square
                :disabled="item.index === trip.stops.length - 1"
                @click="trips.moveStop(trip.id, item.value, 1)"
              />
              <UButton
                size="xs"
                color="neutral"
                variant="outline"
                :label="item.status === 'visited' ? 'Вернуть в план' : 'Отметить посещённым'"
                @click="
                  trips.setStopStatus(
                    trip.id,
                    item.value,
                    item.status === 'visited' ? 'planned' : 'visited',
                  )
                "
              />
              <UButton
                size="xs"
                color="error"
                variant="ghost"
                icon="i-lucide-trash"
                square
                @click="trips.removeStop(trip.id, item.value)"
              />
            </div>
          </div>
        </div>

        <UButton color="error" variant="soft" label="Удалить поездку" @click="confirmOpen = true" />
      </div>
    </UScrollArea>

    <UModal
      v-model:open="confirmOpen"
      title="Удалить поездку?"
      description="Точки останутся в каталоге, исчезнет только этот список."
      :ui="{ footer: 'justify-end' }"
    >
      <template #footer="{ close }">
        <UButton color="neutral" variant="outline" label="Отмена" @click="close" />
        <UButton color="error" label="Удалить" @click="removeTrip" />
      </template>
    </UModal>
  </div>
</template>
