# 2. Event Sourcing für den Bestell-Context

Date: 2026-10-29

## Status

Accepted

Löst [1. CRUD mit PostgreSQL für den Bestell-Context](0001-crud-mit-postgresql-fuer-den-bestell-context.md) ab.

## Context

Support und Buchhaltung fragen regelmäßig, wann ein Artikel hinzukam und wer eine Bestellung geändert hat. Das kann die CRUD-Tabelle nicht beantworten. Seit dem Start der App ändern Kundschaft und Support dieselben Bestellungen gleichzeitig, im Betrieb sind Lost Updates aufgetreten. Der Monatsumsatz soll nachträglich nach neuen Regeln berechenbar sein. Das Team ist auf fünf Personen gewachsen und hat Erfahrung mit Eventual Consistency aus dem Versand-Context.

Verworfen: CRUD plus Audit-Tabelle. Sie liefert Historie für Menschen, aber keine Read Models, die sich aus der Historie neu aufbauen lassen.

## Decision

Wir werden den Bestell-Context mit Event Sourcing und Optimistic Concurrency bauen und Lesemodelle als Projektionen führen. Andere Contexts bleiben CRUD.

## Consequences

Gut: vollständige Historie, Konflikte fallen per Versionsprüfung auf, Read Models wie der Monatsumsatz lassen sich jederzeit neu aufbauen.

Schlecht: Events brauchen Schema und Versionierung, Projektionen sind eventually consistent, das Team muss Replays und Snapshots betreiben.

Neu entscheiden, wenn die Historie fachlich nicht mehr gebraucht wird oder Replays die Antwortzeiten spürbar verschlechtern.

Beispielcode: [EXAMPLES/ARCHITECTURE/event-sourcing](../../../event-sourcing/README.md)
