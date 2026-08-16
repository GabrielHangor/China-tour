import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { db } from '@/shared/db'
import type { StopStatus, Trip, TripStop } from '@/shared/types'

function now(): number {
  return Date.now()
}

export const useTripsStore = defineStore('trips', () => {
  const trips = ref<Trip[]>([])
  const activeTripId = ref<string | null>(localStorage.getItem('china-tour:active-trip'))

  const activeTrip = computed(
    () => trips.value.find((trip) => trip.id === activeTripId.value) ?? null,
  )

  async function hydrate(): Promise<void> {
    trips.value = await db.trips.orderBy('updatedAt').reverse().toArray()
    if (activeTripId.value && !trips.value.some((trip) => trip.id === activeTripId.value)) {
      setActiveTrip(null)
    }
  }

  function setActiveTrip(id: string | null): void {
    activeTripId.value = id
    if (id) {
      localStorage.setItem('china-tour:active-trip', id)
    } else {
      localStorage.removeItem('china-tour:active-trip')
    }
  }

  async function persist(trip: Trip): Promise<void> {
    await db.trips.put(trip)
    const index = trips.value.findIndex((item) => item.id === trip.id)
    if (index === -1) {
      trips.value.unshift(trip)
    } else {
      trips.value[index] = trip
    }
  }

  async function createTrip(name: string): Promise<Trip> {
    const trip: Trip = {
      id: crypto.randomUUID(),
      name: name.trim(),
      stops: [],
      createdAt: now(),
      updatedAt: now(),
    }
    await persist(trip)
    if (!activeTripId.value) {
      setActiveTrip(trip.id)
    }
    return trip
  }

  async function renameTrip(id: string, name: string): Promise<void> {
    const trip = trips.value.find((item) => item.id === id)
    if (!trip) {
      return
    }
    await persist({ ...trip, name: name.trim(), updatedAt: now() })
  }

  async function deleteTrip(id: string): Promise<void> {
    await db.trips.delete(id)
    trips.value = trips.value.filter((item) => item.id !== id)
    if (activeTripId.value === id) {
      setActiveTrip(trips.value[0]?.id ?? null)
    }
  }

  async function addPlace(tripId: string, placeId: string): Promise<void> {
    const trip = trips.value.find((item) => item.id === tripId)
    if (!trip || trip.stops.some((stop) => stop.placeId === placeId)) {
      return
    }
    const stop: TripStop = { placeId, status: 'planned' }
    await persist({ ...trip, stops: [...trip.stops, stop], updatedAt: now() })
  }

  async function removeStop(tripId: string, placeId: string): Promise<void> {
    const trip = trips.value.find((item) => item.id === tripId)
    if (!trip) {
      return
    }
    await persist({
      ...trip,
      stops: trip.stops.filter((stop) => stop.placeId !== placeId),
      updatedAt: now(),
    })
  }

  async function moveStop(tripId: string, placeId: string, direction: -1 | 1): Promise<void> {
    const trip = trips.value.find((item) => item.id === tripId)
    if (!trip) {
      return
    }
    const index = trip.stops.findIndex((stop) => stop.placeId === placeId)
    const next = index + direction
    if (index < 0 || next < 0 || next >= trip.stops.length) {
      return
    }
    const stops = [...trip.stops]
    const current = stops[index]
    const swapped = stops[next]
    if (!current || !swapped) {
      return
    }
    stops[index] = swapped
    stops[next] = current
    await persist({ ...trip, stops, updatedAt: now() })
  }

  async function setStopStatus(tripId: string, placeId: string, status: StopStatus): Promise<void> {
    const trip = trips.value.find((item) => item.id === tripId)
    if (!trip) {
      return
    }
    await persist({
      ...trip,
      stops: trip.stops.map((stop) => (stop.placeId === placeId ? { ...stop, status } : stop)),
      updatedAt: now(),
    })
  }

  async function addRoutePlaces(tripId: string, placeIds: string[]): Promise<void> {
    const trip = trips.value.find((item) => item.id === tripId)
    if (!trip) {
      return
    }
    const existing = new Set(trip.stops.map((stop) => stop.placeId))
    const stops = [
      ...trip.stops,
      ...placeIds
        .filter((id) => !existing.has(id))
        .map((placeId) => ({ placeId, status: 'planned' as const })),
    ]
    await persist({ ...trip, stops, updatedAt: now() })
  }

  return {
    trips,
    activeTripId,
    activeTrip,
    hydrate,
    setActiveTrip,
    createTrip,
    renameTrip,
    deleteTrip,
    addPlace,
    removeStop,
    moveStop,
    setStopStatus,
    addRoutePlaces,
  }
})
