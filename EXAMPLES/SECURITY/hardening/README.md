# Hardening a Node.js Service

A small Express 5 service of the workshop shop with typical weak spots: a 10 MB body limit and no security headers, `x-powered-by` announces the framework, a naive `deepMerge` on user input (prototype pollution), an `order.placed` webhook test that calls any URL (SSRF) and error responses with stack traces. Harden it layer by layer – with Express and Node.js built-ins, no extra packages.

```bash
npm install
npm start
curl -i localhost:3000/health                                  # no security headers, x-powered-by
curl -X PUT localhost:3000/settings -H 'content-type: application/json' -d '{"__proto__":{"isAdmin":true}}'
curl -X POST localhost:3000/webhooks/test -H 'content-type: application/json' -d '{"url":"http://169.254.169.254/"}'
npm test
npm run typecheck
```

## Exercise

1. Headers, limits, errors: `app.disable('x-powered-by')`, a small `securityHeaders` middleware (`x-content-type-options: nosniff`, `content-security-policy: default-src 'none'; frame-ancestors 'none'`, `referrer-policy: no-referrer`), `express.json({ limit: '100kb' })` (413), `server.requestTimeout` and `server.headersTimeout` in `main.ts`. The error handler answers with a generic message, details only go to the log.
2. Replace `deepMerge` in `PUT /settings` with a zod schema (`z.strictObject`) that only accepts known fields (`theme`, `pageSize`) – `__proto__` must lead to 400.
3. Protect `POST /webhooks/test` against SSRF with an allowlist: only `https`, known hosts, no credentials or ports, no redirects (`redirect: 'error'`).
4. Least privilege and supply chain: run `npm audit`, install with `npm ci --ignore-scripts` and start the service with the Node.js permission model (`npm run start:restricted`: only reading the project folder and the network are allowed – on Node.js 26 the network needs an explicit `--allow-net`).

Change the `test.todo` tests in `src/app.test.ts` to `test` along the way. A possible solution lives in `solution/` (`npm run start:solution`, `npm run test:solution`).
