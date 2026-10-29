# Event-Versionierung mit Upcasting

Gespeicherte Events änderst du nie. Das Schema deines Codes ändert sich trotzdem. Upcasting hebt alte Events beim Lesen ins aktuelle Schema, Schritt für Schritt, und lässt das Logbuch unverändert.

`src/events.ts` enthält ein Logbuch aus drei Jahren: 2023 standen Preise in Euro als Kommazahl (`price`) und der Zeitpunkt der Bestellung in `at`, seit 2025 gelten `priceCents` und `placedAt`. Heute liest jeder die Daten so, als wären sie im aktuellen Schema. Die Tests in `src/events.test.ts` zeigen das Ergebnis: Die Summe wird `NaN`, der Zeitpunkt fehlt.

Du brauchst Node.js >= 26.

```bash
npm install
npm start
npm test
npm run typecheck
```

## Übung

1. Lies `src/events.ts`. Jedes Event steckt in einem Umschlag `{ type, version, data }`. Warum braucht es die Version?
2. Leg in `upcast.ts` die aktuelle Version je Event-Type fest und je Type und Version genau einen Upcaster zur nächsten Version.
3. Schreib `upcast(envelope)`: Er wendet die Upcaster nacheinander an, bis die aktuelle Version erreicht ist. `evolve` kennt danach nur noch das aktuelle Schema.
4. Lehne Events ab, die neuer sind als dein Code oder deren Type du nicht kennst, statt zu raten.
5. Beweis per Test, dass das Logbuch nach dem Lesen unverändert ist.
6. Schreib neue Events immer im aktuellen Schema (`toEnvelope`).
7. Überleg: Wann reicht ein neues, optionales Feld? Wann brauchst du einen neuen Event-Type statt einer neuen Version?

Eine mögliche Lösung liegt in `solution/` (`npm run start:solution`).

Weiter: [Konsistenz, Idempotenz und Outbox](../consistency-outbox/README.md)
