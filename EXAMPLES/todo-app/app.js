const PORT = process.env.PORT;
const express = require('express');
const app = express();

const todosAppMiddleware = require('./lib/todo-app-middleware');
const todosRoutes = require('./routes/todos');
const htmlRoutes = require('./routes/html');

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(todosAppMiddleware);
app.use('/', htmlRoutes);
app.use('/api/todos', todosRoutes);

const server = app.listen(PORT, () =>
  console.log(`Listen on ${server.address().port}`),
);
