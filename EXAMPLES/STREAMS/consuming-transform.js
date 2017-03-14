const ReadStream = require('./readStream.js');
const WriteStream = require('./writeStream.js');
const TransformStream = require('./transformStream.js');

const rs = new ReadStream();
const ws = new WriteStream();
const ts = new TransformStream();

rs.pipe(ts).pipe(ws);
