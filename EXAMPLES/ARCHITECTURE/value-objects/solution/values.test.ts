import { describe, expect, it } from 'vitest'
import { changeEmail, reorder, sameCustomer, type Customer } from './customer.ts'
import {
  CustomerId,
  ProductId,
  email,
  lineTotal,
  orderItem,
  sameItem,
  withQuantity,
} from './values.ts'

describe('value objects', () => {
  it('rejects a quantity of zero and a price with decimals', () => {
    expect(() => orderItem({ productId: 'p-1', quantity: 0, priceCents: 1290 })).toThrow(
      'Invalid quantity 0',
    )
    expect(() => orderItem({ productId: 'p-1', quantity: 1, priceCents: 12.9 })).toThrow(
      'Invalid amount 12.9',
    )
  })

  it('computes money in whole cents', () => {
    expect(lineTotal(orderItem({ productId: 'p-4', quantity: 3, priceCents: 10 }))).toBe(30)
  })

  it('compares items by value', () => {
    const a = orderItem({ productId: 'p-1', quantity: 2, priceCents: 1290 })
    const b = orderItem({ productId: 'p-1', quantity: 2, priceCents: 1290 })
    expect(a === b).toBe(false)
    expect(sameItem(a, b)).toBe(true)
  })

  it('cannot be changed, only replaced', () => {
    const item = orderItem({ productId: 'p-1', quantity: 2, priceCents: 1290 })
    expect(() => {
      ;(item as { quantity: number }).quantity = -5
    }).toThrow(TypeError)
    expect(withQuantity(item, 3).quantity).toBe(3)
    expect(item.quantity).toBe(2)
  })

  it('normalizes an email address', () => {
    expect(email(' Ada@Example.org ')).toBe('ada@example.org')
    expect(() => email('ada')).toThrow('Invalid email ada')
  })

  it('does not compile with swapped ids', () => {
    // @ts-expect-error ProductId ist keine CustomerId
    reorder(ProductId('p-1'), CustomerId('c-1'))
    expect(reorder(CustomerId('c-1'), ProductId('p-1'))).toBe('c-1 bestellt p-1 nach')
  })
})

describe('entity', () => {
  it('stays the same customer after an email change', () => {
    const before: Customer = { id: CustomerId('c-1'), name: 'Ada', email: email('ada@example.org') }
    const after = changeEmail(before, 'ada@werkstatt.example')
    expect(sameCustomer(before, after)).toBe(true)
    expect(after.email).toBe('ada@werkstatt.example')
  })
})
