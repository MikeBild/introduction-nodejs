import { describe, expect, expectTypeOf, it } from 'vitest'
import {
  type ErrorState,
  type LoadState,
  formatId,
  icon,
  isError,
  render,
  toList,
} from './load-state.ts'

const states: readonly LoadState[] = [
  { status: 'loading' },
  { status: 'success', data: ['Ada', 'Grace'] },
  { status: 'error', message: 'Timeout' },
]

describe('narrowing', () => {
  it('narrows primitives with typeof', () => {
    expect(formatId(42.4)).toBe('42')
    expect(formatId('u-1')).toBe('U-1')
    expect(toList('Ada')).toEqual(['Ada'])
  })

  it('renders every state', () => {
    expect(states.map(render)).toEqual(['Loading', 'Ada, Grace', 'Error: Timeout'])
    expect(states.map(icon)).toEqual(['spinner', 'check', 'alert'])
  })

  it('filters with a type guard', () => {
    const errorStates = states.filter(isError)
    expectTypeOf(errorStates).toEqualTypeOf<ErrorState[]>()
    expect(errorStates.map((state) => state.message)).toEqual(['Timeout'])
  })

  it('only allows variant fields after narrowing', () => {
    const state = states[1] ?? { status: 'loading' }
    // @ts-expect-error data only exists on the success variant
    expect(state.data).toBeDefined()
    if (state.status === 'success') expectTypeOf(state.data).toEqualTypeOf<readonly string[]>()
    // @ts-expect-error a success state without data is impossible
    const invalidState: LoadState = { status: 'success' }
    expect(invalidState.status).toBe('success')
  })
})
