import postgres from 'postgres'
import type {
  Catalog,
  CustomerId,
  NewOrder,
  Order,
  OrderId,
  OrderItem,
  OrderStatus,
  Product,
  ProductId,
  SaveOrderResult,
} from './orders.ts'

// the database from compose.yaml; DATABASE_URL overrides it (CI service container, another port)
export const databaseUrl = () =>
  process.env.DATABASE_URL ?? 'postgres://shop:shop@127.0.0.1:55432/shop_test'

export const createDatabase = (url: string) =>
  postgres(url, { max: 10, idle_timeout: 20, onnotice: () => {} })

export type Sql = ReturnType<typeof createDatabase>

type ProductRow = { id: string; name: string; price_cents: number; stock: number }
type OrderRow = { id: string; customer_id: string; status: OrderStatus; created_at: Date }
type OrderItemRow = { product_id: string; quantity: number; price_cents: number }

const toProduct = (row: ProductRow): Product => ({
  id: row.id as ProductId,
  name: row.name,
  priceCents: row.price_cents,
  stock: row.stock,
})

const toItem = (row: OrderItemRow): OrderItem => ({
  productId: row.product_id as ProductId,
  quantity: row.quantity,
  priceCents: row.price_cents,
})

const toOrder = (row: OrderRow, items: OrderItem[]): Order => ({
  id: row.id as OrderId,
  customerId: row.customer_id as CustomerId,
  items,
  status: row.status,
  createdAt: row.created_at.toISOString(),
})

// values in ${} are sent as parameters, never concatenated into the SQL text
export const loadCatalog =
  (sql: Sql) =>
  async (productIds: readonly string[]): Promise<Catalog> => {
    if (productIds.length === 0) return new Map()
    const rows = await sql<ProductRow[]>`
      select id, name, price_cents, stock from products where id in ${sql([...productIds])}
    `
    return new Map(rows.map((row) => [row.id, toProduct(row)]))
  }

// thrown inside the transaction to roll it back, turned into a result outside
const stockConflict = new Error('insufficient-stock')

// order, items and stock in one transaction – the conditional update keeps the stock honest when orders race
export const saveOrder =
  (sql: Sql) =>
  async (order: NewOrder): Promise<SaveOrderResult> => {
    try {
      const saved = await sql.begin(async (transaction) => {
        const [row] = await transaction<OrderRow[]>`
          insert into orders (customer_id, status, created_at)
          values (${order.customerId}, ${order.status}, ${order.createdAt})
          returning id, customer_id, status, created_at
        `
        if (!row) throw new Error('insert returned no row')
        for (const { productId, quantity } of order.items) {
          const updated = await transaction`
            update products set stock = stock - ${quantity}
            where id = ${productId} and stock >= ${quantity}
          `
          if (updated.count === 0) throw stockConflict
        }
        const itemRows = order.items.map(({ productId, quantity, priceCents }) => ({
          order_id: row.id,
          product_id: productId,
          quantity,
          price_cents: priceCents,
        }))
        await transaction`insert into order_items ${transaction(itemRows)}`
        return toOrder(row, order.items)
      })
      return { kind: 'saved', order: saved }
    } catch (error) {
      if (error === stockConflict) return { kind: 'conflict', reason: 'insufficient-stock' }
      throw error
    }
  }

// two queries, never one per item
export const findOrder =
  (sql: Sql) =>
  async (orderId: string): Promise<Order | undefined> => {
    const [row] = await sql<OrderRow[]>`
      select id, customer_id, status, created_at from orders where id = ${orderId}
    `
    if (!row) return undefined
    const items = await sql<OrderItemRow[]>`
      select product_id, quantity, price_cents from order_items
      where order_id = ${row.id} order by product_id
    `
    return toOrder(row, items.map(toItem))
  }
