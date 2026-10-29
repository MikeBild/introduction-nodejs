# Health Checks and Graceful Shutdown

An Express 5 order service with a (fake) connection pool. It works – until the platform restarts it: there is no liveness or readiness endpoint, and `SIGTERM` kills the process in the middle of open requests without closing the pool.

```bash
npm install
npm start                  # http://localhost:3000/orders
kill -TERM <pid>           # gone immediately
npm test
npm run typecheck
```

## Exercise

1. Write `createHealthRoutes(isShuttingDown, pingDatabase)` as an `express.Router()`: `GET /livez` is always `200` as long as the process runs (no dependency checks), `GET /readyz` answers `503` while draining or when the database ping fails, otherwise `200`.
2. Write `shutdown(signal)` for `SIGTERM` and `SIGINT`: set `shuttingDown = true` (readiness becomes `503`), start a hard deadline with `setTimeout(…).unref()` that exits with `1`, call `server.close(async () => { await closeDatabase(); process.exit(0) })`. A second signal must not start a second shutdown.
3. Set `server.requestTimeout` and `server.headersTimeout`, so a slow client cannot hold the shutdown open.
4. Change the `test.todo` tests in `src/app.test.ts` to real tests. Inject `exit` and pass a server stand-in with `close(callback)` – then you decide in the test when "all open requests are finished". Use `vi.useFakeTimers()` for the deadline.
5. Reflect: why must `/livez` not check the database? How long may the deadline be compared to `terminationGracePeriodSeconds` in Kubernetes?

A possible solution lives in `solution/` (`npm run start:solution`, `npm run test:solution`).
