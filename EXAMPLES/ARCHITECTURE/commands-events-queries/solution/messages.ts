// Drei Arten von Nachrichten, jede als Discriminated Union.
// Command: ein Wunsch im Imperativ, darf abgelehnt werden.
// Event: eine Tatsache in der Vergangenheitsform, unveränderlich.
// Query: eine Frage ohne Seiteneffekt.

export type OrderItem = { productId: string; quantity: number; priceCents: number }

export type OrderCommand =
  | { type: 'CreateOrder'; orderId: string; customerId: string }
  | { type: 'AddItem'; orderId: string; item: OrderItem }
  | { type: 'PlaceOrder'; orderId: string }
  | { type: 'PayOrder'; orderId: string }
  | { type: 'ShipOrder'; orderId: string }
  | { type: 'CancelOrder'; orderId: string }

export type OrderEvent =
  | { type: 'OrderCreated'; orderId: string; customerId: string }
  | { type: 'ItemAdded'; orderId: string; item: OrderItem }
  | { type: 'OrderPlaced'; orderId: string; placedAt: string }
  | { type: 'OrderPaid'; orderId: string; paidAt: string }
  | { type: 'OrderShipped'; orderId: string; shippedAt: string }
  | { type: 'OrderCancelled'; orderId: string; cancelledAt: string }

export type OrderQuery = { type: 'GetOrder'; orderId: string } | { type: 'ListOpenOrders' }
