var _ = require('lodash');
var db = require('../models');

exports.requiresLogin = function(req, res, next) {
	if (!req.isAuthenticated()) {
		req.flash = {message: "You need to login to view this page.", type: "error"};
		res.status(401).redirect('/#/login');
	} else {
		next();
	}
};

exports.authRolesCheck = function(roles) {
	return function(req, res, next) {
		if (_.intersection(req.user.roles, roles).length == 0 && !_.contains(req.user.roles, 'super')) { // User has none of the roles specified
			// req.flash = {message: "You need to login to view this page.", type: "error"};
			res.status(403);
			next("Forbidden");
			return;	
		}

		next();
	}
}

exports.isUser = function(req, res, next) {
	if (_.intersection(req.user.roles, ['super', 'admin', 'staff']).length == 0 && req.param('id') !== req.user.id) {
		res.status(403);
		next("Forbidden");
		return;
	}
	next();
}

exports.isPerson = function(req, res, next) {
	if (_.intersection(req.user.roles, ['super', 'admin', 'staff']).length == 0 && req.param('id') != req.user.person_id) {
		res.status(403);
		next("Forbidden");
		return;
	}
	next();
}