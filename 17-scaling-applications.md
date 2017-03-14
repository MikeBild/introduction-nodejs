# Scaling NodeJS Applications

* single-thread mode
* event-driven paradigm to handle concurrency
* child processes to parallelize processing in multi-core CPU

## Child processes always have three streams:

* child.stdin
* child.stdout
* child.stderr

* __child.stdio__

## How to

* [exec](https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback) - Runs a command in a shell and buffers the output
* [spawn](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options) - Lauches a new process with given command
* [fork](https://nodejs.org/api/child_process.html#child_process_child_process_fork_modulepath_args_options) - Special case of spawn() to create NodeJS processes

## Spawn

```javascript
child_process.spawn(command[, args][, options])
```

```javascript
const fs = require('fs');
const child_process = require('child_process');

for(let i = 0; i<3; i++) {
   const workerProcess = child_process.spawn('node', ['support.js', i]);

   workerProcess.stdout.on('data', data => {
      console.log('stdout: ' + data);
   });

   workerProcess.stderr.on('data', data => {
      console.log('stderr: ' + data);
   });

   workerProcess.on('close', code => {
      console.log('child process exited with code ' + code);
   });
}
```

## Exec

```javascript
child_process.exec(command[, options], callback)
```

```javascript
const fs = require('fs');
const child_process = require('child_process');

for(let i=0; i<3; i++) {
   const workerProcess = child_process.exec(`node support.js ${i}`, (error, stdout, stderr) => {
      if (error) {
         console.log(error.stack);
         console.log('Error code: '+error.code);
         console.log('Signal received: '+error.signal);
      }
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
   });

   workerProcess.on('exit', function (code) {
      console.log('Child process exited with exit code '+code);
   });
}
```

## Fork

```javascript
child_process.fork(modulePath[, args][, options])
```

```javascript
const fs = require('fs');
const child_process = require('child_process');

for(let i=0; i<3; i++) {
   const workerProcess = child_process.fork('support.js', [i]);

   workerProcess.on('close', function (code) {
      console.log('child process exited with code ' + code);
   });
}
```
