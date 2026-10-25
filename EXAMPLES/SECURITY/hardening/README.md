# Hardening a Node.js Service

A small Hono service with typical weak spots: no limits and security headers, a naive `deepMerge` on user input (prototype pollution), a webhook endpoint that calls any URL (SSRF) and error responses with stack traces. Harden it layer by layer.

```bash
npm install
npm start
curl -i localhost:3000/health                                  # no security headers
curl -X PUT localhost:3000/settings -H 'content-type: application/json' -d '{"__proto__":{"isAdmin":true}}'
curl -X POST localhost:3000/webhooks/test -H 'content-type: application/json' -d '{"url":"http://169.254.169.254/"}'
npm test
npm run typecheck
```

## Exercise

1. Add `secureHeaders()`, `bodyLimit` (100 KB, 413) and `timeout(5_000)` from Hono; `onError` answers with a generic message, details only go to the log.
2. Replace `deepMerge` in `PUT /settings` with a zod schema that only accepts known fields (`theme`, `pageSize`) – `__proto__` must lead to 400.
3. Protect `POST /webhooks/test` against SSRF with an allowlist: only `https` and known hosts, no redirects.
4. Least privilege and supply chain: run `npm audit`, install with `npm ci --ignore-scripts` and start the service with the Node.js permission model (`npm run start:restricted`).

The `todo` tests in `src/app.test.ts` turn green along the way. A possible solution lives in `solution/` (`npm run start:solution`, `npm run test:solution`).
