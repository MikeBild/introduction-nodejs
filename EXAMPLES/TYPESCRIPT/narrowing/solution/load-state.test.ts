import { describe, expect, expectTypeOf, it } from 'vitest'
import {
  type LoadState,
  type SuccessState,
  icon,
  isSuccess,
  loadedItems,
  render,
} from './load-state.ts'

const states: readonly LoadState[] = [
  { status: 'idle' },
  { status: 'success', data: ['Ada'] },
  { status: 'success', data: ['Grace'] },
]

describe('narrowing solution', () => {
  it('handles the idle state everywhere', () => {
    expect(render({ status: 'idle' })).toBe('Nothing loaded yet')
    expect(icon({ status: 'idle' })).toBe('circle')
  })

  it('collects data of success states', () => {
    expectTypeOf(states.filter(isSuccess)).toEqualTypeOf<SuccessState[]>()
    expect(loadedItems(states)).toEqual(['Ada', 'Grace'])
  })
})
