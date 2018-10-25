const PORT = process.env.PORT;
const express = require('express');
const cors = require('cors');
const app = express();

const todosAppMiddleware = require('./lib/todo-app-middleware');
const todosRoutes = require('./routes/todos');
const htmlRoutes = require('./routes/html');

app.set('view engine', 'ejs');

app.use(cors());
app.use('/', express.static('dist'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: true }));
app.use(todosAppMiddleware);
app.use('/html', htmlRoutes);
app.use('/api/todos', todosRoutes);

app.use((error, req, res, next) => {
  console.log('ERROR');
  next(error);
});

const server = app.listen(PORT, () =>
  console.log(`Listen on ${server.address().port}`),
);
