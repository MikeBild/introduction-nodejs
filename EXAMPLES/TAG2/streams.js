const { createReadStream, createWriteStream } = require('fs');
const through = require('through2');

const source = createReadStream('./demo.csv');
const destination1 = createWriteStream('./backup.csv');
const destination2 = createWriteStream('./backup2.csv');

source.on('data', chunk => {
  console.log('New chunk');
  // console.log({ chunk: chunk.toString() });
});

source.on('close', chunk => {
  console.log('Close');
});

source.on('error', error => {
  console.log('Error', error);
});

source
  .pipe(
    through(function(chunk, enc, callback) {
      const data = chunk.toString();
      const newChunk = data
        .split('\n')
        .map(x =>
          x
            .split(',')
            .map(y => y + y)
            .join(',')
        )
        .join('\n');

      this.push(newChunk);
      callback();
    })
  )
  .pipe(destination1);

source.pipe(destination2);
