# Das Aggregat als Konsistenzgrenze

Eine Bestellung hat Regeln: Positionen nur im Status `draft`, `placed` nur mit mindestens einer Position, keine Abkürzung in der Statusfolge `draft → placed → paid → shipped`, Storno nur aus `draft` oder `placed`. Ein Aggregat schützt solche Regeln als Einheit. Von außen ändert niemand ein Feld direkt.

`src/orders.ts` ist ein anämisches Modell: Daten hier, Regeln verstreut in Services. Die Tests in `src/orders.test.ts` zeigen, wie ein zweiter Service die Regeln umgeht, wie eine leere Bestellung bestellt wird und wie ein halber Checkout den Bestand ändert.

Du brauchst Node.js 26 oder neuer.

```bash
npm install
npm start
npm test
npm run typecheck
```

## Übung

1. Lies `src/orders.ts`. Wo stehen die Regeln der Bestellung? Wer kann sie umgehen?
2. Schreib das Aggregat `Order` in `order.ts` als Sammlung reiner Functions: `start`, `addItem`, `place`, `pay`, `ship`, `cancel`. Jede liefert eine neue Order oder wirft.
3. Leite die Gesamtsumme aus den Positionen ab, statt sie zu speichern.
4. Verweise auf andere Aggregate nur per ID: `customerId` statt `Customer`, `productId` statt `Product`.
5. Mach den Bestand zu einem eigenen Aggregat `Product` mit `reserve` und `release`. Warum gehört er nicht in die Bestellung?
6. Schreib ein Repository mit `load` und `save(value, expectedVersion)`. Eine Transaktion ändert genau ein Aggregat: Bestellung platzieren und Bestand reservieren sind zwei Schritte. Ein Test zeigt, dass ein Lost Update jetzt auffällt.

Eine mögliche Lösung liegt in `solution/` (`npm run start:solution`).

Weiter: [Commands, Events und Queries](../commands-events-queries/README.md)
