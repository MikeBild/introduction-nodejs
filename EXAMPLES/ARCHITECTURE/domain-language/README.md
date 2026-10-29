# Fachsprache und Event Storming

Das durchgehende Beispiel ist der Werkstatt-Shop: Kundinnen bestellen Werkzeug, das Lager reserviert den Bestand, der Versand schickt die Pakete. Bevor du Code schreibst, klärst du mit den Fachleuten, was in diesem Ablauf passiert und wie sie es nennen.

`src/board.ts` hält ein Event-Storming-Board als Code fest: Domain Events (orange), Commands (blau) mit Actor, Policies (lila) und Hotspots (rot). Der erste Stand stammt aus dem Code und nicht aus dem Gespräch: `SaveOrder`, `OrderUpdated`, ein Glossar mit Tabellennamen. `src/lint.ts` prüft das Board auf technische Namen, lose Enden und fehlende Begriffe.

Du brauchst Node.js >= 26.

```bash
npm install
npm start            # Befunde für das erste Board
npm test             # Tests für src/ und solution/
npm run typecheck
```

## Übung

1. Lies `src/board.ts` und führ `npm start` aus. Welche Befunde zeigen, dass hier jemand in Tabellen denkt statt in Abläufen?
2. Erzähl den Ablauf einer Bestellung als Folge von Domain Events in der Vergangenheitsform: Was ist passiert, von der ersten Position bis zum Versand?
3. Ergänze vor jedes Event den Command, der es auslöst, und den Actor: Kundin, Lager, Zahlungsanbieter oder Versand.
4. Verbinde Events und Folge-Commands mit Policies: „Immer wenn `OrderPaid`, dann `ShipOrder`.“
5. Halte offene Fragen als Hotspot fest, statt sie zu raten. Beispiel: Was passiert, wenn der Bestand nach dem Bezahlen fehlt?
6. Erklär jeden Begriff im Glossar so, wie ihn der Verkauf erklären würde. „Datensatz“ und „Tabelle“ gehören nicht hinein.
7. Bring `lint` auf null Befunde. Die Tests in `solution/board.test.ts` prüfen das.

Eine mögliche Lösung liegt in `solution/` (`npm run start:solution`).

Weiter: [Bounded Contexts](../bounded-contexts/README.md)
