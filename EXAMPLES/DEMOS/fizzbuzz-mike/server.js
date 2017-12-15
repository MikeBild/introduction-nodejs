const oldLog = console.log;
console.log = txt => oldLog(JSON.stringify({timestamp: Date.now(), data: txt}));

const SERVICE_PORT = process.env.SERVICE_PORT;
const server = require('./fizzbuzz-express');
const os = require('os');

function init() {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('Lade Daten');
      resolve({port: process.env.SERVICE_PORT});
    }, 5000);
  });
}

init().then(({port}) => {
  server.start(port, () => console.log(`Listen on ${server.port()}`));
});

process.on('SIGINT', () => {
  console.log('Shutdown ... ');
  setTimeout(() => {
    console.log('done...');
    process.exit(0);
  }, 5000);
});

setInterval(() => {
  console.log(os.freemem());
  console.log(os.uptime());
}, 10000);
