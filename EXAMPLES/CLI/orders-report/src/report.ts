export type OrderStatus = 'open' | 'paid' | 'cancelled'
export type Order = { orderId: string; customerId: string; totalCents: number; status: OrderStatus }
export type ParsedLine = { ok: true; order: Order } | { ok: false; reason: string }
export type OutputFormat = 'json' | 'csv'

const orderStatuses: readonly OrderStatus[] = ['open', 'paid', 'cancelled']
const isOrderStatus = (value: string): value is OrderStatus =>
  orderStatuses.includes(value as OrderStatus)

export const isOutputFormat = (value: string): value is OutputFormat =>
  value === 'json' || value === 'csv'

export const isHeaderLine = (line: string) => line.startsWith('order_id,')

// money as integer cents, never as float
export const toCents = (amount: string): number | undefined =>
  /^\d+(\.\d{1,2})?$/.test(amount) ? Math.round(Number.parseFloat(amount) * 100) : undefined

export const parseOrderLine = (line: string): ParsedLine => {
  const [orderId, customerId, total = '', status = ''] = line.split(',').map((cell) => cell.trim())
  const totalCents = toCents(total)
  if (!orderId || !customerId) return { ok: false, reason: 'missing order_id or customer_id' }
  if (totalCents === undefined) return { ok: false, reason: `invalid total "${total}"` }
  if (!isOrderStatus(status)) return { ok: false, reason: `invalid status "${status}"` }
  return { ok: true, order: { orderId, customerId, totalCents, status } }
}

const toCsvLine = ({ orderId, customerId, totalCents, status }: Order) =>
  [orderId, customerId, (totalCents / 100).toFixed(2), status].join(',')

export const formatOrders = (orders: readonly Order[], format: OutputFormat): string =>
  format === 'json'
    ? JSON.stringify(orders, null, 2)
    : ['order_id,customer_id,total,status', ...orders.map(toCsvLine)].join('\n')
