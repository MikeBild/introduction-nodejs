*English · [Deutsch](README.de.md)*

# Exercises: Architecture with DDD, CQRS, and Event Sourcing

Exercises for the workshop “Architecture: DDD, CQRS, and Event Sourcing”. Each exercise is its own package with a starting point in `src/`, a reference solution in `solution/`, and tests for both. The running example is the workshop shop: orders with line items `{ productId, quantity, priceCents }`, money in whole cents, status sequence `draft → placed → paid → shipped`, `cancelled` only from `draft` or `placed`.

## What you learn

- Domain language, Bounded Contexts, and aggregates with Domain-Driven Design (DDD)
- Separate commands, events, and queries: CQRS with Read Models and projections
- Event Sourcing with upcasting and outbox – and when it is too much

## Prerequisites

- **Node.js 26** – `nvm use` reads the version from the `.nvmrc` of each exercise. Node.js runs TypeScript directly; the tests run with [Vitest](https://vitest.dev).

## Setup

```bash
git clone https://github.com/MikeBild/introduction-nodejs.git
cd introduction-nodejs/EXAMPLES/ARCHITECTURE/<exercise>
npm install
npm test             # tests for src/ and solution/
npm run typecheck
```

## How to work on an exercise

```bash
npm start            # starting point
npm run start:solution
```

The tests in `src/` describe the starting point including its weaknesses, the tests in `solution/` describe the goal. The tasks are in the section “Exercise” of each exercise's README.

## Exercises

| No. | Exercise                                                     | Topic                                                 |
| --: | ------------------------------------------------------------ | ----------------------------------------------------- |
|   1 | [domain-language](domain-language/README.md)                 | Domain language and Event Storming                    |
|   2 | [bounded-contexts](bounded-contexts/README.md)               | Bounded Contexts, Context Map, Anti-Corruption Layer  |
|   3 | [value-objects](value-objects/README.md)                     | Entities and Value Objects                            |
|   4 | [aggregate](aggregate/README.md)                             | The aggregate as consistency boundary                 |
|   5 | [commands-events-queries](commands-events-queries/README.md) | Commands, events, and queries                         |
|   6 | [cqrs](cqrs/README.md)                                       | CQRS: Write Model and Read Model on one store         |
|   7 | [event-sourcing](event-sourcing/README.md)                   | Event Sourcing: Event Store, left fold, version check |
|   8 | [projections](projections/README.md)                         | Projections: checkpoint, rebuild, snapshots           |
|   9 | [event-versioning](event-versioning/README.md)               | Event versioning with upcasting                       |
|  10 | [consistency-outbox](consistency-outbox/README.md)           | Consistency, idempotency, and outbox                  |
|  11 | [adr](adr/README.md)                                         | Architecture Decision Records                         |
|  12 | [when-too-much](when-too-much/README.md)                     | When CQRS and Event Sourcing are too much             |

### Extra chapters

| Exercise                                           | Topic                                                                  |
| -------------------------------------------------- | ---------------------------------------------------------------------- |
| [sagas](sagas/README.md)                           | Sagas and Process Manager with compensation                            |
| [event-sourcing-aws](event-sourcing-aws/README.md) | Event Store on DynamoDB, projection as a Lambda function on the stream |
| [ports-adapters](ports-adapters/README.md)         | Ports and Adapters without classes                                     |

## Workshop and slides

- Workshop: [“Architecture: DDD, CQRS, and Event Sourcing”](https://workshops.mikebild.dev/w/architektur-ddd-cqrs/remote/)
- Slides: [slides.mikebild.dev/introduction-cqrs-event-sourcing](https://slides.mikebild.dev/introduction-cqrs-event-sourcing.html)

## Archive

Older examples without TypeScript are in [`archive/`](archive/).

## License

[MIT](../../LICENSE)
