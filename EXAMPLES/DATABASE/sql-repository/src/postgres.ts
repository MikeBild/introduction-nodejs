import postgres from 'postgres'
import { formatCents, toCents, type Order, type OrderStatus } from './orders.ts'
import type { OrderRepository } from './repository.ts'

export const createDatabase = (databaseUrl: string) =>
  postgres(databaseUrl, { max: 10, idle_timeout: 20, onnotice: () => {} })

export type Sql = ReturnType<typeof createDatabase>

type OrderRow = { id: string; customer_id: string; status: OrderStatus; total: string }

const toOrder = (row: OrderRow): Order => ({
  id: row.id,
  customerId: row.customer_id,
  status: row.status,
  totalCents: toCents(row.total),
})

// values in ${} are sent as parameters, never concatenated into the SQL text
export const createPostgresOrderRepository = (sql: Sql): OrderRepository => ({
  findOrder: async (orderId) => {
    const [row] = await sql<OrderRow[]>`
      select id, customer_id, status, total from orders where id = ${orderId}
    `
    return row && toOrder(row)
  },
  listOpenOrders: async (limit) => {
    const rows = await sql<OrderRow[]>`
      select id, customer_id, status, total from orders
      where status = 'open' order by created_at limit ${limit}
    `
    return rows.map(toOrder)
  },
  createOrder: async ({ customerId, totalCents }) => {
    const [row] = await sql<OrderRow[]>`
      insert into orders (customer_id, total) values (${customerId}, ${formatCents(totalCents)})
      returning id, customer_id, status, total
    `
    if (!row) throw new Error('insert returned no row')
    return toOrder(row)
  },
})
