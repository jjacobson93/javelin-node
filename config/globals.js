var pkginfo = require('../package.json');

module.exports = function(app) {
	app.set('title', 'Javelin');
	app.set('version', '2.0.0-beta');

	process.env.MANDRILL_KEY = '51PQSrm5pPlJJLZdLRnGDg';
};