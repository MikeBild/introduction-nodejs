# 1. CRUD mit PostgreSQL für den Bestell-Context

Date: 2025-03-12

## Status

Superseded by [2. Event Sourcing für den Bestell-Context](0002-event-sourcing-fuer-den-bestell-context.md)

## Context

Der Shop startet mit einem kleinen Team von drei Personen. Bestellungen werden angelegt, um Artikel ergänzt und versendet. Fachlich zählt nur der aktuelle Stand. Das Team betreibt PostgreSQL seit Jahren. Erwartet sind wenige hundert Bestellungen pro Tag, gleichzeitige Änderungen an derselben Bestellung sind selten.

## Decision

Wir werden Bestellungen als Zeilen in PostgreSQL speichern und bei jeder Änderung überschreiben.

## Consequences

Gut: einfaches Modell, bekanntes Tooling, Reports per SQL.

Schlecht: keine Historie, gleichzeitige Änderungen können sich überschreiben.

Neu entscheiden, wenn die Fachseite die Historie jeder Änderung braucht oder Lost Updates im Betrieb auftreten.
