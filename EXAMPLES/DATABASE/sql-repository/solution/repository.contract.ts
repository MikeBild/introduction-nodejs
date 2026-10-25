import assert from 'node:assert/strict'
import { test } from 'node:test'
import { testOrderRepositoryContract } from '../src/repository.contract.ts'
import type { OrderRepositoryWithItems } from './repository.ts'

export const testOrderRepositoryWithItemsContract = (
  createRepository: () => OrderRepositoryWithItems,
) => {
  testOrderRepositoryContract(createRepository)

  test('placeOrder stores order and items together', async () => {
    const repository = createRepository()
    const items = [
      { sku: 'book', quantity: 1 },
      { sku: 'pen', quantity: 3 },
    ]
    const order = await repository.placeOrder({ customerId: 'c-4', totalCents: 2500, items })
    const openOrders = await repository.listOpenOrdersWithItems(100)
    assert.deepEqual(openOrders.find(({ id }) => id === order.id)?.items, items)
  })

  test('placeOrder is atomic: a failing item rolls back the order', async () => {
    const repository = createRepository()
    const openOrdersBefore = (await repository.listOpenOrders(100)).length
    const duplicateItems = [
      { sku: 'book', quantity: 1 },
      { sku: 'book', quantity: 2 },
    ]
    await assert.rejects(
      repository.placeOrder({ customerId: 'c-5', totalCents: 100, items: duplicateItems }),
    )
    assert.equal((await repository.listOpenOrders(100)).length, openOrdersBefore)
  })
}
