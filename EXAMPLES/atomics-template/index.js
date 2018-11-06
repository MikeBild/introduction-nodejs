#!/usr/bin/env node
const PORT = process.env.PORT || 8080;
const { resolve } = require('path');
const express = require('express');

const main = process.argv[2] && require(resolve(process.argv[2]));
const app = express();

app.use(main);

const instance = app.listen(PORT, () =>
  console.log(`Listen on ${instance.address().port}`)
);
