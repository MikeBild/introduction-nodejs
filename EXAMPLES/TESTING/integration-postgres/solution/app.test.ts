import { afterAll, beforeAll, beforeEach, describe, expect, test } from 'vitest'
import { createApp } from '../src/app.ts'
import { hammer, saw, seedProducts } from '../src/fixtures.ts'
import { createLogger } from '../src/logger.ts'
import type { CustomerId } from '../src/orders.ts'
import { findOrder, loadCatalog, saveOrder, type Sql } from '../src/postgres.ts'
import { connectTestDatabase } from '../src/test-database.ts'
import { listen } from '../src/test-server.ts'

const now = () => new Date('2026-10-29T10:00:00.000Z')
let sql: Sql

// one pool and the migrations per file; the tables are emptied before every test
beforeAll(async () => {
  sql = await connectTestDatabase()
})
afterAll(() => sql.end())
beforeEach(async () => {
  await sql`truncate products, orders cascade`
  await seedProducts(sql, [hammer, saw])
})

// the same factory as in the Vitest exercise – this time with the real functions instead of vi.fn()
const createTestApp = () =>
  createApp({
    loadCatalog: loadCatalog(sql),
    saveOrder: saveOrder(sql),
    findOrder: findOrder(sql),
    logger: createLogger('error'),
    now,
  })

const postOrder = (url: string, body: unknown) =>
  fetch(`${url}/orders`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })

// what the test checks in the database – next to the response, not instead of it
const stockOf = async (productId: string) => {
  const [row] = await sql<{ stock: number }[]>`select stock from products where id = ${productId}`
  return row?.stock
}
const orderCount = async () => {
  const [row] = await sql<{ count: number }[]>`select count(*)::int as count from orders`
  return row?.count
}

describe('POST /orders against PostgreSQL', () => {
  test('answers 201, stores order and items with prices from products and reduces the stock', async () => {
    await using api = await listen(createTestApp())
    const response = await postOrder(api.url, {
      customerId: 'c-17',
      items: [{ productId: hammer.id, quantity: 2 }],
    })
    expect(response.status).toBe(201)
    const order = await response.json()
    expect(order).toMatchObject({
      customerId: 'c-17',
      status: 'placed',
      createdAt: '2026-10-29T10:00:00.000Z',
      items: [{ productId: hammer.id, quantity: 2, priceCents: 1990 }],
    })
    // the round trip through the database: what GET returns is what was stored
    const stored = await fetch(`${api.url}/orders/${order.id}`)
    expect(stored.status).toBe(200)
    expect(await stored.json()).toEqual(order)
    expect(await stockOf(hammer.id)).toBe(8)
    expect(await orderCount()).toBe(1)
  })

  test.each([
    ['unknown-product', [{ productId: 'p-unknown', quantity: 1 }]],
    ['insufficient-stock', [{ productId: hammer.id, quantity: 11 }]],
  ])('answers 422 with %s and stores nothing', async (reason, items) => {
    await using api = await listen(createTestApp())
    const response = await postOrder(api.url, { customerId: 'c-17', items })
    expect(response.status).toBe(422)
    expect(await response.json()).toEqual({ error: reason })
    expect(await orderCount()).toBe(0)
    expect(await stockOf(hammer.id)).toBe(10)
  })

  test('bonus: two concurrent orders for the last saw – one 201, stock 0, one order', async () => {
    await sql`update products set stock = 1 where id = ${saw.id}`
    await using api = await listen(createTestApp())
    const order = { customerId: 'c-17', items: [{ productId: saw.id, quantity: 1 }] }
    const responses = await Promise.all([postOrder(api.url, order), postOrder(api.url, order)])
    const statuses = responses.map((response) => response.status).toSorted()
    expect(statuses[0]).toBe(201)
    // 409: the conditional update refused the second order; 422: its catalog already showed stock 0
    expect(statuses[1]).toBeOneOf([409, 422])
    expect(await stockOf(saw.id)).toBe(0)
    expect(await orderCount()).toBe(1)
  })
})

describe('saveOrder', () => {
  test('rolls back order, items and stock when one item exceeds the stock', async () => {
    const result = await saveOrder(sql)({
      customerId: 'c-17' as CustomerId,
      status: 'placed',
      createdAt: now().toISOString(),
      items: [
        { productId: hammer.id, quantity: 2, priceCents: 1990 },
        { productId: saw.id, quantity: 6, priceCents: 2490 },
      ],
    })
    expect(result).toEqual({ kind: 'conflict', reason: 'insufficient-stock' })
    expect(await orderCount()).toBe(0)
    // the hammer update ran first inside the transaction – and was rolled back with it
    expect(await stockOf(hammer.id)).toBe(10)
    expect(await stockOf(saw.id)).toBe(5)
  })
})

describe('GET /orders/:id', () => {
  test.each(['00000000-0000-4000-8000-000000000000', 'not-a-uuid'])(
    'answers 404 for %s',
    async (id) => {
      await using api = await listen(createTestApp())
      const response = await fetch(`${api.url}/orders/${id}`)
      expect(response.status).toBe(404)
      expect(await response.json()).toEqual({ error: 'not found' })
    },
  )
})
