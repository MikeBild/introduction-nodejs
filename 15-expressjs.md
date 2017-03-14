# ExpressJS

## Overview

* [Basics](#setup)
* [Environment & Practices](#environment-and-practices)
* [Middleware](#middleware)
* [Render Views with Templates](#render-views-with-templates)
* [EJS](#ejs)
* [Routes](#routes)
* [Error Handling](#error-handling)
* [Web-Sockets](#socketio)
* [RESTful / Hypermedia](#restful-routing)
* [Web-Events / Feeds](#event-streams)

## Examples

* [Express Server-Side-Render](EXAMPLES/EXPRESSJS/SSR/README.md)
* [Hypermedia](EXAMPLES/EXPRESSJS/HYPERMEDIA/README.md)
* [Events / Hooks](EXAMPLES/EXPRESSJS/EVENTS/README.md)
* [Socket.IO](EXAMPLES/EXPRESSJS/SOCKETS/README.md)

## Setup

```bash
npm install express --save
```

```javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Hello World'));

const server = app.listen(3000,  () => {
   const address = server.address() || {};
   console.log(`Example app listening at http://${address.host}:${address.port}`);
});
```

## Environment & Practices

* Use the "right" logging
* Use Process-Manager (forever / PM2)
* Use `NODE_ENV=production` || `NODE_ENV=development`
* Use Compression & Caching
* Handle exception with (try/catch) / Promise-Catch and prefer Fail-Fail (avoid handling 'uncaughtException')
* Use ENVIRONMENT VARIABLES
* Use SIGNALS (SIGTERM / SIGHUB) for graceful shutdowns

## Middleware

* Static Files
* Compression
* Body-Parser
* Cookie-Parser
* CORS
* Multi-Part
* Request/Response Time
* Session
* Authentication (Passport)

## Service Static Files

```javascript
app.use(express.static('./public'));
```

## Compression

```
const compression = require('compression');
app.use(compression());
```

## Logging with Morgan

`npm install morgan --save`

```javascript
const morgan = require('morgan');
app.use(morgan());
```

## Render Views with Templates

* `npm install ejs --save`
* [EJS](http://www.embeddedjs.com/)

```javascript
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/index.html', (req, res) => res.render('index', {title: 'Title'}));
```

## EJS

### Tags
* `<%`   'Scriptlet' tag, for control-flow, no output
* `<%=`  Outputs the value into the template (escaped)
* `<%-`  Outputs the unescaped value into the template
* `<%#`  Comment tag, no execution, no output
* `-%>`  Trim-mode ('newline slurp') tag, trims following newline

### Includes

* use `<%- include('common/footer') %>`

### Master-Layouts

* [ejs-locals](https://github.com/RandomEtc/ejs-locals)

## Routes

### Chaining Routes

```javascript
app.route('/books')
  .get((req, res) => res.send('Get a random book'))
  .post((req, res) => res.send('Add a book'))
  .put((req, res) => res.send('Update the book'))
```

### Router-Object

#### Exports

```javascript
const express = require('express');
const router = express.Router();

// middleware that is specific to this router
router.use((req, res, next) => {
  console.log('Time: ', Date.now())
  next()
})

// define the home page route
router.get('/', (req, res) => res.send('Home page'));

// define the about route
router.get('/about',  => (req, res) => res.send('About page'));

module.exports = router;
```

#### Include

```javascript
const books = require('./books');
// ...
app.use('/books', books);
```

### RESTful Routing

```javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Hello GET'));
app.post('/', (req, res) => res.send('Hello POST'));
app.delete('/del_user', (req, res) => res.send('Hello DELETE'));
app.get('/ab*cd', (req, res) => res.send('Page Pattern Match'));

const server = app.listen(3000, () => {
   const address = server.address() || {};
   console.log(`Example app listening at http://${address.host}:${address.port}`);
});
```

## Error Handling

### Last Handler (e.g. 404)

```javascript
app.use('*', (req, res) => {
  res.render('404', err);
});
```

### Handle ExpressJS Errors

```javascript
app.use((err, req, res, next) => {
  // handle error
  console.error(err);
  next();
});
```

### When Promise

```javascript
app.get('/', (req, res, next) => {
  doAsync()
    .then(data => res.send(data))
    .catch(next);
});
```

## Event Streams

> Works like a continuous data __feed__

```javascript
app.get('/subscribe/:feedName', (req, res) => {
  res.set('Transfer-Encoding', 'chunked');
  stream.on(req.params.feedName || 'progress', (data) => {
    res.write(JSON.stringify(data)+'\n');
  });
});
```

## SocketIO

`npm install ws --save`

### Server

```javascript
const WebSocketServer = require('ws').Server
const wss = new WebSocketServer({ port: 3000 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  ws.send('something');
});
```

### Client
```javascript
  window.onload = function() {
    var socket = new WebSocket('ws://localhost:3000');

    socket.onopen = function(event) {
      console.log(event)
      // Send an initial message
      socket.send('I am the client and I\'m listening!');

      // Listen for messages
      socket.onmessage = function(event) {
        console.log('Client received a message',event);
      };

      // Listen for socket closes
      socket.onclose = function(event) {
        console.log('Client notified socket has closed', event);
      };

      // To close the socket....
      //socket.close()

    }
  }
```
