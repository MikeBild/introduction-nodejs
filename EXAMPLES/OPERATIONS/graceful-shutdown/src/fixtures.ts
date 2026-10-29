import type { Order } from './database.ts'

export const orders: Order[] = [
  { id: 'o-1', customerId: 'c-17', status: 'placed', createdAt: '2026-10-01T09:00:00.000Z' },
  { id: 'o-2', customerId: 'c-23', status: 'paid', createdAt: '2026-10-02T14:30:00.000Z' },
]
