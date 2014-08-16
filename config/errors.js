var errorHandler = require('../lib/errorHandler');

module.exports = function(app) {
	app.all('*', function(req, res, next) {
		res.status(404);
		next("Page not found");
	});

	// Cannot find
	app.use(function(err, req, res, next) {
		if (res.statusCode >= 400 && res.statusCode <= 404) return res.render(res.statusCode);
		else return next();
	});

	// 500 handler
	app.use(errorHandler());
}