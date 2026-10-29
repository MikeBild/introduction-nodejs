import { describe, expect, it } from 'vitest'
import { createOrderService, createOrderTable } from './orders.ts'

// Diese Tests beschreiben den heutigen Stand – auch seine Schwächen.
describe('CRUD order service', () => {
  it('places an order, adds items and ships it', async () => {
    const orders = createOrderService(createOrderTable())
    await orders.placeOrder('o-1', 'c-1')
    await orders.addItem('o-1', { sku: 'KB-1', quantity: 2, unitCents: 4900 })
    await orders.shipOrder('o-1')
    expect(await orders.getOrder('o-1')).toMatchObject({ status: 'shipped', totalCents: 9800 })
  })

  it('rejects items for a shipped order', async () => {
    const orders = createOrderService(createOrderTable())
    await orders.placeOrder('o-1', 'c-1')
    await orders.shipOrder('o-1')
    await expect(
      orders.addItem('o-1', { sku: 'KB-1', quantity: 1, unitCents: 4900 }),
    ).rejects.toThrow('Only placed orders accept items')
  })

  it('loses an update when two requests change the same order (lost update)', async () => {
    const orders = createOrderService(createOrderTable())
    await orders.placeOrder('o-1', 'c-1')
    // Beide Requests lesen dieselbe Zeile, der zweite save überschreibt den ersten.
    await Promise.all([
      orders.addItem('o-1', { sku: 'KB-1', quantity: 1, unitCents: 4900 }),
      orders.addItem('o-1', { sku: 'MS-2', quantity: 1, unitCents: 2500 }),
    ])
    const order = await orders.getOrder('o-1')
    expect(order.items).toHaveLength(1) // erwartet wären zwei
  })

  it('keeps no history: only the latest state survives', async () => {
    const orders = createOrderService(createOrderTable())
    await orders.placeOrder('o-1', 'c-1')
    await orders.addItem('o-1', { sku: 'KB-1', quantity: 1, unitCents: 4900 })
    await orders.shipOrder('o-1')
    // Wann wurde platziert? Wann kam der Artikel dazu? Die Zeile weiß es nicht mehr.
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
