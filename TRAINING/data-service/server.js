const { join } = require('path');
const { spawn } = require('child_process');
const express = require('express');
const morgan = require('morgan');
const app = express();
app.use(morgan());

app.set('views', join(__dirname, 'views'));
app.set('view engine', 'ejs');

module.exports = config => {
  const defaults = {
    isAuthenticationEnabled: true,
    ...config,
  };
  app.config = defaults;
  return app;
};

// Auth Middleware
app.use((req, res, next) => {
  if (!app.config.isAuthenticationEnabled) return next();
  if (!req.headers.authorization) return next(new Error('Unauthorized'));
  req.isAuthenticated = true;
  next();
});

// User Middleware
function userMiddleware({ timeout = 300 }) {
  return ({ isAuthenticated, user = {} }, _, next) => {
    if (!isAuthenticated) return next();

    setTimeout(() => {
      user.name = 'foo';
      next();
    }, timeout);
  };
}

// Enable User-Middleware
app.use(userMiddleware({ timeout: 200 }));

app.use('/public', express.static('./public'));

app.get('/foo', (req, res) => res.render('foo', { foo: 'Hello World!' }));

app.get('/customers', async ({ user, isAuthenticated }, res) => {
  const results = await app.config.db.all('SELECT * FROM customers');
  res.send({ results });
});

app.get('/customers/:id', (req, res) => {
  res.send({ newId: req.params.id });
});
app.post('/customers', (req, res) => {
  const newCreatedId = 'sjjsjd';
  res.status(201).send({ newId: newCreatedId });
  // res.redirect(201, `/customers/${newCreatedId}`);
});
app.delete('/customers/:id', (req, res) => {
  res.status(204).send();
});

app.get('/alles', (req, res) => {
  const cp = spawn('ls', ['-lha']);
  cp.stdout.pipe(res);
});

app.get('*', (req, res) => {
  res.status(404).send({ message: 'not found' });
});

app.use(({ message }, req, res, next) => {
  console.log(`Fehler: ${message}`);
  if (message === 'Unauthorized') return res.sendStatus(401);

  res.status(500).send({ message: message });
});
