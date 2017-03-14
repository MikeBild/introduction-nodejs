const ReadStream = require('./readStream.js');
const stream = new ReadStream();

stream.on('data', record => console.log('received: ' + JSON.stringify(record)));

stream.on('end', () => console.log('done'));
