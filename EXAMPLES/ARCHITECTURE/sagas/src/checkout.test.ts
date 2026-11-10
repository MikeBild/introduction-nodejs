import { describe, expect, it } from 'vitest'
import { onOrderPlaced, recordingServices } from './checkout.ts'

// These tests describe the current state – including its weaknesses.
describe('hard-wired checkout', () => {
  it('runs the happy path', async () => {
    const { services, calls } = recordingServices()
    await onOrderPlaced(services, 'o-1', 2580)
    expect(calls).toEqual(['reserveStock o-1', 'charge o-1', 'shipOrder o-1'])
  })

  it('leaves stock reserved and the order open when the payment fails', async () => {
    const { services, calls } = recordingServices(true)
    await expect(onOrderPlaced(services, 'o-1', 2580)).rejects.toThrow('Card declined')
    expect(calls).toEqual(['reserveStock o-1', 'charge o-1']) // no releaseStock, no cancelOrder
  })
})
