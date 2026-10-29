# Architektur: DDD, CQRS und Event Sourcing

Übungen zum Workshop [Architektur: DDD, CQRS und Event Sourcing](https://workshops.mikebild.dev). Das durchgehende Beispiel ist der Werkstatt-Shop: Bestellungen mit Positionen `{ productId, quantity, priceCents }`, Geld in ganzen Cent, Statusfolge `draft → placed → paid → shipped`, `cancelled` nur aus `draft` oder `placed`.

Jede Übung ist ein eigenes Paket mit Startpunkt in `src/`, Lösung in `solution/` und Tests für beides. Die Tests in `src/` beschreiben den Startpunkt samt seinen Schwächen, die Tests in `solution/` das Ziel.

Du brauchst Node.js >= 26 (`.nvmrc`). Node.js führt TypeScript direkt aus, die Tests laufen mit [Vitest](https://vitest.dev).

```bash
cd <übung>
npm install
npm test             # Tests für src/ und solution/
npm run typecheck
npm start            # Startpunkt
npm run start:solution
```

## Kern, von einfach nach schwer

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

## Zusatzkapitel

| Übung                                              | Thema                                                     |
| -------------------------------------------------- | --------------------------------------------------------- |
| [sagas](sagas/README.md)                           | Sagas und Prozessmanager mit Kompensation                 |
| [event-sourcing-aws](event-sourcing-aws/README.md) | Event Store auf DynamoDB, Projektion als Lambda am Stream |
| [ports-adapters](ports-adapters/README.md)         | Ports and Adapters ohne Klassen                           |

Ältere Beispiele ohne TypeScript liegen unter [legacy](legacy/).
