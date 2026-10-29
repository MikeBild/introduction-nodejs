# 2. Event Sourcing nur für Orders, Produkte und Kunden bleiben CRUD

Date: 2026-10-29

## Status

Accepted

Löst [1. CRUD mit PostgreSQL für den Bestell-Context](0001-crud-mit-postgresql-fuer-den-bestell-context.md) ab.

## Context

Support und Buchhaltung des Werkstatt-Shops fragen regelmäßig, wann eine Position hinzukam, wann bestellt, bezahlt oder storniert wurde. Die Statusfolge draft → placed → paid → shipped (Storno nur aus draft oder placed) ist fachlich wichtig, ihre Historie auch. Das kann die CRUD-Tabelle nicht beantworten. Seit dem Start der App ändern Kundschaft und Support dieselben Bestellungen gleichzeitig, im Betrieb sind Lost Updates aufgetreten. Der Monatsumsatz soll nachträglich nach neuen Regeln berechenbar sein. Das Team ist auf fünf Personen gewachsen und hat Erfahrung mit Eventual Consistency aus dem Versand-Context.

Verworfen: CRUD plus Audit-Tabelle. Sie liefert Historie für Menschen, aber keine Read Models, die sich aus der Historie neu aufbauen lassen.

## Decision

Wir werden nur das Aggregat Order mit Event Sourcing und Optimistic Concurrency bauen und Read Models wie „offene Bestellungen“ als Projektionen führen. Produkte und Kunden bleiben CRUD: Dort zählt nur der aktuelle Stand.

## Consequences

Gut: vollständige Historie, Konflikte fallen per Versionsprüfung auf, Read Models wie offene Bestellungen oder der Monatsumsatz lassen sich jederzeit neu aufbauen.

Schlecht: Events brauchen Schema und Versionierung, Projektionen sind eventually consistent, das Team muss Replays und Snapshots betreiben.

Neu entscheiden, wenn die Historie fachlich nicht mehr gebraucht wird oder Replays die Antwortzeiten spürbar verschlechtern.

Beispielcode: [EXAMPLES/ARCHITECTURE/event-sourcing](../../../event-sourcing/README.md)
