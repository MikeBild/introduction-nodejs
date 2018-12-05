const express = require('express');
const app = express.Router();

module.exports = app;

app.get('/', async (req, res) => {
	const {
		repository : {
			urlaubsantraege : { loadAll },
			urlaubsConfig   : { loadMaxAnzahl },
		},
	} = req;
	res.send(await loadAll());
});

app.post('/', async (req, res) => {
	const newUrlaubsantrag = req.body;
	const { repository: { urlaubsantraege: { insert } } } = req;

	res.status(201).send(await insert(newUrlaubsantrag));
});
