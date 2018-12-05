const express = require('express');
const app = express.Router();
const generateUrlaubsreport = require('../../lib/generateUrlaubsreport');
module.exports = app;

app.get('/', (req, res) => {
	const { data: { urlaubsantraege, maxAnzahl } } = req;
	res.send(generateUrlaubsreport(urlaubsantraege, maxAnzahl));
});
