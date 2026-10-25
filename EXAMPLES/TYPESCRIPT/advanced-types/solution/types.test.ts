import { describe, expect, expectTypeOf, it } from 'vitest'
import { type IsString, type IsStringStrict, type Setters, buildPath } from './types.ts'

describe('advanced types solution', () => {
  it('maps keys to setters', () => {
    expectTypeOf<Setters<{ name: string }>>().toEqualTypeOf<{ setName: (value: string) => void }>()
  })

  it('prevents distribution with brackets', () => {
    expectTypeOf<IsString<string | number>>().toEqualTypeOf<boolean>()
    expectTypeOf<IsStringStrict<string | number>>().toEqualTypeOf<false>()
  })

  it('builds paths from typed route params', () => {
    expect(buildPath('/users/:userId/orders/:orderId', { userId: 'u 1', orderId: 'o-7' })).toBe(
      '/users/u%201/orders/o-7',
    )
    // @ts-expect-error orderId is missing
    buildPath('/users/:userId/orders/:orderId', { userId: 'u-1' })
  })
})
