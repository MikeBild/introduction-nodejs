# Streams API

> Objects to read data from a source or write data to a destination in continuous fashion

- Readable − Stream which is used for read operation
- Writable − Stream which is used for write operation
- Transform − A type of duplex stream where the output is computed based on input
- Duplex − Stream which can be used for both read and write operation

> Stream is an EventEmitter instance

- data − This event is fired when there is data immediate available
- readable − This event is fired when there is data is available to read
- end − This event is fired when there is no more data to read
- error − This event is fired when there is any error receiving or writing data
- finish − This event is fired when all the data has been flushed to underlying system

## Reading from a Stream

```javascript
const fs = require('fs');
const data = '';

// Create a readable stream
const readerStream = fs.createReadStream('input.txt');

// Set the encoding to be utf8.
readerStream.setEncoding('UTF8');

// Handle stream events --> data, end, and error
readerStream.on('data', chunk => {
  data += chunk;
});

readerStream.on('end', () => {
  console.log(data);
});

readerStream.on('error', err => {
  console.log(err.stack);
});

console.log('Done');
```

## Writing to a Stream

```javascript
const fs = require('fs');
const data = 'Simply Easy Learning';

// Create a writable stream
const writerStream = fs.createWriteStream('output.txt');

// Write the data to stream with encoding to be utf8
writerStream.write(data, 'UTF8');

// Mark the end of file
writerStream.end();

// Handle stream events --> finish, and error
writerStream.on('finish', () => {
  console.log('Write completed.');
});

writerStream.on('error', err => {
  console.log(err.stack);
});

console.log('Done');
```

## Piping the Streams

> Provide the output of one stream as the input to another stream

```javascript
const fs = require('fs');

// Create a readable stream
const readerStream = fs.createReadStream('input.txt');

// Create a writable stream
const writerStream = fs.createWriteStream('output.txt');

// Pipe the read and write operations
// read input.txt and write data to output.txt
readerStream.pipe(writerStream);

console.log('Done');
```

## Chaining the Streams

> Create a chain of multiple stream operations

```javascript
const fs = require('fs');
const zlib = require('zlib');

// Compress the file input.txt to input.txt.gz
fs.createReadStream('input.txt')
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream('input.txt.gz'));

console.log('File Compressed.');
```

## Creating Streams

## Readable

- Readable streams are sources of data that are waiting to be read
- Readable Stream types
  - Flowing - doesn’t have to ask for the data [Example](STREAMS/consuming-readable-flowing.js)
  - Non-flowing - pushes some of it’s data to the read queue and then emits its readable event [Example](STREAMS/consuming-readable-non-flowing.js)
  - Flow Control (Backpressure) - you can pause and resume streams [Example](STREAMS/consuming-readable-backpressure.js)

## Writeable

- Writable streams are destinations of data [Example](STREAMS/consuming-writable.js)

## Transform Streams

- Transform streams are intermediaries of readable and writable streams [Example](STREAMS/consuming-transform.js)
