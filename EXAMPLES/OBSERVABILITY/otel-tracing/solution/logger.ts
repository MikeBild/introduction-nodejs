import { trace } from '@opentelemetry/api'
import type { LogFields, Logger } from '../src/logger.ts'

const traceFields = (): LogFields => {
  const spanContext = trace.getActiveSpan()?.spanContext()
  return spanContext ? { trace_id: spanContext.traceId, span_id: spanContext.spanId } : {}
}

// every log line inside a span gets trace_id and span_id – the jump from log to trace
export const withTraceContext = (logger: Logger): Logger => ({
  debug: (message, fields) => logger.debug(message, { ...traceFields(), ...fields }),
  info: (message, fields) => logger.info(message, { ...traceFields(), ...fields }),
  warn: (message, fields) => logger.warn(message, { ...traceFields(), ...fields }),
  error: (message, fields) => logger.error(message, { ...traceFields(), ...fields }),
})
