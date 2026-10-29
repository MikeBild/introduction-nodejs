import { type ProcessEvent, initial, react } from './checkout-process.ts'

const events: ProcessEvent[] = [
  { type: 'OrderPlaced', orderId: 'o-1', totalCents: 2580 },
  { type: 'StockReserved', orderId: 'o-1' },
  { type: 'PaymentFailed', orderId: 'o-1' },
]
let state = initial
for (const event of events) {
  const reaction = react(state, event)
  state = reaction.state
  console.info(`${event.type} → ${reaction.commands.map((c) => c.type).join(', ') || '–'}`)
}
console.info('Schritt:', state.step)
