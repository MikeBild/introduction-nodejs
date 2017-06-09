const SERVICE_PORT = process.env.SERVICE_PORT;
const NODE_ENV = process.env.NODE_ENV;

if(!SERVICE_PORT) {
  console.error(`ENV-VAR SERVICE_PORT is missing`);
  process.exit(1);
}

process.on('SIGINT', () => {
  console.log(`Graceful shutdown`);
  process.exit(0);
  // ... clean up resources ...
});

const express = require('express');
const app = express();

app.get('/kontos/:id?', (req, res) => {
  res.send({balance: 0});
});

const instance = app.listen(SERVICE_PORT, () => console.log(`Listen on ${instance.address().port}`))
