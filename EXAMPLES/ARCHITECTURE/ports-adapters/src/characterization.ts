import assert from 'node:assert/strict'
import type { Express } from 'express'
import { test } from 'vitest'
import { listen } from './test-server.ts'

// characterization tests: they pin the HTTP behaviour and must stay green while you refactor.
// createApp must offer p-hammer (19.90 EUR, stock 10) and p-saw (24.90 EUR, stock 5).
export const testPlaceOrderBehaviour = (createApp: () => Express) => {
  const postOrder = async (body: unknown) => {
    await using api = await listen(createApp())
    const response = await fetch(`${api.url}/orders`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    })
    return { status: response.status, body: (await response.json()) as Record<string, unknown> }
  }

  test('places an order and answers with the total in cents', async () => {
    const { status, body } = await postOrder({
      customerId: 'c-17',
      items: [
        { productId: 'p-hammer', quantity: 2 },
        { productId: 'p-saw', quantity: 1 },
      ],
    })
    assert.equal(status, 201)
    assert.equal(body.totalCents, 6470)
  })

  test('rejects an order without items', async () => {
    assert.deepEqual(await postOrder({ customerId: 'c-17', items: [] }), {
      status: 422,
      body: { error: 'empty-order' },
    })
  })

  test('rejects an unknown product', async () => {
    const { status, body } = await postOrder({
      customerId: 'c-17',
      items: [{ productId: 'p-unknown', quantity: 1 }],
    })
    assert.equal(status, 422)
    assert.deepEqual(body, { error: 'unknown-product' })
  })

  test('rejects more than the stock', async () => {
    const { status, body } = await postOrder({
      customerId: 'c-17',
      items: [{ productId: 'p-saw', quantity: 6 }],
    })
    assert.equal(status, 422)
    assert.deepEqual(body, { error: 'insufficient-stock' })
  })

  test('answers 400 without customerId', async () => {
    assert.equal((await postOrder({ items: [] })).status, 400)
  })
}
