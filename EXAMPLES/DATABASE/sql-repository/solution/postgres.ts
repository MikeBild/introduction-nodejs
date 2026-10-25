import { formatCents, toCents, type OrderStatus } from '../src/orders.ts'
import { createPostgresOrderRepository, type Sql } from '../src/postgres.ts'
import type { OrderItem, OrderRepositoryWithItems } from './repository.ts'

type OrderRow = { id: string; customer_id: string; status: OrderStatus; total: string }
type OrderItemRow = OrderItem & { order_id: string }

const toOrder = (row: OrderRow) => ({
  id: row.id,
  customerId: row.customer_id,
  status: row.status,
  totalCents: toCents(row.total),
})

export const createPostgresOrderRepositoryWithItems = (sql: Sql): OrderRepositoryWithItems => {
  const orderRepository = createPostgresOrderRepository(sql)
  return {
    ...orderRepository,
    // all writes in one transaction: if an item insert fails, the order is rolled back as well
    placeOrder: ({ customerId, totalCents, items }) =>
      sql.begin(async (transaction) => {
        const [row] = await transaction<OrderRow[]>`
          insert into orders (customer_id, total) values (${customerId}, ${formatCents(totalCents)})
          returning id, customer_id, status, total
        `
        if (!row) throw new Error('insert returned no row')
        const itemRows = items.map(({ sku, quantity }) => ({ order_id: row.id, sku, quantity }))
        await transaction`insert into order_items ${transaction(itemRows)}`
        return { ...toOrder(row), items }
      }),
    // two queries instead of 1 + N: orders first, then all their items with one IN list
    listOpenOrdersWithItems: async (limit) => {
      const orders = await orderRepository.listOpenOrders(limit)
      if (orders.length === 0) return []
      const itemRows = await sql<OrderItemRow[]>`
        select order_id, sku, quantity from order_items
        where order_id in ${sql(orders.map(({ id }) => id))} order by sku
      `
      return orders.map((order) => ({
        ...order,
        items: itemRows
          .filter((itemRow) => itemRow.order_id === order.id)
          .map(({ sku, quantity }) => ({ sku, quantity })),
      }))
    },
  }
}
