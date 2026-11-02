import { react as completed, type State, type Event, type Reaction } from '../solution/process.ts'
// The durable infrastructure is supplied. Implement these two policies first.
export function react(state: State, event: Event): Reaction {
  if (event.type === 'Cancel') throw new Error('TODO: remember cancellation and await pending results')
  if (event.type === 'Result' && event.command === 'AuthorizePayment' && !event.ok)
    throw new Error('TODO: compensate before marking cancelled')
  return completed(state,event)
}
