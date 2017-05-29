const http = require('http');
const fs = require('fs');
const {EventEmitter} = require('events');
const em1 = new EventEmitter();

em1.on('foo:bar', msg => console.log(`msg received: ${JSON.stringify(msg)}`));
em1.emit('foo:bar', {foo: 'bar'});

const server = http.createServer((req, res) => {
  const fileStream = fs.createReadStream('demo.json');
  fileStream.on('data', data => console.log(data.toString()));
  fileStream.pipe(res);
});

  // fs.readFile('demo.json', (err, data) => {

    // if(err) {
    //   res.statusCode = 500;
    //   res.write(JSON.stringify({message: err.message}));
    // }

    // res.end(data || '');
  // });


const instance = server.listen(8080, () => console.log(`Listen on ${instance.address().port}`));
