var express = require('express');
var app = express();
var http = require('http').Server(app);
var db = require('./models');
var errorHandler = require('./lib/errorHandler');
var fs = require('fs');
var redis = require("redis").createClient();

app.use('/static', express.static(__dirname + '/static'));

var config = require('./config.json');
app.set('config', config);

// Config
require('./config/index')(app);

// Set up DB
db.sequelize.sync().complete(function(err) {
	if (err) {
		throw err[0];
	} else {
		fs.readFile('./initdb.sql', function(err, sql) {
			if (!err) {
				db.sequelize.query(sql.toString()).complete(function(err, result) {
					if (!err) {
						var server = http.listen(8080, function() {
							var address = server.address();

							console.log('Listening at %s:%d', address.address, address.port);
						});
					} else {
						throw err;
					}
				});
			} else {
				throw err;
			}
		});
	}
});