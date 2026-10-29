# Projektionen: Checkpoint, Neuaufbau und Snapshots

Ein Read Model ist eine Projektion, also ein Fold über die Events mit einem eigenen Ziel. Es merkt sich, bis zu welcher Position es gelesen hat, und lässt sich jederzeit aus dem Event Store neu aufbauen.

`src/` enthält den Event Store und das Aggregat Order aus der Übung [Event Sourcing](../event-sourcing/README.md), dazu eine Projektion in `src/read-models.ts`, die zu viel tut: Sie zählt doppelt zugestellte Events doppelt und verschickt nebenbei Mails. Beim Neuaufbau gehen alle Mails noch einmal raus. Die Tests in `src/read-models.test.ts` zeigen das.

Du brauchst Node.js 26 oder neuer.

```bash
npm install
npm start            # Mails beim Aufbau und beim Neuaufbau
npm test
npm run typecheck
```

## Übung

1. Lies `src/read-models.ts`. Was passiert, wenn der Bus ein Event zweimal liefert? Was beim Neuaufbau?
2. Schreib in `projection.ts` einen generischen Typ `Projection<S>` mit `initial` und `apply` und einen Zustand mit Checkpoint `{ state, position }`.
3. Schreib `step`: Ein Event mit einer Position bis zum Checkpoint ändert nichts. So wird jede Projektion idempotent.
4. Schreib `catchUp` (weiterlesen ab dem Checkpoint) und `rebuild` (dieselbe Function ab Position null). Ein Test beweist: Weiterlesen und Neuaufbau ergeben dasselbe.
5. Bau ein Read Model, an das beim Bau niemand gedacht hat: Bestseller pro Produkt, aus der ganzen Historie.
6. Zieh die Mails in einen Reactor mit eigenem Checkpoint. Er läuft beim Neuaufbau der Read Models nicht mit.
7. Schreib einen Snapshot als gemerkten Fold `{ version, state }` und lade ab dem Snapshot nur die Events danach. Ein Test vergleicht mit dem vollen Fold.

Eine mögliche Lösung liegt in `solution/` (`npm run start:solution`).

Weiter: [Event-Versionierung](../event-versioning/README.md)
