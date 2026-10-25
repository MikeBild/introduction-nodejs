import { describe, expect, it } from 'vitest'
import { retryDelays } from './client.ts'

describe('library design solution', () => {
  it('computes exponential delays', () => {
    expect(retryDelays({ strategy: 'exponential', baseDelayMs: 100, maxAttempts: 4 })).toEqual([
      100, 200, 400, 800,
    ])
  })

  it('rejects mixed retry options', () => {
    // @ts-expect-error delayMs belongs to the fixed strategy
    retryDelays({ strategy: 'exponential', baseDelayMs: 100, maxAttempts: 3, delayMs: 200 })
  })
})
