import { trace } from '@opentelemetry/api'
import type { Logger } from '../src/logger.ts'

const traceFields = () => {
  const spanContext = trace.getActiveSpan()?.spanContext()
  return spanContext ? { trace_id: spanContext.traceId, span_id: spanContext.spanId } : {}
}

// every log line inside a span gets trace_id and span_id – the jump from log to trace
export const withTraceContext = (logger: Logger): Logger => ({
  debug: (msg, fields) => logger.debug(msg, { ...traceFields(), ...fields }),
  info: (msg, fields) => logger.info(msg, { ...traceFields(), ...fields }),
  warn: (msg, fields) => logger.warn(msg, { ...traceFields(), ...fields }),
  error: (msg, fields) => logger.error(msg, { ...traceFields(), ...fields }),
  child: (more) => withTraceContext(logger.child(more)),
})
