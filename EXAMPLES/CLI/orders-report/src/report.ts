export type OrderStatus = 'draft' | 'placed' | 'paid' | 'shipped' | 'cancelled'
export type Order = { orderId: string; customerId: string; totalCents: number; status: OrderStatus }
export type ParsedLine = { ok: true; order: Order } | { ok: false; reason: string }
export type OutputFormat = 'json' | 'csv'

const orderStatuses: readonly OrderStatus[] = ['draft', 'placed', 'paid', 'shipped', 'cancelled']
const isOrderStatus = (value: string): value is OrderStatus =>
  orderStatuses.includes(value as OrderStatus)

export const isOutputFormat = (value: string): value is OutputFormat =>
  value === 'json' || value === 'csv'

export const isHeaderLine = (line: string) => line.startsWith('order_id,')

// money as whole cents – an integer, never a float
export const parseCents = (amount: string): number | undefined =>
  /^\d+$/.test(amount) ? Number(amount) : undefined

export const parseOrderLine = (line: string): ParsedLine => {
  const [orderId, customerId, total = '', status = ''] = line.split(',').map((cell) => cell.trim())
  const totalCents = parseCents(total)
  if (!orderId || !customerId) return { ok: false, reason: 'missing order_id or customer_id' }
  if (totalCents === undefined) return { ok: false, reason: `invalid total_cents "${total}"` }
  if (!isOrderStatus(status)) return { ok: false, reason: `invalid status "${status}"` }
  return { ok: true, order: { orderId, customerId, totalCents, status } }
}

const toCsvLine = ({ orderId, customerId, totalCents, status }: Order) =>
  [orderId, customerId, totalCents, status].join(',')

export const formatOrders = (orders: readonly Order[], format: OutputFormat): string =>
  format === 'json'
    ? JSON.stringify(orders, null, 2)
    : ['order_id,customer_id,total_cents,status', ...orders.map(toCsvLine)].join('\n')
