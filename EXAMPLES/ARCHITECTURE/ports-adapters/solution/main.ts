import { createLogger, isLevel } from '../src/logger.ts'
import { createApp } from './app.ts'
import { hammer, saw } from './fixtures.ts'
import { createMemoryOrderStore } from './orders/index.ts'

// composition root – the only place that knows the concrete adapters
const port = Number(process.env.PORT ?? 3000)
const logger = createLogger(isLevel(process.env.LOG_LEVEL) ? process.env.LOG_LEVEL : 'info')
const orderStore = createMemoryOrderStore([hammer, saw])

createApp({ orderStore, clock: () => new Date(), logger }).listen(port, () =>
  logger.info('server started', { url: `http://localhost:${port}` }),
)
