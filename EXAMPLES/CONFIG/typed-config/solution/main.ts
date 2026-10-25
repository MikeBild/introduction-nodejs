import { createLogger } from '../src/logger.ts'
import { loadConfig, redactConfig, type Config } from './config.ts'
import { createHttpServer } from './server.ts'

const tryLoadConfig = (): Config | undefined => {
  try {
    return loadConfig(process.env)
  } catch (error) {
    createLogger('typed-config').error((error as Error).message)
    process.exitCode = 1
    return undefined
  }
}

const config = tryLoadConfig()

if (config) {
  const logger = createLogger('typed-config', config.LOG_LEVEL)
  logger.debug('config loaded', redactConfig(config))
  createHttpServer({ logger, paymentApiKey: config.PAYMENT_API_KEY }).listen(config.PORT, () =>
    logger.info(`listening on http://localhost:${config.PORT}`),
  )
}
