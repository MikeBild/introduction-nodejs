// loaded before the application: node --import ./src/instrumentation.ts src/main.ts
import { register } from 'node:module'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http'
import { NodeSDK } from '@opentelemetry/sdk-node'
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace'

// ESM support: lets the instrumentations patch modules loaded via import (node:http …)
register('@opentelemetry/instrumentation/hook.mjs', import.meta.url)

// OTEL_EXPORTER_OTLP_ENDPOINT set → send via OTLP (Collector, Jaeger …), otherwise print spans to the console
const traceExporter = process.env.OTEL_EXPORTER_OTLP_ENDPOINT
  ? new OTLPTraceExporter()
  : new ConsoleSpanExporter()

const sdk = new NodeSDK({
  serviceName: process.env.OTEL_SERVICE_NAME ?? 'orders',
  traceExporter,
  instrumentations: [new HttpInstrumentation()],
  metricReaders: [], // this example focuses on traces
  logRecordProcessors: [],
})
sdk.start()

const shutdown = () => void sdk.shutdown().finally(() => process.exit())
process.once('SIGTERM', shutdown)
process.once('SIGINT', shutdown)
