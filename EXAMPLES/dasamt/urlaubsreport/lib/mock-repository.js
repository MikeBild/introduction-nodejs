module.exports = {
	urlaubsantraege : {
		loadAll : loadAllUrlaubsantraege,
		insert  : insertUrlaubsantrag,
	},
	urlaubsConfig   : {
		loadMaxAnzahl,
	},
};

async function loadAllUrlaubsantraege() {
	return [
		{ name: 'Max', amount: 3, ok: false },
		{ name: 'Peter', amount: 4, ok: false },
		{ name: 'Max', amount: 2, ok: true },
	];
}

async function insertUrlaubsantrag(urlaubsantrag) {
	return {
		...urlaubsantrag,
		id : urlaubsantrag.name,
	};
}

async function loadMaxAnzahl() {
	return 30;
}
