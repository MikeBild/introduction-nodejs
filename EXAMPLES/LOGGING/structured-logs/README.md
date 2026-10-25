# Structured Logs

JSON log lines on stdout with level, message and context fields. [loglevel](https://github.com/pimterry/loglevel) filters the levels, a small method factory in `src/logger.ts` turns every call into one JSON line and `child()` binds fields such as a request id. The order route in `src/app.ts` still logs the old way.

```bash
npm install
npm start
curl -X POST localhost:3000/orders -H 'content-type: application/json' \
  -d '{"customerId":"c-1","customerEmail":"ada@example.com","amountCents":500000}'
npm start | jq 'select(.level != "debug")'    # JSON logs can be filtered
npm test
npm run typecheck
```

## Exercise

1. Replace the `console.log` prose in `src/app.ts` with `logger.info('order created', { order_id, customer_id })` – IDs instead of email addresses.
2. Write a request-id middleware: take `x-request-id` or create a UUID, set it as response header, put a child logger into the context and log one `request finished` line with `method`, `path`, `status` and `duration_ms`.
3. Add redaction: mask `email`, `password` and `authorization` at any depth, even if someone logs a whole object.
4. Choose the level consciously: a declined payment is a business event (`info`), not an `error`.

The `todo` tests in `src/*.test.ts` turn green along the way. A possible solution lives in `solution/` (`npm run start:solution`, `npm run test:solution`).
