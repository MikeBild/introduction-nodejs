# Entitäten und Value Objects

Eine Kundin bleibt dieselbe Kundin, auch wenn sie ihre E-Mail-Adresse ändert: Sie ist eine Entität mit Identität. Zwei Positionen „2 × Hammer zu 12,90 €“ sind dagegen gleich, wenn ihre Werte gleich sind: Sie sind Value Objects.

`src/order-line.ts` baut Positionen aus `string` und `number`. Die Tests in `src/order-line.test.ts` zeigen, was dabei durchrutscht: Menge null, Preise als Kommazahl, vertauschte IDs, nachträglich geänderte Positionen.

Du brauchst Node.js >= 26.

```bash
npm install
npm start
npm test
npm run typecheck
```

## Übung

1. Lies die Tests in `src/order-line.test.ts`. Welche Fehler könnte der Compiler finden, welche nur eine Prüfung zur Laufzeit?
2. Leg Branded Types für `CustomerId` und `ProductId` an. Ein Test mit `@ts-expect-error` beweist, dass vertauschte IDs nicht mehr kompilieren.
3. Schreib Smart Constructors für `Cents` (ganze Zahl, nicht negativ) und `Quantity` (ganze Zahl ab eins). Sie prüfen einmal, danach garantiert der Type die Regel.
4. Bau `OrderItem` als eingefrorenes Value Object aus diesen Werten. Ändern heißt neu erzeugen: `withQuantity(item, 3)`.
5. Vergleiche Value Objects über ihre Werte (`sameItem`) und Entitäten über ihre ID (`sameCustomer`).
6. Überleg: Welche `string`- und `number`-Felder in eurem Code tragen eine fachliche Regel und verdienen einen eigenen Type?

Eine mögliche Lösung liegt in `solution/` (`npm run start:solution`).

Weiter: [Das Aggregat als Konsistenzgrenze](../aggregate/README.md)
