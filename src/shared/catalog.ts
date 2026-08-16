import { cities } from '@/data/catalog/cities'
import { placeImageUrls } from '@/data/catalog/images'
import { places as catalogPlaces } from '@/data/catalog/places'
import { routes } from '@/data/catalog/routes'
import { streetFacts } from '@/data/catalog/street'
import type { City, Place, PlaceCategory, Route } from '@/shared/types'

export const places: Place[] = catalogPlaces.map((place) => ({
  ...place,
  ...streetFacts[place.id],
}))

const cityById = new Map(cities.map((city) => [city.id, city]))
const placeById = new Map(places.map((place) => [place.id, place]))
const routeById = new Map(routes.map((route) => [route.id, route]))

export const categoryLabels: Record<PlaceCategory, string> = {
  sight: 'Достопримечательность',
  food: 'Еда',
  museum: 'Музей',
  park: 'Парк',
  transport: 'Транспорт',
  hotel: 'Отель',
}

export function placeImages(place: Place): string[] {
  const url = placeImageUrls[place.id]
  return url ? [url] : []
}

export function routeImages(route: Route): string[] {
  for (const placeId of route.placeIds) {
    const url = placeImageUrls[placeId]
    if (url) {
      return [url]
    }
  }
  return []
}

export function getCity(id: string): City | undefined {
  return cityById.get(id)
}

export function getPlace(id: string): Place | undefined {
  return placeById.get(id)
}

export function getRoute(id: string): Route | undefined {
  return routeById.get(id)
}

export function placesByCity(cityId: string): Place[] {
  return places.filter((place) => place.cityId === cityId)
}

export function routePlaces(route: Route): Place[] {
  return route.placeIds
    .map((id) => placeById.get(id))
    .filter((place): place is Place => Boolean(place))
}

export function routePolyline(route: Route): [number, number][] {
  return routePlaces(route).map((place) => [place.lat, place.lng])
}

export { cities, routes }
