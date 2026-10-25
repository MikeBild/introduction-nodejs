// pure business rules – no I/O, no framework, no clock: same input, same output
export type CartItem = { sku: string; quantity: number; unitPriceCents: number }
export type Cart = { id: string; customerId: string; items: CartItem[]; createdAt: Date }
export type AcceptedCheckout = {
  kind: 'accepted'
  cartId: string
  customerId: string
  totalCents: number
}
export type RejectedCheckout = {
  kind: 'rejected'
  reason: 'unknown-cart' | 'empty-cart' | 'cart-expired'
}
export type CheckoutDecision = AcceptedCheckout | RejectedCheckout

const cartLifetimeMs = 24 * 60 * 60 * 1000

export const totalOf = (items: readonly CartItem[]) =>
  items.reduce((sum, item) => sum + item.quantity * item.unitPriceCents, 0)

export const decideCheckout = (cart: Cart, now: Date): CheckoutDecision =>
  cart.items.length === 0
    ? { kind: 'rejected', reason: 'empty-cart' }
    : now.getTime() - cart.createdAt.getTime() > cartLifetimeMs
      ? { kind: 'rejected', reason: 'cart-expired' }
      : {
          kind: 'accepted',
          cartId: cart.id,
          customerId: cart.customerId,
          totalCents: totalOf(cart.items),
        }
