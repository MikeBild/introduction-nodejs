# Konsistenz, Idempotenz und Outbox

Zwischen Schreiben und Lesen liegt ein Verzug, und jeder Bus liefert mindestens einmal, manchmal doppelt. Mit Event Sourcing hast du die Outbox schon: Der Event Store ist sie. Ein Relay veröffentlicht ab seinem Checkpoint, Consumer erkennen Duplikate, und eine Query wartet auf die Position, die der Command geschrieben hat.

`src/` enthält den Event Store aus der Übung [Event Sourcing](../event-sourcing/README.md). Hier liefert `append` zusätzlich die letzte globale Position. `src/shop.ts` speichert die Zahlung und veröffentlicht sie danach direkt: ein Dual Write. Die Tests in `src/shop.test.ts` zeigen, wie ein Netzwerkfehler das Event verliert und wie eine doppelte Zustellung zwei Pakete packt.

Du brauchst Node.js 26 oder neuer.

```bash
npm install
npm start
npm test
npm run typecheck
```

## Übung

1. Lies `src/shop.ts`. Was passiert, wenn `bus.publish` scheitert, nachdem `payOrder` gespeichert hat?
2. Schreib einen Relay in `relay.ts`: Er liest ab seinem Checkpoint aus dem Event Store, veröffentlicht und rückt den Checkpoint erst nach dem Publish vor. Der Command veröffentlicht nichts mehr selbst.
3. Beweis per Test: Nach einem Netzwerkfehler holt der nächste Lauf das Event nach.
4. Mach den Versand idempotent (`consumer.ts`): Stream und Version sind der Schlüssel. Ein Neustart des Relays ohne Checkpoint packt trotzdem nur ein Paket.
5. Bau ein Read Model „Status je Bestellung“, das hinter dem Store herläuft. Zeig per Test den veralteten Stand direkt nach dem Command.
6. Schreib `readAfter`: Die Query wartet, bis das Read Model die Position kennt, die der Command geliefert hat (Read-your-writes).
7. Vergleiche mit der Lektion zu Node.js und Outbox: Was brauchst du dort zusätzlich, weil der Zustand in Tabellen liegt?

Eine mögliche Lösung liegt in `solution/` (`npm run start:solution`).

Weiter: [ADR](../adr/README.md)
