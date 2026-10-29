import { describe, expect, it } from 'vitest'
import { createOrderLine, lineTotal, reorder, type Customer } from './order-line.ts'

// Diese Tests beschreiben den heutigen Stand – auch seine Schwächen.
describe('order lines from primitives', () => {
  it('accepts a quantity of zero and a price in euros', () => {
    const line = createOrderLine('p-1', 0, 12.9)
    expect(lineTotal(line)).toBe(0)
  })

  it('computes money with floating point', () => {
    expect(lineTotal(createOrderLine('p-4', 3, 0.1))).toBe(0.30000000000000004)
  })

  it('lets you swap customer id and product id', () => {
    expect(reorder('p-1', 'c-1')).toBe('p-1 bestellt c-1 nach') // kompiliert trotzdem
  })

  it('treats two equal lines as different objects', () => {
    expect(createOrderLine('p-1', 2, 1290) === createOrderLine('p-1', 2, 1290)).toBe(false)
  })

  it('lets anyone change a line after the fact', () => {
    const line = createOrderLine('p-1', 2, 1290)
    line.quantity = -5
    expect(lineTotal(line)).toBe(-6450)
  })

  it('compares customers by all fields, so an email change creates a new customer', () => {
    const before: Customer = { id: 'c-1', name: 'Ada', email: 'ada@example.org' }
    const after: Customer = { ...before, email: 'ada@werkstatt.example' }
    expect(JSON.stringify(before) === JSON.stringify(after)).toBe(false)
  })
})
