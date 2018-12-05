const fetch = require('node-fetch');
const { startServer, stopServer } = require('../server');
const repository = require('../lib/mock-repository');

const { equal, deepEqual } = require('assert');
describe('Integrations Tests', () => {
	describe('Urlaubsantraege ', () => {
		let instance;
		before(async () => {
			instance = await startServer({
				repository,
			});
		});

		after(async () => {
			await stopServer(instance);
		});

		it('should return a new urlaubsantrag', async () => {
			const response = await fetch(
				`http://localhost:${instance.address().port}/api/urlaubsantraege`,
				{
					method  : 'POST',
					headers : {
						'Content-Type' : 'application/json',
					},
					body    : JSON.stringify({
						name : 'foo',
					}),
				}
			);
			equal(response.status, 201);

			const { id, name } = await response.json();
			equal(id, 'foo');
			equal(name, 'foo');
		});
	});
});
