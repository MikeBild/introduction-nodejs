import { loadConfig } from './config.ts'
import { createLogger } from './logger.ts'
import { createHttpServer } from './server.ts'

const config = loadConfig(process.env)
const logger = createLogger('typed-config', config.LOG_LEVEL)

// pitfall: never log the whole config – as soon as it contains secrets, they end up in the logs
logger.debug('config loaded', config)

createHttpServer({ logger }).listen(config.PORT, () =>
  logger.info(`listening on http://localhost:${config.PORT}`),
)
