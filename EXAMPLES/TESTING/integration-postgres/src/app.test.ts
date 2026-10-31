import { describe, test } from 'vitest'

// Exercise: integration tests against the real PostgreSQL from compose.yaml (docker compose up --wait).
// - beforeAll: `sql = await connectTestDatabase()` (src/test-database.ts) applies the migrations; afterAll: `sql.end()`
// - beforeEach: `truncate products, orders cascade`, then `seedProducts(sql, [hammer, saw])` – every test starts alike
// - the app gets the real functions instead of vi.fn():
//   createApp({ loadCatalog: loadCatalog(sql), saveOrder: saveOrder(sql), findOrder: findOrder(sql), logger, now })
//   started with `await using api = await listen(app)` (src/test-server.ts) and called with fetch
// - check the response AND the database: rows in orders, stock in products
describe('POST /orders against PostgreSQL', () => {
  test.todo('answers 201, stores order and items with prices from products and reduces the stock')
  test.todo('answers 422 for an unknown product and stores nothing')
  test.todo('answers 422 when the quantity exceeds the stock and keeps the stock')
  test.todo('bonus: two concurrent orders for the last saw – one 201, stock 0, one order')
})

describe('saveOrder', () => {
  test.todo('rolls back order, items and stock when one item exceeds the stock')
})

describe('GET /orders/:id', () => {
  test.todo('answers 404 for an unknown or invalid id')
})
