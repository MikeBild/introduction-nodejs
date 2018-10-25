const PORT = process.env.PORT;
const express = require('express');
const app = express();

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

const server = app.listen(PORT, () =>
  console.log(`Listen on ${server.address().port}`),
);
