# Übungen: Architektur mit DDD, CQRS und Event Sourcing

Übungen zum Workshop „Architektur: DDD, CQRS und Event Sourcing“. Jede Übung ist ein eigenes Paket mit Startpunkt in `src/`, Lösung in `solution/` und Tests für beides. Das durchgehende Beispiel ist der Werkstatt-Shop: Bestellungen mit Positionen `{ productId, quantity, priceCents }`, Geld in ganzen Cent, Statusfolge `draft → placed → paid → shipped`, `cancelled` nur aus `draft` oder `placed`.

## Was du lernst

- Fachsprache, Bounded Contexts und Aggregate mit Domain-Driven Design (DDD)
- Commands, Events und Queries trennen: CQRS mit Read Models und Projektionen
- Event Sourcing mit Upcasting und Outbox – und wann es zu viel ist

## Voraussetzungen

- **Node.js 26** – `nvm use` liest die Version aus der `.nvmrc` der jeweiligen Übung. Node.js führt TypeScript direkt aus, die Tests laufen mit [Vitest](https://vitest.dev).

## Einrichten

```bash
git clone https://github.com/MikeBild/introduction-nodejs.git
cd introduction-nodejs/EXAMPLES/ARCHITECTURE/<übung>
npm install
npm test             # Tests für src/ und solution/
npm run typecheck
```

## So arbeitest du mit einer Übung

```bash
npm start            # Startpunkt
npm run start:solution
```

Die Tests in `src/` beschreiben den Startpunkt samt seinen Schwächen, die Tests in `solution/` das Ziel. Die Aufgaben stehen in der README jeder Übung im Abschnitt „Übung“.

## Übungen

| Nr. | Übung                                                        | Thema                                                   |
| --: | ------------------------------------------------------------ | ------------------------------------------------------- |
|   1 | [domain-language](domain-language/README.md)                 | Fachsprache und Event Storming                          |
|   2 | [bounded-contexts](bounded-contexts/README.md)               | Bounded Contexts, Context Map, Anti-Corruption Layer    |
|   3 | [value-objects](value-objects/README.md)                     | Entitäten und Value Objects                             |
|   4 | [aggregate](aggregate/README.md)                             | Das Aggregat als Konsistenzgrenze                       |
|   5 | [commands-events-queries](commands-events-queries/README.md) | Commands, Events und Queries                            |
|   6 | [cqrs](cqrs/README.md)                                       | CQRS: Write Model und Read Model auf einem Store        |
|   7 | [event-sourcing](event-sourcing/README.md)                   | Event Sourcing: Event Store, Left Fold, Versionsprüfung |
|   8 | [projections](projections/README.md)                         | Projektionen: Checkpoint, Neuaufbau, Snapshots          |
|   9 | [event-versioning](event-versioning/README.md)               | Event-Versionierung mit Upcasting                       |
|  10 | [consistency-outbox](consistency-outbox/README.md)           | Konsistenz, Idempotenz und Outbox                       |
|  11 | [adr](adr/README.md)                                         | Architecture Decision Records                           |
|  12 | [when-too-much](when-too-much/README.md)                     | Wann CQRS und Event Sourcing zu viel sind               |

### Zusatzkapitel

| Übung                                              | Thema                                                     |
| -------------------------------------------------- | --------------------------------------------------------- |
| [sagas](sagas/README.md)                           | Sagas und Prozessmanager mit Kompensation                 |
| [event-sourcing-aws](event-sourcing-aws/README.md) | Event Store auf DynamoDB, Projektion als Lambda am Stream |
| [ports-adapters](ports-adapters/README.md)         | Ports and Adapters ohne Klassen                           |

## Workshop und Folien

- Workshop: [„Architektur: DDD, CQRS und Event Sourcing“](https://workshops.mikebild.dev/w/architektur-ddd-cqrs/remote/)
- Folien: [slides.mikebild.dev/introduction-cqrs-event-sourcing](https://slides.mikebild.dev/introduction-cqrs-event-sourcing.html)

## Archiv

Ältere Beispiele ohne TypeScript liegen unter [`legacy/`](legacy/).

## Lizenz

[MIT](../../LICENSE)
