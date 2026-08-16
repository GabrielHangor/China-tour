<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { categoryLabels, getCity, getPlace, placeImages } from '@/shared/catalog'
import { useTripsStore } from '@/features/trips/tripsStore'

const route = useRoute()
const router = useRouter()
const trips = useTripsStore()
const toast = useToast()

const open = ref(true)
const selectedTripId = ref<string | undefined>(trips.activeTripId ?? undefined)

const place = computed(() => {
  const id = route.params.placeId
  return typeof id === 'string' ? getPlace(id) : undefined
})

const images = computed(() => (place.value ? placeImages(place.value) : []))

const tripItems = computed(() => trips.trips.map((trip) => ({ label: trip.name, value: trip.id })))

const alreadyAdded = computed(() => {
  if (!place.value || !selectedTripId.value) {
    return false
  }
  const trip = trips.trips.find((item) => item.id === selectedTripId.value)
  return trip?.stops.some((stop) => stop.placeId === place.value?.id) ?? false
})

watch(
  () => trips.activeTripId,
  (id) => {
    if (id) {
      selectedTripId.value = id
    }
  },
)

function onOpenChange(value: boolean): void {
  if (!value) {
    router.back()
  }
}

async function addToTrip(): Promise<void> {
  if (!place.value) {
    return
  }
  let tripId = selectedTripId.value
  if (!tripId) {
    const trip = await trips.createTrip('Моя поездка')
    tripId = trip.id
    selectedTripId.value = tripId
  }
  await trips.addPlace(tripId, place.value.id)
  trips.setActiveTrip(tripId)
  toast.add({
    title: 'Добавлено в поездку',
    color: 'success',
    icon: 'i-lucide-check',
  })
}
</script>

<template>
  <USlideover
    v-model:open="open"
    :title="place?.nameRu ?? 'Место'"
    :description="place ? `${place.nameZh} · ${getCity(place.cityId)?.nameRu ?? ''}` : undefined"
    side="right"
    @update:open="onOpenChange"
  >
    <template v-if="place" #body>
      <div class="flex flex-col gap-4">
        <img
          v-if="images[0]"
          :src="images[0]"
          :alt="place.nameRu"
          class="h-48 w-full rounded-lg object-cover"
        />
        <div class="flex flex-wrap gap-2">
          <UBadge color="neutral" variant="subtle">{{ categoryLabels[place.category] }}</UBadge>
          <UBadge v-for="tag in place.tags" :key="tag" color="primary" variant="subtle">
            {{ tag }}
          </UBadge>
        </div>
        <p class="text-muted text-sm leading-6">{{ place.description }}</p>
        <UAlert
          v-if="place.tips"
          color="info"
          variant="subtle"
          icon="i-lucide-lightbulb"
          :description="place.tips"
        />

        <div class="flex flex-col gap-2">
          <p class="text-sm font-medium">Добавить в поездку</p>
          <USelectMenu
            v-model="selectedTripId"
            :items="tripItems"
            value-key="value"
            placeholder="Выберите поездку"
          />
          <UButton
            :disabled="alreadyAdded"
            :label="alreadyAdded ? 'Уже в поездке' : 'Добавить'"
            icon="i-lucide-plus"
            @click="addToTrip"
          />
        </div>
      </div>
    </template>
    <template v-else #body>
      <UEmpty icon="i-lucide-map-pin-off" title="Место не найдено" />
    </template>
  </USlideover>
</template>
