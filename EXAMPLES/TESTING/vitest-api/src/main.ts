import { randomUUID } from 'node:crypto'
import { createApp } from './app.ts'
import { catalogOf, hammer, saw } from './fixtures.ts'
import { createLogger, isLevel } from './logger.ts'
import type { Order, OrderId } from './orders.ts'

// composition root: here the shell gets real (in-memory) I/O
const port = Number(process.env.PORT ?? 3000)
const logger = createLogger(isLevel(process.env.LOG_LEVEL) ? process.env.LOG_LEVEL : 'info')
const catalog = catalogOf(hammer, saw)
const orders = new Map<string, Order>()

const app = createApp({
  loadCatalog: async (productIds) =>
    new Map([...catalog].filter(([productId]) => productIds.includes(productId))),
  saveOrder: async (newOrder) => {
    const order: Order = { id: randomUUID() as OrderId, ...newOrder }
    orders.set(order.id, order)
    return order
  },
  logger,
})

app.listen(port, () => logger.info('server started', { url: `http://localhost:${port}` }))
