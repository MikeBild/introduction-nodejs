const express = require('express');
const app = express.Router();

module.exports = app;

app.get('/', (req, res, next) => {
  console.log(req.header('Accept'));

  res.send(req.store.consumers);
});

app.post('/:id', (req, res) => {
  const id = req.params.id;

  req.store.consumers.push({ id });

  res.redirect('/consumers');
});
