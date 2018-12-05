const fetch = require('node-fetch');
const { startServer, stopServer } = require('../server');

const { equal, deepEqual } = require('assert');
describe('Integrations Tests', () => {
	describe('Urlaubsreport ', () => {
		let instance;
		before(async () => {
			instance = await startServer({
				data : {
					urlaubsantraege : [
						{ name: 'Max', amount: 3, ok: false },
						{ name: 'Peter', amount: 4, ok: false },
						{ name: 'Max', amount: 2, ok: true },
					],
					maxAnzahl       : 30,
				},
			});
		});

		after(async () => {
			await stopServer(instance);
		});

		it('should return a report', async () => {
			const response = await fetch(
				`http://localhost:${instance.address().port}/api/urlaubsreport`,
				{
					headers : {
						'Content-Type' : 'application/json',
					},
				}
			);
			equal(response.status, 200);

			const actual = await response.json();
			deepEqual(actual, {
				Max : { name: 'Max', rest: 28 },
			});
		});
	});
});
