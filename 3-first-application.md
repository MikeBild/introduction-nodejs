# First Application

## Import requires modules

```javascript
const http = require('http');
```

## Create a HTTP server

```javascript
http
  .createServer((request, response) => {
    // Send the HTTP header
    // HTTP Status: 200 : OK
    // Content Type: text/plain
    response.writeHead(200, { 'Content-Type': 'text/plain' });

    // Send the response body as "Hello World"
    response.end('Hello World\n');
  })
  .listen(8081);

// Console will print the message
console.log('Server running at http://127.0.0.1:8081/');
```

## Create a HTTPS server

```javascript
```

## Read request and return response

```bash
node main.js
curl -XGET http://localhost:8081
```
