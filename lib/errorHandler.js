var util = require('util'),
	uuid = require('node-uuid'),
	pkginfo = require('../package.json'),
	// Mongo
	mongo = require('mongodb'),
	GridFS = require('gridfs-stream'),
	mongoDb = new mongo.Db('javelin-mongo', new mongo.Server("localhost", 27017), { safe: false }),

	// Error handling
	accepts = require('accepts'),
	escapeHtml = require('escape-html'),
	errorCSS = "*{outline:0;margin:0;padding:0;}body{font:13px \"Helvetica Neue\", \"Lucida Grande\", Arial;background:#ECE9E9 0;background-repeat:no-repeat;color:#555;-webkit-font-smoothing:antialiased;padding:80px 100px;}h1,h2{font-size:22px;color:#343434;}h1 em,h2 em{font-weight:400;padding:0 5px;}h1{font-size:60px;}h2{margin-top:10px;}ul li{list-style:none;}#stacktrace{margin-left:60px;}#versions{margin-top:20px;font-size:16px;font-weight:bold}",
	errorHTML = '<html><head><meta charset=\'utf-8\'><title>{error}</title><style>{style}</style></head><body><div id="wrapper"><h1>{title} Error</h1><h2>Ticket ID: {ticketId}</h2><h2><em>{statusCode}</em> {error}</h2><ul id="stacktrace">{stack}</ul><p id="versions">Versions</p><p>Node: {nodeVersion}</p><p>Express: {expressVersion}</p><p>Javelin: {javelinVersion}</p></div></body></html>';

module.exports = function() {
	return function(err, req, res, next) {
		console.log("In my error handler");

		// Create the JSON for creating the view and/or persisting
		var timestamp = new Date().toISOString();
		var ticketId = util.format("%s.%s.%s", ((req) ? req.ip : '127.0.0.1'), timestamp, uuid.v4());
		var ticket = {
			id: ticketId,
			message: err.message,
			stack: err.stack,
			timestamp: timestamp,
			status: (err.status) ? err.status : 500,
			nodeVersion: process.versions.node,
			expressVersion: pkginfo.dependencies.express.replace('~', ''),
			javelinVersion: pkginfo.version
		};
		for (var prop in err) {
			if (!(prop in ticket)) ticket[prop] = err[prop];
		}

		// Save to Mongo
		mongoDb.open(function(err) {
			if (err) {
				console.error("Mongo connection could not be open:", err);
			} else {
				var collection = mongoDb.collection('errors');
				collection.insert(ticket, function(err, docs) {
					if (err) console.error("There was an error save the error:", err);
					mongoDb.close();
				});
			}
		});
		// write error to console
		// if (env !== 'test') {
		  console.error(err.stack || String(err))
		// }

		if (req && res) {
			// respect err.status
			if (err.status) {
			  res.status(err.status);
			}

			// default status code to 500
			if (res.statusCode < 400) {
			  res.status(500);
			}

			// cannot actually respond
			if (res._header) {
			  return req.socket.destroy()
			}

			// negotiate
			var accept = accepts(req)
			var type = accept.types('html', 'json', 'text')

			// Security header for content sniffing
			res.setHeader('X-Content-Type-Options', 'nosniff')

			// html
			if (type === 'html') {
				var stack = (err.stack || '')
					.split('\n').slice(1)
					.map(function(v){ return '<li>' + escapeHtml(v).replace(/  /g, ' &nbsp;') + '</li>'; }).join('');
				var html = errorHTML
				  .replace('{style}', errorCSS)
				  .replace('{stack}', stack)
				  .replace('{title}', "Javelin")
				  .replace('{ticketId}', ticket.id)
				  .replace('{statusCode}', ticket.status)
				  .replace('{nodeVersion}', ticket.nodeVersion)
				  .replace('{expressVersion}', ticket.expressVersion)
				  .replace('{javelinVersion}', ticket.javelinVersion)
				  .replace(/\{error\}/g, escapeHtml(String(err)).replace(/  /g, ' &nbsp;').replace(/\n/g, '<br>'));
				res.setHeader('Content-Type', 'text/html; charset=utf-8');
				res.end(html);
			// json
			} else if (type === 'json') {
				res.setHeader('Content-Type', 'application/json');
				res.json(ticket);
			// plain text
			} else {
				res.setHeader('Content-Type', 'text/plain');
				res.end(err.stack || String(err));
			}
		}
	}
};