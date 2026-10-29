import { describe, expect, it } from 'vitest'
import { type ProcessEvent, initial, react } from './checkout-process.ts'

const run = (events: ProcessEvent[]) =>
  events.reduce(
    (acc, event) => {
      const { state, commands } = react(acc.state, event)
      return { state, commands: [...acc.commands, ...commands.map((c) => c.type)] }
    },
    { state: initial, commands: [] as string[] },
  )

const placed: ProcessEvent = { type: 'OrderPlaced', orderId: 'o-1', totalCents: 2580 }

describe('checkout process manager', () => {
  it('reserves, charges and ships on the happy path', () => {
    const { state, commands } = run([
      placed,
      { type: 'StockReserved', orderId: 'o-1' },
      { type: 'PaymentSucceeded', orderId: 'o-1' },
    ])
    expect(commands).toEqual(['ReserveStock', 'RequestPayment', 'ShipOrder'])
    expect(state.step).toBe('shipping')
  })

  it('requests the amount from the placed order', () => {
    const afterPlaced = react(initial, placed).state
    expect(react(afterPlaced, { type: 'StockReserved', orderId: 'o-1' }).commands).toEqual([
      { type: 'RequestPayment', orderId: 'o-1', amountCents: 2580 },
    ])
  })

  it('compensates a failed payment: release stock, cancel order', () => {
    const { state, commands } = run([
      placed,
      { type: 'StockReserved', orderId: 'o-1' },
      { type: 'PaymentFailed', orderId: 'o-1' },
    ])
    expect(commands).toEqual(['ReserveStock', 'RequestPayment', 'ReleaseStock', 'CancelOrder'])
    expect(state.step).toBe('cancelled')
  })

  it('cancels without payment when stock is missing', () => {
    expect(run([placed, { type: 'StockUnavailable', orderId: 'o-1' }]).commands).toEqual([
      'ReserveStock',
      'CancelOrder',
    ])
  })

  it('ignores a redelivered event', () => {
    const reserved: ProcessEvent = { type: 'StockReserved', orderId: 'o-1' }
    expect(run([placed, reserved, reserved]).commands).toEqual(['ReserveStock', 'RequestPayment'])
  })
})
