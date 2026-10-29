import { describe, expect, it } from 'vitest'
import * as order from './order.ts'
import { type Product, available, release, reserve } from './product.ts'
import { ConcurrencyError, change, inMemoryRepository } from './repository.ts'

const o1 = order.OrderId('o-1')
const hammer = { productId: order.ProductId('p-1'), quantity: 2, priceCents: 1290 }
const draft = () => order.addItem(order.start(o1, order.CustomerId('c-1')), hammer)

describe('aggregate Order', () => {
  it('derives the total from its items', () => {
    expect(order.totalCents(order.addItem(draft(), hammer))).toBe(5160)
  })

  it('rejects items once placed', () => {
    expect(() => order.addItem(order.place(draft()), hammer)).toThrow(
      'Only draft orders accept items',
    )
  })

  it('rejects an empty order', () => {
    expect(() => order.place(order.start(o1, order.CustomerId('c-1')))).toThrow(
      'An order needs at least one item',
    )
  })

  it('follows draft → placed → paid → shipped without shortcuts', () => {
    expect(() => order.ship(order.place(draft()))).toThrow('Only paid orders can ship')
    expect(order.ship(order.pay(order.place(draft()))).status).toBe('shipped')
  })

  it('cancels only from draft or placed', () => {
    expect(order.cancel(order.place(draft())).status).toBe('cancelled')
    expect(() => order.cancel(order.pay(order.place(draft())))).toThrow()
  })

  it('never changes the order it was given', () => {
    const before = draft()
    order.place(before)
    expect(before.status).toBe('draft')
  })
})

describe('aggregate Product', () => {
  const hammerStock: Product = {
    id: order.ProductId('p-1'),
    name: 'Hammer',
    priceCents: 1290,
    stock: 3,
    reservations: {},
  }

  it('reserves stock per order and releases it again', () => {
    const reserved = reserve(hammerStock, o1, 2)
    expect(available(reserved)).toBe(1)
    expect(() => reserve(reserved, order.OrderId('o-2'), 2)).toThrow('Out of stock: p-1')
    expect(available(release(reserved, o1))).toBe(3)
  })
})

describe('one transaction, one aggregate', () => {
  it('saves orders and products in separate steps with a version check', async () => {
    const orders = inMemoryRepository<order.Order>()
    const products = inMemoryRepository<Product>()
    await orders.save(draft(), 0)
    await products.save(
      { id: order.ProductId('p-1'), name: 'Hammer', priceCents: 1290, stock: 3, reservations: {} },
      0,
    )
    await change(orders, o1, order.place) // Transaktion 1
    await change(products, 'p-1', (p) => reserve(p, o1, 2)) // Transaktion 2
    expect((await orders.load(o1)).value.status).toBe('placed')
    expect(available((await products.load('p-1')).value)).toBe(1)
  })

  it('detects a lost update', async () => {
    const orders = inMemoryRepository<order.Order>()
    await orders.save(draft(), 0)
    const first = await orders.load(o1)
    const second = await orders.load(o1)
    await orders.save(order.addItem(first.value, hammer), first.version)
    await expect(orders.save(order.addItem(second.value, hammer), second.version)).rejects.toThrow(
      ConcurrencyError,
    )
  })
})
