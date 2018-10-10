# Web Architectural Styles

## Server-Side-Rendering & Universal JavaScript

```
----                       ----
|  |  <----------------->  |  |
----                       ----

Browser-Request            Render HTML-Template via NodeJS->ExpressJS->Engine Response
```

## JSON / XML RPC

```
----                       ----
|  |  <----------------->  |  |
----                       ----

HTTP/AJAX-Request          XML/JSON via NodeJS (NET/HTTP(S)Module) Response
```

## RESTful

```
----                       ----
|  |  <----------------->  |  |
----                       ----

HTTP/AJAX-Request          XML/JSON via NodeJS->ExpressJS Response
```

### Richardson Maturity Model

#### Level 0

- XML/JSON-RPC or SOAP
- Service consumers uses a single URI
- Service consumers use a single HTTP-Method (mostly POST)

#### Level 1

- Service consumers uses multiple URIs
- Service consumers uses multiple HTTP-Method

#### Level 2

- Service consumers uses multiple resource-based URIs
- Service consumers uses multiple HTTP-Method

#### Level 3

- Navigation via Hypermedia links
- Template based links
- Service consumers uses multiple resource-based URIs
- Service consumers uses multiple HTTP-Method

### Conventions

> Representational State Transfer - HTTP based operations to query and mutate resouce oriented server states

- GET - idempotent
- POST - non-idempotent
- PUT - idempotent
- DELETE - idempotent
- PATCH - non-idempotent
- HEAD - idempotent

> a = 4; // idempotent
> a++; // non-idempotent

- GET - 200 (Ok)
- POST - 201 (Created)
- PUT - 200 (Ok), 204 (No Content)
- DELETE - 200(Ok), 202 (Accepted), 204 (No Content)

## Hypermedia with ExpressJS

- [RESTful Example](EXAMPLES/ARCHITECTURE/restfule.md)
- [Hypemedia Example](EXAMPLES/ARCHITECTURE/hypermedia.md)

## Web-Sockets

- [WebSocket Example](EXAMPLES/ARCHITECTURE/websockets.md)
