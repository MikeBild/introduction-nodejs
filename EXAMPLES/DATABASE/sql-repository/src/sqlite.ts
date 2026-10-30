import { randomUUID } from 'node:crypto'
import { Database } from 'node:sqlite'
import type { Order, OrderStatus } from './orders.ts'
import type { OrderRepository } from './repository.ts'

// Exercise: order_items and the index on orders(status) are missing
const schema = `
  create table if not exists orders (
    id text primary key,
    customer_id text not null,
    status text not null default 'placed'
      check (status in ('draft', 'placed', 'paid', 'shipped', 'cancelled')),
    created_at text not null
  ) strict;
`

// timeout: how long a blocked connection waits for the lock before it gives up
// Exercise: switch the journal mode to WAL, every connection to this file then profits
export const openDatabase = (path: string, { timeout = 5000 } = {}) => {
  const db = new Database(path, { timeout })
  db.exec(schema)
  return db
}

export type OrderRow = {
  id: string
  customer_id: string
  status: OrderStatus
  created_at: string
}

export const toOrder = (row: OrderRow, items: Order['items'] = []): Order => ({
  id: row.id,
  customerId: row.customer_id,
  items,
  status: row.status,
  createdAt: row.created_at,
})

// every call below is synchronous: `async` only fulfils the port, the event loop waits for SQLite
// Exercise: the items are not stored yet – see the section on SQLite in the README
export const createSqliteOrderRepository = (db: Database): OrderRepository => {
  const findById = db.prepare(`
    select id, customer_id, status, created_at from orders where id = ?
  `)
  const listByStatus = db.prepare(`
    select id, customer_id, status, created_at from orders
    where status = ? order by created_at, id limit ?
  `)
  const insertOrder = db.prepare(`
    insert into orders (id, customer_id, status, created_at) values (?, ?, ?, ?)
  `)
  return {
    findOrder: async (orderId) => {
      const row = findById.get(orderId) as OrderRow | undefined
      return row && toOrder(row)
    },
    listOrdersByStatus: async (status, limit) => {
      const rows = listByStatus.all(status, limit) as OrderRow[]
      return rows.map((row) => toOrder(row))
    },
    saveOrder: async ({ customerId, status, createdAt }) => {
      const id = randomUUID() // SQLite has no gen_random_uuid()
      insertOrder.run(id, customerId, status, createdAt)
      return toOrder({ id, customer_id: customerId, status, created_at: createdAt })
    },
  }
}
