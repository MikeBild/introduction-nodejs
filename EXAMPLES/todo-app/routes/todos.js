const { createReadStream, createWriteStream } = require('fs');
const express = require('express');
const app = express.Router();
const fetch = require('node-fetch');
const { mapToTodo } = require('../lib/todos/mappings');
module.exports = app;

app.get('/', async (req, res) => {
  const response = await fetch(
    `${req.todoDBBaseUrl}/_all_docs?include_docs=true`,
  );
  const data = await response.json();
  res.send(data.rows.map(row => ({ ...row.doc, id: row.doc._id })));
});

app.post('/', async (req, res) => {
  const response = await fetch(req.todoDBBaseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req.body),
  });
  const data = await response.json();
  res.send({ ...req.body, ...data });
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
