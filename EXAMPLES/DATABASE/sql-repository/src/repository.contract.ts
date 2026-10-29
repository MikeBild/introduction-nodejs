import assert from 'node:assert/strict'
import { test } from 'vitest'
import type { NewOrder } from './orders.ts'
import type { OrderRepository } from './repository.ts'

export const newOrder = (customerId: string, items: NewOrder['items'] = []): NewOrder => ({
  customerId,
  items,
  status: 'placed',
  createdAt: '2026-10-29T10:00:00.000Z',
})

const hammer = { productId: 'p-hammer', quantity: 2, priceCents: 1990 }
const saw = { productId: 'p-saw', quantity: 1, priceCents: 2490 }

// one set of expectations for every adapter – in-memory and postgres must behave alike
export const testOrderRepositoryContract = (
  createRepository: () => OrderRepository,
  { storesItems = true } = {},
) => {
  // Exercise: the postgres adapter runs these as todo until it stores items (storesItems: false)
  const itemTest = storesItems ? test : test.todo

  test('saveOrder stores a placed order with an id and the given createdAt', async () => {
    const repository = createRepository()
    const order = await repository.saveOrder(newOrder('c-1'))
    assert.equal(order.status, 'placed')
    assert.equal(order.createdAt, '2026-10-29T10:00:00.000Z')
    assert.deepEqual(await repository.findOrder(order.id), order)
  })

  test('findOrder returns undefined for an unknown id', async () => {
    assert.equal(
      await createRepository().findOrder('00000000-0000-4000-8000-000000000000'),
      undefined,
    )
  })

  test('listOrdersByStatus filters by status and respects the limit', async () => {
    const repository = createRepository()
    for (const customerId of ['c-2', 'c-3', 'c-4']) await repository.saveOrder(newOrder(customerId))
    await repository.saveOrder({ ...newOrder('c-5'), status: 'draft' })
    assert.equal((await repository.listOrdersByStatus('placed', 2)).length, 2)
    const drafts = await repository.listOrdersByStatus('draft', 100)
    assert.ok(drafts.every(({ status }) => status === 'draft'))
  })

  itemTest('saveOrder stores the items with their prices in cents', async () => {
    const repository = createRepository()
    const order = await repository.saveOrder(newOrder('c-6', [hammer, saw]))
    assert.deepEqual((await repository.findOrder(order.id))?.items, [hammer, saw])
  })

  itemTest('saveOrder is atomic: a failing item rolls back the order', async () => {
    const repository = createRepository()
    const placedBefore = (await repository.listOrdersByStatus('placed', 1000)).length
    await assert.rejects(
      repository.saveOrder(newOrder('c-7', [hammer, { ...hammer, quantity: 1 }])),
    )
    assert.equal((await repository.listOrdersByStatus('placed', 1000)).length, placedBefore)
  })
}
