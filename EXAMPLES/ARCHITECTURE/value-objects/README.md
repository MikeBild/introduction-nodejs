*English · [Deutsch](README.de.md)*

# Entities and Value Objects

A customer remains the same customer even when they change their email address: they are an entity with identity. Two line items “2 × hammer at €12.90”, on the other hand, are equal when their values are equal: they are Value Objects.

`src/order-line.ts` builds line items from `string` and `number`. The tests in `src/order-line.test.ts` show what slips through: quantity zero, prices as decimals, swapped IDs, line items changed after the fact.

You need Node.js 26 or newer.

```bash
npm install
npm start
npm test
npm run typecheck
```

## Exercise

1. Read the tests in `src/order-line.test.ts`. Which errors could the compiler find, which only a check at runtime?
2. Create Branded Types for `CustomerId` and `ProductId`. A test with `@ts-expect-error` proves that swapped IDs no longer compile.
3. Write smart constructors for `Cents` (integer, not negative) and `Quantity` (integer from one). They check once; after that, the type guarantees the rule.
4. Build `OrderItem` as a frozen Value Object from these values. Changing means creating anew: `withQuantity(item, 3)`.
5. Compare Value Objects by their values (`sameItem`) and entities by their ID (`sameCustomer`).
6. Consider: Which `string` and `number` fields in your code carry a domain rule and deserve their own type?

One possible solution is in `solution/` (`npm run start:solution`).

Next: [The aggregate as consistency boundary](../aggregate/README.md)
