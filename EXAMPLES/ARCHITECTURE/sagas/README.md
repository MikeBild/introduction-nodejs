# Sagas und Prozessmanager

Eine Bestellung läuft durch drei Contexts: Lager, Zahlung, Versand. Eine Transaktion über alle drei gibt es nicht. Ein Prozessmanager reagiert auf Events, merkt sich den Schritt und schickt den nächsten Command. Scheitert ein Schritt, gleicht er Erledigtes mit neuen Commands aus: Kompensation.

`src/checkout.ts` verdrahtet den Ablauf fest: reservieren, abbuchen, versenden. Die Tests in `src/checkout.test.ts` zeigen, was bei einer abgelehnten Zahlung passiert: Der Bestand bleibt reserviert, die Bestellung bleibt offen.

Du brauchst Node.js >= 26.

```bash
npm install
npm start
npm test
npm run typecheck
```

## Übung

1. Lies `src/checkout.ts`. Welche Schritte müsste jemand nach einer abgelehnten Zahlung von Hand rückgängig machen?
2. Modelliere in `checkout-process.ts` die Events, auf die der Prozess reagiert, und die Commands, die er schickt.
3. Schreib `react(state, event)` als reine Function: Sie liefert den neuen Schritt und die Commands. Sie entscheidet nichts über Bestand oder Zahlung, das bleibt in den Aggregaten.
4. Kompensiere eine gescheiterte Zahlung mit `ReleaseStock` und `CancelOrder`. Fehlt der Bestand, storniere ohne Zahlung.
5. Ignoriere Events, die doppelt oder zu spät kommen. Ein Test liefert `StockReserved` zweimal.
6. Überleg: Wo würdest du den Zustand des Prozesses speichern? Was passiert, wenn die Zahlung nie antwortet? Wie sähe derselbe Ablauf in AWS Step Functions aus?

Eine mögliche Lösung liegt in `solution/` (`npm run start:solution`).
