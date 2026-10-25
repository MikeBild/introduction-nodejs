import { context, trace } from '@opentelemetry/api'
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks'
import { InMemorySpanExporter, SimpleSpanProcessor, TracerProvider } from '@opentelemetry/sdk-trace'

// in tests the spans land in memory instead of a backend
export const setupTestTracing = () => {
  const spanExporter = new InMemorySpanExporter()
  trace.setGlobalTracerProvider(
    new TracerProvider({ spanProcessors: [new SimpleSpanProcessor({ exporter: spanExporter })] }),
  )
  context.setGlobalContextManager(new AsyncLocalStorageContextManager().enable())
  return spanExporter
}
