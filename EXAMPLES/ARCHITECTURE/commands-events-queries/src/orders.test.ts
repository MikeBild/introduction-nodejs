import { describe, expect, it } from 'vitest'
import { createOrderApi } from './orders.ts'

const draft = { id: 'o-1', customerId: 'c-1', status: 'draft' as const, items: [] }

// Diese Tests beschreiben den heutigen Stand – auch seine Schwächen.
describe('update-everything API', () => {
  it('ships a draft order without items', () => {
    const api = createOrderApi()
    api.saveOrder(draft)
    expect(api.updateOrder('o-1', { status: 'shipped' }).status).toBe('shipped')
  })

  it('does not tell what happened: placed or just renamed?', () => {
    const api = createOrderApi()
    api.saveOrder(draft)
    const before = api.updateOrder('o-1', { customerId: 'c-2' })
    const after = api.updateOrder('o-1', { status: 'placed' })
    expect(Object.keys(before)).toEqual(Object.keys(after)) // kein Unterschied in der Antwort
  })

  it('changes state while reading', () => {
    let clock = 0
    const api = createOrderApi(() => new Date(Date.UTC(2026, 9, 1, 0, 0, clock++)))
    api.saveOrder(draft)
    const first = api.getOrder('o-1')
    const second = api.getOrder('o-1')
    expect(first).not.toEqual(second)
  })
})
