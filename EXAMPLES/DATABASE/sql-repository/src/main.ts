import { createLogger, isLevel } from './logger.ts'
import { createMemoryOrderRepository } from './memory.ts'
import { orderTotalCents } from './orders.ts'
import { createDatabase, createPostgresOrderRepository } from './postgres.ts'

const logger = createLogger(isLevel(process.env.LOG_LEVEL) ? process.env.LOG_LEVEL : 'info')
const databaseUrl = process.env.DATABASE_URL
const sql = databaseUrl ? createDatabase(databaseUrl) : undefined
const orderRepository = sql ? createPostgresOrderRepository(sql) : createMemoryOrderRepository()

logger.info('repository selected', { adapter: sql ? 'postgres' : 'in-memory' })

try {
  const order = await orderRepository.saveOrder({
    customerId: 'c-17',
    status: 'placed',
    createdAt: new Date().toISOString(),
    items: [{ productId: 'p-hammer', quantity: 2, priceCents: 1990 }],
  })
  logger.debug('order saved', { order_id: order.id, item_count: order.items.length })
  const placedOrders = await orderRepository.listOrdersByStatus('placed', 10)
  logger.info('placed orders loaded', {
    order_count: placedOrders.length,
    total_cents: placedOrders.reduce((sum, { items }) => sum + orderTotalCents(items), 0),
  })
} catch (error) {
  logger.error('database access failed', { reason: (error as Error).message })
  process.exitCode = 1
} finally {
  await sql?.end()
}
