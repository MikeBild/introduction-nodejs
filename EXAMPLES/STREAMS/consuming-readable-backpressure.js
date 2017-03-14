const ReadStream = require('./readStream.js');
const stream = new ReadStream();

stream.on('data', record => {
  console.log('received: ' + JSON.stringify(record));
  console.log('pausing stream for 2 seconds');
  stream.pause();
  setTimeout(() => {
    console.log('resuming stream');
    stream.resume();
  }, 2000);
});

stream.on('end', () => console.log('done'));
