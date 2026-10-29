// Events im Speicher: ein Umschlag mit Type, Schema-Version und Daten.
// Das Logbuch ist drei Jahre alt. Die ersten Events haben ein anderes Schema als heute.

export type Envelope = { type: string; version: number; data: Record<string, unknown> }

// Heutiges Schema (Version 2): Geld in Cent, Zeitpunkt als placedAt
export type OrderEvent =
  | { type: 'ItemAdded'; productId: string; quantity: number; priceCents: number }
  | { type: 'OrderPlaced'; placedAt: string }

export type Order = { totalCents: number; placedAt: string | null }
export const initial: Order = { totalCents: 0, placedAt: null }

export const evolve = (order: Order, event: OrderEvent): Order =>
  event.type === 'ItemAdded'
    ? { ...order, totalCents: order.totalCents + event.quantity * event.priceCents }
    : { ...order, placedAt: event.placedAt }

// Das Logbuch: 2023 in Euro und mit „at“, seit 2025 in Cent und mit „placedAt“
export const log: readonly Envelope[] = Object.freeze([
  { type: 'ItemAdded', version: 1, data: { productId: 'p-1', quantity: 2, price: 12.9 } },
  { type: 'OrderPlaced', version: 1, data: { at: '2023-05-02T08:00:00.000Z' } },
  { type: 'ItemAdded', version: 2, data: { productId: 'p-2', quantity: 1, priceCents: 1999 } },
  { type: 'OrderPlaced', version: 2, data: { placedAt: '2026-10-12T10:00:00.000Z' } },
])

// Heute: Jeder liest die Daten so, als wären sie im aktuellen Schema.
export const naiveRead = (envelope: Envelope) =>
  ({ type: envelope.type, ...envelope.data }) as OrderEvent
