const http = require('http');
const fs = require('fs');
const {EventEmitter} = require('events');
const em1 = new EventEmitter();
let count = 0;
setInterval(() => em1.emit('my-event', {timestamp: Date.now(), count: ++count}), 1000);

const server = http.createServer(router);
const instance = server.listen(8080, () => console.log(`Listen on ${instance.address().port}`));

function router(req, res) {
  console.log(req.url)
  switch(req.url) {
    case '/':
      res.end('Hello World');
      break;
    case '/file-content':
      sendFileContent(req, res);
      break;
    case '/live-stream':
      res.setHeader('Content-Type', 'text/event-stream');
      const myHandler = evt => res.write(`data: ${JSON.stringify(evt)}\n\n`)

      em1.on('my-event', myHandler);
      console.log(em1.listenerCount('my-event'));

      req.connection.on('close', () => {
        em1.removeListener('my-event', myHandler);
        console.log(em1.listenerCount('my-event'));
      });
      break;
  }
}

function sendFileContent (req, res) {
  const fileStream = fs.createReadStream('demo.json');
  // fileStream.on('data', data => console.log(data.toString()));
  fileStream.pipe(res);
}
