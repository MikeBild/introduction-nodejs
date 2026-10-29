# Bounded Contexts und Anti-Corruption Layer

Im Werkstatt-Shop heißt alles „Produkt“, aber nicht überall dasselbe. Für den Verkauf hat ein Produkt einen Namen, einen Preis und ist kaufbar oder nicht. Für das Lager ist es eine SKU mit Bestand und Reservierungen. Wo ein Wort seine Bedeutung wechselt, verläuft eine Grenze: ein Bounded Context.

`src/inventory.ts` ist das ältere Lagersystem mit eigener Sprache (`sku`, `price_eur` als Text, `qty_on_hand`). `src/sales.ts` ist der Verkauf und spricht heute direkt die Sprache des Lagers. Die Tests in `src/sales.test.ts` zeigen die Folgen: Geld als Kommazahl, ein voll reserviertes Produkt gilt als verfügbar, und eine Umbenennung im Lager bricht den Verkauf.

Du brauchst Node.js >= 26.

```bash
npm install
npm start
npm test
npm run typecheck
```

## Übung

1. Lies `src/sales.ts`. Welche Felder des Lagers kennt der Verkauf? Was passiert, wenn das Lager `price_eur` umbenennt?
2. Beschreib das Produkt so, wie der Verkauf es braucht: `Product { id, name, priceCents, available }`. Leg einen Port `Catalog` an, der ein Produkt per ID liefert.
3. Schreib einen Anti-Corruption Layer (ACL) in `inventory-acl.ts`. Er ist die einzige Stelle, die beide Sprachen kennt: „19,99“ wird zu 1999 Cent, verfügbar ist nur, was nach Reservierungen übrig bleibt.
4. Bau den Verkauf so um, dass er nur noch `Catalog` kennt. Ein Test mit einem festen Katalog ohne Lager beweist das.
5. Halte die Context Map als Code fest: Wer ist upstream, wer downstream, wer übersetzt? Prüf per Test, dass kein Context das Modell des Altsystems ungefiltert übernimmt.
6. Überleg: Welcher Context ist bei euch Core Domain, welcher Supporting, welcher Generic? Wo lohnt sich ein ACL, wo reicht Conformist?

Eine mögliche Lösung liegt in `solution/` (`npm run start:solution`).

Weiter: [Entitäten und Value Objects](../value-objects/README.md)
