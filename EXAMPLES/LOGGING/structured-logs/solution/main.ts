import { createLogger, isLevel } from '../src/logger.ts'
import { catalog, chargePayment, findCustomer } from '../src/shop.ts'
import { createApp } from './app.ts'
import { defaultSensitiveKeys, withRedaction } from './redact.ts'

const port = Number(process.env.PORT ?? 3000)
const logger = withRedaction(
  createLogger(isLevel(process.env.LOG_LEVEL) ? process.env.LOG_LEVEL : 'info', {
    service: 'orders',
  }),
  defaultSensitiveKeys,
)
const app = createApp({ logger, catalog, findCustomer, chargePayment })

app.listen(port, () => logger.info('server started', { port }))
