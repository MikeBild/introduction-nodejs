# OpenTelemetry Tracing

An order service instrumented with [OpenTelemetry](https://opentelemetry.io/docs/languages/js/). `src/instrumentation.ts` starts the `NodeSDK` with the HTTP instrumentation **before** the app (`node --import`), so every request becomes a span. Without an OTLP endpoint the spans are printed to the console, JSON logs come from [loglevel](https://github.com/pimterry/loglevel).

```bash
npm install
npm start
curl -X POST localhost:3000/orders -d '{"customerId":"c-1","items":[{"sku":"book","quantity":1}]}'
curl -X POST localhost:3000/orders -d '{"customerId":"c-1","items":[{"sku":"sold-out","quantity":1}]}'
npm test        # spans are collected in memory (InMemorySpanExporter)
npm run typecheck
```

## With Jaeger (Docker)

```bash
docker run -d --rm --name jaeger -p 16686:16686 -p 4318:4318 jaegertracing/jaeger:latest
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318 OTEL_SERVICE_NAME=orders npm start
open http://localhost:16686
```

## Exercise

1. Wrap `placeOrder` in its own span `order.place` (`tracer.startActiveSpan`): attribute `order.item_count`, `recordException` and status `ERROR` on failure, `span.end()` in `finally`.
2. Put `trace_id` and `span_id` of the active span into every log line, so you can jump from a log line to its trace.
3. Look at the trace in Jaeger: which part of `POST /orders` takes the longest? Which IDs belong in spans and logs – and why not into metric labels?

The `todo` tests in `src/orders.test.ts` turn green along the way. A possible solution lives in `solution/` (`npm run start:solution`, `npm run test:solution`).
