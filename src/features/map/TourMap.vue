<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'maplibre-gl/dist/maplibre-gl.css'
import '@maplibre/maplibre-gl-leaflet'
import { useGeolocation } from '@/features/map/useGeolocation'
import { applyRussianLabels } from '@/features/map/mapLanguage'
import { useTripsStore } from '@/features/trips/tripsStore'
import { getPlace, places, routePolyline, routes } from '@/shared/catalog'
import { formatDistance, haversineKm, toDisplayLatLng } from '@/shared/coords'
import type { Basemap, PlaceCategory } from '@/shared/types'

const OPENFREEMAP_STYLE = 'https://tiles.openfreemap.org/styles/liberty'
const GAODE_URL =
  'https://webrd0{s}.is.autonavi.com/appmaptile?lang=en&size=1&scale=1&style=8&x={x}&y={y}&z={z}'

const categoryColors: Record<PlaceCategory, string> = {
  sight: '#dc2626',
  food: '#d97706',
  museum: '#7c3aed',
  park: '#16a34a',
  transport: '#2563eb',
  hotel: '#57534e',
}

const router = useRouter()
const trips = useTripsStore()
const { position, trail, error, watching, assumeGcj02, start, stop } = useGeolocation()

const root = ref<HTMLElement | null>(null)
const basemap = ref<Basemap>('ru')
const settingsOpen = ref(false)

let map: L.Map | undefined
let ruLayer: L.MaplibreGL | undefined
let gaodeLayer: L.TileLayer | undefined
const markersLayer = L.layerGroup()
const routesLayer = L.layerGroup()
const tripLayer = L.layerGroup()
const geoLayer = L.layerGroup()

function display(lat: number, lng: number): [number, number] {
  return toDisplayLatLng(lat, lng, basemap.value)
}

function rebuildPlaces(): void {
  markersLayer.clearLayers()
  for (const place of places) {
    L.circleMarker(display(place.lat, place.lng), {
      radius: 7,
      color: '#fff',
      weight: 1,
      fillColor: categoryColors[place.category],
      fillOpacity: 0.95,
    })
      .bindTooltip(place.nameRu)
      .on('click', () => {
        void router.push({ name: 'place', params: { placeId: place.id } })
      })
      .addTo(markersLayer)
  }
}

function rebuildRoutes(): void {
  routesLayer.clearLayers()
  for (const route of routes) {
    const latlngs = routePolyline(route).map(([lat, lng]) => display(lat, lng))
    if (latlngs.length < 2) {
      continue
    }
    L.polyline(latlngs, { color: '#f59e0b', weight: 3, opacity: 0.55 })
      .bindTooltip(route.nameRu)
      .addTo(routesLayer)
  }
}

function rebuildTrip(): void {
  tripLayer.clearLayers()
  const trip = trips.activeTrip
  if (!trip) {
    return
  }
  const points = trip.stops
    .map((stop) => getPlace(stop.placeId))
    .filter((place) => place !== undefined)
    .map((place) => display(place.lat, place.lng))
  if (points.length >= 2) {
    L.polyline(points, { color: '#dc2626', weight: 5, opacity: 0.9 }).addTo(tripLayer)
  }
}

function rebuildGeo(): void {
  geoLayer.clearLayers()
  if (trail.value.length > 1) {
    L.polyline(
      trail.value.map((point) => display(point.lat, point.lng)),
      { color: '#2563eb', weight: 3, opacity: 0.8 },
    ).addTo(geoLayer)
  }
  if (position.value) {
    L.circleMarker(display(position.value.lat, position.value.lng), {
      radius: 9,
      color: '#fff',
      weight: 2,
      fillColor: '#2563eb',
      fillOpacity: 1,
    })
      .bindTooltip('Я здесь')
      .addTo(geoLayer)
  }
}

function bindRussianLabels(layer: L.MaplibreGL): void {
  const glMap = layer.getMaplibreMap()
  const apply = (): void => {
    applyRussianLabels(glMap)
  }
  if (glMap.isStyleLoaded()) {
    apply()
    return
  }
  glMap.once('load', apply)
}

function applyBasemap(): void {
  if (!map || !ruLayer || !gaodeLayer) {
    return
  }
  if (basemap.value === 'gaode') {
    map.removeLayer(ruLayer)
    gaodeLayer.addTo(map)
  } else {
    map.removeLayer(gaodeLayer)
    ruLayer.addTo(map)
    bindRussianLabels(ruLayer)
  }
  rebuildPlaces()
  rebuildRoutes()
  rebuildTrip()
  rebuildGeo()
}

const nextStop = computed(() => {
  const trip = trips.activeTrip
  if (!trip) {
    return null
  }
  const planned = trip.stops.find((stop) => stop.status === 'planned')
  if (!planned) {
    return null
  }
  return getPlace(planned.placeId) ?? null
})

