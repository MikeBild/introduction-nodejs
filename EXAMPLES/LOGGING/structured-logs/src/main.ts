import { createApp } from './app.ts'
import { createLogger, isLevel } from './logger.ts'
import { catalog, chargePayment, findCustomer } from './shop.ts'

const port = Number(process.env.PORT ?? 3000)
const logger = createLogger(isLevel(process.env.LOG_LEVEL) ? process.env.LOG_LEVEL : 'info', {
  service: 'orders',
})
const app = createApp({ logger, catalog, findCustomer, chargePayment })

app.listen(port, () => logger.info('server started', { port }))
