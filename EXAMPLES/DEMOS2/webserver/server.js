const http = require('http');
const fs = require('fs');
const EventEmitter = require('events');

const em1 = new EventEmitter();

em1.on('my-event', msg => {
  console.log(JSON.stringify(msg, null, 4));
});

let count = 0;
setInterval(() => {
  em1.emit('my-event', {foo: ++count});
}, 1000);

const server = http.createServer((req, res) => {
  console.log('req/res');
  switch(req.url) {
    case '/':
      res.write('root');
      res.write('foo ');
      res.write('bar');
      res.end();
      break;
    case '/file':
      fs.createReadStream('index.html').pipe(res);
      break;
    case '/subscribe':
      res.setHeader('Content-Type', 'text/event-stream');
      const myHandler =  msg => res.write(`data: ${JSON.stringify(msg)}\n\n`);
      em1.on('my-push', myHandler);
      req.connection.once('close', () => {
        em1.removeListener('my-push', myHandler);
        res.end();
      });
      break;
    case '/push':
      if(req.method !== 'POST') return res.end();
      em1.emit('my-push', {some: 'stuff'});
      res.end();
      break;
    case '/hello':
      res.write('hello world');
      res.end();
      break;
  }
});

const instance = server.listen(8080, () => {
  console.log(`Listen on ${instance.address().port}`);
});