import { placeOrder, type Order, type PlaceOrderInput, type RejectionReason } from './core.ts'
import type { Clock, OrderStore } from './ports.ts'

export type PlaceOrderOutcome =
  { kind: 'placed'; order: Order } | { kind: 'rejected'; reason: RejectionReason }

// use case: gets its ports as parameters, returns a ready-to-use function
export const createPlaceOrder =
  (store: OrderStore, clock: Clock) =>
  async (input: PlaceOrderInput): Promise<PlaceOrderOutcome> => {
    const catalog = await store.loadCatalog(input.items.map(({ productId }) => productId))
    const result = placeOrder(input, catalog, clock())
    return result.kind === 'placed'
      ? { kind: 'placed', order: await store.saveOrder(result.order) }
      : result
  }
