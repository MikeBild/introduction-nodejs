import log, { type LogLevelDesc } from 'loglevel'

export const createLogger = (name: string, level: LogLevelDesc = 'info') => {
  const logger = log.getLogger(name)
  logger.setLevel(level)
  return logger
}

export type Logger = ReturnType<typeof createLogger>
