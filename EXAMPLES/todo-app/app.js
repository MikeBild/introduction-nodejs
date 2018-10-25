const PORT = process.env.PORT;
const express = require('express');
const app = express();
const { createReadStream, createWriteStream } = require('fs');
const EventEmitter = require('events');
const eventemitter1 = new EventEmitter();

let count = 0;
setInterval(() => {
  eventemitter1.emit('changed', { count: count++ });
}, 1000);

eventemitter1.on('changed', payload => {
  console.log({ payload });
});

app.set('view engine', 'ejs');

const todoList = [{ id: 1, description: 'todo1' }];

app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.baseUrl = process.env.BASEURL;
  console.log(`${new Date()}: ${req.method}`);
  next();
});

app.get('/', (req, res) => {
  res.render('index', { title: 'ToDo-App', todoList });
});

app.post('/', (req, res) => {
  const data = req.body;
  todoList.push({ ...data, id: todoList.length + 1 });
  res.redirect('/');
});

app.get('/api/todos', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const outputFile = createWriteStream('./backup.json');
  const inputFile = createReadStream('./todo-list.json');
  inputFile.pipe(outputFile);
  inputFile.pipe(res);
});

app.get('/api/todos/changedStream', (req, res) => {
  res.setHeader('Transfer-Encoding', 'chunk');
  res.setHeader('Content-Type', 'text/event-stream');
  eventemitter1.on('changed', payload => {
    res.write(`${JSON.stringify(payload, null, 4)}\n`);
  });
  res.write('\n\n');
});

const server = app.listen(PORT, () =>
  console.log(`Listen on ${server.address().port}`),
);
