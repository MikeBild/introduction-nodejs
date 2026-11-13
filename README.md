*English · [Deutsch](README.de.md)*

# Exercises: Node.js

Exercise repository for the workshop “Node.js backend, functional and type-safe”. 40 exercises in three series – JavaScript and TypeScript, Node.js backend, architecture with DDD, CQRS, and Event Sourcing. Each exercise comes with a README that holds the task, a runnable starting point (`src/`), tests, and a reference solution (`solution/`). The backend and architecture exercises share one example: the workshop shop with products and orders, money always in whole cents.

## What you learn

- Use values and equality in JavaScript safely, derive and narrow types with TypeScript `strict`, parse data at the system boundary with zod
- Build HTTP APIs with Express 5, test them with Vitest, configure them type-safely, log in a structured way, harden, measure, and shut them down cleanly
- Apply domain language, aggregates, commands, events and queries, CQRS, and Event Sourcing – and recognize when they are too much

## Prerequisites

- **Node.js 26** – runs the `.ts` files directly (type stripping). The backend and architecture exercises require `>=26` (`engines` in `package.json`); the architecture exercises ship an `.nvmrc` for that (`nvm use`). `sql-repository` needs Node.js 26.11 for `node:sqlite`; the TypeScript exercises run from Node.js 22.18 on.
- **npm 12** – only for `MONOREPO` and `saga-checkout`. Node.js 26 ships npm 11.20, so run `npm install -g npm@12` once.
- **Docker** – for `integration-postgres` and `saga-checkout` (PostgreSQL from Docker Compose); optional for `sql-repository` (real PostgreSQL) and `otel-tracing` (Jaeger).
- Optional: Deno and Bun for `cross-runtime`.

## Setup

There is no central package: each exercise is its own npm project with its own `package.json`. Install in the folder of the exercise, not in the repository root.

```bash
git clone https://github.com/MikeBild/introduction-nodejs.git
cd introduction-nodejs/EXAMPLES/EXPRESS/orders-api
npm install
npm start            # http://localhost:3000
npm test
npm run typecheck
```

## How to work on an exercise

```text
EXAMPLES/EXPRESS/orders-api/
  README.md          the task in the section “Exercise”, step by step
  package.json       scripts: start, test, typecheck, format – and the same for the reference solution
  src/               your starting point, already runs
    app.ts           the Express app
    orders.ts        the domain: placeOrder and orderTotalCents as Pure Functions
    app.test.ts      tests with test.todo – switch them to test as soon as you tackle them
  solution/          one possible solution, same structure
```

1. Read the README of the exercise, start the starting point with `npm start`, and try the `curl` commands from the README.
2. Work on `src/` until `npm test` and `npm run typecheck` are green.
3. Then compare with `solution/`: `npm run test:solution` and `npm run start:solution`.

