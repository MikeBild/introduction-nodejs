import { createApp } from './app.ts'
import { loadConfig } from './config.ts'
import { createLogger } from './logger.ts'

const config = loadConfig(process.env)
const logger = createLogger(config.LOG_LEVEL, { service: 'typed-config' })

// pitfall: never log the whole config – as soon as it contains secrets, they end up in the logs
logger.debug('config loaded', config)

createApp({ logger }).listen(config.PORT, () =>
  logger.info('server started', { url: `http://localhost:${config.PORT}` }),
)
