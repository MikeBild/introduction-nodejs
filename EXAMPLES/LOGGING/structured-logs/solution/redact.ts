import type { LogFields, Logger } from '../src/logger.ts'

const redactValue = (value: unknown, sensitiveKeys: ReadonlySet<string>): unknown =>
  Array.isArray(value)
    ? value.map((item) => redactValue(item, sensitiveKeys))
    : value !== null && typeof value === 'object'
      ? redactFields(value as LogFields, sensitiveKeys)
      : value

// masks sensitive keys at any depth – a safety net, not a licence to log whole objects
export const redactFields = (fields: LogFields, sensitiveKeys: ReadonlySet<string>): LogFields =>
  Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [
      key,
      sensitiveKeys.has(key.toLowerCase()) ? '[redacted]' : redactValue(value, sensitiveKeys),
    ]),
  )

export const withRedaction = (logger: Logger, sensitiveKeys: ReadonlySet<string>): Logger => ({
  debug: (message, fields = {}) => logger.debug(message, redactFields(fields, sensitiveKeys)),
  info: (message, fields = {}) => logger.info(message, redactFields(fields, sensitiveKeys)),
  warn: (message, fields = {}) => logger.warn(message, redactFields(fields, sensitiveKeys)),
  error: (message, fields = {}) => logger.error(message, redactFields(fields, sensitiveKeys)),
  child: (fields) =>
    withRedaction(logger.child(redactFields(fields, sensitiveKeys)), sensitiveKeys),
})

export const defaultSensitiveKeys: ReadonlySet<string> = new Set([
  'authorization',
  'cookie',
  'password',
  'email',
  'customeremail',
])
