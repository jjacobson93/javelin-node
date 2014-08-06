var db = require('../models');

exports.findAll = function(req, res) {
	var query = {};
	
	if (req.query.search == undefined) {
		for (var key in req.query) {
			if (!query.where) query.where = {};

			if (key !== "created_at" && key !== "updated_at" && key in db.person.rawAttributes) {
				var field = db.person.rawAttributes[key];

				if (field.type._typeName == 'VARCHAR')
					query.where[key] = { like: '%' + req.query[key] + '%' };
				else
					query.where[key] = req.query[key];
			}
		}
	} else {
		query.where = db.Sequelize.or(
			["last_name ILIKE ?", '%' + req.query.search + '%'],
			["first_name ILIKE ?", '%' + req.query.search + '%']
		);
	}

	db.person.findAll(query, {
		transaction: req.t
	}).success(function(people) {
		res.json(people);
	}).error(function(err) {
		res.status(400).json({ message: err });
	});
};

exports.findOne = function(req, res) {
	var query = {
		where: { id: req.params.id },
		include: [
			{
				model: db.section,
				include: [ db.session, db.course ]
			},
			{
				model: db.auth_user,
				attributes: ['username']
			}
		]
	};

	db.person.find(query, {
		transaction: req.t
	}).success(function(person) {
		res.json(person);
	}).error(function(err) {
		res.status(400).json({ message: err });
	});
};

exports.filterAll = function(req, res) {
	db.person.find(req.query, {
		transaction: req.t
	}).success(function(people) {
		res.json(people);
	}).error(function(err) {
		res.status(400).json({ message: err });
	});
};

exports.create = function(req, res) {
	db.person.create(req.body, {
		transaction: req.t
	}).success(function(person) {
		res.status(201).json(person);
	}).error(function(err) {
		res.status(400).json({ message: err });
	});
};

exports.update = function(req, res) {
	db.person.update(req.body, {
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
	db.person.destroy({
		id: req.params.id
	}, {
		transaction: req.t
	}).success(function(affectedRows) {
		res.json({ affectedRows: affectedRows });
	});
};