import { describe, expect, it } from 'vitest'
import { createOrderService, createOrderTable } from './orders.ts'

const hammer = { productId: 'p-1', quantity: 2, priceCents: 1290 }
const screwdrivers = { productId: 'p-2', quantity: 1, priceCents: 2490 }

// Diese Tests beschreiben den heutigen Stand – auch seine Schwächen.
describe('CRUD order service', () => {
  it('runs an order from draft to shipped', async () => {
    const orders = createOrderService(createOrderTable())
    await orders.createOrder('o-1', 'c-1')
    await orders.addItem('o-1', hammer)
    await orders.placeOrder('o-1')
    await orders.payOrder('o-1')
    await orders.shipOrder('o-1')
    expect(await orders.getOrder('o-1')).toMatchObject({ status: 'shipped', totalCents: 2580 })
  })

  it('rejects items once the order is placed', async () => {
    const orders = createOrderService(createOrderTable())
    await orders.createOrder('o-1', 'c-1')
    await orders.addItem('o-1', hammer)
    await orders.placeOrder('o-1')
    await expect(orders.addItem('o-1', screwdrivers)).rejects.toThrow(
      'Only draft orders accept items',
    )
  })

  it('loses an update when two requests change the same order (lost update)', async () => {
    const orders = createOrderService(createOrderTable())
    await orders.createOrder('o-1', 'c-1')
    // Beide Requests lesen dieselbe Zeile, der zweite save überschreibt den ersten.
    await Promise.all([orders.addItem('o-1', hammer), orders.addItem('o-1', screwdrivers)])
    const order = await orders.getOrder('o-1')
    expect(order.items).toHaveLength(1) // erwartet wären zwei
  })

  it('keeps no history: only the latest state survives', async () => {
    const orders = createOrderService(createOrderTable())
    await orders.createOrder('o-1', 'c-1')
    await orders.addItem('o-1', hammer)
    await orders.placeOrder('o-1')
    await orders.payOrder('o-1')
    // Wann wurde bestellt, wann bezahlt? Die Zeile weiß es nicht mehr.
    expect(Object.keys(await orders.getOrder('o-1')).sort()).toEqual([
      'customerId',
      'id',
      'items',
      'status',
      'totalCents',
      'updatedAt',
    ])
  })
})
