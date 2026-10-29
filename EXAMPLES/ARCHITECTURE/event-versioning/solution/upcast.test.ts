import { describe, expect, it } from 'vitest'
import { evolve, initial, log } from '../src/events.ts'
import { toEnvelope, upcast } from './upcast.ts'

describe('upcasting', () => {
  it('reads three years of events with today’s evolve', () => {
    expect(log.map(upcast).reduce(evolve, initial)).toEqual({
      totalCents: 2 * 1290 + 1999,
      placedAt: '2026-10-12T10:00:00.000Z',
    })
  })

  it('lifts euros into cents and renames at into placedAt', () => {
    expect(upcast(log[0]!)).toEqual({
      type: 'ItemAdded',
      productId: 'p-1',
      quantity: 2,
      priceCents: 1290,
    })
    expect(upcast(log[1]!)).toEqual({ type: 'OrderPlaced', placedAt: '2023-05-02T08:00:00.000Z' })
  })

  it('never changes the stored events', () => {
    const before = JSON.stringify(log)
    log.map(upcast)
    expect(JSON.stringify(log)).toBe(before)
  })

  it('refuses events from a newer version of the code', () => {
    expect(() => upcast({ type: 'ItemAdded', version: 3, data: {} })).toThrow(
      'ItemAdded v3 is newer than this code',
    )
  })

  it('refuses unknown event types instead of guessing', () => {
    expect(() => upcast({ type: 'OrderGifted', version: 1, data: {} })).toThrow(
      'Unknown event type OrderGifted',
    )
  })

  it('writes new events in the current schema', () => {
    expect(toEnvelope({ type: 'OrderPlaced', placedAt: '2026-10-29T09:00:00.000Z' })).toEqual({
      type: 'OrderPlaced',
      version: 2,
      data: { placedAt: '2026-10-29T09:00:00.000Z' },
    })
  })
})
