module.exports = {
	isBestaetigtWorden,
	hasName,
};
function isBestaetigtWorden(antrag) {
	return antrag.ok === true;
}

function hasName(antrag) {
	return antrag.name ? true : false;
}
