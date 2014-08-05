var errorHandler = require('../lib/errorHandler');

module.exports = function(app) {
	// Error handler
	app.use(errorHandler());
}