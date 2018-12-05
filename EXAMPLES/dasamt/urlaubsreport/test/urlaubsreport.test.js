const { equal, deepEqual } = require('assert');
describe(' Unit Tests', () => {
	describe('Urlaubsreport ', () => {
		it('an empty list of antraege, should calculate an empty report', () => {
			// Arrange
			const generateUrlaubsreport = require('../lib/generateUrlaubsreport');
			// Act
			const actual = generateUrlaubsreport([], 30);
			// Assert
			deepEqual(actual, {});
		});
		it('3 not ok antraege should, should calculate an empty report', () => {
			// Arrange
			const generateUrlaubsreport = require('../lib/generateUrlaubsreport');
			// Act
			const actual = generateUrlaubsreport(
				[ { name: 'Max', amount: 3 }, { name: 'Peter', amount: 4 }, { name: 'Max', amount: 2 } ],
				30
			);
			// Assert
			deepEqual(actual, {});
		});
		it('3 ok antraege should, should calculate a report', () => {
			// Arrange
			const generateUrlaubsreport = require('../lib/generateUrlaubsreport');
			// Act
			const actual = generateUrlaubsreport(
				[
					{ name: 'Max', amount: 3, ok: true },
					{ name: 'Peter', amount: 4, ok: true },
					{ name: 'Max', amount: 2, ok: true },
				],
				30
			);
			// Assert
			deepEqual(actual, {
				Max: { name: 'Max', rest: 25 },
				Peter: { name: 'Peter', rest: 26 },
			});
		});
		it('2 ok and 1 not ok antraege should, should calculate a report', () => {
			// Arrange
			const generateUrlaubsreport = require('../lib/generateUrlaubsreport');
			// Act
			const actual = generateUrlaubsreport(
				[
					{ name: 'Max', amount: 3, ok: false },
					{ name: 'Peter', amount: 4, ok: true },
					{ name: 'Max', amount: 2, ok: true },
				],
				30
			);
			// Assert
			deepEqual(actual, {
				Max: { name: 'Max', rest: 28 },
				Peter: { name: 'Peter', rest: 26 },
			});
		});
		it('2 ok and 1 not ok antraege should, should calculate a report', () => {
			// Arrange
			const generateUrlaubsreport = require('../lib/generateUrlaubsreport');
			// Act
			const actual = generateUrlaubsreport(
				[
					{ name: 'Max', amount: 3, ok: false },
					{ name: 'Peter', amount: 4, ok: false },
					{ name: 'Max', amount: 2, ok: true },
				],
				30
			);
			// Assert
			deepEqual(actual, {
				Max: { name: 'Max', rest: 28 },
			});
		});
	});
});
