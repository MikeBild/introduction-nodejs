const DBURL = process.env.DBURL || 'myurl';
const express = require('express');
const dbMiddleware = require('./dbMiddleware');
const usersRoutes = require('./routes/users');
const app = express();

app.use(dbMiddleware(DBURL));
app.use('/users', usersRoutes);

const instance = app.listen(8080, () => {
  console.log(`Listen on ${instance.address().port}`);
});
