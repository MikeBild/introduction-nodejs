const express = require('express');
const expressBodyParser = require('body-parser');
const app = express();
const uuid = require('uuid');
let instance = null;

//in-memory
const shoes = [];
app.use(expressBodyParser.json());
app.use((req, res, next) => {
  console.log(`LOG: ${req.method} ${req.url}`);
  next();
});
app.get('/shoes', (req, res) => res.send(shoes));
app.post('/shoes', (req, res) => {
  const shoe = req.body;
  shoe.id = uuid.v1();
  shoes.push(shoe);
  res.status(201).send(shoe);
});

app.use((err, req, res, next) => {
  console.log(`An error: ${err.message}`);
  res.status(500).send();
});

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

