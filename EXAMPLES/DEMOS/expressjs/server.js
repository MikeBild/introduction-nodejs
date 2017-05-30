const express = require('express');
const app = express();
let instance = null;

// app.get('/', (req, res) => res.send({}));

module.exports = {
  start,
  stop,
};

function start ({port}) {
  return new Promise(resolve => {
    instance = app.listen(port, resolve);
  });
}

function stop () {
  return new Promise(resolve => (instance || {}).close(resolve));
}

