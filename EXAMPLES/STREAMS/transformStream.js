const Transform = require('stream').Transform;
const util = require('util');

const TransformStream = function() {
  Transform.call(this, {objectMode: true});
};
util.inherits(TransformStream, Transform);

TransformStream.prototype._transform = function(chunk, encoding, callback) {
  console.log('transform before : ' + JSON.stringify(chunk));

  if (typeof chunk.originalValue === 'undefined') chunk.originalValue = chunk.value;
  chunk.value++;

  console.log('transform after : ' + JSON.stringify(chunk));
  this.push(chunk);
  callback();
};

module.exports = TransformStream;
