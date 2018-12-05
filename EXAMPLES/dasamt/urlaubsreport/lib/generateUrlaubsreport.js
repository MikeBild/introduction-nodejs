const { hasName, isBestaetigtWorden } = require('./businessRules');

module.exports = function(urlaubsantraege, maxAnzahl) {
	return urlaubsantraege
		.filter(hasName)
		.filter(isBestaetigtWorden)
		.reduce((state, { name, amount }) => {
			if (!state[name]) state[name] = { name, rest: maxAnzahl };

			state[name].rest -= amount;
			return state;
		}, {});
};
