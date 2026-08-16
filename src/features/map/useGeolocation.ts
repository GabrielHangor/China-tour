import { onUnmounted, ref } from 'vue'
import { fromDeviceLatLng } from '@/shared/coords'

export interface GeoPoint {
  lat: number
  lng: number
  accuracy: number
}

export function useGeolocation() {
  const position = ref<GeoPoint | null>(null)
  const trail = ref<{ lat: number; lng: number }[]>([])
  const error = ref<string | null>(null)
  const watching = ref(false)
  const assumeGcj02 = ref(false)
  let watchId: number | null = null

  function start(): void {
    if (!navigator.geolocation) {
      error.value = 'Геолокация недоступна в этом браузере'
      return
    }

    error.value = null
    watching.value = true
    watchId = navigator.geolocation.watchPosition(
      (result) => {
        const raw = fromDeviceLatLng(
          result.coords.latitude,
          result.coords.longitude,
          assumeGcj02.value,
        )
        position.value = { ...raw, accuracy: result.coords.accuracy }
        trail.value.push(raw)
        if (trail.value.length > 400) {
          trail.value.shift()
        }
      },
      (result) => {
        error.value = result.message || 'Не удалось получить координаты'
        watching.value = false
      },
      { enableHighAccuracy: true, maximumAge: 4000, timeout: 20000 },
    )
  }

  function stop(): void {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId)
      watchId = null
    }
    watching.value = false
  }

  onUnmounted(stop)

  return { position, trail, error, watching, assumeGcj02, start, stop }
}
