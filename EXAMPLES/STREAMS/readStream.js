const data = require('./dataSource.json');
const Readable = require('stream').Readable;
const util = require('util');

const ReadStream = function () {
  Readable.call(this, {objectMode: true});
  this.data = data;
  this.curIndex = 0;
};

util.inherits(ReadStream, Readable);

ReadStream.prototype._read = function() {
  if (this.curIndex === this.data.length) return this.push(null);

  const data = this.data[this.curIndex++];
  console.log('read: ' + JSON.stringify(data));
  this.push(data);
};

module.exports = ReadStream;
