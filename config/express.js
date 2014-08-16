var	session = require('express-session'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	csrf = require('csurf'),
	flash = require('connect-flash'),
	RedisStore = require('connect-redis')(session),
	uuid = require('node-uuid'),
	multipart = require('connect-multiparty');

module.exports = function(app) {
	app.set('view engine', 'ejs');

	app.enable('trust proxy');

	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());

	app.use(session({
		secret: 'this is one super awesome secret',
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: 1*60*60*1000, // 1 hour
			expires: false
		},
		genid: function() {
			return uuid.v4();
		},
		store: new RedisStore({
			host: '127.0.0.1',
			port: 6379,
			prefix: 'javsess:',
			ttl: 1*60*60 // 1 hour
		})
	}));
	app.use(cookieParser());

	// Multipart forms
	app.use(multipart({
		uploadDir: __dirname + '/../uploads'
	}));

	// CSRF
	app.use(csrf());

	// Flash
	app.use(flash());
}