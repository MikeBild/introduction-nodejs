const { PORT, configMiddleware } = require('./lib/config-middleware');
const repositoryMiddleware = require('./lib/repository-middleware');
const express = require('express');
const home = require('./routes/home');
const apiUrlaubsreport = require('./routes/api/urlaubsreport');
const apiUrlaubsantraege = require('./routes/api/urlaubsantraege');
const apiHealthcheck = require('./routes/api/healthcheck');
const app = express();

module.exports = {
	startServer,
	stopServer,
};

app.set('view engine', 'ejs');
app.use(express.urlencoded({}));
app.use(express.json({}));
app.use(configMiddleware);

app.use((error, req, res, next) => {
	console.error(error);
	res.render('error', { error });
});

function startServer({ port, repository }) {
	app.use(repositoryMiddleware(repository));
	app.use('/', home);
	app.use('/api/urlaubsreport', apiUrlaubsreport);
	app.use('/api/urlaubsantraege', apiUrlaubsantraege);
	app.use('/healthcheck', apiHealthcheck);

	return new Promise((resolve) => {
		const instance = app.listen(port, () => resolve(instance));
	});
}

function stopServer(instance) {
	return new Promise((resolve) => {
		instance.close(() => resolve());
	});
}
