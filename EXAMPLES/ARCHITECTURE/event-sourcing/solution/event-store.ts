import type { OrderEvent } from './order.ts'

// Jedes gespeicherte Event bekommt eine globale Position: Projektionen erkennen daran Duplikate.
export type StoredEvent = {
  position: number
  streamId: string
  version: number
  event: OrderEvent
}

export type EventStore = {
  load: (id: string) => Promise<{ events: OrderEvent[]; version: number }>
  append: (id: string, expectedVersion: number, events: OrderEvent[]) => Promise<void>
  readAll: (fromPosition?: number) => Promise<StoredEvent[]>
}

export class ConcurrencyError extends Error {
  readonly streamId: string
  readonly expectedVersion: number
  readonly actualVersion: number

  constructor(streamId: string, expectedVersion: number, actualVersion: number) {
    super(`Version conflict in ${streamId}: expected ${expectedVersion}, found ${actualVersion}`)
    this.name = 'ConcurrencyError'
    this.streamId = streamId
    this.expectedVersion = expectedVersion
    this.actualVersion = actualVersion
  }
}

export const inMemoryEventStore = (): EventStore => {
  const log: StoredEvent[] = []
  const streams = new Map<string, StoredEvent[]>()

  return {
    load: async (id) => {
      const stream = streams.get(id) ?? []
      // Kopien: Wer geladene Events verändert, ändert nie den Store.
      return {
        events: stream.map((stored) => structuredClone(stored.event)),
        version: stream.length,
      }
    },
    append: async (id, expectedVersion, events) => {
      const stream = streams.get(id) ?? []
      if (stream.length !== expectedVersion)
        throw new ConcurrencyError(id, expectedVersion, stream.length)
      const stored = events.map((event, index) => ({
        position: log.length + index + 1,
        streamId: id,
        version: expectedVersion + index + 1,
        event: structuredClone(event),
      }))
      streams.set(id, [...stream, ...stored])
      log.push(...stored)
    },
    readAll: async (fromPosition = 0) =>
      log
        .filter((stored) => stored.position > fromPosition)
        .map((stored) => structuredClone(stored)),
  }
}
