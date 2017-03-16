const fs = require('fs');
const https = require('https');
const express = require('express');
const expressBodyParser = require('body-parser');
const RateLimit = require('express-rate-limit');
const expressAuth = require('./auth-middleware');
const docsApi = require('../routes/docs');
const app = express();

const limiter = new RateLimit({
  windowMs: 15*60*1000,
  max: 10,
  delayMs: 0,
  headers: true, 
});

app.use(limiter);
app.use(expressBodyParser.json());
app.use((req, res, next) => {
  const dbValues = {
    'user1': { username: 'user1', role: 'admin', }
  };

  req.database = {
    get: key => dbValues[key],
    set: (key, value) => dbValues[key] = value,
  };

  next();
});
app.get('/', (req, res, next) => res.send({msg: 'foo', user1: req.database.get('user1')}));
app.use('/docs', expressAuth.basicAuth(), docsApi);

let httpsServer = undefined;
module.exports = () => {
  return {
    start: ({ port }) => new Promise(resolve => {       
      httpsServer = https.createServer({ key: fs.readFileSync('psx').toString(), cert: fs.readFileSync('psx.cert').toString()}, app).listen(port, () => resolve(httpsServer));
    }),
    stop: () => new Promise(resolve => (httpsServer || {}).close(resolve)),
  };
};