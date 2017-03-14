const Writable = require('stream').Writable;
const util = require('util');

const WriteStream = function() {
  Writable.call(this, {objectMode: true});
};
util.inherits(WriteStream, Writable);

WriteStream.prototype._write = (chunk, encoding, callback) => {
  console.log('write: ' + JSON.stringify(chunk));
  // done with the current piece of data and is ready for the next piece of data.
  callback();
};

// simulate slow writes
/*
WriteStream.prototype._write = (chunk, encoding, callback) => {
  console.log('write: ' + JSON.stringify(chunk));
  console.log('waiting 2 seconds');
  setTimeout(() => {
    console.log('finished waiting');
    callback();
  }, 2000);
};
*/

module.exports = WriteStream;
