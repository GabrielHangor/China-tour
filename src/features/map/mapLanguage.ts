import type { DataDrivenPropertyValueSpecification, Map as MaplibreMap } from 'maplibre-gl'

const russianLabelField = [
  'coalesce',
  ['get', 'name:ru'],
  ['get', 'name:en'],
  ['get', 'name:latin'],
  ['get', 'name_en'],
  ['get', 'name'],
] as DataDrivenPropertyValueSpecification<string>

export function applyRussianLabels(map: MaplibreMap): void {
  const style = map.getStyle()
  if (!style?.layers) {
    return
  }

  for (const layer of style.layers) {
    if (layer.type !== 'symbol') {
      continue
    }
    if (map.getLayoutProperty(layer.id, 'text-field') === undefined) {
      continue
    }
    map.setLayoutProperty(layer.id, 'text-field', russianLabelField)
  }
}
