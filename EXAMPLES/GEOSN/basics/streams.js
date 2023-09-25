const fs = require("fs");
const zlib = require("zlib");
const { Transform } = require("stream");

const removeSpaces = new Transform({
  transform(chunk, encoding, callback) {    
    callback(null, String(chunk).replaceAll(" ", ""));
  },
});

const readerStream = fs.createReadStream("streams.js");

readerStream.on("data", (chunk) => {
  console.log(chunk.toString("utf-8"));
});

readerStream.on("end", () => {
  console.log("end");
});

readerStream.on("error", (error) => {
  console.error({ error });
});

const writerStream = fs.createWriteStream("copy.js");
readerStream.pipe(removeSpaces).pipe(writerStream);

const zipStream = zlib.createGzip();
const zipWriterStream = fs.createWriteStream("copy.zip");

readerStream.pipe(zipStream).pipe(zipWriterStream);
