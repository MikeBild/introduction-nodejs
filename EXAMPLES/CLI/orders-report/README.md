# Orders Report CLI

A small, composable command line tool: `parseArgs` from `node:util`, input from a file or stdin, data on stdout, logs ([loglevel](https://github.com/pimterry/loglevel)) on stderr and meaningful exit codes. TypeScript runs directly with Node.js >= 22.18 (type stripping).

```bash
npm install
npm start                                        # report for data/orders.csv as JSON
cat data/orders.csv | node src/cli.ts -f csv     # read from stdin, write CSV
node src/cli.ts data/orders.csv -v 2>/dev/null   # data only, logs discarded
npm test
npm run typecheck
```

Exit codes: `0` ok, `1` input error, `2` wrong usage.

## Exercise

1. Add an option `--limit` (short `-l`, number, default `10`). An invalid value prints the usage on stderr and sets exit code `2`. The `todo` test in `src/cli.test.ts` becomes green.
2. Handle Ctrl+C: catch `SIGINT`, pass an `AbortSignal` to the input stream and end with exit code `130` – never call `process.exit()` in the middle of the code.
3. Write a test with `node:test` that starts the CLI via `child_process.spawn`, sends `SIGINT` and checks the exit code.

A possible solution lives in `solution/` (`npm run start:solution`, `npm run test:solution`).