const distanceLabel = computed(() => {
  if (!position.value || !nextStop.value) {
    return null
  }
  return `${nextStop.value.nameRu} · ${formatDistance(haversineKm(position.value, nextStop.value))}`
})

function dismissError(): void {
  error.value = null
}

function toggleLocation(): void {
  if (watching.value) {
    stop()
    return
  }
  start()
}

function locateMe(): void {
  if (!watching.value) {
    start()
  }
  if (position.value && map) {
    map.flyTo(display(position.value.lat, position.value.lng), 14)
  }
}

onMounted(() => {
  if (!root.value) {
    return
  }
  map = L.map(root.value, {
    zoomControl: false,
    attributionControl: true,
    minZoom: 2,
    maxBounds: [
      [-85, -180],
      [85, 180],
    ],
    maxBoundsViscosity: 1,
  }).setView([35.2, 105.5], 5)
  map.attributionControl.addAttribution(
    '&copy; <a href="https://openfreemap.org">OpenFreeMap</a> &copy; OpenMapTiles &copy; OpenStreetMap',
  )
  L.control.zoom({ position: 'bottomright' }).addTo(map)
  ruLayer = L.maplibreGL({
    style: OPENFREEMAP_STYLE,
  })
  gaodeLayer = L.tileLayer(GAODE_URL, {
    maxZoom: 18,
    subdomains: '1234',
    attribution: 'Gaode / Amap',
  })
  ruLayer.addTo(map)
  bindRussianLabels(ruLayer)
  routesLayer.addTo(map)
  markersLayer.addTo(map)
  tripLayer.addTo(map)
  geoLayer.addTo(map)
  rebuildPlaces()
  rebuildRoutes()
  rebuildTrip()
})

onBeforeUnmount(() => {
  map?.remove()
  map = undefined
})

watch(basemap, applyBasemap)
watch(
  () => trips.activeTrip,
  () => rebuildTrip(),
  { deep: true },
)
watch([position, trail], () => {
  rebuildGeo()
  if (position.value && map && trail.value.length === 1) {
    map.flyTo(display(position.value.lat, position.value.lng), 13)
  }
})
</script>

<template>
  <div class="absolute inset-0">
    <div ref="root" class="tour-map absolute inset-0" />

    <div class="pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-col gap-2 p-3">
      <div class="pointer-events-auto flex items-start justify-between gap-2">
        <div class="flex flex-wrap gap-2">
          <UButton
            size="sm"
            :color="basemap === 'ru' ? 'primary' : 'neutral'"
            :variant="basemap === 'ru' ? 'solid' : 'outline'"
            label="Русский"
            @click="basemap = 'ru'"
          />
          <UButton
            size="sm"
            :color="basemap === 'gaode' ? 'primary' : 'neutral'"
            :variant="basemap === 'gaode' ? 'solid' : 'outline'"
            label="Китай"
            @click="basemap = 'gaode'"
          />
        </div>
        <UPopover v-model:open="settingsOpen">
          <UButton size="sm" color="neutral" variant="outline" icon="i-lucide-settings" />
          <template #content>
            <div class="flex w-64 flex-col gap-3 p-3">
              <p class="text-sm text-muted">
                Слой «Русский» — подписи name:ru, иначе английский. «Китай» нужен, если OpenFreeMap
                недоступен в КНР. Если маркер смещён на 300–500 м, включите сдвиг GPS.
              </p>
              <USwitch v-model="assumeGcj02" label="GPS в GCJ-02" />
            </div>
          </template>
        </UPopover>
      </div>

      <UAlert
        v-if="error"
        class="pointer-events-auto"
        color="warning"
        variant="subtle"
        icon="i-lucide-triangle-alert"
        :title="error"
        :close="{ onClick: dismissError }"
      />
      <UBadge v-if="distanceLabel" color="primary" variant="subtle" size="lg" class="self-start">
        {{ distanceLabel }}
      </UBadge>
    </div>

    <div class="pointer-events-auto absolute right-3 bottom-24 z-10 flex flex-col gap-2">
      <UButton
        color="neutral"
        variant="outline"
        icon="i-lucide-locate-fixed"
        square
        @click="locateMe"
      />
      <UButton
        :color="watching ? 'primary' : 'neutral'"
        :variant="watching ? 'solid' : 'outline'"
        :icon="watching ? 'i-lucide-navigation-off' : 'i-lucide-navigation'"
        square
        @click="toggleLocation"
      />
    </div>
  </div>
</template>

<style>
.tour-map,
.tour-map .leaflet-pane,
.leaflet-container {
  z-index: 0;
}
</style>
