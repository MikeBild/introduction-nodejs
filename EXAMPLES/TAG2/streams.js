const { createReadStream, createWriteStream } = require('fs');
const through = require('through2');

const sourceFileStream = createReadStream('foo.json');
const backupFileStream = createWriteStream('backup.json');

sourceFileStream.pipe(backupFileStream);
sourceFileStream.on('data', data => {});
sourceFileStream.once('finish', () => {});
sourceFileStream.once('error', error => {});
// createReadStream('data.csv')

process.stdin
  .pipe(
    through(function(chunk, enc, callback) {
      const dataOp = chunk
        .toString()
        .split('\n')
        .map(x =>
          x
            .split(',')
            .map(y => y + y)
            .join(',')
        )
        .join('\n');
      this.push(dataOp);
      callback();
    })
  )
  .pipe(process.stdout);
