// Pure process policy. Each participant protects its own invariants.
export type Command = 'ReserveStock' | 'AuthorizePayment' | 'CommitStock' | 'ConfirmOrder' |
  'VoidAuthorization' | 'ReleaseReservation' | 'CancelOrder'
export type Step = 'reserving' | 'waiting' | 'authorizing' | 'committing' | 'confirming' |
  'voiding' | 'releasing' | 'cancelling' | 'confirmed' | 'cancelled'
export type State = {
  id: string; orderId: string; reservationId: string; paymentId: string;
  mode: 'automatic' | 'manual'; step: Step; attempt: number;
  abort: boolean; authorized: boolean; reason?: string;
}
export type Event = { type: 'Approve' } | { type: 'Cancel' } |
  { type: 'Result'; command: Command; ok: boolean; reason?: string }
export type Reaction = { state: State; command?: Command }
export const initial = (id: string, mode: State['mode']): State => ({
  id, orderId: `order:${id}`, reservationId: `reservation:${id}:0`, paymentId: `payment:${id}`,
  mode, step: 'reserving', attempt: 0, abort: false, authorized: false,
})
const pending: Partial<Record<Step, Command>> = {
  reserving: 'ReserveStock', authorizing: 'AuthorizePayment', committing: 'CommitStock',
  confirming: 'ConfirmOrder', voiding: 'VoidAuthorization', releasing: 'ReleaseReservation', cancelling: 'CancelOrder',
}
const move = (state: State, step: Step): Reaction => ({ state: { ...state, step }, command: pending[step] })
const compensate = (state: State): Reaction => move(state, state.authorized ? 'voiding' : 'releasing')
export function react(state: State, event: Event): Reaction {
  if (event.type === 'Cancel') {
    // CommitStock is the pivot. After submitting it, reconcile/finish before a separate cancellation.
    if (['committing', 'confirming', 'confirmed'].includes(state.step)) throw new Error('SeparateCancellationRequired')
    if (['cancelled', 'voiding', 'releasing', 'cancelling'].includes(state.step)) return { state }
    const cancelled = { ...state, abort: true, reason: 'cancelled by customer' }
    // Do not report success while a resource-creating command may still succeed.
    return state.step === 'waiting' ? compensate(cancelled) : { state: cancelled }
  }
  if (event.type === 'Approve') {
    if (state.step !== 'waiting') return { state }
    // Always acquire a fresh reservation; inventory atomically releases the old one.
    const attempt = state.attempt + 1
    return move({ ...state, attempt, reservationId: `reservation:${state.id}:${attempt}` }, 'reserving')
  }
  if (pending[state.step] !== event.command) return { state } // duplicate result, already durably handled
  if (!event.ok) {
    if (['ReserveStock', 'AuthorizePayment', 'CommitStock'].includes(event.command))
      return compensate({ ...state, abort: true, reason: event.reason ?? 'rejected' })
    // Compensation and post-pivot confirmation cannot be labelled complete on failure.
    throw new Error(event.reason ?? 'retry required')
  }
  switch (event.command) {
    case 'ReserveStock':
      if (state.abort) return compensate(state)
      return move(state, state.mode === 'manual' && state.attempt === 0 ? 'waiting' : 'authorizing')
    case 'AuthorizePayment': {
      const authorized = { ...state, authorized: true }
      return state.abort ? compensate(authorized) : move(authorized, 'committing')
    }
    case 'CommitStock': return move(state, 'confirming')
    case 'ConfirmOrder': return move(state, 'confirmed')
    case 'VoidAuthorization': return move({ ...state, authorized: false }, 'releasing')
    case 'ReleaseReservation': return move(state, 'cancelling')
    case 'CancelOrder': return move(state, 'cancelled')
  }
}
export function status(state: State, attention = false): string {
  if (attention) return 'NEEDS_ATTENTION'
  if (state.step === 'confirmed') return 'CONFIRMED'
  if (state.step === 'cancelled') return 'CANCELLED'
  if (state.abort || ['voiding', 'releasing', 'cancelling'].includes(state.step)) return 'COMPENSATING'
  return state.step === 'waiting' ? 'AWAITING_APPROVAL' : 'PENDING'
}
