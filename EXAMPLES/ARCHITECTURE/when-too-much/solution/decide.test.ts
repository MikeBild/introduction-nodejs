import { describe, expect, it } from 'vitest'
import { shop } from '../src/contexts.ts'
import { decisionLine, recommend } from './decide.ts'

const byName = (name: string) => shop.find((context) => context.name === name)!

describe('decision flow per bounded context', () => {
  it('keeps simple contexts on CRUD', () => {
    expect(recommend(byName('Katalog'))).toBe('crud')
    expect(recommend(byName('Kunden'))).toBe('crud')
  })

  it('separates commands and queries where rules collide but history does not matter', () => {
    expect(recommend(byName('Lager'))).toBe('cqrs-lite')
  })

  it('uses event sourcing only where history counts and the team is ready', () => {
    expect(recommend(byName('Bestellungen'))).toBe('cqrs-event-sourcing')
    expect(recommend(byName('Retouren'))).toBe('compromise')
  })

  it('ends up with event sourcing in one context out of five', () => {
    expect(shop.filter((c) => recommend(c) === 'cqrs-event-sourcing')).toHaveLength(1)
  })

  it('writes a decision line for the ADR', () => {
    expect(decisionLine(byName('Katalog'))).toBe(
      'Katalog: Wir werden CRUD einsetzen. Ein Modell reicht, die Regeln sind einfach.',
    )
  })
})
