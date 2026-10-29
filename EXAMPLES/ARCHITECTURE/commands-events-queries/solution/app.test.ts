import { describe, expect, it } from 'vitest'
import { createOrderApp } from './app.ts'
import type { OrderCommand, OrderEvent } from './messages.ts'
import { decide, evolve, initial } from './order.ts'

const hammer = { productId: 'p-1', quantity: 2, priceCents: 1290 }
const at = new Date('2026-10-01T09:00:00.000Z')

const run = (commands: OrderCommand[]) => {
  const app = createOrderApp(() => at)
  const events: OrderEvent[] = []
  app.subscribe((event) => events.push(event))
  for (const command of commands) app.send(command)
  return { app, events }
}

describe('commands, events, queries', () => {
  it('turns accepted commands into events', () => {
    const { events } = run([
      { type: 'CreateOrder', orderId: 'o-1', customerId: 'c-1' },
      { type: 'AddItem', orderId: 'o-1', item: hammer },
      { type: 'PlaceOrder', orderId: 'o-1' },
    ])
    expect(events.map((e) => e.type)).toEqual(['OrderCreated', 'ItemAdded', 'OrderPlaced'])
    expect(events[2]).toEqual({ type: 'OrderPlaced', orderId: 'o-1', placedAt: at.toISOString() })
  })

  it('rejects a command without creating an event', () => {
    const { app, events } = run([{ type: 'CreateOrder', orderId: 'o-1', customerId: 'c-1' }])
    expect(() => app.send({ type: 'ShipOrder', orderId: 'o-1' })).toThrow(
      'Only paid orders can ship',
    )
    expect(events).toHaveLength(1)
  })

  it('answers queries without side effects', () => {
    const { app } = run([
      { type: 'CreateOrder', orderId: 'o-1', customerId: 'c-1' },
      { type: 'AddItem', orderId: 'o-1', item: hammer },
      { type: 'PlaceOrder', orderId: 'o-1' },
      { type: 'CreateOrder', orderId: 'o-2', customerId: 'c-2' },
    ])
    const first = app.ask({ type: 'ListOpenOrders' })
    expect(first.map((o) => o.id)).toEqual(['o-1'])
    expect(app.ask({ type: 'ListOpenOrders' })).toEqual(first)
  })

  it('names commands in the imperative and events in the past tense', () => {
    const commands: OrderCommand['type'][] = [
      'CreateOrder',
      'AddItem',
      'PlaceOrder',
      'PayOrder',
      'ShipOrder',
      'CancelOrder',
    ]
    for (const name of commands) expect(name).toMatch(/^(Create|Add|Place|Pay|Ship|Cancel)/)
    const event = decide(initial, { type: 'CreateOrder', orderId: 'o-1', customerId: 'c-1' })[0]!
    expect(event.type).toMatch(/(ed|Paid)$/)
  })

  it('rebuilds the state from the events alone', () => {
    const { events } = run([
      { type: 'CreateOrder', orderId: 'o-1', customerId: 'c-1' },
      { type: 'AddItem', orderId: 'o-1', item: hammer },
      { type: 'PlaceOrder', orderId: 'o-1' },
      { type: 'PayOrder', orderId: 'o-1' },
    ])
    expect(events.reduce(evolve, initial)).toEqual({
      customerId: 'c-1',
      status: 'paid',
      items: [hammer],
    })
  })
})
