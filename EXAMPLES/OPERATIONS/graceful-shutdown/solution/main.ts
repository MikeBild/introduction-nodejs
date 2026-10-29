import { createDatabase } from '../src/database.ts'
import { orders } from '../src/fixtures.ts'
import { createLogger, isLevel } from '../src/logger.ts'
import { createApp } from './app.ts'
import { createShutdown } from './shutdown.ts'

const port = Number(process.env.PORT ?? 3000)
const logger = createLogger(isLevel(process.env.LOG_LEVEL) ? process.env.LOG_LEVEL : 'info')
const database = createDatabase(orders)

// isShuttingDown is only called per request – by then `lifecycle` exists
const app = createApp({ database, logger, isShuttingDown: () => lifecycle.isShuttingDown() })
const server = app.listen(port, () =>
  logger.info('server started', { url: `http://localhost:${port}` }),
)
server.requestTimeout = 30_000 // slow clients cannot hold a connection forever
server.headersTimeout = 10_000

const lifecycle = createShutdown({ server, closeDatabase: database.end, logger, timeoutMs: 10_000 })
process.once('SIGTERM', lifecycle.shutdown)
process.once('SIGINT', lifecycle.shutdown)
