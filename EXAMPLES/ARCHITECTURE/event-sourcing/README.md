# Event Sourcing und CQRS

Das durchgehende Beispiel ist der Werkstatt-Shop. Eine Bestellung hat Positionen `{ productId, quantity, priceCents }`, Geld zählt immer in ganzen Cent. Die Statusfolge ist `draft → placed → paid → shipped`, `cancelled` geht nur aus `draft` oder `placed`.

`src/orders.ts` ist ein klassischer CRUD-Service dafür: Jede Änderung liest die Zeile, ändert sie und überschreibt sie. Das reicht oft. Die Tests in `src/orders.test.ts` zeigen aber zwei Schwächen. Zwei gleichzeitige Requests verlieren ein Update. Und später weiß niemand mehr, wann bestellt oder bezahlt wurde.

Du baust das Aggregat Order mit Event Sourcing nach. Der Zustand entsteht dann aus Events, Konflikte fallen per Versionsprüfung auf, und Read Models sind wegwerfbare Projektionen.

Du brauchst Node.js >= 26.

```bash
npm install
npm start            # CRUD: zwei Positionen hinzugefügt, eine bleibt übrig
npm test             # Tests für src/ und solution/
npm run typecheck
```

Zielstruktur:

```
solution/
  order.ts         # Aggregat: Branded IDs, OrderEvent, Order, initial, evolve,
                   # create, addItem, place, pay, ship, cancel, totalCents
  event-store.ts   # EventStore mit load/append(expectedVersion), ConcurrencyError, inMemoryEventStore
  commands.ts      # Command Handler: laden, falten, entscheiden, anhängen
  projections.ts   # Read Models: Bestellliste mit „offenen Bestellungen“, Umsatz pro Monat
  main.ts          # kleines Demo-Skript
```

## Übung

1. Lies `src/orders.test.ts`. Warum geht beim gleichzeitigen `addItem` eine Position verloren? Was fehlt dir, um den Umsatz im Oktober nachträglich zu berechnen?
2. Modelliere die Events in der Vergangenheitsform: `OrderCreated`, `ItemAdded`, `OrderPlaced`, `OrderPaid`, `OrderShipped`, `OrderCancelled`. Schreib `evolve(order, event)` und leite den Zustand als Left Fold ab: `events.reduce(evolve, initial)`.
3. Schreib die Entscheidungen `create`, `addItem`, `place`, `pay`, `ship` und `cancel`. Sie prüfen die Regeln und liefern neue Events:
   - Positionen nur im Status `draft`.
   - `place` nur mit mindestens einer Position.
   - Keine Abkürzung in der Statusfolge.
   - Storno nur aus `draft` oder `placed`.
4. Baue `inMemoryEventStore()` mit `load(id)` → `{ events, version }` und `append(id, expectedVersion, events)`. Passt die Version nicht, wirft `append` einen `ConcurrencyError`. Gib beim Laden Kopien zurück, damit niemand gespeicherte Events ändert.
5. Verbinde alles in Commands wie `placeOrder` und `shipOrder`: laden, falten, entscheiden, mit erwarteter Version anhängen. Wiederhole den Test mit zwei gleichzeitigen `addItem`: Jetzt scheitert der zweite, statt still zu überschreiben.
6. Gib jedem gespeicherten Event eine globale Position und baue zwei Projektionen: eine Bestellliste mit „offenen Bestellungen“ (`placed` oder `paid`) und den Umsatz pro Monat der Bezahlung. Mach sie idempotent: Ein doppelt zugestelltes Event zählt nur einmal. Beweis per Test, dass ein Neuaufbau aus allen Events dasselbe Read Model ergibt.
7. Überleg: „`placed` nur mit ausreichend Bestand“ – warum prüft das Aggregat Order den Bestand nicht selbst? Der Bestand gehört zum Produkt, einem anderen Aggregat. Pro Transaktion änderst du genau ein Aggregat. Wie würdest du Reservierung und Bestellung verbinden?
8. Braucht dein eigener Bounded Context die Historie fachlich, oder reicht CRUD? Halte die Antwort als ADR fest, siehe [../adr](../adr/README.md) und dort ADR 0002 „Event Sourcing nur für Orders“.

Eine mögliche Lösung liegt in `solution/` (`npm run start:solution`).
