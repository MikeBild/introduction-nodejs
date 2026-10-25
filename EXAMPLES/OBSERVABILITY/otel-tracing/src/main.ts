import type { LogLevelDesc } from 'loglevel'
import { createLogger } from './logger.ts'
import { placeOrder } from './orders.ts'
import { createOrderServer } from './server.ts'

const port = Number(process.env.PORT ?? 3000)
const logger = createLogger('orders', (process.env.LOG_LEVEL ?? 'info') as LogLevelDesc)

createOrderServer({ logger, placeOrder }).listen(port, () =>
  logger.info('server started', { port }),
)
