# JWT / OIDC with jose and Hono

Your API does not log anybody in: an identity provider issues access tokens, the API verifies them strictly with [jose](https://github.com/panva/jose) (signature via JWKS, `iss`, `aud`, `exp`) and then decides about permissions. For local development `npm run dev` starts a dev issuer that signs tokens offline (`ENABLE_DEV_ISSUER=true`, bound to 127.0.0.1, fixed scopes). Without it and without `JWKS_URI`/`JWT_ISSUER` the server refuses to start – fail closed.

```bash
npm install
npm run dev
TOKEN=$(curl -s "localhost:3000/dev/token?scope=orders:read")
curl -i localhost:3000/orders                                   # 401
curl -i localhost:3000/orders -H "authorization: Bearer $TOKEN" # 200
npm test
npm run typecheck

# with a real identity provider, e.g. Keycloak
JWKS_URI=https://idp.example.com/realms/shop/protocol/openid-connect/certs \
JWT_ISSUER=https://idp.example.com/realms/shop JWT_AUDIENCE=orders-api npm start
```

## Exercise

1. `GET /me` only decodes the token with `decodeJwt` – put it behind `requireAuth` and read the claims from `c.get('principal')`.
2. Separate authorization from authentication: write `hasScope(principal, scope)` as a pure function and a `requireScope('orders:write')` middleware for `DELETE /orders/:orderId` (403 instead of 401).
3. Pin the allowed algorithms (`algorithms: ['RS256']`) in `jwtVerify` and check that rejected tokens are logged with a reason, never with the token itself.

The `todo` tests in `src/app.test.ts` turn green along the way. A possible solution lives in `solution/` (`npm run start:solution`, `npm run test:solution`).
