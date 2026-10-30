// Process Manager: reagiert auf Events, merkt sich den Schritt und schickt Commands.
// Er entscheidet nichts über Bestand oder Zahlung, das bleibt in den Aggregaten.

export type ProcessEvent =
  | { type: 'OrderPlaced'; orderId: string; totalCents: number }
  | { type: 'StockReserved'; orderId: string }
  | { type: 'StockUnavailable'; orderId: string }
  | { type: 'PaymentSucceeded'; orderId: string }
  | { type: 'PaymentFailed'; orderId: string }

export type ProcessCommand =
  | { type: 'ReserveStock'; orderId: string }
  | { type: 'RequestPayment'; orderId: string; amountCents: number }
  | { type: 'ReleaseStock'; orderId: string }
  | { type: 'CancelOrder'; orderId: string }
  | { type: 'ShipOrder'; orderId: string }

export type Step = 'idle' | 'reserving' | 'paying' | 'shipping' | 'cancelled'
export type Checkout = { step: Step; totalCents: number }

export const initial: Checkout = { step: 'idle', totalCents: 0 }

type Reaction = { state: Checkout; commands: ProcessCommand[] }

// Welcher Schritt erwartet welches Event? Alles andere ist doppelt oder zu spät.
const expected: Record<ProcessEvent['type'], Step> = {
  OrderPlaced: 'idle',
  StockReserved: 'reserving',
  StockUnavailable: 'reserving',
  PaymentSucceeded: 'paying',
  PaymentFailed: 'paying',
}

export const react = (state: Checkout, event: ProcessEvent): Reaction => {
  if (expected[event.type] !== state.step) return { state, commands: [] }
  const { orderId } = event
  switch (event.type) {
    case 'OrderPlaced':
      return {
        state: { step: 'reserving', totalCents: event.totalCents },
        commands: [{ type: 'ReserveStock', orderId }],
      }
    case 'StockReserved':
      return {
        state: { ...state, step: 'paying' },
        commands: [{ type: 'RequestPayment', orderId, amountCents: state.totalCents }],
      }
    case 'StockUnavailable':
      return {
        state: { ...state, step: 'cancelled' },
        commands: [{ type: 'CancelOrder', orderId }],
      }
    case 'PaymentSucceeded':
      return { state: { ...state, step: 'shipping' }, commands: [{ type: 'ShipOrder', orderId }] }
    case 'PaymentFailed':
      // Kompensation: Was schon passiert ist, gleichen neue Commands aus.
      return {
        state: { ...state, step: 'cancelled' },
        commands: [
          { type: 'ReleaseStock', orderId },
          { type: 'CancelOrder', orderId },
        ],
      }
  }
}
