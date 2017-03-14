const ReadStream = require('./readStream.js');
const WriteStream = require('./writeStream.js');

const rs = new ReadStream();
const ws = new WriteStream();
rs.pipe(ws);
