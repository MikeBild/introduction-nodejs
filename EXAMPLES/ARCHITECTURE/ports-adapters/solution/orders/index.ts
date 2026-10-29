// public API of the orders module – other modules import only from here
export {
  orderTotalCents,
  placeOrder,
  type Catalog,
  type NewOrder,
  type Order,
  type PlaceOrderInput,
  type Product,
  type ProductId,
} from './core.ts'
export { createOrderRoutes } from './http.ts'
export { createMemoryOrderStore } from './memory.ts'
export { createPlaceOrder, type PlaceOrderOutcome } from './place-order.ts'
export type { Clock, OrderStore } from './ports.ts'
