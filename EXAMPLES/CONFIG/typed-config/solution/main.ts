import { createLogger } from '../src/logger.ts'
import { createApp } from './app.ts'
import { loadConfig, redactConfig, type Config } from './config.ts'

const tryLoadConfig = (): Config | undefined => {
  try {
    return loadConfig(process.env)
  } catch (error) {
    // no logger yet (its level is part of the config) – a clear message on stderr, exit code 1
    console.error((error as Error).message)
    process.exitCode = 1
    return undefined
  }
}

const config = tryLoadConfig()

if (config) {
  const logger = createLogger(config.LOG_LEVEL, { service: 'typed-config' })
  logger.debug('config loaded', redactConfig(config))
  createApp({ logger, paymentApiKey: config.PAYMENT_API_KEY }).listen(config.PORT, () =>
    logger.info('server started', { url: `http://localhost:${config.PORT}` }),
  )
}
