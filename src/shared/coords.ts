import gcoord from 'gcoord'
import type { Basemap } from '@/shared/types'

export function toDisplayLatLng(lat: number, lng: number, basemap: Basemap): [number, number] {
  if (basemap !== 'gaode') {
    return [lat, lng]
  }

  const [gcjLng, gcjLat] = gcoord.transform([lng, lat], gcoord.WGS84, gcoord.GCJ02) as [
    number,
    number,
  ]
  return [gcjLat, gcjLng]
}

export function fromDeviceLatLng(
  lat: number,
  lng: number,
  assumeGcj02: boolean,
): { lat: number; lng: number } {
  if (!assumeGcj02) {
    return { lat, lng }
  }

  const [wgsLng, wgsLat] = gcoord.transform([lng, lat], gcoord.GCJ02, gcoord.WGS84) as [
    number,
    number,
  ]
  return { lat: wgsLat, lng: wgsLng }
}

export function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const r = 6371
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const sinLat = Math.sin(dLat / 2)
  const sinLng = Math.sin(dLng / 2)
  const h = sinLat * sinLat + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinLng * sinLng
  return 2 * r * Math.asin(Math.min(1, Math.sqrt(h)))
}

export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} м`
  }
  return `${km.toFixed(km < 10 ? 1 : 0)} км`
}

function toRad(value: number): number {
  return (value * Math.PI) / 180
}

export function lngLatToTile(lat: number, lng: number, zoom: number): { x: number; y: number } {
  const n = 2 ** zoom
  const x = Math.floor(((lng + 180) / 360) * n)
  const latRad = toRad(lat)
  const y = Math.floor(((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n)
  return { x, y }
}
