import { serve } from '@hono/node-server'
import { createApp } from './app.ts'
import { createLogger } from '../src/logger.ts'
import { createOrderStore } from '../src/orders.ts'

const port = Number(process.env.PORT ?? 3000)
const logger = createLogger('zod-api', process.env.LOG_LEVEL === 'debug' ? 'debug' : 'info')
const orderStore = createOrderStore([
  {
    id: 'a3e1c1f4-1111-4c1e-9a55-000000000001',
    customerId: 'c-17',
    items: [{ sku: 'book', quantity: 1 }],
    status: 'paid',
  },
  {
    id: 'a3e1c1f4-1111-4c1e-9a55-000000000002',
    customerId: 'c-23',
    items: [{ sku: 'pen', quantity: 3 }],
    status: 'open',
  },
])

serve({ fetch: createApp({ orderStore, logger }).fetch, port }, ({ port }) =>
  logger.info(`listening on http://localhost:${port}`),
)
