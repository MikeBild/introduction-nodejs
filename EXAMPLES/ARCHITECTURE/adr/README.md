# Architecture Decision Records

Der Code zeigt, was gebaut wurde. Ein ADR hält fest, warum. Es ist kurz, liegt nummeriert neben dem Code und wird im Pull Request reviewt.

Ein akzeptiertes ADR änderst du nie. Entscheidet dein Team neu, schreibst du ein neues ADR und setzt das alte auf `Superseded`.

```
docs/adr/
  0000-template.md                                       # Vorlage zum Kopieren
  0001-crud-mit-postgresql-fuer-den-bestell-context.md   # Superseded by 0002
  0002-event-sourcing-nur-fuer-orders.md                 # Accepted, löst 0001 ab
src/
  check-adr.ts                                           # Prüfregeln für Aufbau und Status
  draft/0003-projektionen.md                             # Entwurf, der noch kein ADR ist
```

Die Beispiele gehören zur Übung [Event Sourcing und CQRS](../event-sourcing/README.md): 0001 beschreibt den CRUD-Stand aus `src/`, 0002 die Entscheidung für `solution/`.

Du brauchst Node.js 26 oder neuer.

```bash
npm install
npm start            # prüft docs/adr
npm start -- <pfad>  # prüft die ADRs in einem anderen Ordner, zum Beispiel in deinem Repo
npm test
npm run typecheck
```

## Aufbau

- Titel: die Entscheidung, nicht das Thema
- Date: wann entschieden wurde
- Status: Proposed, Accepted, Deprecated oder Superseded by …
- Context: Last, Team und Zwänge zum Zeitpunkt der Entscheidung
- Decision: ein Satz mit „Wir werden …“
- Consequences: gut, schlecht und wann du neu entscheidest

## Übung

1. Lies 0001 und 0002. Was hat sich im Kontext geändert, dass 0001 nicht mehr gilt? Warum steht 0001 noch im Repo?
2. Lies den Entwurf `src/draft/0003-projektionen.md` und die Befunde in `src/adr.test.ts`. Schreib daraus ein vollständiges ADR 0003: Was war die Lage, was hast du verworfen, was kostet die Entscheidung?
3. Such dir eine offene Architekturentscheidung in deinem Team. Lohnt sich ein ADR? Ja, wenn sie schwer umkehrbar ist, mehrere Teams betrifft oder eine naheliegende Alternative verwirft.
4. Kopier `0000-template.md` als nächste Nummer nach `docs/adr/` in deinem Repo und füll es aus. Nenn auch die schlechten Konsequenzen und die Bedingung, unter der du neu entscheidest. Prüf es mit `npm start -- <pfad>`.
5. Öffne einen Pull Request und lass das ADR reviewen. Mit dem Merge wird es `Accepted`.

Eine mögliche Lösung für ADR 0003 liegt in `solution/` (`npm run start:solution`).

Weiter: [Wann CQRS und Event Sourcing zu viel sind](../when-too-much/README.md)
