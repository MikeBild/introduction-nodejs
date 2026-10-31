import type { Product, ProductId } from './orders.ts'
import type { Sql } from './postgres.ts'

// two products are enough for every case of this exercise – fixed prices, fixed stock, fixed ids
export const hammer: Product = {
  id: 'p-hammer' as ProductId,
  name: 'Claw hammer',
  priceCents: 1990,
  stock: 10,
}
export const saw: Product = {
  id: 'p-saw' as ProductId,
  name: 'Hand saw',
  priceCents: 2490,
  stock: 5,
}

// the same products in the table: after a truncate in tests, idempotent at startup
export const seedProducts = (sql: Sql, products: readonly Product[]) => sql`
  insert into products ${sql(
    products.map(({ id, name, priceCents, stock }) => ({
      id,
      name,
      price_cents: priceCents,
      stock,
    })),
  )}
  on conflict (id) do nothing
`
