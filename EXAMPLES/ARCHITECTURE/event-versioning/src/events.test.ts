import { describe, expect, it } from 'vitest'
import { evolve, initial, log, naiveRead } from './events.ts'

// Diese Tests beschreiben den heutigen Stand – auch seine Schwächen.
describe('reading old events with the new schema', () => {
  it('turns the total into NaN', () => {
    const order = log.slice(0, 1).map(naiveRead).reduce(evolve, initial)
    expect(order.totalCents).toBeNaN()
  })

  it('loses the time an old order was placed', () => {
    const order = log.slice(1, 2).map(naiveRead).reduce(evolve, initial)
    expect(order.placedAt).toBeUndefined()
  })
})
