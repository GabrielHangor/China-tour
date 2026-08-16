import Dexie, { type Table } from 'dexie'
import type { Trip } from '@/shared/types'

class TourDatabase extends Dexie {
  trips!: Table<Trip, string>

  constructor() {
    super('china-tour')
    this.version(1).stores({
      trips: 'id, createdAt, updatedAt',
    })
  }
}

export const db = new TourDatabase()
