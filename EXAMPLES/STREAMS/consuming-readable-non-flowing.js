const ReadStream = require('./readStream.js');
const stream = new ReadStream();

stream.on('readable', () => {
  while (null !== (record = stream.read())) {
    console.log('received: ' + JSON.stringify(record));
  }
});

stream.on('end', () => console.log('done'));
