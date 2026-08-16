import { lngLatToTile } from '@/shared/coords'
import type { Place } from '@/shared/types'

const GAODE_TEMPLATE =
  'https://webrd01.is.autonavi.com/appmaptile?lang=en&size=1&scale=1&style=8&x={x}&y={y}&z={z}'

export interface OfflineProgress {
  done: number
  total: number
  ok: number
  failed: number
}

function tileUrl(template: string, z: number, x: number, y: number): string {
  return template.replace('{z}', String(z)).replace('{x}', String(x)).replace('{y}', String(y))
}

function tilesAround(lat: number, lng: number, zoom: number, radius: number): string[] {
  const { x, y } = lngLatToTile(lat, lng, zoom)
  const n = 2 ** zoom
  const urls: string[] = []
  for (let dx = -radius; dx <= radius; dx += 1) {
    for (let dy = -radius; dy <= radius; dy += 1) {
      const tileX = (((x + dx) % n) + n) % n
      const tileY = y + dy
      if (tileY < 0 || tileY >= n) {
        continue
      }
      urls.push(tileUrl(GAODE_TEMPLATE, zoom, tileX, tileY))
    }
  }
  return urls
}

export function collectOfflineUrls(places: Place[]): string[] {
  const urls = new Set<string>()
  for (const place of places) {
    for (let zoom = 8; zoom <= 11; zoom += 1) {
      for (const url of tilesAround(place.lat, place.lng, zoom, 1)) {
        urls.add(url)
      }
    }
    for (let zoom = 12; zoom <= 15; zoom += 1) {
      for (const url of tilesAround(place.lat, place.lng, zoom, 2)) {
        urls.add(url)
      }
    }
  }
  return [...urls]
}

export async function prefetchUrls(
  urls: string[],
  onProgress: (progress: OfflineProgress) => void,
): Promise<void> {
  let done = 0
  let ok = 0
  let failed = 0
  const total = urls.length
  onProgress({ done, total, ok, failed })

  const workers = 8
  let cursor = 0

  async function run(): Promise<void> {
    while (cursor < urls.length) {
      const url = urls[cursor]
      cursor += 1
      if (!url) {
        continue
      }
      try {
        const response = await fetch(url, { mode: 'cors', credentials: 'omit' })
        if (response.ok) {
          ok += 1
        } else {
          failed += 1
        }
      } catch {
        failed += 1
      }
      done += 1
      if (done === total || done % 20 === 0) {
        onProgress({ done, total, ok, failed })
      }
    }
  }

  await Promise.all(Array.from({ length: workers }, () => run()))
  onProgress({ done: total, total, ok, failed })
}
