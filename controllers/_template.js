var db = require('../models');

exports.findAll = function(req, res) {
	db.MODELNAME.findAll({}, {
		transaction: req.t
	}).success(function(people) {
		res.json(people);
	}).error(function(err) {
		res.status(400).json({ message: err });
	});
};

exports.findOne = function(req, res) {
	db.MODELNAME.find({
		where: { id: req.params.id }
	}, {
		transaction: req.t
	}).success(function(MODELNAME) {
		res.json(MODELNAME);
	}).error(function(err) {
		res.status(400).json({ message: err });
	});
};

exports.create = function(req, res) {
	db.MODELNAME.create(req.body, {
		transaction: req.t
	}).success(function(MODELNAME) {
		res.status(201).json(MODELNAME);
	}).error(function(err) {
		res.status(400).json({ message: err });
	});
};

exports.update = function(req, res) {
	db.MODELNAME.update(req.body, {
		id: req.params.id
	}, {
		returning: true,
		transaction: req.t
	}).success(function(peopleUpdated) {
		res.json(peopleUpdated);
	}).error(function(err) {
		res.status(400).json({ message: err });
	});
};

exports.delete = function(req, res) {
	db.MODELNAME.destroy({
		id: req.params.id
	}, {
		transaction: req.t
	}).success(function(affectedRows) {
		res.json({ affectedRows: affectedRows });
	});
};