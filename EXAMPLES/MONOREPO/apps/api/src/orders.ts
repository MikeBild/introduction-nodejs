export type OrderItem = { productId: string; quantity: number; priceCents: number }
export type Order = {
  id: string
  customerId: string
  items: OrderItem[]
  status: 'draft' | 'placed' | 'paid' | 'shipped' | 'cancelled'
  createdAt: string
}

export const orders: readonly Order[] = [
  {
    id: 'o-1',
    customerId: 'c-1',
    items: [
      { productId: 'p-hammer', quantity: 2, priceCents: 1299 },
      { productId: 'p-saw', quantity: 1, priceCents: 2499 },
    ],
    status: 'placed',
    createdAt: '2026-10-01T09:00:00.000Z',
  },
  {
    id: 'o-2',
    customerId: 'c-2',
    items: [{ productId: 'p-saw', quantity: 3, priceCents: 2499 }],
    status: 'paid',
    createdAt: '2026-10-02T14:30:00.000Z',
  },
]
