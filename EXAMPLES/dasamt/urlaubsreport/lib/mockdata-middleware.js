const DATA_FOLDER = process.env.DATA_FOLDER || 'data';
const PORT = process.env.PORT || 8080;

module.exports = function(data) {
	return function(req, res, next) {
		req.data = JSON.parse(JSON.stringify(data));
		next();
	};
};
