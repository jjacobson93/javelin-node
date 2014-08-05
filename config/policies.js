
exports.requiresLogin = function(req, res, next) {
	if (!req.isAuthenticated()) {
		req.flash = {message: "You need to login to view this page.", type: "error"};
		res.redirect('/#/login');
	} else {
		next();
	}
};