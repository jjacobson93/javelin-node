var db = require('../models');
var _ = require('lodash');

exports.findAll = function(req, res) {
	var query = {
		order: [[db.sequelize.col('people.last_name')], [db.sequelize.col('people.first_name')]]
	};
	
	if (req.query.search == undefined) {
		for (var key in req.query) {
			if (!query.where) query.where = {};

			if (key !== "created_at" && key !== "updated_at" && key in db.person.rawAttributes) {
				var field = db.person.rawAttributes[key];

				if (field.type._typeName == 'VARCHAR') {
					query.where[key] = { like: '%' + req.query[key] + '%' };
				} else {
					query.where[key] = req.query[key];
				}
			}
		}

		var w = { ne: 'Q' };
		if (!query.where) query.where = {};
		query.where['last_name'] = query.where['last_name'] ? db.Sequelize.and(query.where['last_name'], w) : w;
		query.where['first_name'] = query.where['first_name'] ? db.Sequelize.and(query.where['first_name'], w) : w;

	} else {
		query.where = db.Sequelize.and(
			db.Sequelize.or(
				["last_name ILIKE ?", '%' + req.query.search + '%'],
				["first_name ILIKE ?", '%' + req.query.search + '%']
			),
			{ last_name: { ne: 'Q' } },
			{ first_name: { ne: 'Q' } }
		);

	}

	query.include = {
		model: db.crew,
		attributes: ['room']
	};

	db.person.findAll(query, {
		transaction: req.t,
	}).success(function(people) {
		res.json(people);
	}).error(function(err) {
		res.status(400).json({ message: err });
	});
};

exports.findWithCrew = function(req, res) {
	db.sequelize.query("SELECT \"people\".*, \"crew\".\"room\" AS \"crew.room\", \"crew\".\"id\" AS \"crew.id\" FROM \"people\" LEFT OUTER JOIN \"crews\" AS \"crew\" ON \"people\".\"crew_id\" = \"crew\".\"id\" WHERE \"people\".\"grad_year\"='9' ORDER BY \"people\".\"last_name\", \"people\".\"first_name\";").success(function(people) {
		console.log(people);
		res.send(people);
	}).error(function(err) {
		res.status(400).send(error);
	});
}

exports.findNonUsers = function(req, res) {
	var query = {}
	query.where = db.Sequelize.and(
		db.Sequelize.or(
			["last_name ILIKE ?", '%' + req.query.search + '%'],
			["first_name ILIKE ?", '%' + req.query.search + '%']
		),
		{ last_name: { ne: 'Q' } },
		{ first_name: { ne: 'Q' } }
	);

	// Find all users
	db.auth_user.findAll(query, {
		transaction: req.t,
		attributes: ['person_id']
	}).success(function(users) {

		db.people.findAll({
			where: {
				id: { not: _.pluck(users, 'person_id') }
			}
		})


	}).error(function(err) {
		res.status(400).json({ message: err });
	});
}

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
		if (person && person.last_name == 'Q' && person.first_name == 'Q' && !_.contains(req.user.roles, 'super')) {
			res.status(401).send("Unauthorized");
		} else {
			res.json(person);
		}
	}).error(function(err) {
		res.status(400).json({ message: err });
	});
};

exports.filterAll = function(req, res) {
	db.person.findAll(req.query, {
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