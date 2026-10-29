# Structured Logs

JSON log lines on stdout with level, time, message and context fields – without a logging library. `src/logger.ts` is about 20 lines: `createLogger(minLevel, bound)` filters levels, writes one `JSON.stringify` line per call and `child(fields)` binds fields such as a request id. The order route of the Express 5 app in `src/app.ts` still logs the old way.

```bash
npm install
npm start
curl -X POST localhost:3000/orders -H 'content-type: application/json' \
  -d '{"customerId":"c-17","items":[{"productId":"p-workbench","quantity":1}]}'   # 402, declined
npm start | jq 'select(.level != "debug")'    # JSON logs can be filtered
npm test
npm run typecheck
```

## Exercise

1. Replace the `console.log` prose in `src/app.ts` with `logger.info('order placed', { order_id, customer_id, total_cents })` – IDs instead of email addresses.
2. Write a `requestLogger(logger)` middleware: take `x-request-id` or create a UUID, set it as response header, put a child logger into `res.locals.logger` (type it with `declare global { namespace Express { interface Locals { logger: Logger } } }`) and log one `request finished` line with `method`, `path`, `status` and `duration_ms` on `res.on('finish')`.
3. Add redaction: `withRedaction(logger, keys)` masks `email`, `password` and `authorization` at any depth, even if someone logs a whole object.
4. Choose the level consciously: a declined payment is a business event (`info`), not an `error`.

Change the `test.todo` tests in `src/*.test.ts` to `test` along the way – `src/capture.ts` collects the log lines with `vi.spyOn(console, 'log')`. A possible solution lives in `solution/` (`npm run start:solution`, `npm run test:solution`).
