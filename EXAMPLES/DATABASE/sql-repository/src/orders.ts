export type OrderStatus = 'open' | 'paid' | 'cancelled'
export type Order = { id: string; customerId: string; status: OrderStatus; totalCents: number }
export type NewOrder = { customerId: string; totalCents: number }

// numeric comes back from Postgres as string – convert to integer cents, never to float
export const toCents = (numeric: string): number => {
  const [euros = '0', cents = ''] = numeric.split('.')
  return Number(euros) * 100 + Number(cents.padEnd(2, '0').slice(0, 2))
}

export const formatCents = (totalCents: number): string =>
  `${Math.trunc(totalCents / 100)}.${String(totalCents % 100).padStart(2, '0')}`

export const sumTotals = (orders: readonly Order[]): number =>
  orders.reduce((sum, order) => sum + order.totalCents, 0)
