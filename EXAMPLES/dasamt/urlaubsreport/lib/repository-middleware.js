const DATA_FOLDER = process.env.DATA_FOLDER || 'data';
const PORT = process.env.PORT || 8080;

module.exports = function(repository) {
	return function(req, res, next) {
		req.repository = repository;
		next();
	};
};
