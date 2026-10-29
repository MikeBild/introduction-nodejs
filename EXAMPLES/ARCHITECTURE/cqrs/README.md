# CQRS: Write Model und Read Model auf einem Store

Command Query Responsibility Segregation, kurz CQRS, trennt das Modell zum Schreiben vom Modell zum Lesen. Das ist eine fachliche Grenze, kein Framework, und braucht keine zweite Datenbank.

`src/orders.ts` nutzt ein Modell für alles. Die Übersicht „offene Bestellungen“ lädt jedes Aggregat und jeden Kunden einzeln, und weil die Oberfläche den Kundennamen braucht, steht er jetzt auch in der Bestellung. Die Tests in `src/orders.test.ts` zeigen das.

Du brauchst Node.js 26 oder neuer.

```bash
npm install
npm start
npm test
npm run typecheck
```

## Übung

1. Lies `src/orders.ts`. Welche Felder braucht die Regel „nur mit Positionen bestellen“, welche nur die Anzeige?
2. Leg in `store.ts` einen Store mit drei Tabellen an: `orders` und `customers` fürs Schreiben, `openOrders` als Sicht fürs Lesen. `transaction` gilt ganz oder gar nicht.
3. Schreib die Schreibseite in `write.ts`: `placeOrder`, `payOrder`, `shipOrder`. Sie prüfen die Regeln, geben nichts zurück und halten `openOrders` in derselben Transaktion aktuell.
4. Schreib die Leseseite in `read.ts`: `listOpenOrders` liefert flache Zeilen genau in der Form der Übersicht, ohne Aggregat und ohne Regel.
5. Beweis per Test: Ein abgelehnter Command ändert weder Write Model noch Sicht, und zweimal fragen ergibt zweimal dieselbe Antwort.
6. Überleg: Wann würdest du die Sicht asynchron und in einem zweiten Store pflegen? Was kostet dich das?

Eine mögliche Lösung liegt in `solution/` (`npm run start:solution`).

Weiter: [Event Sourcing](../event-sourcing/README.md)
