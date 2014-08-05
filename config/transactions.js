var db = require('../models');

module.exports = function(app) {
	// Set up DB transaction
	var transactionHandler = function() {
		return function(req, res, next) {
			console.log("*** REQUEST STARTED ***");
			db.sequelize.transaction(function(t) {
				req.t = t;
				res.on('finish', function() {
					console.log("*** RESPONSE FINISHED", res.statusCode, "***");
					if (res.statusCode < 400) {
						t.commit().success(function() {
							console.log("*** COMMIT ***");
						}).error(function(err) {
							console.log("There was an error commiting:", err);
						});
					} else {
						t.rollback().success(function() {
							console.log("*** ROLLBACK ***");
						}).error(function(err) {
							console.log("There was an error rolling back:", err);
						});
					}
				});
				next();
			});
		}
	}

	app.use(transactionHandler());
};