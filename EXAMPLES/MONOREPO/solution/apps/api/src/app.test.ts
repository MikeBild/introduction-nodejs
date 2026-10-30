import assert from 'node:assert/strict'
import { describe, it } from 'vitest'
import { createApp } from './app.ts'
import { orders } from './orders.ts'
import { listen } from './test-server.ts'

describe('orders api', () => {
  it('uses totalCents from @shop/domain: order o-1 costs 5097 cents', async () => {
    await using api = await listen(createApp(orders))
    const order = (await (await fetch(`${api.url}/orders/o-1`)).json()) as { totalCents: number }
    assert.equal(order.totalCents, 5097)
  })

  it('answers 404 for an unknown order', async () => {
    await using api = await listen(createApp(orders))
    assert.equal((await fetch(`${api.url}/orders/o-9`)).status, 404)
  })

  it('filters GET /orders?status=placed', async () => {
    await using api = await listen(createApp(orders))
    const placed = (await (await fetch(`${api.url}/orders?status=placed`)).json()) as {
      id: string
    }[]
    assert.deepEqual(
      placed.map(({ id }) => id),
      ['o-1'],
    )
  })

  it('answers 400 for GET /orders?status=open', async () => {
    await using api = await listen(createApp(orders))
    assert.equal((await fetch(`${api.url}/orders?status=open`)).status, 400)
  })
})
