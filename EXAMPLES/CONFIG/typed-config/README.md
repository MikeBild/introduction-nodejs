# Typed Configuration and Secrets

Configuration comes from the environment, is parsed once at startup with [zod](https://zod.dev) and passed on as a frozen, typed object. Locally Node.js reads `.env` itself (`--env-file-if-exists`), no `dotenv` package needed. The service is a small Express 5 app (`src/app.ts`) with `GET /health`.

```bash
npm install
npm start                       # runs with defaults – still too forgiving
cp .env.example .env            # local values, .env is git-ignored
LOG_LEVEL=debug npm start       # look at what the debug log prints
curl localhost:3000/health
npm test
npm run typecheck
```

## Exercise

1. Add `DATABASE_URL` (Postgres URL) and `PAYMENT_API_KEY` (min. 16 chars) to the schema in `src/config.ts` – required, without defaults. Change the `test.todo` tests in `src/config.test.ts` to `test`; they turn green.
2. Remove `process.env` from `src/app.ts`: `main.ts` loads the config and passes only `paymentApiKey` into `createApp`.
3. If the config is invalid, write a clear message to stderr and end with exit code `1` – before the server starts.
4. Write `redactConfig(config)`, which masks secrets and passwords in URLs, and log only this view.

A possible solution lives in `solution/` (`npm run start:solution`, `npm run test:solution`).
