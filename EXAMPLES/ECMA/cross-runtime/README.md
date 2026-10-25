# ECMAScript: code that runs everywhere

`src/handler.js` is the core: a `Request` to `Response` handler that uses only ECMAScript and Web APIs (`URL`, `Response.json`, `crypto.randomUUID`, `fetch`, `AbortSignal`). The runtime specific parts are thin adapters in `adapters/`.
Plain JavaScript (ESM) with JSDoc types, checked by `tsc` (`checkJs`) and tested with `node:test` under Node.js.

```bash
npm install
npm test           # node --test (Node.js >= 22)
npx tsc --noEmit   # type check the JSDoc types
```

## Run it in every runtime

```bash
npm start                                   # Node.js: node adapters/node.js  -> http://localhost:3000
deno run --allow-net --allow-env adapters/deno.js   # Deno -> http://localhost:8000
bun adapters/bun.js                         # Bun  -> http://localhost:3000
npx serve .                                 # Browser: open http://localhost:3000/public/
```

Every runtime answers with `{ path, id, runtime }`, only `runtime` differs. In the browser `crypto.randomUUID` needs a secure context: `localhost` or HTTPS.
`adapters/deno.js` and `adapters/bun.js` use the `Deno` and `Bun` globals and are therefore not part of the Node.js type check.

## Exercise

1. Add a route `/health` that answers `{ status: 'ok' }`, and `404` for unknown paths. Keep the core free of `process`, `Deno`, `Bun` and `window`.
2. Give `fetchJson` a timeout with `AbortSignal.timeout(ms)` and test it against a slow handler behind the Node.js adapter.
3. Start the same core in Node.js, Deno, Bun and the browser and compare the answers.

A possible solution is in `solution/`.
