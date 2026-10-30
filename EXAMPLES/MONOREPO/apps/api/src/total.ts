import type { OrderItem } from './orders.ts'

// Copied from packages/domain a while ago. The copy has drifted: it forgot the quantity.
export const totalCents = (items: readonly OrderItem[]): number =>
  items.reduce((sum, { priceCents }) => sum + priceCents, 0)
