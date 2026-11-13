*[English](README.md) · Deutsch*

# Übungen: Node.js

Übungs-Repo zum Workshop „Node.js Backend, funktional und typsicher“. 40 Übungen in drei Reihen – JavaScript und TypeScript, Node.js-Backend, Architektur mit DDD, CQRS und Event Sourcing. Zu jeder Übung gibt es eine README mit der Aufgabe, einen lauffähigen Startpunkt (`src/`), Tests und eine Lösung (`solution/`). Die Backend- und Architektur-Übungen teilen sich ein Beispiel: den Werkstatt-Shop mit Produkten und Bestellungen, Geld immer in ganzen Cent.

## Was du lernst

- Werte und Gleichheit in JavaScript sicher einsetzen, mit TypeScript `strict` Typen ableiten und eingrenzen, Daten an der Systemgrenze mit zod parsen
- HTTP-APIs mit Express 5 bauen, mit Vitest testen, typsicher konfigurieren, strukturiert loggen, absichern, messen und sauber herunterfahren
- Fachsprache, Aggregate, Commands, Events und Queries, CQRS und Event Sourcing anwenden – und erkennen, wann sie zu viel sind

## Voraussetzungen

- **Node.js 26** – führt die `.ts`-Dateien direkt aus (Type Stripping). Die Backend- und Architektur-Übungen verlangen `>=26` (`engines` in der `package.json`), die Architektur-Übungen bringen dafür eine `.nvmrc` mit (`nvm use`). `sql-repository` braucht Node.js 26.11 für `node:sqlite`; die TypeScript-Übungen laufen ab Node.js 22.18.
- **npm 12** – nur für `MONOREPO` und `saga-checkout`. Node.js 26 bringt npm 11.20 mit, deshalb einmal `npm install -g npm@12`.
- **Docker** – für `integration-postgres` und `saga-checkout` (PostgreSQL aus Docker Compose); optional für `sql-repository` (echtes PostgreSQL) und `otel-tracing` (Jaeger).
- Optional: Deno und Bun für `cross-runtime`.

## Einrichten

Es gibt kein zentrales Paket: Jede Übung ist ein eigenes npm-Projekt mit eigener `package.json`. Installiere im Ordner der Übung, nicht im Hauptverzeichnis.

```bash
git clone https://github.com/MikeBild/introduction-nodejs.git
cd introduction-nodejs/EXAMPLES/EXPRESS/orders-api
npm install
npm start            # http://localhost:3000
npm test
npm run typecheck
```

## So arbeitest du mit einer Übung

```text
EXAMPLES/EXPRESS/orders-api/
  README.md          Aufgabe im Abschnitt „Exercise“, Schritt für Schritt
  package.json       Scripts: start, test, typecheck, format – und dieselben für die Lösung
  src/               dein Startpunkt, läuft bereits
    app.ts           die Express-App
    orders.ts        die Domäne: placeOrder und orderTotalCents als Pure Functions
    app.test.ts      Tests mit test.todo – stell sie auf test um, sobald du sie angehst
  solution/          eine mögliche Lösung, gleiche Struktur
```

1. Lies die README der Übung, starte den Startpunkt mit `npm start` und probiere die `curl`-Befehle aus der README aus.
2. Bearbeite `src/`, bis `npm test` und `npm run typecheck` grün sind.
3. Vergleiche danach mit `solution/`: `npm run test:solution` und `npm run start:solution`.

