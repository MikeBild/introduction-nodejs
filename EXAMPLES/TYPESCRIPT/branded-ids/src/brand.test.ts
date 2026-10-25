import { describe, expect, expectTypeOf, it } from 'vitest'
import { type CustomerId, type OrderId, cancelOrder, toCustomerId, toOrderId } from './brand.ts'

describe('branded ids', () => {
  it('creates ids only through checking constructors', () => {
    expect(toOrderId('o-7')).toBe('o-7')
    expect(() => toOrderId('c-42')).toThrow('Invalid OrderId: c-42')
    expectTypeOf(toCustomerId('c-42')).toEqualTypeOf<CustomerId>()
  })

  it('keeps only the base value at runtime', () => {
    expect(typeof toOrderId('o-7')).toBe('string')
    expect(JSON.parse(JSON.stringify({ id: toOrderId('o-7') }))).toEqual({ id: 'o-7' })
  })

  it('turns swapped ids into compiler errors', () => {
    const customerId = toCustomerId('c-42')
    const orderId = toOrderId('o-7')
    expect(cancelOrder(customerId, orderId)).toBe('Order o-7 of customer c-42 cancelled')
    // @ts-expect-error OrderId is not assignable to CustomerId
    cancelOrder(orderId, customerId)
    // @ts-expect-error a raw string is not an OrderId
    const rawOrderId: OrderId = 'o-8'
    expect(rawOrderId).toBe('o-8')
  })
})
