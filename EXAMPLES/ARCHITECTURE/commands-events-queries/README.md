# Commands, Events und Queries

Ein Command ist ein Wunsch und darf abgelehnt werden: `PlaceOrder`. Ein Event ist eine Tatsache, die schon passiert ist: `OrderPlaced`. Eine Query ist eine Frage ohne Side Effect: `ListOpenOrders`.

`src/orders.ts` kennt nur `saveOrder`, `updateOrder` und `getOrder`. Die Tests in `src/orders.test.ts` zeigen die Folgen: Eine leere Bestellung lässt sich auf `shipped` setzen, niemand sieht, was jemand wollte, und schon das Lesen ändert den Zustand.

Du brauchst Node.js 26 oder neuer.

```bash
npm install
npm start
npm test
npm run typecheck
```

## Übung

1. Lies `src/orders.ts`. Was alles kann `updateOrder` bedeuten?
2. Modelliere die Nachrichten als Discriminated Unions in `messages.ts`: Commands im Imperativ (`CreateOrder`, `AddItem`, `PlaceOrder`, `PayOrder`, `ShipOrder`, `CancelOrder`), Events in der Vergangenheitsform, zwei Queries.
3. Schreib `decide(order, command)`: Er prüft die Regeln und liefert neue Events oder wirft. Kein Event ohne bestandene Prüfung.
4. Schreib `evolve(order, event)`: Er wendet ein Event auf den Zustand an, ohne zu prüfen. Das Event ist schon passiert.
5. Bau eine kleine App mit `send(command)`, `ask(query)` und `subscribe(listener)`. Ein Command liefert keine Daten zurück, eine Query ändert nichts.
6. Beweis per Test, dass sich der Zustand allein aus den Events ergibt: `events.reduce(evolve, initial)`. Genau darauf baut Event Sourcing auf.

Eine mögliche Lösung liegt in `solution/` (`npm run start:solution`).

Weiter: [CQRS](../cqrs/README.md)
