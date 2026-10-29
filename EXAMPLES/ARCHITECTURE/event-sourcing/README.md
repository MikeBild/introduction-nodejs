# Event Sourcing und CQRS

`src/orders.ts` ist ein klassischer CRUD-Service für Bestellungen: Jede Änderung liest die Zeile, ändert sie und überschreibt sie. Das reicht oft. Die Tests in `src/orders.test.ts` zeigen aber zwei Schwächen. Zwei gleichzeitige Requests verlieren ein Update. Und nach dem Versand weiß niemand mehr, wann was passiert ist.

Du baust denselben Bestell-Context mit Event Sourcing nach. Der Zustand entsteht dann aus Events, Konflikte fallen per Versionsprüfung auf, und Read Models sind wegwerfbare Projektionen.

Du brauchst Node.js >= 26.

```bash
npm install
npm start            # CRUD: zwei Artikel hinzugefügt, einer bleibt übrig
npm test             # Tests für src/ und solution/
npm run typecheck
```

Zielstruktur:

```
solution/
  order.ts         # Aggregat: OrderEvent, Order, initial, evolve, place, addItem, ship
  event-store.ts   # EventStore mit load/append(expectedVersion), ConcurrencyError, inMemoryEventStore
  commands.ts      # Command Handler: laden, falten, entscheiden, anhängen
  projections.ts   # Read Models: Bestellliste und Umsatz pro Monat
  main.ts          # kleines Demo-Skript
```

## Übung

1. Lies `src/orders.test.ts`. Warum geht beim gleichzeitigen `addItem` ein Artikel verloren? Was fehlt dir, um den Monatsumsatz für Oktober nachträglich zu berechnen?
2. Modelliere drei Events in der Vergangenheitsform: `OrderPlaced`, `ItemAdded`, `OrderShipped`. Schreib `evolve(order, event)` und leite den Zustand als Left Fold ab: `events.reduce(evolve, initial)`.
3. Schreib die Entscheidungen `place`, `addItem` und `ship`. Sie prüfen die Invarianten und liefern neue Events. Versand vor der Platzierung und Artikel nach dem Versand lehnen sie ab.
4. Baue `inMemoryEventStore()` mit `load(id)` → `{ events, version }` und `append(id, expectedVersion, events)`. Passt die Version nicht, wirft `append` einen `ConcurrencyError`. Gib beim Laden Kopien zurück, damit niemand gespeicherte Events ändert.
5. Verbinde alles in den Commands `placeOrder`, `addItem` und `shipOrder`: laden, falten, entscheiden, mit erwarteter Version anhängen. Wiederhole den Test mit zwei gleichzeitigen `addItem`: Jetzt scheitert der zweite, statt still zu überschreiben.
6. Gib jedem gespeicherten Event eine globale Position und baue zwei Projektionen: eine Bestellliste und den Umsatz pro Monat. Mach sie idempotent: Ein doppelt zugestelltes Event zählt nur einmal. Beweis per Test, dass ein Neuaufbau aus allen Events dasselbe Read Model ergibt.
7. Überleg: Braucht dein eigener Bounded Context die Historie fachlich, oder reicht CRUD? Halte die Antwort als ADR fest, siehe [../adr](../adr/README.md).

Eine mögliche Lösung liegt in `solution/` (`npm run start:solution`).
