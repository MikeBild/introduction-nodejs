import assert from 'node:assert/strict'
import { describe, it } from 'vitest'
import { createApp } from './app.ts'
import { orders } from './orders.ts'
import { listen } from './test-server.ts'

describe('orders api', () => {
  // BUG: 2 x 1299 + 1 x 2499 is 5097. The copy in src/total.ts ignores the quantity.
  it('reports the wrong total for an order with two hammers', async () => {
    await using api = await listen(createApp(orders))
    const order = (await (await fetch(`${api.url}/orders/o-1`)).json()) as { totalCents: number }
    assert.equal(order.totalCents, 3798)
  })

  it('answers 404 for an unknown order', async () => {
    await using api = await listen(createApp(orders))
    assert.equal((await fetch(`${api.url}/orders/o-9`)).status, 404)
  })

  it.todo('uses totalCents from @shop/domain: order o-1 costs 5097 cents')
  it.todo('filters GET /orders?status=placed')
  it.todo('answers 400 for GET /orders?status=open')
})
