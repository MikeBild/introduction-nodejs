import assert from 'node:assert/strict'
import { test } from 'node:test'
import type { OrderRepository } from './repository.ts'

// one set of expectations for every adapter – in-memory and postgres must behave alike
export const testOrderRepositoryContract = (createRepository: () => OrderRepository) => {
  test('createOrder stores an open order with an id', async () => {
    const repository = createRepository()
    const order = await repository.createOrder({ customerId: 'c-1', totalCents: 1250 })
    assert.equal(order.status, 'open')
    assert.deepEqual(await repository.findOrder(order.id), order)
  })

  test('findOrder returns undefined for an unknown id', async () => {
    assert.equal(
      await createRepository().findOrder('00000000-0000-4000-8000-000000000000'),
      undefined,
    )
  })

  test('listOpenOrders respects the limit', async () => {
    const repository = createRepository()
    for (const totalCents of [100, 200, 300])
      await repository.createOrder({ customerId: 'c-2', totalCents })
    assert.equal((await repository.listOpenOrders(2)).length, 2)
  })

  test('money survives the round trip without float errors', async () => {
    const repository = createRepository()
    const order = await repository.createOrder({ customerId: 'c-3', totalCents: 1999 })
    assert.equal((await repository.findOrder(order.id))?.totalCents, 1999)
  })
}
