import type { OrderItem } from '../src/orders.ts'
import { toOrder, type OrderRow, type Sql } from '../src/postgres.ts'
import type { OrderRepository } from '../src/repository.ts'

type OrderItemRow = { order_id: string; product_id: string; quantity: number; price_cents: number }

// one query for the items of all orders – 2 queries instead of 1 + N
const withItems = async (sql: Sql, rows: readonly OrderRow[]) => {
  if (rows.length === 0) return []
  const itemRows = await sql<OrderItemRow[]>`
    select order_id, product_id, quantity, price_cents from order_items
    where order_id in ${sql(rows.map(({ id }) => id))} order by product_id
  `
  const itemsOf = (orderId: string): OrderItem[] =>
    itemRows
      .filter((itemRow) => itemRow.order_id === orderId)
      .map(({ product_id, quantity, price_cents }) => ({
        productId: product_id,
        quantity,
        priceCents: price_cents,
      }))
  return rows.map((row) => toOrder(row, itemsOf(row.id)))
}

export const createPostgresOrderRepository = (sql: Sql): OrderRepository => ({
  findOrder: async (orderId) => {
    const rows = await sql<OrderRow[]>`
      select id, customer_id, status, created_at from orders where id = ${orderId}
    `
    const [order] = await withItems(sql, rows)
    return order
  },
  listOrdersByStatus: async (status, limit) => {
    const rows = await sql<OrderRow[]>`
      select id, customer_id, status, created_at from orders
      where status = ${status} order by created_at, id limit ${limit}
    `
    return withItems(sql, rows)
  },
  // all writes in one transaction: if an item insert fails, the order is rolled back as well
  saveOrder: ({ customerId, status, items }) =>
    sql.begin(async (transaction) => {
      const [row] = await transaction<OrderRow[]>`
        insert into orders (customer_id, status) values (${customerId}, ${status})
        returning id, customer_id, status, created_at
      `
      if (!row) throw new Error('insert returned no row')
      if (items.length > 0) {
        const itemRows = items.map(({ productId, quantity, priceCents }) => ({
          order_id: row.id,
          product_id: productId,
          quantity,
          price_cents: priceCents,
        }))
        await transaction`insert into order_items ${transaction(itemRows)}`
      }
      return toOrder(row, items)
    }),
})
