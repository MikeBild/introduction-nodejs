# OpenTelemetry Tracing

The order service of the workshop shop (Express 5) instrumented with [OpenTelemetry](https://opentelemetry.io/docs/languages/js/). `src/instrumentation.ts` starts the `NodeSDK` with the HTTP instrumentation **before** the app (`node --import`), so every request becomes a span. Without an OTLP endpoint the spans are printed to the console; JSON logs come from the small `src/logger.ts`.

```bash
npm install
npm start
curl -X POST localhost:3000/orders -H 'content-type: application/json' \
  -d '{"customerId":"c-1","items":[{"productId":"p-hammer","quantity":1}]}'     # 201
curl -X POST localhost:3000/orders -H 'content-type: application/json' \
  -d '{"customerId":"c-1","items":[{"productId":"p-sold-out","quantity":1}]}'   # 422
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
2. Put `trace_id` and `span_id` of the active span into every log line (`withTraceContext(logger)`, child loggers included), so you can jump from a log line to its trace.
3. Look at the trace in Jaeger: which part of `POST /orders` takes the longest? Which IDs belong in spans and logs – and why not into metric labels?

Change the `test.todo` tests in `src/orders.test.ts` to `test` along the way. A possible solution lives in `solution/` (`npm run start:solution`, `npm run test:solution`).
