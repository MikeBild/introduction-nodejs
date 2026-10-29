# Architecture Decision Records

Der Code zeigt, was gebaut wurde. Ein ADR hält fest, warum. Es ist kurz, liegt nummeriert neben dem Code und wird im Pull Request reviewt.

Ein akzeptiertes ADR änderst du nie. Entscheidet ihr neu, schreibst du ein neues ADR und setzt das alte auf `Superseded`.

```
docs/adr/
  0000-template.md                                  # Vorlage zum Kopieren
  0001-crud-mit-postgresql-fuer-den-bestell-context.md   # Superseded by 0002
  0002-event-sourcing-fuer-den-bestell-context.md        # Accepted, löst 0001 ab
```

Die Beispiele gehören zur Übung [Event Sourcing und CQRS](../event-sourcing/README.md): 0001 beschreibt den CRUD-Stand aus `src/`, 0002 die Entscheidung für `solution/`.

## Aufbau

- Titel: die Entscheidung, nicht das Thema
- Date: wann entschieden wurde
- Status: Proposed, Accepted, Deprecated oder Superseded by …
- Context: Last, Team und Zwänge zum Zeitpunkt der Entscheidung
- Decision: ein Satz mit „Wir werden …“
- Consequences: gut, schlecht, und wann ihr neu entscheidet

## Übung

1. Lies 0001 und 0002. Was hat sich im Kontext geändert, dass 0001 nicht mehr gilt? Warum steht 0001 noch im Repo?
2. Such dir eine offene Architekturentscheidung in eurem Team. Lohnt sich ein ADR? Ja, wenn sie schwer umkehrbar ist, mehrere Teams betrifft oder eine naheliegende Alternative verwirft.
3. Kopier `0000-template.md` als nächste Nummer nach `docs/adr/` in eurem Repo und füll es aus. Nenn auch die schlechten Konsequenzen und die Bedingung, unter der ihr neu entscheidet.
4. Öffne einen Pull Request und lass das ADR reviewen. Mit dem Merge wird es `Accepted`.
