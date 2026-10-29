import type { Logger } from '../src/logger.ts'

type Fields = Record<string, unknown>

const redactValue = (value: unknown, sensitiveKeys: ReadonlySet<string>): unknown =>
  Array.isArray(value)
    ? value.map((item) => redactValue(item, sensitiveKeys))
    : value !== null && typeof value === 'object'
      ? redactFields(value as Fields, sensitiveKeys)
      : value

// masks sensitive keys at any depth – a safety net, not a licence to log whole objects
export const redactFields = (fields: Fields, sensitiveKeys: ReadonlySet<string>): Fields =>
  Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [
      key,
      sensitiveKeys.has(key.toLowerCase()) ? '[redacted]' : redactValue(value, sensitiveKeys),
    ]),
  )

export const withRedaction = (logger: Logger, sensitiveKeys: ReadonlySet<string>): Logger => ({
  debug: (msg, fields = {}) => logger.debug(msg, redactFields(fields, sensitiveKeys)),
  info: (msg, fields = {}) => logger.info(msg, redactFields(fields, sensitiveKeys)),
  warn: (msg, fields = {}) => logger.warn(msg, redactFields(fields, sensitiveKeys)),
  error: (msg, fields = {}) => logger.error(msg, redactFields(fields, sensitiveKeys)),
  child: (more) => withRedaction(logger.child(redactFields(more, sensitiveKeys)), sensitiveKeys),
})

export const defaultSensitiveKeys: ReadonlySet<string> = new Set([
  'authorization',
  'cookie',
  'password',
  'email',
])
