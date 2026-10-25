import log, { type LogLevelDesc } from 'loglevel'

export type LogFields = Readonly<Record<string, unknown>>
export type LogMethod = (message: string, fields?: LogFields) => void
export type Logger = {
  debug: LogMethod
  info: LogMethod
  warn: LogMethod
  error: LogMethod
  child: (fields: LogFields) => Logger
}
export type LoggerOptions = {
  name: string
  level: LogLevelDesc
  base?: LogFields
  write?: (line: string) => void
}

const writeToStdout = (line: string) => void process.stdout.write(`${line}\n`)

// loglevel decides which levels are active, the method factory turns every call into one JSON line
export const createLogger = ({
  name,
  level,
  base = {},
  write = writeToStdout,
}: LoggerOptions): Logger => {
  const levelLogger = log.getLogger(name)
  levelLogger.methodFactory =
    (methodName) =>
    (message: string, fields: LogFields = {}) =>
      write(
        JSON.stringify({
          level: methodName,
          time: new Date().toISOString(),
          msg: message,
          ...fields,
        }),
      )
  levelLogger.setLevel(level)

  const bindFields = (boundFields: LogFields): Logger => ({
    debug: (message, fields) => levelLogger.debug(message, { ...boundFields, ...fields }),
    info: (message, fields) => levelLogger.info(message, { ...boundFields, ...fields }),
    warn: (message, fields) => levelLogger.warn(message, { ...boundFields, ...fields }),
    error: (message, fields) => levelLogger.error(message, { ...boundFields, ...fields }),
    child: (fields) => bindFields({ ...boundFields, ...fields }),
  })
  return bindFields({ service: name, ...base })
}
