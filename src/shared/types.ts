export type PlaceCategory = 'sight' | 'food' | 'museum' | 'park' | 'transport' | 'hotel'

export type StopStatus = 'planned' | 'visited'

export interface City {
  id: string
  nameRu: string
  nameZh: string
  lat: number
  lng: number
}

export interface Place {
  id: string
  nameRu: string
  nameZh: string
  cityId: string
  category: PlaceCategory
  lat: number
  lng: number
  description: string
  images: string[]
  tags: string[]
  tips?: string
}

export interface Route {
  id: string
  nameRu: string
  description: string
  cityIds: string[]
  placeIds: string[]
  images: string[]
}

export interface TripStop {
  placeId: string
  status: StopStatus
  notes?: string
}

export interface Trip {
  id: string
  name: string
  stops: TripStop[]
  createdAt: number
  updatedAt: number
}

export type Basemap = 'osm' | 'gaode'
