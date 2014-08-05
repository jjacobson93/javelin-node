var db = require('../models');

exports.findAll = function(req, res) {
	db.events.findAll({}, { transaction: req.t }).success(function(events) {
		res.json(events);
	}).error(function(err) {
		res.status(400).json({ message: err });
	});
};

exports.findOne = function(req, res) {
	db.events.find({
		where: { id: req.params.id }
	}, {
		transaction: req.t
	}).success(function(evt) {
		res.json(evt);
	}).error(function(err) {
		res.status(400).json({ message: err });
	});
};

exports.create = function(req, res) {
	db.events.create(req.body, {
		transaction: req.t
	}).success(function(evt) {
		res.status(201).json(evt);
	}).error(function(err) {
		res.status(400).json({ message: err });
	});
};

exports.update = function(req, res) {
	db.events.update(req.body, {
		id: req.params.id
	}, {
		returning: true,
		transaction: req.t
	}).success(function(events) {
		res.json(events);
	}).error(function(err) {
		res.status(400).json({ message: err });
	});
};

exports.delete = function(req, res) {
	db.events.destroy({
		id: req.params.id
	}, {
		transaction: req.t
	}).success(function(affectedRows) {
		res.json({ affectedRows: affectedRows });
	});
};