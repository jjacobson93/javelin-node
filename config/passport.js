var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	db = require('../models'),
	_ = require('lodash');

module.exports = function(app) {
	app.use(passport.initialize());
	app.use(passport.session());

	passport.use(new LocalStrategy(function(username, password, done) {
		db.auth_user.find({ where: { username: username } }).done(function(err, user) {
			if (err) {
				return done(err, false,  { message: 'Incorrect username/password' });
			}

			if (!user) {
				return done(null, false, { message: 'Incorrect username/password' });
			}

			if (!user.password && user.invitation_key) {
				return done(null, false, { message: 'Please check your email for an invitation'});
			}

			if (!user.password) {
				return done(null, false, { message: 'You have not set a password yet'});
			}

			if (!user.isValidPassword(password)) {
				return done(null, false, { message: 'Incorrect username/password' });
			}

			return done(null, user);
		});
	}));

	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		db.auth_user.find({
			where: { id: id },
			include: [{
				model: db.person
			}, {
				model: db.auth_role,
				as: 'roles'
			}]
		}).done(function(err, user) {
			if (err) {
				done(err, null);
			} else {
				if (user) {
					user.values.roles = _.pluck(user.values.roles, 'name');
					done(err, user.values);
					// var userData = user.values;
					// user.getPerson().done(function(err, person) {
					// 	if (!err) {
					// 		delete(person.values.id);
					// 		_.extend(userData, person.values);
					// 	}
					// 	done(err, userData);
					// });
				} else {
					done("UndefinedUser", null);
				}
			}
		});
	});
};