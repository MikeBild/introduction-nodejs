import { describe, expect, expectTypeOf, it } from 'vitest'
import {
  type ElementOf,
  type EventName,
  type Mutable,
  type RouteParams,
  type Unwrap,
  createEmitter,
  createGetters,
} from './types.ts'

describe('advanced types', () => {
  it('computes types with conditional types and infer', () => {
    expectTypeOf<ElementOf<string[]>>().toEqualTypeOf<string>()
    expectTypeOf<ElementOf<number>>().toBeNever()
    expectTypeOf<ElementOf<string[] | number[]>>().toEqualTypeOf<string | number>()
    expectTypeOf<Unwrap<Promise<Promise<number>>>>().toEqualTypeOf<number>()
  })

  it('maps keys to getters', () => {
    const userGetters = createGetters({ name: 'Ada', age: 36 })
    expect(userGetters.getName()).toBe('Ada')
    expect(userGetters.getAge()).toBe(36)
    expectTypeOf(userGetters.getAge).returns.toEqualTypeOf<number>()
    expectTypeOf<Mutable<{ readonly id: string }>>().toEqualTypeOf<{ id: string }>()
  })

  it('builds event names with template literal types', () => {
    expectTypeOf<EventName<'user'>>().toEqualTypeOf<'user:created' | 'user:deleted'>()
    const emitter = createEmitter<'user'>()
    const received: string[] = []
    emitter.on('user:created', (payload) => received.push(payload))
    emitter.emit('user:created', 'u-1')
    expect(received).toEqual(['u-1'])
    // @ts-expect-error 'user:updated' is not a valid event
    emitter.on('user:updated', () => {})
  })

  it('extracts route params', () => {
    expectTypeOf<RouteParams<'/users/:userId/orders/:orderId'>>().toEqualTypeOf<
      'userId' | 'orderId'
    >()
    expectTypeOf<RouteParams<'/health'>>().toBeNever()
  })
})
