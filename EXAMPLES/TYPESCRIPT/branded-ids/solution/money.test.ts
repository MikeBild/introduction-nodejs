import { describe, expect, it } from 'vitest'
import { addVat, formatCents, toCents, toEmail, toEuro } from './money.ts'

describe('branded units solution', () => {
  it('converts units explicitly', () => {
    const gross = addVat(toCents(toEuro(19.99)), 0.19)
    expect(formatCents(gross)).toBe('23.79 EUR')
    // @ts-expect-error Euro is not Cents
    addVat(toEuro(19.99), 0.19)
    // @ts-expect-error a plain number is not Cents
    formatCents(1999)
  })

  it('normalizes and checks emails', () => {
    expect(toEmail(' Ada@Example.org ')).toBe('ada@example.org')
    expect(() => toEmail('no-mail')).toThrow('Invalid Email')
  })
})
