var db = require('../models');
var _ = require('lodash');

exports.findAll = function(req, res) {
	var start = new Date(parseInt(req.param('start')) * 1000);
	var end = new Date(parseInt(req.param('end')) * 1000);
	console.log(start);
	db.event.findAll({
		where: {
			start_time: { gte: start },
			end_time: { lt: end }
		},
		order: [['start_time', 'ASC']]
	}, {
		transaction: req.t
	}).success(function(events) {
		res.json(events);
	}).error(function(err) {
		res.status(400).json({ message: err });
	});
};

exports.findOne = function(req, res) {
	db.event.find({
		where: { id: req.params.id },
		include: [ {
			model: db.person,
			as: "attendees",
			required: false
		}]
	}, {
		transaction: req.t
	}).success(function(evt) {
		res.json(evt);
	}).error(function(err) {
		res.status(400).json({ message: err });
	});
};

exports.findAttendeesForEvent = function(req, res) {
	db.person.findAll({
		include: [ {
			model: db.event,
			where: {
				"id" : req.param('id')
			},
			required: true
		} ]
	}, {
		transaction: req.t
	}).success(function(attendees) {
		res.send(attendees);
	}).error(function(err) {
		res.status(400).json({ message: err });
	});
};

exports.create = function(req, res) {
	db.event.create(req.body, {
		transaction: req.t
	}).success(function(evt) {
		res.status(201).json(evt);
	}).error(function(err) {
		res.status(400).json({ message: err });
	});
};

exports.update = function(req, res) {
	db.event.update(req.body, {
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
	db.event.destroy({
		id: req.params.id
	}, {
		transaction: req.t
	}).success(function(affectedRows) {
		res.json({ affectedRows: affectedRows });
	});
};

exports.addAttendeesToEvent = function(req, res) {
	var event_id = req.param('id');

	db.attendee.bulkCreate(_.map(req.body.people, function(person_id) {
		return {
			event_id: event_id,
			person_id: person_id,
			attend_time: new Date()
		}
	}), {
		transaction: req.t,
		returning: true
	}).success(function(attendees) {
		res.status(201).json(attendees);
	}).error(function(err) {
		res.status(400).json({ message: err });
	});
}