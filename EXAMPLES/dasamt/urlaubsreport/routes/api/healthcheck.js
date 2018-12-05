const express = require('express');
const app = express.Router();

module.exports = app;

app.get('/', (req, res) => {
	res.sendStatus(200);
});
