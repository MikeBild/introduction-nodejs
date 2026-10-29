export type OrderStatus = 'draft' | 'placed' | 'paid' | 'shipped' | 'cancelled'
export type Order = { id: string; customerId: string; status: OrderStatus; createdAt: string }

// domain rule: cancelled only from draft or placed
export const canCancel = (order: Order) => order.status === 'draft' || order.status === 'placed'

export const createOrders = () =>
  new Map<string, Order>([
    ['o-1', { id: 'o-1', customerId: 'c-17', status: 'placed', createdAt: '2026-10-01T09:00:00Z' }],
    [
      'o-2',
      { id: 'o-2', customerId: 'c-23', status: 'shipped', createdAt: '2026-09-12T16:45:00Z' },
    ],
  ])
