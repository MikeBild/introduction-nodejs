import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { testPlaceOrderBehaviour } from '../src/characterization.ts'
import { createLogger } from '../src/logger.ts'
import { createApp } from './app.ts'
import { hammer, saw } from './fixtures.ts'
import { createMemoryOrderStore, createPlaceOrder, placeOrder } from './orders/index.ts'

beforeEach(() => void vi.spyOn(console, 'log').mockImplementation(() => {}))
afterEach(() => void vi.restoreAllMocks())

const now = new Date('2026-10-29T10:00:00.000Z')
const clock = () => now
const catalog = new Map([[hammer.id as string, hammer]])

describe('core: placeOrder', () => {
  test('places an order with prices from the catalog and createdAt = now', () => {
    expect(
      placeOrder(
        { customerId: 'c-17', items: [{ productId: hammer.id, quantity: 2 }] },
        catalog,
        now,
      ),
    ).toEqual({
      kind: 'placed',
      order: {
        customerId: 'c-17',
        items: [{ productId: hammer.id, quantity: 2, priceCents: 1990 }],
        status: 'placed',
        createdAt: '2026-10-29T10:00:00.000Z',
      },
    })
  })

  test('the stock rule needs no global state – just a catalog value', () => {
    const emptyShelf = new Map([[hammer.id as string, { ...hammer, stock: 0 }]])
    expect(
      placeOrder(
        { customerId: 'c-17', items: [{ productId: hammer.id, quantity: 1 }] },
        emptyShelf,
        now,
      ),
    ).toEqual({
      kind: 'rejected',
      reason: 'insufficient-stock',
    })
  })
})

describe('use case: createPlaceOrder', () => {
  test('saves placed orders through the port', async () => {
    const orderStore = createMemoryOrderStore([hammer])
    const placeOrderNow = createPlaceOrder(orderStore, clock)
    const outcome = await placeOrderNow({
      customerId: 'c-17',
      items: [{ productId: hammer.id, quantity: 1 }],
    })
    expect(outcome.kind).toBe('placed')
    expect(orderStore.savedOrders()).toHaveLength(1)
  })

  test('saves nothing for a rejected order', async () => {
    const orderStore = createMemoryOrderStore([hammer])
    const placeOrderNow = createPlaceOrder(orderStore, clock)
    await placeOrderNow({ customerId: 'c-17', items: [{ productId: 'p-unknown', quantity: 1 }] })
    expect(orderStore.savedOrders()).toHaveLength(0)
  })
})

// the same characterization tests as for the knot – the refactoring kept the behaviour
describe('http adapter (characterization)', () =>
  testPlaceOrderBehaviour(() =>
    createApp({
      orderStore: createMemoryOrderStore([hammer, saw]),
      clock,
      logger: createLogger('error'),
    }),
  ))
