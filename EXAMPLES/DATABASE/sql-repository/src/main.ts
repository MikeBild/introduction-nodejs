import { createLogger } from './logger.ts'
import { createMemoryOrderRepository } from './memory.ts'
import { formatCents, sumTotals } from './orders.ts'
import { createDatabase, createPostgresOrderRepository } from './postgres.ts'

const logger = createLogger('sql-repository', process.env.LOG_LEVEL === 'debug' ? 'debug' : 'info')
const databaseUrl = process.env.DATABASE_URL
const sql = databaseUrl ? createDatabase(databaseUrl) : undefined
const orderRepository = sql ? createPostgresOrderRepository(sql) : createMemoryOrderRepository()

logger.info(`using ${sql ? 'postgres' : 'in-memory'} repository`)

try {
  const createdOrder = await orderRepository.createOrder({ customerId: 'c-17', totalCents: 4990 })
  logger.debug(`order created order_id=${createdOrder.id}`)
  const openOrders = await orderRepository.listOpenOrders(10)
  logger.info(`${openOrders.length} open orders, total ${formatCents(sumTotals(openOrders))} EUR`)
} catch (error) {
  logger.error(`database access failed: ${(error as Error).message}`)
  process.exitCode = 1
} finally {
  await sql?.end()
}
