import { createApp } from './app.ts'
import { createDatabase } from './database.ts'
import { orders } from './fixtures.ts'
import { createLogger, isLevel } from './logger.ts'

const port = Number(process.env.PORT ?? 3000)
const logger = createLogger(isLevel(process.env.LOG_LEVEL) ? process.env.LOG_LEVEL : 'info')
const database = createDatabase(orders)

createApp({ database, logger }).listen(port, () =>
  logger.info('server started', { url: `http://localhost:${port}` }),
)

// Exercise: SIGTERM ends the process immediately – open requests break, the pool is never closed
