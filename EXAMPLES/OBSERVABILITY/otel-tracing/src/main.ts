import { createApp } from './app.ts'
import { createLogger, isLevel } from './logger.ts'
import { placeOrder } from './orders.ts'

const port = Number(process.env.PORT ?? 3000)
// Exercise: add trace_id and span_id of the active span to every log line
const logger = createLogger(isLevel(process.env.LOG_LEVEL) ? process.env.LOG_LEVEL : 'info', {
  service: 'orders',
})

createApp({ logger, placeOrder }).listen(port, () => logger.info('server started', { port }))
