import { describe, expect, expectTypeOf, it } from 'vitest'
import { type Result, first, pair, parseAge, pluck } from './collections.ts'

const users = [
  { name: 'Ada', age: 36 },
  { name: 'Grace', age: 45 },
]

describe('generics', () => {
  it('keeps the element type with first', () => {
    expect(first([1, 2, 3])).toBe(1)
    expect(first([])).toBeUndefined()
    expectTypeOf(first([1, 2, 3])).toEqualTypeOf<number | undefined>()
    expectTypeOf(first(['Ada'])).toEqualTypeOf<string | undefined>()
  })

  it('connects two type parameters with pair', () => {
    expectTypeOf(pair('Ada', 36)).toEqualTypeOf<[string, number]>()
  })

  it('plucks fields with keyof constraints', () => {
    expect(pluck(users, 'name')).toEqual(['Ada', 'Grace'])
    expectTypeOf(pluck(users, 'age')).toEqualTypeOf<number[]>()
    // @ts-expect-error email is not a key of the users
    pluck(users, 'email')
  })

  it('models success and failure with Result', () => {
    expect(parseAge('36')).toEqual({ ok: true, value: 36 })
    expect(parseAge('abc')).toEqual({ ok: false, error: 'Invalid age: abc' })
    expectTypeOf(parseAge('36')).toEqualTypeOf<Result<number, string>>()
  })
})
