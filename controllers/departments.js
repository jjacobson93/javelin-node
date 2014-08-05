var db = require('../models');

exports.findAll = function(req, res) {
	var query = {};

	if (req.query.name) {
		query.where = { name: { like: '%' + req.query.name + '%' } };
	}

	db.department.findAll(query, {
		transaction: req.t
	}).success(function(departments) {
		res.json(departments);
	}).error(function(err) {
		res.status(400).json({ message: err });
	});
};