| Befehl | Was es tut |
| --- | --- |
| `npm start` | Startpunkt starten; die Express-Übungen antworten auf `http://localhost:3000` |
| `npm test` | Vitest für `src/` |
| `npm run test:solution` | Vitest für `solution/` |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run format` | Prettier für `src/`, `solution/` und die README |

So unterscheiden sich die drei Reihen:

- **Backend:** Die Tests, die du im Lauf der Übung grün machst, stehen als `test.todo` in `src/*.test.ts`. Der Code läuft von Anfang an, die Aufgabe baut ihn aus oder härtet ihn.
- **JavaScript und TypeScript:** `src/*.test.ts` enthält Laufzeit- und Typtests (`expectTypeOf`, `@ts-expect-error`), du ergänzt sie um eigene. `values-equality` und `cross-runtime` sind JavaScript mit JSDoc-Typen und testen mit `node --test`. `npm test` läuft hier über `src/` und `solution/` zusammen.
- **Architektur:** Die Tests in `src/` beschreiben den Startpunkt samt seinen Schwächen, die Tests in `solution/` das Ziel; `npm test` prüft in den meisten Übungen beide. Die Aufgaben stehen im Abschnitt „Übung“ der jeweiligen README.

Zwei Dinge weichen ab:

- `MONOREPO` ist ein npm-Workspace: `npm install` und `npm test` im Ordner `EXAMPLES/MONOREPO`, die Pakete liegen in `apps/` und `packages/`. Braucht npm 12.
- `integration-postgres` startet die Datenbank mit `docker compose up --wait`, `saga-checkout` mit `npm run db:up`. `sql-repository` läuft ohne Datenbank gegen einen In-Memory-Adapter, die PostgreSQL-Suite wird dann übersprungen.

## Übungen

Die Reihenfolge geht von einfach nach schwer.

### JavaScript und TypeScript

| Nr. | Lektion | Übung |
| --- | --- | --- |
| 01 | Werte, Typen und Gleichheit ohne Überraschungen | [values-equality](EXAMPLES/ECMA/values-equality/README.md) |
| 02 | Object Types, Union und Literal Types | [unions-literals](EXAMPLES/TYPESCRIPT/unions-literals/README.md) |
| 03 | Narrowing und Discriminated Unions | [narrowing](EXAMPLES/TYPESCRIPT/narrowing/README.md) |
| 04 | Generics behalten, was `any` wegwirft | [generics](EXAMPLES/TYPESCRIPT/generics/README.md) |
| 05 | Typen ableiten mit Partial, Pick, Omit, Record und ReturnType | [utility-types](EXAMPLES/TYPESCRIPT/utility-types/README.md) |
| 06 | Conditional, Mapped und Template Literal Types | [advanced-types](EXAMPLES/TYPESCRIPT/advanced-types/README.md) |
| 07 | Typen prüfen den Code, Schemas prüfen die Welt draußen: zod | [runtime-validation](EXAMPLES/TYPESCRIPT/runtime-validation/README.md) |
| 08 | Branded Types für sichere IDs | [branded-ids](EXAMPLES/TYPESCRIPT/branded-ids/README.md) |
| 09 | Typsichere API und ein ESM-Paket mit Declarations | [library-design](EXAMPLES/TYPESCRIPT/library-design/README.md) |
| 10 | Ein Kern aus Web-Standards für Node.js, Deno, Bun und Browser | [cross-runtime](EXAMPLES/ECMA/cross-runtime/README.md) |

### Node.js-Backend

| Nr. | Lektion | Übung |
| --- | --- | --- |
| 01 | HTTP-API mit Express 5: Routes, Router, 404 und Error Handling | [orders-api](EXAMPLES/EXPRESS/orders-api/README.md) |
| 02 | CLI mit `parseArgs`, stdin/stdout und Exit Codes | [orders-report](EXAMPLES/CLI/orders-report/README.md) |
| 03 | „Parse, don't validate“: Requests an der Grenze mit zod parsen | [zod-api](EXAMPLES/VALIDATION/zod-api/README.md) |
| 04 | Konfiguration einmal aus der Umgebung lesen, Secrets aus Code und Logs halten | [typed-config](EXAMPLES/CONFIG/typed-config/README.md) |
| 05 | Functional Core ohne Mocks testen, Imperative Shell mit `vi.fn()` und `fetch` | [vitest-api](EXAMPLES/TESTING/vitest-api/README.md) |
| 06 | Integration-Tests gegen ein echtes PostgreSQL aus Docker Compose | [integration-postgres](EXAMPLES/TESTING/integration-postgres/README.md) |
| 07 | SQL-Repository mit postgres.js, SQLite als zweiter Adapter | [sql-repository](EXAMPLES/DATABASE/sql-repository/README.md) |
| 08 | Der Shop als npm-Monorepo mit Workspaces | [MONOREPO](EXAMPLES/MONOREPO/README.md) |
| 09 | Strukturierte JSON-Logs ohne Library | [structured-logs](EXAMPLES/LOGGING/structured-logs/README.md) |
| 10 | JWT/OIDC mit jose: Authentifizierung von Autorisierung trennen | [jwt-oidc](EXAMPLES/AUTH/jwt-oidc/README.md) |
| 11 | Erst messen: Load Test, CPU-Profil und Heap Snapshots | [profiling](EXAMPLES/PERFORMANCE/profiling/README.md) |
| 12 | Einen Service härten: Limits, Security Headers, Prototype Pollution, SSRF | [hardening](EXAMPLES/SECURITY/hardening/README.md) |
| 13 | OpenTelemetry: Traces und Logs über die Trace-ID verbinden | [otel-tracing](EXAMPLES/OBSERVABILITY/otel-tracing/README.md) |
| 14 | Health Checks und Graceful Shutdown bei `SIGTERM` | [graceful-shutdown](EXAMPLES/OPERATIONS/graceful-shutdown/README.md) |
| 15 | Ports and Adapters ohne Klassen und DI-Container | [ports-adapters](EXAMPLES/ARCHITECTURE/ports-adapters/README.md) |
| 16 | Event Sourcing und CQRS | [event-sourcing](EXAMPLES/ARCHITECTURE/event-sourcing/README.de.md) |
| 17 | Architecture Decision Records | [adr](EXAMPLES/ARCHITECTURE/adr/README.de.md) |

Die letzten drei gehören auch zur Architektur-Reihe.

### Architektur: DDD, CQRS und Event Sourcing

Übersicht und Arbeitsweise der Reihe: [EXAMPLES/ARCHITECTURE](EXAMPLES/ARCHITECTURE/README.de.md).

| Nr. | Lektion | Übung |
| --- | --- | --- |
| 01 | Fachsprache und Event Storming | [domain-language](EXAMPLES/ARCHITECTURE/domain-language/README.de.md) |
| 02 | Bounded Contexts, Context Map, Anti-Corruption Layer | [bounded-contexts](EXAMPLES/ARCHITECTURE/bounded-contexts/README.de.md) |
| 03 | Entitäten und Value Objects | [value-objects](EXAMPLES/ARCHITECTURE/value-objects/README.de.md) |
| 04 | Das Aggregat als Konsistenzgrenze | [aggregate](EXAMPLES/ARCHITECTURE/aggregate/README.de.md) |
| 05 | Commands, Events und Queries | [commands-events-queries](EXAMPLES/ARCHITECTURE/commands-events-queries/README.de.md) |
| 06 | CQRS: Write Model und Read Model auf einem Store | [cqrs](EXAMPLES/ARCHITECTURE/cqrs/README.de.md) |
| 07 | Event Sourcing: Event Store, Left Fold, Versionsprüfung | [event-sourcing](EXAMPLES/ARCHITECTURE/event-sourcing/README.de.md) |
| 08 | Projektionen: Checkpoint, Neuaufbau, Snapshots | [projections](EXAMPLES/ARCHITECTURE/projections/README.de.md) |
| 09 | Event-Versionierung mit Upcasting | [event-versioning](EXAMPLES/ARCHITECTURE/event-versioning/README.de.md) |
| 10 | Konsistenz, Idempotenz und Outbox | [consistency-outbox](EXAMPLES/ARCHITECTURE/consistency-outbox/README.de.md) |
| 11 | Architecture Decision Records | [adr](EXAMPLES/ARCHITECTURE/adr/README.de.md) |
| 12 | Wann CQRS und Event Sourcing zu viel sind | [when-too-much](EXAMPLES/ARCHITECTURE/when-too-much/README.de.md) |

Dazu kommen vier Zusatzkapitel:

| Lektion | Übung |
| --- | --- |
| Sagas und Process Manager mit Kompensation | [sagas](EXAMPLES/ARCHITECTURE/sagas/README.de.md) |
| Event Store auf DynamoDB, Projektion als Lambda am Stream | [event-sourcing-aws](EXAMPLES/ARCHITECTURE/event-sourcing-aws/README.de.md) |
| Ports and Adapters ohne Klassen | [ports-adapters](EXAMPLES/ARCHITECTURE/ports-adapters/README.md) |
| Persistenter Checkout im modularen Monolithen: Process Manager, Command-Outbox und Crash-Tests auf PostgreSQL (Docker) | [saga-checkout](EXAMPLES/ARCHITECTURE/saga-checkout/README.de.md) |

## Der Werkstatt-Shop

Eine Bestellung besteht aus Positionen `{ productId, quantity, priceCents }`, Geld steht immer in ganzen Cent. Die Statusfolge ist `draft → placed → paid → shipped`, `cancelled` geht nur aus `draft` oder `placed`. In den API-Übungen kehrt derselbe Kern wieder: `placeOrder(input, catalog, now)` und `orderTotalCents(items)` als Pure Functions, das zod-Schema `PlaceOrderInput` an der HTTP-Grenze.

## Stack

**Stack (November 2026):** Node.js 26 · TypeScript 7 mit `strict`, Typprüfung mit `tsc --noEmit` · Vitest 5 · Prettier 3 · Express 5 · zod 4

So wenig Pakete wie möglich. Node.js bringt vieles selbst mit, und die Übungen nutzen es: Type Stripping für `.ts`-Dateien, `node:test` (`values-equality`, `cross-runtime`), `parseArgs` aus `node:util` (`orders-report`), `--env-file-if-exists` statt dotenv (`typed-config`), `node:sqlite` (`sql-repository`), `--cpu-prof` und Heap Snapshots (`profiling`), `--permission` (`hardening`) und `--import` für die Instrumentierung (`otel-tracing`). Pakete kommen nur dort dazu, wo die Übung sie braucht:

| Paket | Wofür | Übungen |
| --- | --- | --- |
| [Express 5](https://expressjs.com) | HTTP-Server; leitet abgelehnte Promises aus `async`-Handlern selbst an den Error Handler weiter | alle API-Übungen, `ports-adapters` |
| [zod 4](https://zod.dev) | Schemas an der Grenze: Request, Query, Konfiguration | `runtime-validation`, `zod-api`, `typed-config` und die meisten Express-Übungen |
| [postgres.js](https://github.com/porsager/postgres) | SQL mit Tagged Templates, parametrisiert | `sql-repository`, `integration-postgres` |
| [jose](https://github.com/panva/jose) | Access Tokens prüfen: Signatur über JWKS, `iss`, `aud`, `exp` | `jwt-oidc` |
| [OpenTelemetry](https://opentelemetry.io/docs/languages/js/) | `NodeSDK` mit HTTP-Instrumentierung, Spans im Test in Memory | `otel-tracing` |
| AWS SDK v3 für DynamoDB | Event Store auf DynamoDB, Projektion als Lambda | `event-sourcing-aws` |
| pg, graphql, tsx | Prozesszustand in PostgreSQL, GraphQL-API | `saga-checkout` |
| autocannon (per `npx`) | Load Test | `profiling` |

Bewusst ohne Library: Logging (`structured-logs`), dotenv (`typed-config`), Security-Middleware (`hardening`), DI-Container (`ports-adapters`).

## Kapitel

Kurze englische Notizen zu den Grundlagen, überwiegend aus den Jahren 2017 bis 2018; Kapitel 5 (npm und Workspaces) ist auf Node.js 26 und npm 12 aktualisiert. Zum Nachschlagen neben den Übungen:

- **Grundlagen:** [Introduction](1-introduction.md) · [Setup and Basics](2-setup-basics.md) · [REPL](4-repl.md) · [Buffers](9-buffers.md) · [File System](11-file-system.md) · [Error Handling](12-errors-and-globals.md) und [Globals](12-errors-and-globals.md#global-objects) · [Built-in Modules](13-utilities.md) · [Scaling mit Child Processes](17-scaling-applications.md)
- **Async Patterns:** [Callbacks](6-callbacks.md) · [Event Loop](7-event-loop.md) · [EventEmitter](8-event-emitter.md) · [Streams](10-streams.md) · [Promises](18-async-promises.md) · [RxJS](22-rxjs.md)
- **HTTP und Web-Architektur:** [HTTP-Server](3-first-application.md) · [Web Architectural Styles](14-web-architecture.md): [SSR und Universal JavaScript](14-web-architecture.md#server-side-rendering--universal-javascript), [JSON/XML-RPC](14-web-architecture.md#json--xml-rpc), [RESTful](14-web-architecture.md#restful), [Hypermedia](14-web-architecture.md#hypermedia-with-expressjs), [WebSockets](14-web-architecture.md#web-sockets)
- **Express:** [ExpressJS](15-expressjs.md): [Setup](15-expressjs.md#setup), [Environment und Practices](15-expressjs.md#environment--practices), [Middleware](15-expressjs.md#middleware), [Render Views with Templates](15-expressjs.md#render-views-with-templates), [EJS](15-expressjs.md#ejs), [Routes](15-expressjs.md#routes), [Error Handling](15-expressjs.md#error-handling), [HTTP/2](15-expressjs.md#http2), [Event Streams](15-expressjs.md#event-streams), [Socket.IO](15-expressjs.md#socketio)
- **npm und Tooling:** [NPM and Workspaces](5-npm-yarn.md): [Global vs. Local](5-npm-yarn.md#global-vs-local), [package.json](5-npm-yarn.md#packagejson), [Lockfile](5-npm-yarn.md#lockfile), [Update versions](5-npm-yarn.md#update-versions), [Workspaces and Monorepo](5-npm-yarn.md#workspaces-and-monorepo) · [Quality Tools](19-quality-tools.md): [Nodemon](19-quality-tools.md#nodemon), [ESLint](19-quality-tools.md#es-lint), [Process Manager and Supervisor](19-quality-tools.md#process-manager-and-supervisor), [Node-Inspector als Debugger](19-quality-tools.md#node-inspector-as-debugger), [debug als Logging-Tool](19-quality-tools.md#debug-as-logging-tool), [Prettier](19-quality-tools.md#code-style-with-prettier)
- **Testing:** [Testing](16-testing.md): [Test Pyramid](16-testing.md#test-pyramid), [Test Types](16-testing.md#test-types), [Arrange-Act-Assert](16-testing.md#arrange-act-assert), [Mocha](16-testing.md#mocha), [Asserts](16-testing.md#asserts), [Negative Tests](16-testing.md#negative-tests), [Async Tests](16-testing.md#async-tests), [Integration Tests](16-testing.md#integration-tests)
- **ECMAScript, Functional JS und TypeScript:** [Functional JavaScript](20-functional.md) · [Babel and ECMAScript](21-ECMA.md): [Block Scope](21-ECMA.md#block-scope), [Template Strings](21-ECMA.md#template-strings), [Destructuring](21-ECMA.md#destructing), [Classes](21-ECMA.md#classes), [Statics](21-ECMA.md#statics), [Object Literal Extensions](21-ECMA.md#object-literal-extentions), [Modules, Exports and Imports](21-ECMA.md#modules-exports-and-imports), [Arrow Functions](21-ECMA.md#arrow-functions), [Default Parameter](21-ECMA.md#default-parameter), [Rest Parameters](21-ECMA.md#rest-parameters), [Spread für Objects](21-ECMA.md#spread-operator-for-objects) und [Arrays](21-ECMA.md#spread-operator-for-arrays), [Promises](21-ECMA.md#promises), [Async und Await](21-ECMA.md#async-and-await), [Generator Function](21-ECMA.md#generator-function) · [TypeScript & NodeJS](23-TypeScript.md): [Setup](23-TypeScript.md#setup), [Testing](23-TypeScript.md#testing), [Resources](23-TypeScript.md#resources)

## Workshop und Folien

- Workshop: [„Architektur: DDD, CQRS und Event Sourcing“](https://workshops.mikebild.dev/w/architektur-ddd-cqrs/remote/)
- Workshop: [„AWS Serverless mit Lambda, CDK und DynamoDB“](https://workshops.mikebild.dev/w/aws-serverless/remote/)
- Workshop: [„Design Patterns als Funktionen“](https://workshops.mikebild.dev/w/design-patterns/remote/)
- Workshop: [„Fullstack mit TypeScript, Node.js, GraphQL und React in 6 Tagen“](https://workshops.mikebild.dev/w/fullstack/onsite/)
- Workshop: [„GraphQL vom Schema bis zur Produktion“](https://workshops.mikebild.dev/w/graphql/onsite/)
- Workshop: [„Microservices mit Node.js, Express 5 und Docker Compose“](https://workshops.mikebild.dev/w/microservices/remote/)
- Workshop: [„Node.js Core mit Express 5“](https://workshops.mikebild.dev/w/nodejs-kompakt/remote/)
- Workshop: [„Node.js Backend, funktional und typsicher“](https://workshops.mikebild.dev/w/nodejs/remote/)
- Workshop: [„Reactive Programming mit Rx.NET“](https://workshops.mikebild.dev/w/reactive-programming-dotnet/remote/)
- Workshop: [„Reactive Programming mit RxJS“](https://workshops.mikebild.dev/w/reactive-programming/remote/)
- Folien: [slides.mikebild.dev/introduction-nodejs](https://slides.mikebild.dev/introduction-nodejs.html)
- PDF: [introduction-nodejs.pdf](https://media.mikebild.dev/site/mikebild/decks/introduction-nodejs/introduction-nodejs.pdf)
- Video: [introduction-nodejs.mp4](https://media.mikebild.dev/site/mikebild/decks/introduction-nodejs/introduction-nodejs.mp4)
- Folien: [slides.mikebild.dev/introduction-cqrs-event-sourcing](https://slides.mikebild.dev/introduction-cqrs-event-sourcing.html)
- PDF: [introduction-cqrs-event-sourcing.pdf](https://media.mikebild.dev/site/mikebild/decks/introduction-cqrs-event-sourcing/introduction-cqrs-event-sourcing.pdf)
- Video: [introduction-cqrs-event-sourcing.mp4](https://media.mikebild.dev/site/mikebild/decks/introduction-cqrs-event-sourcing/introduction-cqrs-event-sourcing.mp4)
- Beiträge auf mikebild.dev:
  - [Node.js-Training: Vom Event Loop zur Architekturentscheidung](https://www.mikebild.dev/de/blog/nodejs-training-event-loop-architektur/)
  - [CQRS ist eine fachliche Grenze, kein Framework](https://www.mikebild.dev/de/blog/cqrs-fachliche-grenze-kein-framework/)
  - [Commands, Events und Queries sauber trennen](https://www.mikebild.dev/de/blog/commands-events-queries-trennen/)
  - [Das Aggregat als Konsistenzgrenze](https://www.mikebild.dev/de/blog/aggregat-als-konsistenzgrenze/)
  - [Read Models aus Events: Projections statt zufälliger Caches](https://www.mikebild.dev/de/blog/read-models-sind-projektionen/)
  - [Event Sourcing: der Event-Store als Logbuch](https://www.mikebild.dev/de/blog/event-sourcing-der-event-store-als-logbuch/)
  - [Wann CQRS und Event Sourcing zu viel sind](https://www.mikebild.dev/de/blog/wann-cqrs-und-event-sourcing-zu-viel-ist/)
  - [Event Sourcing auf AWS: DynamoDB Streams und Lambda](https://www.mikebild.dev/de/blog/event-sourcing-auf-aws-dynamodb-streams/)

## Archiv

Das Material von 2017 bis 2018 (Node.js 6 bis 9, Babel 6, Express 4, Mocha, RxJS 5 und 6, TypeScript 3.2) liegt unverändert im Repo und wird nicht mehr gepflegt:

- [EXAMPLES/EXPRESSJS/SSR](EXAMPLES/EXPRESSJS/SSR/README.md) – Express 4 mit EJS- und Nunjucks-Templates
- [EXAMPLES/HTTP2/EXPRESSJS-SPDY](EXAMPLES/HTTP2/EXPRESSJS-SPDY/README.md) – HTTP/2 über spdy, Push-Benachrichtigungen per EventSource
- [EXAMPLES/ECMA/BABEL-NODE](EXAMPLES/ECMA/BABEL-NODE/README.md) und [BABEL-REGISTER](EXAMPLES/ECMA/BABEL-REGISTER/README.md) – Babel 6 für Node.js 6
- [EXAMPLES/BASICS](EXAMPLES/BASICS), [EVENTEMITTER](EXAMPLES/EVENTEMITTER), [STREAMS](EXAMPLES/STREAMS), [FUNCTIONALJS](EXAMPLES/FUNCTIONALJS), [RXJS](EXAMPLES/RXJS) und die Mocha-Skripte in [EXAMPLES/TESTING](EXAMPLES/TESTING) – einzelne JavaScript-Dateien zu den Kapiteln
- [EXAMPLES/TYPESCRIPT/src](EXAMPLES/TYPESCRIPT/src) – das alte TypeScript-Setup mit Mocha
- [EXAMPLES/ARCHITECTURE/archive](EXAMPLES/ARCHITECTURE/archive) – Hypermedia, Signals und WebSockets ohne TypeScript
- [tools.md](tools.md) – Werkzeuge für Docker und Kubernetes, dazu die Repos [introduction-docker](https://github.com/MikeBild/introduction-docker) und [introduction-kubernetes](https://github.com/MikeBild/introduction-kubernetes)

## Fehler melden

Hast du einen Fehler gefunden oder eine Idee? Leg ein [Issue](https://github.com/MikeBild/introduction-nodejs/issues) an. Sicherheitslücken meldest du bitte nicht öffentlich, sondern über das Kontaktformular auf [mikebild.dev](https://www.mikebild.dev).

## Lizenz

[MIT](LICENSE)
