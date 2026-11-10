*English · [Deutsch](README.de.md)*

# Persistent checkout in a modular monolith

One Node process runs GraphQL and the workers. PostgreSQL holds process state, work orders, and idempotent participant results. Exactly one brake part is ordered; the payment provider is simulated. No real payments or emails.

## Start

Use Node 26, npm 12, and Docker:

```sh
npm ci
npm run db:up
npm test
npm run typecheck
npm run start:solution
```

The database runs locally only, on port 55439. `npm run db:down` removes the exercise container. The tests empty only this exercise database; never point DATABASE_URL at a foreign or production database.

```sh
curl http://127.0.0.1:4300/graphql -H 'content-type: application/json' -d '{"query":"mutation { startCheckout(input:{idempotencyKey:\"demo-1\",mode:MANUAL}) { id status } }"}'
```

With the returned ID, query `checkout(id:...)` and call `approveCheckout(id:...)` or `cancelCheckout(id:...)`. AUTOMATIC needs no approval. Starting again with the same key returns the same process; different input with the same key is rejected. The API is a local single-user demo without authentication. In an application, access must be authorized and keys limited per user/tenant.

## Tasks

1. **Ownership:** Draw Ordering with Process Manager, Inventory, and Payment. Assign stock, process progress, and order status separately. The Process Manager decides on sequence and deadlines; participants decide on local invariants.
2. **Compensation:** Complete the two TODOs in `src/process.ts`. A cancellation during ReserveStock or AuthorizePayment records the intent but waits for their result. A successful late authorization leads to VoidAuthorization. Complete ReleaseReservation and CancelOrder first, then report CANCELLED. Afterwards compare with `solution/process.ts` and transfer the domain tests to your function.
3. **Persistence:** Follow `enqueue`, `claim`, `finish`, and `execute`. Explain the crash between participant commit and `finish`. The tests run exactly this abort. As an experiment, remove the receipt protection and observe the consequences. Restore it.
4. **Approval/API:** Start MANUAL, let the reservation expire, and approve afterwards. Inventory must acquire a new reservation and may reject it. Design the display for all status values in the React client. On a timeout, start the original request again with the same key.

`npm start` uses the incomplete exercise function; the infrastructure is provided from `solution/`. The starting point is deliberately not a complete second server. The starter test explicitly demonstrates the TODOs; the integration tests check the reference solution.

## React integration (sketch)

```tsx
const { data, error, startPolling, stopPolling } = useQuery(CHECKOUT, {
  variables: { id: processId },
});
useEffect(() => {
  const state = data?.checkout.status;
  if (state === 'CONFIRMED' || state === 'CANCELLED') stopPolling();
  else startPolling(1000);
  return stopPolling;
}, [data?.checkout.status, startPolling, stopPolling]);
// An error means: status not readable, not: order rejected.
// AWAITING_APPROVAL: offer explicit approval/cancellation.
// COMPENSATING: rollback in progress; NEEDS_ATTENTION: clarification required.
```

This sketch assumes Apollo and existing GraphQL documents in the frontend; the runnable project contains the backend and the tests. User interfaces stay in the design of the respective product.

## Guarantees and limits

- Process state and the next work orders are written atomically. Here `jobs` is a database-backed command outbox; there is no broker.
- Participant change and receipt are atomic. A command called again returns the stored result. For a real payment provider, the adapter needs its idempotency key and result query.
- A timeout is an unknown result, not a payment rejection. Technical errors are retried with the same command key. After five errors, the process stays visible with NEEDS_ATTENTION. `resume(id)` is an internal operator function for after the cause has been clarified.
- Lease and token prevent an old worker from overwriting the progress of a new one. They do not prevent duplicate external execution; that is what the receipt/provider protection is for.
- Inventory releases expired reservations periodically. Manual approval always acquires a fresh reservation. CommitStock checks the deadline again under the same Inventory lock.
- CommitStock is the pivot. Once it has been commissioned, its result is clarified and, on success, the order is confirmed. From then on, a cancellation needs a separate cancellation process. ConfirmOrder is retried, never replaced by blindly releasing stock that has already been committed.
- Authorization is not a capture. Capture/refund and shipping are deliberately not implemented. The lesson explains their additional compensations.
- For the demo, the tables share one database; transactions still run per participant and process step. That allows clear crash tests without distributed databases. Message-based adapters would also have to store the participant result and the outgoing event atomically.
- The initial and the final email are different notifications. No delivery adapter is operated here. For real notifications after a confirmed status, create a deduplicated outbox job.
