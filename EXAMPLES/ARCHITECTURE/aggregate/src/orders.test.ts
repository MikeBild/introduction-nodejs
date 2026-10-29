import { describe, expect, it } from 'vitest'
import { addItem, checkout, importItems, newOrder, type Product } from './orders.ts'

const hammer = { productId: 'p-1', quantity: 2, priceCents: 1290 }
const products = () =>
  new Map<string, Product>([['p-1', { id: 'p-1', name: 'Hammer', priceCents: 1290, stock: 3 }]])

// Diese Tests beschreiben den heutigen Stand – auch seine Schwächen.
describe('anemic order', () => {
  it('lets a second service add items after the order is placed', () => {
    const order = newOrder('o-1', 'c-1')
    addItem(order, hammer)
    checkout(order, products())
    importItems(order, [hammer])
    expect(order.items).toHaveLength(2) // Regel umgangen
    expect(order.totalCents).toBe(2580) // Summe passt nicht mehr zu den Positionen
  })

  it('places an empty order', () => {
    const order = newOrder('o-1', 'c-1')
    checkout(order, products())
    expect(order.status).toBe('placed')
  })

  it('leaves the stock changed when checkout fails halfway', () => {
    const stock = products()
    const order = newOrder('o-1', 'c-1')
    addItem(order, hammer)
    addItem(order, hammer)
    expect(() => checkout(order, stock)).toThrow('Out of stock')
    expect(stock.get('p-1')?.stock).toBe(1) // zwei abgezogen, Bestellung trotzdem nicht placed
  })

  it('lets anyone set any status', () => {
    const order = newOrder('o-1', 'c-1')
    order.status = 'shipped'
    expect(order.status).toBe('shipped')
  })
})
