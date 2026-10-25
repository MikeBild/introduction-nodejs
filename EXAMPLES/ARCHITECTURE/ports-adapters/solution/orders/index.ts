// public API of the orders module – other modules import only from here
export { checkout, type CheckoutResult } from './checkout.ts'
export { decideCheckout, type Cart, type CheckoutDecision } from './core.ts'
export { createOrderRoutes } from './http.ts'
export { createMemoryOrderStore } from './memory.ts'
export type { Clock, OrderStore } from './ports.ts'
