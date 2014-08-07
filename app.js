var express = require('express');
var app = express();
var http = require('http').Server(app);
var db = require('./models');
var errorHandler = require('./lib/errorHandler');

app.use('/static', express.static(__dirname + '/static'));

// Config
require('./config')(app);

// Set up DB
db.sequelize.sync().complete(function(err) {
	if (err) {
		throw err[0];
	} else {
		// Start the server
		var server = http.listen(8080, function() {
			var address = server.address();

			console.log('Listening at %s:%d', address.address, address.port);
		});
	}
});