import { serve } from '@hono/node-server'
import log from 'loglevel'
import { createApp } from './app.ts'
import { createMemoryOrderStore } from './orders/index.ts'

// composition root – the only place that knows the concrete adapters
const port = Number(process.env.PORT ?? 3000)
const logger = log.getLogger('orders')
logger.setLevel(process.env.LOG_LEVEL === 'debug' ? 'debug' : 'info')

const orderStore = createMemoryOrderStore([
  {
    id: 'cart-1',
    customerId: 'c-17',
    items: [
      { sku: 'book', quantity: 2, unitPriceCents: 1990 },
      { sku: 'pen', quantity: 3, unitPriceCents: 250 },
    ],
    createdAt: new Date(),
  },
  { id: 'cart-empty', customerId: 'c-23', items: [], createdAt: new Date() },
])

serve(
  { fetch: createApp({ orderStore, clock: () => new Date(), logger }).fetch, port },
  ({ port }) => logger.info(`listening on http://localhost:${port}`),
)
