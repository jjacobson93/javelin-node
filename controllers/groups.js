var db = require('../models');
var _ = require('lodash');

exports.findAll = function(req, res) {
	var query = {};
	if (req.query.members == "true") {
		query.include = [ { model: db.person, as: "members" } ];
	}

	db.group.findAll(query, {
		transaction: req.t
	}).success(function(groups) {
		res.json(groups);
	}).error(function(err) {
		res.status(400).json({ message: err });
	});
};

exports.findOne = function(req, res) {
	var query = {
		where: { id: req.params.id }
	};

	if (req.query.members == "true") {
		query.include = [ { model: db.person, as: "members" } ];
	}

	db.group.find(query, {
		transaction: req.t
	}).success(function(group) {
		res.json(group);
	}).error(function(err) {
		res.status(400).json({ message: err });
	});
};

exports.create = function(req, res) {
	var groupData = { name: req.body.name, is_smart: req.body.is_smart, permission: req.body.permission };
	if (req.body.description) groupData.description = req.body.description;

	db.group.create(groupData, {
		transaction: req.t
	}).success(function(group) {
		if (req.body.people !== undefined && req.body.people.length > 0) {
				
			var memberIds = _.map(req.body.people, function(person) {
				return person.id;
			});

			db.person.findAll({ 
				where: { id: memberIds }
			}, {
				transaction: req.t
			}).success(function(people) {
				group.setMembers(people, {
					transaction: req.t
				}).success(function(members) {
					group.members = members._values;
					res.status(201).json(group);
				}).error(function(err) {
					res.status(400).json({ message: err });
				});
			}).error(function(err) {
				res.status(400).json({ message: err });
			});
		} else {
			res.status(201).json(group);
		}
	}).error(function(err) {
		res.status(400).json({ message: err });
	});
};

exports.update = function(req, res) {
	db.group.update(req.body, {
		id: req.params.id
	}, {
		returning: true,
		transaction: req.t
	}).success(function(groupsUpdated) {
		res.json(groupsUpdated);
	}).error(function(err) {
		res.status(400).json({ message: err });
	});
};

exports.delete = function(req, res) {
	db.group.destroy({
		id: req.params.id
	}, {
		transaction: req.t
	}).success(function(affectedRows) {
		res.json({ affectedRows: affectedRows });
	});
};