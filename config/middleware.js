
module.exports = function(app) {
	// Set up local variables to use in templates
	app.use(function(req, res, next) {
		res.locals.authUser = req.user;
		res.locals._csrf = req.csrfToken();
		res.locals.flash = req.flash();
		res.locals.timestamp = new Date();

		res.cookie('XSRF-TOKEN', res.locals._csrf);

		next();
	});
};