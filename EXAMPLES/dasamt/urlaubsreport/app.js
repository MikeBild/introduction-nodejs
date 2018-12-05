const { startServer, stopServer } = require('./server');
const repository = require('./lib/redis-repository');
let instance;

main();

async function main() {
	instance = await startServer({
		port       : 8080,
		repository,
	});
	console.log(`Listen on ${instance.address().port}`);
}

// process.on('SIGTERM', gracefulShutdown);
// process.on('SIGINT', gracefulShutdown);

function gracefulShutdown() {
	console.log('Shutdown initiated...');
	stopServer(instance).then(() => {
		console.log('Shutdown successful.');
		process.exit(0);
	});
}
