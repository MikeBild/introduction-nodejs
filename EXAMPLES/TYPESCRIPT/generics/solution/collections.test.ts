import { describe, expect, expectTypeOf, it } from 'vitest'
import { type Result, parseAge } from '../src/collections.ts'
import { groupBy, last, mapResult } from './collections.ts'

describe('generics solution', () => {
  it('returns the last element type-safe', () => {
    expect(last(['Ada', 'Grace'])).toBe('Grace')
    expectTypeOf(last(['Ada', 'Grace'])).toEqualTypeOf<string | undefined>()
  })

  it('groups items by a derived key', () => {
    const groups = groupBy([1, 2, 3, 4], (value) => (value % 2 === 0 ? 'even' : 'odd'))
    expect(groups).toEqual({ odd: [1, 3], even: [2, 4] })
    expectTypeOf(groups).toEqualTypeOf<Partial<Record<'even' | 'odd', number[]>>>()
  })

  it('maps only successful results', () => {
    expect(mapResult(parseAge('36'), (age) => age + 1)).toEqual({ ok: true, value: 37 })
    expect(mapResult(parseAge('x'), (age) => age + 1).ok).toBe(false)
    expectTypeOf(mapResult(parseAge('36'), String)).toEqualTypeOf<Result<string, string>>()
  })
})
