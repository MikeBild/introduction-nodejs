# Profiling and Performance

A small report server with 100,000 generated orders. `GET /report?month=2026-03` is slow and memory grows under load – find out why by measuring, not guessing. Vital signs (event loop delay p99, heap, recent requests) are logged every 5 seconds via [loglevel](https://github.com/pimterry/loglevel).

```bash
npm install
npm start                  # http://localhost:3000/report?month=2026-03
npm run load               # second terminal: autocannon, 50 connections, 10 s
npm run bench              # micro measurement of buildMonthlyReport
npm run profile            # like start, writes profiles/*.cpuprofile on Ctrl+C
npm run heap               # like start, `kill -USR2 <pid>` writes a heap snapshot
npm test
npm run typecheck
```

Open `.cpuprofile` and `.heapsnapshot` files in Chrome DevTools (Performance / Memory tab) – wide bars in the flame graph are expensive.

## Exercise

1. Set a target first (e.g. p99 < 50 ms with 50 connections), run `npm run load` and write down p99 and your guess where the time goes.
2. Record a CPU profile under load and find the hot function. Rewrite `buildMonthlyReport` in `src/report.ts` with a single pass and a `Map` – the tests guarantee the same result. Measure again.
3. Take two heap snapshots a minute apart under load, compare them and fix the growing structure in `src/server.ts` with an upper bound.

A possible solution lives in `solution/` (`npm run start:solution`, `npm run test:solution`).
