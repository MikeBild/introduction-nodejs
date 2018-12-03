const spawn = require('child_process').spawn;
const { from } = require('rxjs');
const { streamToRx, rxToStream } = require('rxjs-stream');
const { tap, map } = require('rxjs/operators');

// Stream to Observable
streamToRx(spawn('ls', ['-lha']).stdout)
  .pipe(map(x => x.toString()))
  .pipe(tap(x => console.log(x), error => console.error(error)))
  .subscribe();

// Observable to Stream
const sequence = from([1, 2, 3, '\n\n']).pipe(map(x => x.toString()));
const stream = rxToStream(sequence);
stream.pipe(process.stdout);
