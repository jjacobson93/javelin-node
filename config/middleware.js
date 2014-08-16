var _ = require('lodash');

module.exports = function(app) {
	var config = app.get('config');
	// Set up local variables to use in templates
	app.use(function(req, res, next) {
		res.locals.authUser = req.user;
		res.locals._csrf = req.csrfToken();
		res.locals.flash = req.flash();
		res.locals.now = new Date();
		res.locals.version = app.get('version');
		res.locals.accountName = config.accountName;
		res.locals._ = _;

		res.cookie('XSRF-TOKEN', res.locals._csrf);

		next();
	});
};