import type { AcceptedCheckout, Cart } from './core.ts'

// the core defines what it needs – adapters adapt to it
export type OrderStore = {
  findCart: (cartId: string) => Promise<Cart | undefined>
  saveOrder: (order: AcceptedCheckout) => Promise<{ id: string }>
}

export type Clock = () => Date
