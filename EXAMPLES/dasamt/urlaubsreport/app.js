const { startServer, stopServer } = require('./server');

main();

async function main() {
	const instance = await startServer({
		port : 8080,
	});
	console.log(`Listen on ${instance.address().port}`);
}
