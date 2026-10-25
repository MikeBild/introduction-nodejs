import log, { type LogLevelDesc } from 'loglevel'

export type LogFields = Readonly<Record<string, unknown>>
export type Logger = Record<
  'debug' | 'info' | 'warn' | 'error',
  (message: string, fields?: LogFields) => void
>

const writeToStdout = (line: string) => void process.stdout.write(`${line}\n`)

// one JSON line per call – Exercise: add trace_id and span_id of the active span to every line
export const createLogger = (
  name: string,
  level: LogLevelDesc,
  write: (line: string) => void = writeToStdout,
): Logger => {
  const levelLogger = log.getLogger(name)
  levelLogger.methodFactory =
    (methodName) =>
    (message: string, fields: LogFields = {}) =>
      write(
        JSON.stringify({
          level: methodName,
          time: new Date().toISOString(),
          service: name,
          msg: message,
          ...fields,
        }),
      )
  levelLogger.setLevel(level)
  return {
    debug: (message, fields) => levelLogger.debug(message, fields),
    info: (message, fields) => levelLogger.info(message, fields),
    warn: (message, fields) => levelLogger.warn(message, fields),
    error: (message, fields) => levelLogger.error(message, fields),
  }
}
