const { PORT, configMiddleware } = require('./lib/config-middleware');
const mockData = require('./lib/mockdata-middleware');
const express = require('express');
const home = require('./routes/home');
const apiUrlaubsreport = require('./routes/api/urlaubsreport');
const apiHealthcheck = require('./routes/api/healthcheck');
const app = express();

module.exports = {
	startServer,
	stopServer,
};

app.set('view engine', 'ejs');
app.use(express.urlencoded({}));
app.use(configMiddleware);

app.use((error, req, res, next) => {
	console.error(error);
	res.render('error', { error });
});

function startServer({ port, data = {} }) {
	app.use(mockData(data));
	app.use('/', home);
	app.use('/api/urlaubsreport', apiUrlaubsreport);
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
