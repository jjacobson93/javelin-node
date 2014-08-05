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
				return done(err);
			}

			if (!user) {
				return done(null, false, { message: 'Incorrect username' });
			}

			if (!user.isValidPassword(password)) {
				return done(null, false, { message: 'Incorrect password' });
			}

			return done(null, user);
		});
	}));

	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		db.auth_user.find({ where: { id: id } }).done(function(err, user) {
			if (err) {
				done(err, null);
			} else {
				if (user) {
					var userData = user.values;
					user.getPerson().done(function(err, person) {
						if (!err) {
							delete(person.values.id);
							_.extend(userData, person.values);
						}
						done(err, userData);
					});
				} else {
					done("UndefinedUser", null);
				}
			}
		});
	});
};