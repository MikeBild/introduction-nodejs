import type { LogLevelDesc } from 'loglevel'
import { createLogger } from '../src/logger.ts'
import { placeOrder } from '../src/orders.ts'
import { createOrderServer } from '../src/server.ts'
import { withTraceContext } from './logger.ts'
import { traced } from './orders-traced.ts'

const port = Number(process.env.PORT ?? 3000)
const logger = withTraceContext(
  createLogger('orders', (process.env.LOG_LEVEL ?? 'info') as LogLevelDesc),
)

createOrderServer({ logger, placeOrder: traced(placeOrder) }).listen(port, () =>
  logger.info('server started', { port }),
)
