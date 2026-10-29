import { describe, expect, it } from 'vitest'
import { recommend, shop } from './contexts.ts'

// Diese Tests beschreiben den heutigen Stand – auch seine Schwächen.
describe('one pattern for every context', () => {
  it('puts even the catalog on event sourcing', () => {
    const catalog = shop.find((context) => context.name === 'Katalog')!
    expect(recommend(catalog)).toBe('cqrs-event-sourcing')
  })

  it('ignores whether the team can carry it', () => {
    const returns = shop.find((context) => context.name === 'Retouren')!
    expect(recommend(returns)).toBe('cqrs-event-sourcing')
  })
})
