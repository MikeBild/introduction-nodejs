# 3. Read Models als Tabellen in PostgreSQL, neu aufbaubar aus dem Event Store

Date: 2026-10-29

## Status

Accepted

## Context

Die Übersicht „offene Bestellungen“ faltet heute bei jedem Aufruf alle Events im Speicher. Bei 40 000 Bestellungen dauert das mehrere Sekunden. Der Support braucht die Liste in unter 200 Millisekunden. Das Team betreibt PostgreSQL seit Jahren, ein zweiter Datenbanktyp würde Betrieb und Backups verdoppeln.

Verworfen: ein Cache vor der Query. Er lässt sich nicht aus der Historie neu aufbauen und veraltet still.

## Decision

Wir werden jedes Read Model als eigene Tabelle in PostgreSQL führen. Eine Projektion schreibt sie ab ihrem Checkpoint fort und kann sie jederzeit aus dem Event Store neu aufbauen.

## Consequences

Gut: schnelle Queries, eine Datenbank im Betrieb, neue Sichten ohne Migration der Events.

Schlecht: Read Models hängen kurz hinterher, ein Neuaufbau braucht bei vielen Events Zeit und eine zweite Tabelle zum Umschalten.

Neu entscheiden, wenn ein Read Model eine Suche braucht, die PostgreSQL nicht schnell genug liefert.
