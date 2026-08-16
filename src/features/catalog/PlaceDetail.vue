<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PlaceImage from '@/features/catalog/PlaceImage.vue'
import { useMapStore } from '@/features/map/mapStore'
import { useTripsStore } from '@/features/trips/tripsStore'
import { copyText } from '@/shared/clipboard'
import { categoryLabels, getCity, getPlace, placeImages } from '@/shared/catalog'
import type { Place } from '@/shared/types'

const route = useRoute()
const router = useRouter()
const mapStore = useMapStore()
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

const facts = computed(() => {
  if (!place.value) {
    return []
  }
  const rows: { label: string; value: string; icon: string }[] = []
  if (place.value.addressZh) {
    rows.push({ label: 'Адрес', value: place.value.addressZh, icon: 'i-lucide-map-pin' })
  }
  if (place.value.metroZh) {
    rows.push({ label: 'Метро', value: place.value.metroZh, icon: 'i-lucide-train' })
  }
  if (place.value.hours) {
    rows.push({ label: 'Часы', value: place.value.hours, icon: 'i-lucide-clock' })
  }
  return rows
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

async function copyValue(value: string, title = 'Скопировано'): Promise<void> {
  const ok = await copyText(value)
  toast.add({
    title: ok ? title : 'Не удалось скопировать',
    color: ok ? 'success' : 'warning',
    icon: ok ? 'i-lucide-check' : 'i-lucide-copy',
  })
}

function appleMapsUrl(item: Place): string {
  const query = encodeURIComponent(item.nameZh)
  return `https://maps.apple.com/?q=${query}&ll=${item.lat},${item.lng}`
}

function amapUrl(item: Place): string {
  const name = encodeURIComponent(item.nameZh)
  return `https://uri.amap.com/marker?position=${item.lng},${item.lat}&name=${name}`
}

function showOnMap(): void {
  if (!place.value) {
    return
  }
  mapStore.focusPlace(place.value.id)
  void router.push({ name: 'map' })
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
    side="right"
    :ui="{
      overlay: 'lg:bg-elevated/40',
      content: 'rounded-t-3xl sm:max-w-lg lg:rounded-none',
      header: 'min-h-0 border-0 p-0',
      body: 'p-0',
    }"
    @update:open="onOpenChange"
  >
    <template #header>
      <div class="bg-muted mx-auto mt-2 mb-1 h-1 w-9 rounded-full lg:hidden" />
    </template>
    <template v-if="place" #body>
      <div class="flex min-h-0 flex-1 flex-col">
        <div class="min-h-0 flex-1 overflow-y-auto">
          <div class="relative h-56 shrink-0">
            <PlaceImage
              :src="images[0]"
              :alt="place.nameRu"
              class="absolute inset-0 h-full w-full"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
            />
            <div class="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-4">
              <p class="text-sm text-white/80">
                {{ place.nameRu }} · {{ getCity(place.cityId)?.nameRu }}
              </p>
              <button
                type="button"
                class="text-left text-[32px] leading-none font-semibold tracking-tight text-white"
                @click="copyValue(place.nameZh, 'Скопировано для такси')"
              >
                {{ place.nameZh }}
              </button>
              <p class="text-xs text-white/70">Нажмите имя — скопировать для такси</p>
            </div>
          </div>

          <div class="flex flex-col gap-4 p-4">
            <div class="flex flex-wrap gap-2">
              <UBadge color="neutral" variant="subtle">{{ categoryLabels[place.category] }}</UBadge>
              <UBadge v-for="tag in place.tags" :key="tag" color="primary" variant="subtle">
                {{ tag }}
              </UBadge>
            </div>

            <p class="text-muted text-sm leading-6">{{ place.description }}</p>

            <div
              v-if="facts.length"
              class="bg-elevated divide-y divide-default overflow-hidden rounded-2xl"
            >
              <button
                v-for="fact in facts"
                :key="fact.label"
                type="button"
                class="flex w-full items-start gap-3 px-3 py-3 text-left"
                @click="copyValue(fact.value, `${fact.label} скопирован`)"
              >
                <UIcon :name="fact.icon" class="text-primary mt-0.5 size-4 shrink-0" />
                <span class="min-w-0 flex-1">
                  <span class="text-muted block text-xs">{{ fact.label }}</span>
                  <span class="text-highlighted text-sm">{{ fact.value }}</span>
                </span>
                <UIcon name="i-lucide-copy" class="text-muted mt-0.5 size-4 shrink-0" />
              </button>
            </div>

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
            </div>
          </div>
        </div>

        <div
          class="border-default bg-default/90 flex shrink-0 gap-2 border-t p-3 backdrop-blur-xl"
          style="padding-bottom: max(0.75rem, env(safe-area-inset-bottom))"
        >
          <UButton class="flex-1" icon="i-lucide-map" label="На карте" @click="showOnMap" />
          <UPopover>
            <UButton color="neutral" variant="outline" icon="i-lucide-navigation" label="Маршрут" />
            <template #content>
              <div class="flex w-48 flex-col gap-1 p-2">
                <UButton
                  :href="appleMapsUrl(place)"
                  target="_blank"
                  rel="noopener"
                  color="neutral"
                  variant="ghost"
                  label="Apple Maps"
                  block
                />
                <UButton
                  :href="amapUrl(place)"
                  target="_blank"
                  rel="noopener"
                  color="neutral"
                  variant="ghost"
                  label="高德地图"
                  block
                />
              </div>
            </template>
          </UPopover>
          <UButton
            color="neutral"
            variant="outline"
            icon="i-lucide-plus"
            :disabled="alreadyAdded"
            :label="alreadyAdded ? 'В поездке' : 'В поездку'"
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
