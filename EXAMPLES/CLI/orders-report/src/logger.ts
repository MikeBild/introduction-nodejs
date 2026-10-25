import log, { type LogLevelDesc } from 'loglevel'

// CLI rule: stdout is reserved for data, every log line goes to stderr
export const createLogger = (name: string, level: LogLevelDesc) => {
  const logger = log.getLogger(name)
  logger.methodFactory =
    (methodName) =>
    (...messages: unknown[]) =>
      process.stderr.write(`[${name}] ${methodName}: ${messages.join(' ')}\n`)
  logger.setLevel(level)
  return logger
}
