import { describe, expect, it } from 'vitest'
import { fakeInventory, warehouse } from '../src/inventory.ts'
import { checkMap, contextMap } from './context-map.ts'
import { inventoryCatalog, parseEuroToCents, toProduct } from './inventory-acl.ts'
import { createSales, ProductId } from './sales.ts'

const sales = createSales(inventoryCatalog(fakeInventory(warehouse)))

describe('anti-corruption layer', () => {
  it('translates euros as text into whole cents', () => {
    expect(parseEuroToCents('19,99')).toBe(1999)
    expect(() => parseEuroToCents('19.99')).toThrow('Invalid price')
  })

  it('translates an inventory item into a sales product', () => {
    expect(toProduct(warehouse[2]!)).toEqual({
      id: 'p-3',
      name: 'Wasserwaage',
      priceCents: 2490,
      available: false,
    })
  })
})

describe('sales in its own language', () => {
  it('sums the cart in whole cents', async () => {
    expect(await sales.cartTotalCents([{ productId: ProductId('p-4'), quantity: 3 }])).toBe(30)
  })

  it('does not sell a fully reserved product', async () => {
    expect(await sales.isAvailable(ProductId('p-3'))).toBe(false)
  })

  it('works with any catalog, without knowing the inventory', async () => {
    const fixed = createSales(async (id) => ({
      id,
      name: 'Test',
      priceCents: 100,
      available: true,
    }))
    expect(await fixed.cartTotalCents([{ productId: ProductId('x'), quantity: 2 }])).toBe(200)
  })
})

describe('context map', () => {
  it('protects every context from the legacy model', () => {
    expect(checkMap(contextMap)).toEqual([])
    expect(checkMap([{ upstream: 'Lager', downstream: 'Versand', pattern: 'Conformist' }])).toEqual(
      ['Versand übernimmt das Modell von Lager ohne Übersetzung'],
    )
  })
})
