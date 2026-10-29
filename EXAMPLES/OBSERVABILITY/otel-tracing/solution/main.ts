import { createApp } from '../src/app.ts'
import { createLogger, isLevel } from '../src/logger.ts'
import { placeOrder } from '../src/orders.ts'
import { withTraceContext } from './logger.ts'
import { traced } from './orders-traced.ts'

const port = Number(process.env.PORT ?? 3000)
const logger = withTraceContext(
  createLogger(isLevel(process.env.LOG_LEVEL) ? process.env.LOG_LEVEL : 'info', {
    service: 'orders',
  }),
)

createApp({ logger, placeOrder: traced(placeOrder) }).listen(port, () =>
  logger.info('server started', { port }),
)
