var db = require('../models');
var messaging = require('../lib/messaging');
var uuid = require('node-uuid');

exports.isAuthenticated = function(req, res) {
	res.send(req.isAuthenticated());
};

exports.findAll = function(req, res) {
	db.auth_user.findAll({
		include: [{
			model: db.person
		}, {
			model: db.auth_role,
			as: 'roles'
		}]
	}, {
		transaction: req.t
	}).success(function(users) {
		res.send(users);
	}).error(function(err) {
		res.status(400).json({ message: err });
	});
};

exports.findOne = function(req, res) {
	db.auth_user.find({
		where: { id: req.params.id }
	}, {
		transaction: req.t
	}).success(function(user) {
		res.send(user);
	}).error(function(err) {
		res.status(400).json({ message: err });
	});
}

exports.findByInvitation = function(req, res) {
	db.auth_user.find({
		where: { invitation_key: req.params.key }
	}, {
		transaction: req.t,
		attributes: ['username', 'invitation_key']
	}).success(function(user) {
		res.send(user);
	}).error(function(err) {
		res.status(400).json({ message: err });
	});
}

exports.create = function(req, res) {
	// Set expiration date for invitation_key for 2 days in the future
	var expiration = new Date();
	expiration.setDate(expiration.getDate() + 2);

	// Create the user
	db.auth_user.create({
		username: req.body.email,
		invitation_expiration: expiration,
		invitation_key: uuid.v4(),
		person_id: req.body.person_id,
		active: true
	}, {
		transaction: req.t
	}).success(function(user) {
		user.getPerson({}, {
			transaction: req.t
		}).success(function(person) {
			var baseUrl = req.protocol + '://' + req.headers.host;
			// Send user an invitation
			messaging.sendInvitation({
				to: [{
					email: req.body.email,
					name: person.first_name + ' ' + person.last_name,
					type: 'to'
				}],
				baseUrl: baseUrl,
				person: person.values,
				user: user.values,
				invitation_key: user.invitation_key
			}, function(err, result) {
				if (!err) {
					res.send(user);
				} else {
					res.status(400).send({ message: err });
				}
			});
		}).error(function(err) {
			res.status(400).send({ message: err });
		});
	}).error(function(err) {
		res.status(400).send({ message: err });
	});
};

exports.resendInvitation = function(req, res) {
	var id = req.params.id;

	db.auth_user.find({
		where: { id: req.params.id }
	}, {
		transaction: req.t,
		attributes: ['username']
	}).success(function(user) {
		user.getPerson({}, {
			transaction: req.t
		}).success(function(person) {
			var baseUrl = req.protocol + '://' + req.headers.host;
			// Send user an invitation
			messaging.sendInvitation({
				to: [{
					email: user.username,
					name: person.first_name + ' ' + person.last_name,
					type: 'to'
				}],
				baseUrl: baseUrl,
				person: person.values,
				user: user.values,
				invitation_key: user.invitation_key
			}, function(err, result) {
				if (!err) {
					res.send(user);
				} else {
					res.status(400).send({ message: err });
				}
			});
		}).error(function(err) {
			res.status(400).send({ message: err });
		});
	}).error(function(err) {
		res.status(400).send({ message: err });
	});
};

exports.register = function(req, res) {
	db.auth_user.find({
		where: {
			username: req.body.username,
			invitation_key: req.body.invitation_key
		}
	}, {
		transaction: req.t
	}).success(function(user) {
		if (Date.now() < user.invitation_expiration.getTime()) {
			user.updateAttributes({
				password: req.body.password,
				invitation_key: null,
				invitation_expiration: null
			}, ['password', 'invitation_key', 'invitation_expiration'], {
				transaction: req.t
			}).success(function(user) {
				if (user) {
					req.login(user, function(err) {
						if (err) {
							console.error(err);
							res.status(400).send({ message: "There was an error logging in."});
						} else {
							res.redirect('/');
						}
					});
				} else {
					res.status(400).send({ message: "Invalid invitation/username pair" });
				}
			}).error(function(err) {
				res.status(400).send({ message: err });
			});

		} else {
			res.status(400).send({ message: "Your invitation is expired." });
		}
	}).error(function(err) {
		res.status(400).send({ message: "User does not exist "});
	});
};