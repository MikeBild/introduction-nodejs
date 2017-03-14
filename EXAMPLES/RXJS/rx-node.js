const spawn = require('child_process').spawn;
const Rx = require('rx');
const RxNode = require('rx-node');

RxNode.fromStream(spawn('ls', ['-lha']).stdout)
  .map(x => x.toString())
  .do(console.log)
  .subscribe()
