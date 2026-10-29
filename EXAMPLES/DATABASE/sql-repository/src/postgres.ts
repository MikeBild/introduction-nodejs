import postgres from 'postgres'
import type { Order, OrderStatus } from './orders.ts'
import type { OrderRepository } from './repository.ts'

export const createDatabase = (databaseUrl: string) =>
  postgres(databaseUrl, { max: 10, idle_timeout: 20, onnotice: () => {} })

export type Sql = ReturnType<typeof createDatabase>

export type OrderRow = { id: string; customer_id: string; status: OrderStatus; created_at: Date }

export const toOrder = (row: OrderRow, items: Order['items'] = []): Order => ({
  id: row.id,
  customerId: row.customer_id,
  items,
  status: row.status,
  createdAt: row.created_at.toISOString(),
})

// values in ${} are sent as parameters, never concatenated into the SQL text
// Exercise: the items are not stored yet – there is no order_items table
export const createPostgresOrderRepository = (sql: Sql): OrderRepository => ({
  findOrder: async (orderId) => {
    const [row] = await sql<OrderRow[]>`
      select id, customer_id, status, created_at from orders where id = ${orderId}
    `
    return row && toOrder(row)
  },
  listOrdersByStatus: async (status, limit) => {
    const rows = await sql<OrderRow[]>`
      select id, customer_id, status, created_at from orders
      where status = ${status} order by created_at, id limit ${limit}
    `
    return rows.map((row) => toOrder(row))
  },
  saveOrder: async ({ customerId, status }) => {
    const [row] = await sql<OrderRow[]>`
      insert into orders (customer_id, status) values (${customerId}, ${status})
      returning id, customer_id, status, created_at
    `
    if (!row) throw new Error('insert returned no row')
    return toOrder(row)
  },
})
