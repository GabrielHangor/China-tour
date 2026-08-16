import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMapStore = defineStore('map', () => {
  const focusPlaceId = ref<string | null>(null)

  function focusPlace(id: string): void {
    focusPlaceId.value = id
  }

  function clearFocus(): void {
    focusPlaceId.value = null
  }

  return { focusPlaceId, focusPlace, clearFocus }
})
