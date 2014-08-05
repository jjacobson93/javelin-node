var	session = require('express-session'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	csrf = require('csurf'),
	flash = require('connect-flash'),
	RedisStore = require('connect-redis')(session),
	uuid = require('node-uuid');

module.exports = function(app) {
	app.set('view engine', 'ejs');
	app.use(session({
		secret: 'this is one super awesome secret',
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: 4*60*60*1000, // 4 hours
			expires: false
		},
		genid: function() {
			return uuid.v4();
		},
		store: new RedisStore({
			host: '127.0.0.1',
			port: 6379,
			prefix: 'javsess'
		})
	}));
	app.use(cookieParser());
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());

	// CSRF
	app.use(csrf());

	// Flash
	app.use(flash());
}