| Command | What it does |
| --- | --- |
| `npm start` | Start the starting point; the Express exercises answer on `http://localhost:3000` |
| `npm test` | Vitest for `src/` |
| `npm run test:solution` | Vitest for `solution/` |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run format` | Prettier for `src/`, `solution/`, and the README |

This is how the three series differ:

- **Backend:** The tests you turn green during the exercise are listed as `test.todo` in `src/*.test.ts`. The code runs from the start; the task extends or hardens it.
- **JavaScript and TypeScript:** `src/*.test.ts` contains runtime and type tests (`expectTypeOf`, `@ts-expect-error`); you add your own. `values-equality` and `cross-runtime` are JavaScript with JSDoc types and test with `node --test`. Here `npm test` runs over `src/` and `solution/` together.
- **Architecture:** The tests in `src/` describe the starting point including its weaknesses, the tests in `solution/` describe the goal; in most exercises `npm test` checks both. The tasks are in the section “Exercise” of each README.

Two things differ:

- `MONOREPO` is an npm workspace: `npm install` and `npm test` in the folder `EXAMPLES/MONOREPO`; the packages live in `apps/` and `packages/`. Needs npm 12.
- `integration-postgres` starts the database with `docker compose up --wait`, `saga-checkout` with `npm run db:up`. `sql-repository` runs without a database against an in-memory adapter; the PostgreSQL suite is then skipped.

## Exercises

The order goes from easy to hard.

### JavaScript and TypeScript

| No. | Lesson | Exercise |
| --- | --- | --- |
| 01 | Values, types, and equality without surprises | [values-equality](EXAMPLES/ECMA/values-equality/README.md) |
| 02 | Object Types, Union and Literal Types | [unions-literals](EXAMPLES/TYPESCRIPT/unions-literals/README.md) |
| 03 | Narrowing and Discriminated Unions | [narrowing](EXAMPLES/TYPESCRIPT/narrowing/README.md) |
| 04 | Generics keep what `any` throws away | [generics](EXAMPLES/TYPESCRIPT/generics/README.md) |
| 05 | Derive types with Partial, Pick, Omit, Record, and ReturnType | [utility-types](EXAMPLES/TYPESCRIPT/utility-types/README.md) |
| 06 | Conditional, Mapped, and Template Literal Types | [advanced-types](EXAMPLES/TYPESCRIPT/advanced-types/README.md) |
| 07 | Types check the code, schemas check the world outside: zod | [runtime-validation](EXAMPLES/TYPESCRIPT/runtime-validation/README.md) |
| 08 | Branded Types for safe IDs | [branded-ids](EXAMPLES/TYPESCRIPT/branded-ids/README.md) |
| 09 | Type-safe API and an ESM package with declarations | [library-design](EXAMPLES/TYPESCRIPT/library-design/README.md) |
| 10 | A core of web standards for Node.js, Deno, Bun, and browsers | [cross-runtime](EXAMPLES/ECMA/cross-runtime/README.md) |

### Node.js backend

| No. | Lesson | Exercise |
| --- | --- | --- |
| 01 | HTTP API with Express 5: routes, router, 404, and error handling | [orders-api](EXAMPLES/EXPRESS/orders-api/README.md) |
| 02 | CLI with `parseArgs`, stdin/stdout, and exit codes | [orders-report](EXAMPLES/CLI/orders-report/README.md) |
| 03 | “Parse, don't validate”: parse requests at the boundary with zod | [zod-api](EXAMPLES/VALIDATION/zod-api/README.md) |
| 04 | Read configuration from the environment once, keep secrets out of code and logs | [typed-config](EXAMPLES/CONFIG/typed-config/README.md) |
| 05 | Test the Functional Core without mocks, the Imperative Shell with `vi.fn()` and `fetch` | [vitest-api](EXAMPLES/TESTING/vitest-api/README.md) |
| 06 | Integration tests against a real PostgreSQL from Docker Compose | [integration-postgres](EXAMPLES/TESTING/integration-postgres/README.md) |
| 07 | SQL repository with postgres.js, SQLite as a second adapter | [sql-repository](EXAMPLES/DATABASE/sql-repository/README.md) |
| 08 | The shop as an npm monorepo with workspaces | [MONOREPO](EXAMPLES/MONOREPO/README.md) |
| 09 | Structured JSON logs without a library | [structured-logs](EXAMPLES/LOGGING/structured-logs/README.md) |
| 10 | JWT/OIDC with jose: separate authentication from authorization | [jwt-oidc](EXAMPLES/AUTH/jwt-oidc/README.md) |
| 11 | Measure first: load test, CPU profile, and heap snapshots | [profiling](EXAMPLES/PERFORMANCE/profiling/README.md) |
| 12 | Harden a service: limits, security headers, prototype pollution, SSRF | [hardening](EXAMPLES/SECURITY/hardening/README.md) |
| 13 | OpenTelemetry: connect traces and logs via the trace ID | [otel-tracing](EXAMPLES/OBSERVABILITY/otel-tracing/README.md) |
| 14 | Health checks and graceful shutdown on `SIGTERM` | [graceful-shutdown](EXAMPLES/OPERATIONS/graceful-shutdown/README.md) |
| 15 | Ports and Adapters without classes and DI container | [ports-adapters](EXAMPLES/ARCHITECTURE/ports-adapters/README.md) |
| 16 | Event Sourcing and CQRS | [event-sourcing](EXAMPLES/ARCHITECTURE/event-sourcing/README.md) |
| 17 | Architecture Decision Records | [adr](EXAMPLES/ARCHITECTURE/adr/README.md) |

The last three also belong to the architecture series.

### Architecture: DDD, CQRS, and Event Sourcing

Overview and way of working of the series: [EXAMPLES/ARCHITECTURE](EXAMPLES/ARCHITECTURE/README.md).

| No. | Lesson | Exercise |
| --- | --- | --- |
| 01 | Domain language and Event Storming | [domain-language](EXAMPLES/ARCHITECTURE/domain-language/README.md) |
| 02 | Bounded Contexts, Context Map, Anti-Corruption Layer | [bounded-contexts](EXAMPLES/ARCHITECTURE/bounded-contexts/README.md) |
| 03 | Entities and Value Objects | [value-objects](EXAMPLES/ARCHITECTURE/value-objects/README.md) |
| 04 | The aggregate as consistency boundary | [aggregate](EXAMPLES/ARCHITECTURE/aggregate/README.md) |
| 05 | Commands, events, and queries | [commands-events-queries](EXAMPLES/ARCHITECTURE/commands-events-queries/README.md) |
| 06 | CQRS: Write Model and Read Model on one store | [cqrs](EXAMPLES/ARCHITECTURE/cqrs/README.md) |
| 07 | Event Sourcing: Event Store, left fold, version check | [event-sourcing](EXAMPLES/ARCHITECTURE/event-sourcing/README.md) |
| 08 | Projections: checkpoint, rebuild, snapshots | [projections](EXAMPLES/ARCHITECTURE/projections/README.md) |
| 09 | Event versioning with upcasting | [event-versioning](EXAMPLES/ARCHITECTURE/event-versioning/README.md) |
| 10 | Consistency, idempotency, and outbox | [consistency-outbox](EXAMPLES/ARCHITECTURE/consistency-outbox/README.md) |
| 11 | Architecture Decision Records | [adr](EXAMPLES/ARCHITECTURE/adr/README.md) |
| 12 | When CQRS and Event Sourcing are too much | [when-too-much](EXAMPLES/ARCHITECTURE/when-too-much/README.md) |

Four extra chapters come on top:

| Lesson | Exercise |
| --- | --- |
| Sagas and Process Manager with compensation | [sagas](EXAMPLES/ARCHITECTURE/sagas/README.md) |
| Event Store on DynamoDB, projection as a Lambda function on the stream | [event-sourcing-aws](EXAMPLES/ARCHITECTURE/event-sourcing-aws/README.md) |
| Ports and Adapters without classes | [ports-adapters](EXAMPLES/ARCHITECTURE/ports-adapters/README.md) |
| Persistent checkout in a modular monolith: Process Manager, command outbox, and crash tests on PostgreSQL (Docker) | [saga-checkout](EXAMPLES/ARCHITECTURE/saga-checkout/README.md) |

## The workshop shop

An order consists of line items `{ productId, quantity, priceCents }`; money is always in whole cents. The status sequence is `draft → placed → paid → shipped`; `cancelled` is only possible from `draft` or `placed`. The same core returns in the API exercises: `placeOrder(input, catalog, now)` and `orderTotalCents(items)` as Pure Functions, the zod schema `PlaceOrderInput` at the HTTP boundary.

## Stack

**Stack (November 2026):** Node.js 26 · TypeScript 7 with `strict`, type checking with `tsc --noEmit` · Vitest 5 · Prettier 3 · Express 5 · zod 4

As few packages as possible. Node.js brings a lot on its own, and the exercises use it: type stripping for `.ts` files, `node:test` (`values-equality`, `cross-runtime`), `parseArgs` from `node:util` (`orders-report`), `--env-file-if-exists` instead of dotenv (`typed-config`), `node:sqlite` (`sql-repository`), `--cpu-prof` and heap snapshots (`profiling`), `--permission` (`hardening`), and `--import` for the instrumentation (`otel-tracing`). Packages are added only where an exercise needs them:

| Package | What for | Exercises |
| --- | --- | --- |
| [Express 5](https://expressjs.com) | HTTP server; forwards rejected promises from `async` handlers to the error handler on its own | all API exercises, `ports-adapters` |
| [zod 4](https://zod.dev) | Schemas at the boundary: request, query, configuration | `runtime-validation`, `zod-api`, `typed-config`, and most Express exercises |
| [postgres.js](https://github.com/porsager/postgres) | SQL with tagged templates, parameterized | `sql-repository`, `integration-postgres` |
| [jose](https://github.com/panva/jose) | Verify access tokens: signature via JWKS, `iss`, `aud`, `exp` | `jwt-oidc` |
| [OpenTelemetry](https://opentelemetry.io/docs/languages/js/) | `NodeSDK` with HTTP instrumentation, spans in memory during tests | `otel-tracing` |
| AWS SDK v3 for DynamoDB | Event Store on DynamoDB, projection as a Lambda function | `event-sourcing-aws` |
| pg, graphql, tsx | Process state in PostgreSQL, GraphQL API | `saga-checkout` |
| autocannon (via `npx`) | Load test | `profiling` |

Deliberately without a library: logging (`structured-logs`), dotenv (`typed-config`), security middleware (`hardening`), DI container (`ports-adapters`).

## Chapters

Short English notes on the fundamentals, mostly from 2017 to 2018; chapter 5 (npm and workspaces) is updated to Node.js 26 and npm 12. For reference alongside the exercises:

- **Fundamentals:** [Introduction](1-introduction.md) · [Setup and Basics](2-setup-basics.md) · [REPL](4-repl.md) · [Buffers](9-buffers.md) · [File System](11-file-system.md) · [Error Handling](12-errors-and-globals.md) and [Globals](12-errors-and-globals.md#global-objects) · [Built-in Modules](13-utilities.md) · [Scaling with Child Processes](17-scaling-applications.md)
- **Async patterns:** [Callbacks](6-callbacks.md) · [Event Loop](7-event-loop.md) · [EventEmitter](8-event-emitter.md) · [Streams](10-streams.md) · [Promises](18-async-promises.md) · [RxJS](22-rxjs.md)
- **HTTP and web architecture:** [HTTP Server](3-first-application.md) · [Web Architectural Styles](14-web-architecture.md): [SSR and Universal JavaScript](14-web-architecture.md#server-side-rendering--universal-javascript), [JSON/XML-RPC](14-web-architecture.md#json--xml-rpc), [RESTful](14-web-architecture.md#restful), [Hypermedia](14-web-architecture.md#hypermedia-with-expressjs), [WebSockets](14-web-architecture.md#web-sockets)
- **Express:** [ExpressJS](15-expressjs.md): [Setup](15-expressjs.md#setup), [Environment and Practices](15-expressjs.md#environment--practices), [Middleware](15-expressjs.md#middleware), [Render Views with Templates](15-expressjs.md#render-views-with-templates), [EJS](15-expressjs.md#ejs), [Routes](15-expressjs.md#routes), [Error Handling](15-expressjs.md#error-handling), [HTTP/2](15-expressjs.md#http2), [Event Streams](15-expressjs.md#event-streams), [Socket.IO](15-expressjs.md#socketio)
- **npm and tooling:** [NPM and Workspaces](5-npm-yarn.md): [Global vs. Local](5-npm-yarn.md#global-vs-local), [package.json](5-npm-yarn.md#packagejson), [Lockfile](5-npm-yarn.md#lockfile), [Update versions](5-npm-yarn.md#update-versions), [Workspaces and Monorepo](5-npm-yarn.md#workspaces-and-monorepo) · [Quality Tools](19-quality-tools.md): [Nodemon](19-quality-tools.md#nodemon), [ESLint](19-quality-tools.md#es-lint), [Process Manager and Supervisor](19-quality-tools.md#process-manager-and-supervisor), [Node Inspector as debugger](19-quality-tools.md#node-inspector-as-debugger), [debug as logging tool](19-quality-tools.md#debug-as-logging-tool), [Prettier](19-quality-tools.md#code-style-with-prettier)
- **Testing:** [Testing](16-testing.md): [Test Pyramid](16-testing.md#test-pyramid), [Test Types](16-testing.md#test-types), [Arrange-Act-Assert](16-testing.md#arrange-act-assert), [Mocha](16-testing.md#mocha), [Asserts](16-testing.md#asserts), [Negative Tests](16-testing.md#negative-tests), [Async Tests](16-testing.md#async-tests), [Integration Tests](16-testing.md#integration-tests)
- **ECMAScript, functional JS, and TypeScript:** [Functional JavaScript](20-functional.md) · [Babel and ECMAScript](21-ECMA.md): [Block Scope](21-ECMA.md#block-scope), [Template Strings](21-ECMA.md#template-strings), [Destructuring](21-ECMA.md#destructing), [Classes](21-ECMA.md#classes), [Statics](21-ECMA.md#statics), [Object Literal Extensions](21-ECMA.md#object-literal-extentions), [Modules, Exports and Imports](21-ECMA.md#modules-exports-and-imports), [Arrow Functions](21-ECMA.md#arrow-functions), [Default Parameter](21-ECMA.md#default-parameter), [Rest Parameters](21-ECMA.md#rest-parameters), [Spread for Objects](21-ECMA.md#spread-operator-for-objects) and [Arrays](21-ECMA.md#spread-operator-for-arrays), [Promises](21-ECMA.md#promises), [Async and Await](21-ECMA.md#async-and-await), [Generator Function](21-ECMA.md#generator-function) · [TypeScript & NodeJS](23-TypeScript.md): [Setup](23-TypeScript.md#setup), [Testing](23-TypeScript.md#testing), [Resources](23-TypeScript.md#resources)

## Workshop and slides

- Workshop (held in German): [“Architecture: DDD, CQRS, and Event Sourcing”](https://workshops.mikebild.dev/w/architektur-ddd-cqrs/remote/)
- Workshop (held in German): [“AWS serverless with Lambda, CDK, and DynamoDB”](https://workshops.mikebild.dev/w/aws-serverless/remote/)
- Workshop (held in German): [“Design patterns as functions”](https://workshops.mikebild.dev/w/design-patterns/remote/)
- Workshop (held in German): [“Full-stack with TypeScript, Node.js, GraphQL, and React in 6 days”](https://workshops.mikebild.dev/w/fullstack/onsite/)
- Workshop (held in German): [“GraphQL from schema to production”](https://workshops.mikebild.dev/w/graphql/onsite/)
- Workshop (held in German): [“Microservices with Node.js, Express 5, and Docker Compose”](https://workshops.mikebild.dev/w/microservices/remote/)
- Workshop (held in German): [“Node.js core with Express 5”](https://workshops.mikebild.dev/w/nodejs-kompakt/remote/)
- Workshop (held in German): [“Node.js backend, functional and type-safe”](https://workshops.mikebild.dev/w/nodejs/remote/)
- Workshop (held in German): [“Reactive programming with Rx.NET”](https://workshops.mikebild.dev/w/reactive-programming-dotnet/remote/)
- Workshop (held in German): [“Reactive programming with RxJS”](https://workshops.mikebild.dev/w/reactive-programming/remote/)
- Slides: [slides.mikebild.dev/introduction-nodejs.en](https://slides.mikebild.dev/introduction-nodejs.en.html)
- PDF: [introduction-nodejs.en.pdf](https://media.mikebild.dev/site/mikebild/decks/introduction-nodejs/introduction-nodejs.en.pdf)
- Video: [introduction-nodejs.en.mp4](https://media.mikebild.dev/site/mikebild/decks/introduction-nodejs/introduction-nodejs.en.mp4)
- Slides: [slides.mikebild.dev/introduction-cqrs-event-sourcing.en](https://slides.mikebild.dev/introduction-cqrs-event-sourcing.en.html)
- PDF: [introduction-cqrs-event-sourcing.en.pdf](https://media.mikebild.dev/site/mikebild/decks/introduction-cqrs-event-sourcing/introduction-cqrs-event-sourcing.en.pdf)
- Video: [introduction-cqrs-event-sourcing.en.mp4](https://media.mikebild.dev/site/mikebild/decks/introduction-cqrs-event-sourcing/introduction-cqrs-event-sourcing.en.mp4)
- Posts on mikebild.dev:
  - [Node.js Training: From the Event Loop to Architecture Decisions](https://www.mikebild.dev/en/blog/nodejs-training-from-event-loop-to-architecture/)
  - [CQRS Is a Domain Boundary, Not a Framework](https://www.mikebild.dev/en/blog/cqrs-is-a-domain-boundary-not-a-framework/)
  - [Cleanly Separating Commands, Events and Queries](https://www.mikebild.dev/en/blog/separating-commands-events-and-queries/)
  - [The Aggregate as a Consistency Boundary](https://www.mikebild.dev/en/blog/the-aggregate-as-a-consistency-boundary/)
  - [Read Models from Events: Projections Instead of Accidental Caches](https://www.mikebild.dev/en/blog/read-models-from-events-projections/)
  - [Event Sourcing: The Event Store as a Logbook](https://www.mikebild.dev/en/blog/event-sourcing-the-event-store-as-a-logbook/)
  - [When CQRS and Event Sourcing Are Too Much](https://www.mikebild.dev/en/blog/when-cqrs-and-event-sourcing-are-too-much/)
  - [Event Sourcing on AWS: DynamoDB Streams and Lambda](https://www.mikebild.dev/en/blog/event-sourcing-on-aws-dynamodb-streams-and-lambda/)

## Archive

The material from 2017 to 2018 (Node.js 6 to 9, Babel 6, Express 4, Mocha, RxJS 5 and 6, TypeScript 3.2) stays in the repository unchanged and is no longer maintained:

- [EXAMPLES/EXPRESSJS/SSR](EXAMPLES/EXPRESSJS/SSR/README.md) – Express 4 with EJS and Nunjucks templates
- [EXAMPLES/HTTP2/EXPRESSJS-SPDY](EXAMPLES/HTTP2/EXPRESSJS-SPDY/README.md) – HTTP/2 via spdy, push notifications via EventSource
- [EXAMPLES/ECMA/BABEL-NODE](EXAMPLES/ECMA/BABEL-NODE/README.md) and [BABEL-REGISTER](EXAMPLES/ECMA/BABEL-REGISTER/README.md) – Babel 6 for Node.js 6
- [EXAMPLES/BASICS](EXAMPLES/BASICS), [EVENTEMITTER](EXAMPLES/EVENTEMITTER), [STREAMS](EXAMPLES/STREAMS), [FUNCTIONALJS](EXAMPLES/FUNCTIONALJS), [RXJS](EXAMPLES/RXJS), and the Mocha scripts in [EXAMPLES/TESTING](EXAMPLES/TESTING) – single JavaScript files for the chapters
- [EXAMPLES/TYPESCRIPT/src](EXAMPLES/TYPESCRIPT/src) – the old TypeScript setup with Mocha
- [EXAMPLES/ARCHITECTURE/archive](EXAMPLES/ARCHITECTURE/archive) – Hypermedia, Signals, and WebSockets without TypeScript
- [tools.md](tools.md) – tools for Docker and Kubernetes, plus the repositories [introduction-docker](https://github.com/MikeBild/introduction-docker) and [introduction-kubernetes](https://github.com/MikeBild/introduction-kubernetes)

## Report a problem

Found a bug or have an idea? Open an [issue](https://github.com/MikeBild/introduction-nodejs/issues). Please do not report security vulnerabilities publicly; use the contact form on [mikebild.dev](https://www.mikebild.dev) instead.

## License

[MIT](LICENSE)
