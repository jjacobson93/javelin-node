var db = require('../models');
var _ = require('lodash');

exports.findSubjects = function(req, res) {
	var query = {};
	var start = new Date(parseInt(req.param('start')));
	var end = new Date(parseInt(req.param('end')));

	if (start && end) {
		query.include = [
			{
				model: db.tutoring_attendance,
				where: db.Sequelize.or(
					db.Sequelize.and(
						{ 'tutoring_attendances.in_time': { gte: start } },
						{ 'tutoring_attendances.in_time': { lt: end } }
					),
					db.Sequelize.and(
						{ 'tutoring_attendances.out_time': { gte: start } },
						{ 'tutoring_attendances.out_time': { lt: end } }
					)
				),
				required: false,
				include: [{
					model: db.person,
					as: "attendee",
					attributes: ['id', 'last_name', 'first_name']
				}]
			}
		];

		query.order = [['tutoring_subjects.title', 'ASC'], ['tutoring_attendances.in_time', 'DESC']];
	}

	db.tutoring_subject.findAll(query, {
		transaction: req.t
	}).success(function(subjects) {
		res.json(subjects);
	}).error(function(err) {
		res.status(400).json({ message: err });
	});
};

exports.createSubject = function(req, res) {
	db.tutoring_subject.create(req.body, {
		transaction: req.t
	}).success(function(subject) {
		res.status(201).json(subject);
	}).error(function(err) {
		res.status(400).json({ message: err });
	});
};

exports.findSubject = function(req, res) {
	var start = new Date(parseInt(req.param('start')));
	var end = new Date(parseInt(req.param('end')));
	var id = req.param('id');

	var query = {
		where: { id: id }
	};

	if (start && end) {
		query.include = [
			{
				model: db.tutoring_attendance,
				where: db.Sequelize.or(
					db.Sequelize.and(
						{ 'tutoring_attendances.in_time': { gte: start } },
						{ 'tutoring_attendances.in_time': { lt: end } }
					),
					db.Sequelize.and(
						{ 'tutoring_attendances.out_time': { gte: start } },
						{ 'tutoring_attendances.out_time': { lt: end } }
					)
				),
				required: false,
				include: [{
					model: db.person,
					as: "attendee",
					attributes: ['id', 'last_name', 'first_name']
				}]
			}
		];

		query.order = 'tutoring_attendances.in_time DESC'
	}

	db.tutoring_subject.find(query, {
		transaction: req.t
	}).success(function(subject) {
		res.json(subject);
	}).error(function(err) {
		res.status(400).json({ message: err });
	});
};

exports.checkInToSubject = function(req, res) {
	var subjectId = req.params.id;
	var personId = req.param('person_id');
	var creatorId = req.user.id;

	// Check out of any subject (except subjectId), first
	db.tutoring_attendance.update({
		out_time: new Date() // update out_time
	}, {
		person_id: personId,
		tutoring_subject_id: { ne: subjectId },
		out_time: null // only active
	}, {
		transaction: req.t
	}).success(function(affectedRows) {
		// Now let's look at the subject we're checking into
		db.tutoring_attendance.find({
			where: {
				person_id: personId,
				tutoring_subject_id: subjectId,
				out_time: null
			}
		}, {
			transaction: req.t
		}).success(function(tutoring_attendance) {
			// Are we already checked in here?
			if (tutoring_attendance && !tutoring_attendance.out_time) {
				res.json(tutoring_attendance);
			} else {
				// Create since it not checked in
				db.tutoring_attendance.create({
					tutoring_subject_id: subjectId,
					person_id: personId,
					creator_id: creatorId
				}, {
					transaction: req.t
				}).success(function(attendance) {
					res.json(attendance);
				}).error(function(err) {
					res.status(400).json({ message: err });
				});
			}
		}).error(function(err) {
			res.status(400).json({ message: err });
		});
	}).error(function(err) {
		res.status(400).json({ message: err });
	});
};

exports.checkOutFromSubject = function(req, res) {
	var subjectId = req.params.id;
	var personId = req.param('person_id');

	var where = {
		person_id: personId,
		out_time: null // only active
	};

	if (subjectId > 0) {
		where.tutoring_subject_id = subjectId;
	}

	db.tutoring_attendance.update({
		out_time: new Date()
	}, where, {
		transaction: req.t,
		returning: true
	}).success(function(attendance) {
		res.json(attendance);
	}).error(function(err) {
		res.status(400).json({ message: err });
	});
};

exports.notCheckedInToSubject = function(req, res) {
	var subjectId = req.params.id;

	var where = {
		
	}

	db.person.findAll({
		where: where
	}, {
		transaction: req.t
	}).success(function(people) {
		res.json(people);
	}).error(function(err) {
		res.status(400).json({ message: err });
	});
}

// exports.findAll = function(req, res) {
// 	db.MODELNAME.findAll({}, { transaction: req.t }).success(function(people) {
// 		res.json(people);
// 	}).error(function(err) {
// 		res.status(400).json({ message: err });
// 	});
// };

// exports.findOne = function(req, res) {
// 	db.MODELNAME.find({
// 		where: { id: req.params.id }
// 	}, {
// 		transaction: req.t
// 	}).success(function(MODELNAME) {
// 		res.json(MODELNAME);
// 	}).error(function(err) {
// 		res.status(400).json({ message: err });
// 	});
// };

// exports.create = function(req, res) {
// 	db.MODELNAME.create(req.body, {
// 		transaction: req.t
// 	}).success(function(MODELNAME) {
// 		res.status(201).json(MODELNAME);
// 	}).error(function(err) {
// 		res.status(400).json({ message: err });
// 	});
// };

// exports.update = function(req, res) {
// 	db.MODELNAME.update(req.body, {
// 		id: req.params.id
// 	}, {
// 		returning: true,
// 		transaction: req.t
// 	}).success(function(peopleUpdated) {
// 		res.json(peopleUpdated);
// 	}).error(function(err) {
// 		res.status(400).json({ message: err });
// 	});
// };

// exports.delete = function(req, res) {
// 	db.MODELNAME.destroy({
// 		id: req.params.id
// 	}, {
// 		transaction: req.t
// 	}).success(function(affectedRows) {
// 		res.json({ affectedRows: affectedRows });
// 	});
// };