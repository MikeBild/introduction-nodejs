const { createReadStream, createWriteStream } = require('fs');
const express = require('express');
const app = express.Router();

module.exports = app;

app.get('/', (req, res) => {
  req.todoList ....
});

app.get('/:id', (req, res) => {
  req.todoList ....
});

app.get('/changedStream', (req, res) => {
  res.setHeader('Transfer-Encoding', 'chunk');
  res.setHeader('Content-Type', 'text/event-stream');
  req.eventemitter.on('changed', payload => {
    res.write(`${JSON.stringify(payload, null, 4)}\n`);
  });
  res.write('\n\n');
});
