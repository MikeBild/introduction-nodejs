const express = require('express');
const app = express.Router();

module.exports = app;

app.get('/', (_, res) => {
  res.send('Hello World');
});

app.get('/users', (req, res) => {
  res.send([{ id: 1 }]);
});
