*English · [Deutsch](README.de.md)*

# Bounded Contexts and Anti-Corruption Layer

In the workshop shop everything is called “product”, but not everywhere with the same meaning. For sales, a product has a name and a price and is either purchasable or not. For the warehouse, it is a SKU with stock and reservations. Where a word changes its meaning, a boundary runs: a Bounded Context.

`src/inventory.ts` is the older warehouse system with its own language (`sku`, `price_eur` as text, `qty_on_hand`). `src/sales.ts` is sales and today speaks the language of the warehouse directly. The tests in `src/sales.test.ts` show the consequences: money as a decimal, a fully reserved product counts as available, and a rename in the warehouse breaks sales.

You need Node.js 26 or newer.

```bash
npm install
npm start
npm test
npm run typecheck
```

## Exercise

1. Read `src/sales.ts`. Which fields of the warehouse does sales know? What happens when the warehouse renames `price_eur`?
2. Describe the product the way sales needs it: `Product { id, name, priceCents, available }`. Create a port `Catalog` that returns a product by ID.
3. Write an Anti-Corruption Layer (ACL) in `inventory-acl.ts`. It is the only place that knows both languages: “19,99” becomes 1999 cents, and available is only what is left after reservations.
4. Rebuild sales so that it only knows `Catalog`. A test with a fixed catalog and no warehouse proves it.
5. Record the Context Map as code: Who is upstream, who is downstream, who translates? Check by test that no context adopts the model of the older system unfiltered.
6. Consider: Which context in your project is Core Domain, which is Supporting, which is Generic? Where is an ACL worth it, where is Conformist enough?

One possible solution is in `solution/` (`npm run start:solution`).

Next: [Entities and Value Objects](../value-objects/README.md)
