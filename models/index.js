var fs        = require('fs'),
	path      = require('path'),
	Sequelize = require('sequelize'),
	lodash    = require('lodash'),
	sequelize = new Sequelize('javelinnode', 'jjacobson', null, {
		dialect: 'postgres',
		define: {
			underscored: true
		},
		pool: {
			maxConnections: 40
		}
	}),
	db        = {};

// Create the DB object
fs.readdirSync(__dirname).filter(function(file) {
  	return (file.indexOf('.') !== 0) && (file !== 'index.js');
}).forEach(function(file) {
	var model = sequelize.import(path.join(__dirname, file));
	db[model.name] = model;
});

// Set up associations
Object.keys(db).forEach(function(modelName) {
	if ('associate' in db[modelName]) {
		db[modelName].associate(db);
	}
});

module.exports = lodash.extend({
	sequelize: sequelize,
	Sequelize: Sequelize
}, db);

// var fs = require('fs'),
// 	path = require('path'),
// 	orm = require('orm');
// 	models = {},
// 	options = {
// 		database: "javelinnode",
// 		protocol: "postgres",
// 		host: "127.0.0.1"
// 		user: "jjacobson",
// 		query: {
// 			pool: true
// 		}
// 	};

// orm.connect(options, function(err, db) {
// 	fs.readdirSync(__dirname).filter(function(file) {
// 		return (file.indexOf('.') !== 0) && (file !== 'index.js');
// 	}).forEach(function(file) {
// 		var model = require(path.join(__dirname, file));
// 		models[file.split('.')[0]] = model(db);
// 	});
// });

// module.exports = models;