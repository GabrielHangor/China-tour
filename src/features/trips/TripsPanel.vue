<script setup lang="ts">
import { inject, ref } from 'vue'
import { useRouter } from 'vue-router'
import PanelShell from '@/layouts/PanelShell.vue'
import { useTripsStore } from '@/features/trips/tripsStore'
import type { TripBackup } from '@/features/trips/tripsStore'
import { getPlace } from '@/shared/catalog'

const openCreateTrip = inject<() => void>('openCreateTrip', () => {})
const router = useRouter()
const trips = useTripsStore()
const toast = useToast()
const fileInput = ref<HTMLInputElement | null>(null)

function openTrip(id: string): void {
  trips.setActiveTrip(id)
  void router.push({ name: 'trip', params: { tripId: id } })
}

function stopPreview(tripId: string): string {
  const trip = trips.trips.find((item) => item.id === tripId)
  if (!trip || trip.stops.length === 0) {
    return 'Пока без точек'
  }
  const names = trip.stops
    .slice(0, 3)
    .map((stop) => getPlace(stop.placeId)?.nameRu)
    .filter((name): name is string => Boolean(name))
  const more = trip.stops.length > 3 ? ` и ещё ${trip.stops.length - 3}` : ''
  return names.join(', ') + more
}

function downloadBackup(): void {
  const blob = new Blob([JSON.stringify(trips.exportBackup(), null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'china-tour-trips.json'
  link.click()
  URL.revokeObjectURL(url)
  toast.add({
    title: 'Файл сохранён',
    description: 'Положите его в Файлы до вылета',
    color: 'success',
    icon: 'i-lucide-download',
  })
}

async function onImportFile(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) {
    return
  }
  try {
    const data = JSON.parse(await file.text()) as TripBackup
    const count = await trips.importBackup(data)
    toast.add({
      title: 'Поездки восстановлены',
      description: `${count} шт.`,
      color: 'success',
      icon: 'i-lucide-upload',
    })
  } catch {
    toast.add({
      title: 'Не получилось прочитать файл',
      color: 'error',
      icon: 'i-lucide-triangle-alert',
    })
  }
}
</script>

<template>
  <PanelShell>
    <div class="flex items-center justify-between gap-2 px-4 pt-2 pb-2 lg:pt-4">
      <div>
        <h1
          class="text-highlighted text-[28px] font-bold tracking-tight lg:text-xl lg:font-semibold"
        >
          Поездки
        </h1>
        <p class="text-muted text-sm">Маршруты хранятся только на этом устройстве</p>
      </div>
      <div class="flex shrink-0 items-center gap-1">
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-lucide-download"
          square
          @click="downloadBackup"
        />
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-lucide-upload"
          square
          @click="fileInput?.click()"
        />
        <UButton icon="i-lucide-plus" size="sm" label="Создать" @click="openCreateTrip" />
      </div>
    </div>
    <input
      ref="fileInput"
      type="file"
      accept="application/json"
      class="hidden"
      @change="onImportFile"
    />

    <UScrollArea class="min-h-0 flex-1 px-4 pb-4">
      <UEmpty
        v-if="trips.trips.length === 0"
        icon="i-lucide-suitcase"
        title="Поездок пока нет"
        description="Создайте поездку и добавьте точки из каталога"
      >
        <template #actions>
          <UButton label="Создать поездку" @click="openCreateTrip" />
        </template>
      </UEmpty>

      <div v-else class="flex flex-col gap-3">
        <button
          v-for="trip in trips.trips"
          :key="trip.id"
          type="button"
          class="text-left"
          @click="openTrip(trip.id)"
        >
          <UCard :ui="{ root: 'rounded-2xl' }">
            <div class="flex items-start justify-between gap-2">
              <div>
                <p class="text-highlighted font-medium">{{ trip.name }}</p>
                <p class="text-muted text-sm">{{ stopPreview(trip.id) }}</p>
              </div>
              <UBadge v-if="trips.activeTripId === trip.id" color="primary" variant="subtle">
                активна
              </UBadge>
            </div>
          </UCard>
        </button>
      </div>
    </UScrollArea>
  </PanelShell>
</template>
