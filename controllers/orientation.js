var db = require('../models');
var _ = require('lodash');

exports.findCrews = function(req, res) {
	db.crew.findAll({
		include: [{
			model: db.person,
			as: 'crew_members',
		}]
	}, {
		transaction: req.t
	}).success(function(crews) {
		res.json(crews);
	}).error(function(err) {
		res.status(400).json({ message: err });
	});
};

exports.findCrew = function(req, res) {
	db.crew.find({
		where: { id: req.params.id },
		include: [{
			model: db.person,
			as: 'crew_members',
			attributes: ['id', 'last_name', 'first_name']
		}]
	}, {
		transaction: req.t
	}).success(function(crew) {
		res.json(crew);
	}).error(function(err) {
		res.status(400).json({ message: err });
	});
};

exports.createCrew = function(req, res) {
	db.crew.create(req.body, {
		transaction: req.t
	}).success(function(crew) {
		if (req.body.people !== undefined && req.body.people.length > 0) {
				
			var memberIds = _.map(req.body.people, function(person) {
				return person.id;
			});

			db.person.findAll({ 
				where: { id: memberIds }
			}, {
				transaction: req.t
			}).success(function(people) {
				crew.setCrewMembers(people, {
					transaction: req.t
				}).success(function(members) {
					var crewClone = _.cloneDeep(crew.values);
					crewClone.crewMembers = members;
					res.status(201).json(crewClone);
				}).error(function(err) {
					res.status(400).json({ message: err });
				});
			}).error(function(err) {
				res.status(400).json({ message: err });
			});
		} else {
			res.status(201).json(crew);
		}
	}).error(function(err) {
		res.status(400).json({ message: err });
	});
};

exports.updateCrew = function(req, res) {
	db.crew.update(req.body, {
		id: req.params.id
	}, {
		returning: true,
		transaction: req.t
	}).success(function(crewsUpdated) {
		res.json(crewsUpdated);
	}).error(function(err) {
		res.status(400).json({ message: err });
	});
};

exports.deleteCrew = function(req, res) {
	db.crew.destroy({
		id: req.params.id
	}, {
		transaction: req.t
	}).success(function(affectedRows) {
		res.json({ affectedRows: affectedRows });
	});
};