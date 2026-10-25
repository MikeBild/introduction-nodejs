import { decideCheckout, type AcceptedCheckout, type RejectedCheckout } from './core.ts'
import type { Clock, OrderStore } from './ports.ts'

export type CheckoutResult = (AcceptedCheckout & { id: string }) | RejectedCheckout

// use case: gets its ports as parameters, returns a ready-to-use function
export const checkout =
  (store: OrderStore, clock: Clock) =>
  async (cartId: string): Promise<CheckoutResult> => {
    const cart = await store.findCart(cartId)
    if (!cart) return { kind: 'rejected', reason: 'unknown-cart' }
    const decision = decideCheckout(cart, clock())
    return decision.kind === 'accepted'
      ? { ...decision, ...(await store.saveOrder(decision)) }
      : decision
  }
