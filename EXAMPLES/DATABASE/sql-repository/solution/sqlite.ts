import { randomUUID } from 'node:crypto'
import { Database } from 'node:sqlite'
import type { OrderItem } from '../src/orders.ts'
import type { OrderRepository } from '../src/repository.ts'
import { toOrder, type OrderRow } from '../src/sqlite.ts'

const schema = `
  create table if not exists orders (
    id text primary key,
    customer_id text not null,
    status text not null default 'placed'
      check (status in ('draft', 'placed', 'paid', 'shipped', 'cancelled')),
    created_at text not null
  ) strict;
  create table if not exists order_items (
    order_id text not null references orders (id) on delete cascade,
    product_id text not null,
    quantity integer not null check (quantity >= 1),
    price_cents integer not null check (price_cents >= 0),
    primary key (order_id, product_id)
  ) strict;
  create index if not exists orders_status_idx on orders (status);
`

// NORMAL: no fsync per commit in WAL mode – a power failure can lose the last commits, never
// corrupt the file. FULL: one fsync per commit, as in postgres. On macOS a plain fsync does not
// flush the drive cache, so FULL and NORMAL measure almost alike there (see pragma fullfsync).
type Synchronous = 'normal' | 'full'

export const openDatabase = (
  path: string,
  { timeout = 5000, synchronous = 'full' as Synchronous } = {},
) => {
  const db = new Database(path, { timeout })
  db.exec(`pragma journal_mode = wal; pragma synchronous = ${synchronous};`) // stored in the file
  db.exec(schema)
  return db
}

type OrderItemRow = { order_id: string; product_id: string; quantity: number; price_cents: number }

export const createSqliteOrderRepository = (db: Database): OrderRepository => {
  const findById = db.prepare(`
    select id, customer_id, status, created_at from orders where id = ?
  `)
  const listByStatus = db.prepare(`
    select id, customer_id, status, created_at from orders
    where status = ? order by created_at, id limit ?
  `)
  // json_each: one prepared statement for any number of ids
  const itemsOfOrders = db.prepare(`
    select order_id, product_id, quantity, price_cents from order_items
    where order_id in (select value from json_each(?)) order by product_id
  `)
  const insertOrder = db.prepare(`
    insert into orders (id, customer_id, status, created_at) values (?, ?, ?, ?)
  `)
  const insertItem = db.prepare(`
    insert into order_items (order_id, product_id, quantity, price_cents) values (?, ?, ?, ?)
  `)

  // one query for the items of all orders – 2 queries instead of 1 + N
  const withItems = (rows: readonly OrderRow[]) => {
    if (rows.length === 0) return []
    const itemRows = itemsOfOrders.all(JSON.stringify(rows.map(({ id }) => id))) as OrderItemRow[]
    const itemRowsByOrder = Map.groupBy(itemRows, ({ order_id }) => order_id)
    const itemsOf = (orderId: string): OrderItem[] =>
      (itemRowsByOrder.get(orderId) ?? []).map(({ product_id, quantity, price_cents }) => ({
        productId: product_id,
        quantity,
        priceCents: price_cents,
      }))
    return rows.map((row) => toOrder(row, itemsOf(row.id)))
  }

  return {
    findOrder: async (orderId) => {
      const row = findById.get(orderId) as OrderRow | undefined
      return row && withItems([row])[0]
    },
    listOrdersByStatus: async (status, limit) =>
      withItems(listByStatus.all(status, limit) as OrderRow[]),
    // immediate: takes the write lock up front, so a second writer waits instead of failing later
    saveOrder: async ({ customerId, status, createdAt, items }) => {
      const id = randomUUID()
      db.exec('begin immediate')
      try {
        insertOrder.run(id, customerId, status, createdAt)
        for (const { productId, quantity, priceCents } of items) {
          insertItem.run(id, productId, quantity, priceCents)
        }
        db.exec('commit')
      } catch (error) {
        db.exec('rollback')
        throw error
      }
      return toOrder({ id, customer_id: customerId, status, created_at: createdAt }, items)
    },
  }
}
