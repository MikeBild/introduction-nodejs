# Persistenter Checkout im modularen Monolithen

Ein Node-Prozess betreibt GraphQL und Worker. PostgreSQL hält Prozesszustand, Arbeitsaufträge und idempotente Teilnehmerergebnisse. Bestellt wird genau ein Bremsenteil; der Zahlungsanbieter ist simuliert. Keine echten Zahlungen oder E-Mails.

## Start

Node 26, npm 12 und Docker verwenden:

```sh
npm ci
npm run db:up
npm test
npm run typecheck
npm run start:solution
```

Die Datenbank läuft ausschließlich lokal auf Port 55439. `npm run db:down` entfernt den Übungscontainer. Tests leeren ausschließlich diese Übungsdatenbank; DATABASE_URL niemals auf eine fremde oder produktive Datenbank setzen.

```sh
curl http://127.0.0.1:4300/graphql -H 'content-type: application/json' -d '{"query":"mutation { startCheckout(input:{idempotencyKey:\"demo-1\",mode:MANUAL}) { id status } }"}'
```

Mit der zurückgegebenen ID `checkout(id:...)` abfragen und `approveCheckout(id:...)` oder `cancelCheckout(id:...)` aufrufen. AUTOMATIC benötigt keine Freigabe. Wiederholtes Starten mit demselben Schlüssel liefert denselben Prozess; andere Eingaben bei gleichem Schlüssel werden abgelehnt. Die API ist eine lokale Einzelbenutzer-Demo ohne Authentifizierung. In einer Anwendung müssen Zugriffe autorisiert und Schlüssel pro Benutzer/Mandant begrenzt werden.

## Aufgaben

1. **Ownership:** Zeichne Ordering mit Process Manager, Inventory und Payment. Ordne Bestand, Prozessfortschritt und Bestellstatus getrennt zu. Der Process Manager entscheidet über Reihenfolge und Fristen; Teilnehmer über lokale Invarianten.
2. **Kompensation:** Ergänze in `src/process.ts` die beiden TODOs. Ein Abbruch während ReserveStock oder AuthorizePayment merkt die Absicht, wartet aber auf deren Ergebnis. Erfolgreiche späte Autorisierung führt zu VoidAuthorization. Erst ReleaseReservation und CancelOrder abschließen, dann CANCELLED melden. Vergleiche anschließend mit `solution/process.ts` und übertrage die fachlichen Tests auf deine Funktion.
3. **Persistenz:** Verfolge `enqueue`, `claim`, `finish` und `execute`. Erkläre den Absturz zwischen Teilnehmer-Commit und `finish`. Die Tests führen genau diesen Abbruch aus. Entferne versuchsweise den Receipt-Schutz und beobachte die Folgen. Stelle ihn wieder her.
4. **Freigabe/API:** Starte MANUAL, lasse die Reservierung verfallen und bestätige danach. Inventory muss eine neue Reservierung erwerben und kann sie ablehnen. Entwirf im React-Client die Anzeige für alle Statuswerte. Starte den ursprünglichen Request bei einem Timeout mit demselben Schlüssel erneut.

`npm start` nutzt die unvollständige Übungsfunktion; die Infrastruktur wird aus `solution/` bereitgestellt. Der Einstieg ist absichtlich kein vollständiger zweiter Server. Der Starter-Test weist die TODOs explizit nach; die Integrationstests prüfen die Musterlösung.

## React-Anbindung (Integrationsskizze)

```tsx
const { data, error, startPolling, stopPolling } = useQuery(CHECKOUT, {
  variables: { id: processId },
});
useEffect(() => {
  const state = data?.checkout.status;
  if (state === 'CONFIRMED' || state === 'CANCELLED') stopPolling();
  else startPolling(1000);
  return stopPolling;
}, [data?.checkout.status, startPolling, stopPolling]);
// Fehler bedeutet: Status nicht lesbar, nicht: Bestellung abgelehnt.
// AWAITING_APPROVAL: explizite Freigabe/Abbruch anbieten.
// COMPENSATING: Rückabwicklung läuft; NEEDS_ATTENTION: Klärung erforderlich.
```

Diese Skizze setzt Apollo und vorhandene GraphQL-Dokumente im Frontend voraus; das ausführbare Projekt enthält Backend und Tests. Oberflächen bleiben im Design des jeweiligen Produkts.

## Garantien und Grenzen

- Prozesszustand und nächste Arbeitsaufträge werden atomar geschrieben. Hier ist `jobs` eine datenbankgestützte Command-Outbox; es gibt keinen Broker.
- Teilnehmeränderung und Receipt sind atomar. Ein erneut aufgerufener Command liefert das gespeicherte Ergebnis. Für einen echten Zahlungsanbieter braucht der Adapter dessen Idempotenzschlüssel und Ergebnisabfrage.
- Ein Timeout ist ein unbekanntes Ergebnis, keine Zahlungsablehnung. Technische Fehler werden mit demselben Command-Schlüssel wiederholt. Nach fünf Fehlern bleibt der Prozess mit NEEDS_ATTENTION sichtbar. `resume(id)` ist eine interne Operatorfunktion nach Klärung der Ursache.
- Lease und Token verhindern, dass ein alter Worker den Fortschritt eines neuen überschreibt. Sie verhindern keine doppelte externe Ausführung; dafür dient der Receipt-/Provider-Schutz.
- Inventory gibt abgelaufene Reservierungen periodisch frei. Manuelle Freigabe erwirbt immer eine frische Reservierung. CommitStock prüft die Frist nochmals unter derselben Inventory-Sperre.
- CommitStock ist der Pivot. Nach dessen Beauftragung wird sein Ergebnis geklärt und bei Erfolg die Bestellung bestätigt. Ab dann braucht ein Abbruch einen separaten Stornierungsprozess. ConfirmOrder wird wiederholt, niemals durch blindes Freigeben bereits übernommenen Bestands ersetzt.
- Autorisierung ist kein Einzug. Capture/Refund und Versand sind bewusst nicht implementiert. Die Lektion erklärt ihre zusätzlichen Kompensationen.
- Tabellen teilen sich für die Demo eine Datenbank, Transaktionen laufen trotzdem je Teilnehmer und Prozessschritt. Das erlaubt klare Crash-Tests ohne verteilte Datenbanken. Nachrichtenbasierte Adapter müssten Teilnehmerergebnis und ausgehendes Event ebenfalls atomar speichern.
- Eingangs- und Abschluss-E-Mail sind unterschiedliche Benachrichtigungen. Ein Versandadapter wird hier nicht betrieben. Für echte Benachrichtigungen nach bestätigtem Status einen deduplizierten Outbox-Auftrag anlegen.
