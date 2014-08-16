var Mandrill = require('mandrill-api/mandrill').Mandrill;
var mandrill = new Mandrill(process.env.MANDRILL_KEY);
var fs = require('fs');
var ejs = require('ejs');

function sendMessage(data, cb) {
	var message = {
		html: data.html,
		subject: data.subject,
		from_email: 'notify@javelinwebapp.com',
		from_name: 'Javelin',
		to: data.to,
		inline_css: true
	};

	mandrill.messages.send({
		message: message,
		async: true
	}, function(result) {
		console.log("Sent mandrill message:", result);
		cb(null, result);
	}, function(err) {
		console.error("Mandrill error:")
		cb(err, null);
	});
};

exports.sendInvitation = function(data, cb) {
	var filePath = __dirname + '/../views/emails/invitation.ejs';
	fs.readFile(filePath, {
		encoding: 'utf8'
	}, function(err, htmlString) {
		var html = ejs.render(htmlString, {
			title: 'Welcome to Javelin!',
			baseUrl: data.baseUrl,
			person: data.person,
			invitation_key: data.invitation_key,
			filename: filePath
		});

		sendMessage({
			html: html,
			subject: "Welcome to Javelin!",
			to: data.to
		}, cb);
	})
};