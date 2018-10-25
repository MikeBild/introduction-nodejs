const express = require('express');
const app = express.Router();

module.exports = app;

app.get('/', (req, res) => {
  res.render('index', { title: 'ToDo-App', todoList: req.todoList });
});

app.post('/', (req, res) => {
  const data = req.body;
  req.todoList.push({ ...data, id: req.todoList.length + 1 });
  res.redirect('/');
});
