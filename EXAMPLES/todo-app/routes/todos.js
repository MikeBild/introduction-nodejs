const { createReadStream, createWriteStream } = require('fs');
const express = require('express');
const app = express.Router();
const fetch = require('node-fetch');

module.exports = app;

app.get('/', async (req, res) => {
  const response = await fetch(
    `${req.todoDBBaseUrl}/_all_docs?include_docs=true`,
  );
  const data = await response.json();
  res.send(data.rows.map(row => ({ ...row.doc, id: row.doc._id })));
});

app.post('/', (req, res) => {
  const newTodo = { ...req.body, id: req.todoList.length + 1 };
  req.todoList.push(newTodo);
  res.send(newTodo);
});

app.get('/:id', (req, res) => {});

app.get('/changedStream', (req, res) => {
  res.setHeader('Transfer-Encoding', 'chunk');
  res.setHeader('Content-Type', 'text/event-stream');
  req.eventemitter.on('changed', payload => {
    res.write(`${JSON.stringify(payload, null, 4)}\n`);
  });
  res.write('\n\n');
});
