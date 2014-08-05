var passport = require('passport');
var policies = require('./policies');
var authUser = require('../controllers/authUser');
var people = require('../controllers/people');
var groups = require('../controllers/groups');
var events = require('../controllers/events');
var departments = require('../controllers/departments');
var tutoring = require('../controllers/tutoring');
var admin = require('../controllers/admin');
var orientation = require('../controllers/orientation');

var requiresLogin = policies.requiresLogin;

module.exports = function(app) {
	app.get('/', function(req, res) {
		res.render('index');
	});

	app.post('/login', passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/',
		failureFlash: true
	}));

	////////////////////////////////////////
	//			  CONTROLLERS 			  //
	////////////////////////////////////////

	// users
	app.get('/api/users/is_authenticated', authUser.isAuthenticated);

	// people
	app.get('/api/people', requiresLogin, people.findAll);
	app.get('/api/people/:id', requiresLogin, people.findOne);
	app.get('/api/people/filter/', requiresLogin, people.filterAll);

	app.post('/api/people', requiresLogin, people.create);
	app.put('/api/people/:id', requiresLogin, people.update);
	app.delete('/api/people/:id', requiresLogin, people.delete);

	// groups
	app.get('/api/groups', requiresLogin, groups.findAll);
	app.get('/api/groups/:id', requiresLogin, groups.findOne);

	app.post('/api/groups', requiresLogin, groups.create);
	app.put('/api/groups/:id', requiresLogin, groups.update);
	app.delete('/api/groups/:id', requiresLogin, groups.delete);

	// events
	// app.get('/api/events')

	// departments
	app.get('/api/departments', requiresLogin, departments.findAll);

	// tutoring
	app.get('/api/tutoring/subjects', requiresLogin, tutoring.findSubjects);
	app.post('/api/tutoring/subjects', requiresLogin, tutoring.createSubject);

	app.get('/api/tutoring/subjects/:id', requiresLogin, tutoring.findSubject);
	app.post('/api/tutoring/subjects/:id', requiresLogin, tutoring.checkInToSubject);
	app.put('/api/tutoring/subjects/:id', requiresLogin, tutoring.checkOutFromSubject);

	// orientation
	app.get('/api/orientation/crews', requiresLogin, orientation.findCrews);
	app.get('/api/orientation/crews/:id', requiresLogin, orientation.findCrew);
	app.post('/api/orientation/crews', requiresLogin, orientation.createCrew);
	app.put('/api/orientation/crews', requiresLogin, orientation.updateCrew);
	app.delete('/api/orientation/crews', requiresLogin, orientation.deleteCrew);

	// app.get('/api/tutoring/attendance', requiresLogin, tutoring.findAttendance);


	////////////////////////////////////////
	//				 VIEWS   			  //
	////////////////////////////////////////

	app.get('/views/login', function(req, res) {
		res.render('login');
	});

	app.get('/views/:controller', requiresLogin, function(req, res) {
		res.render(req.params.controller);
	});

	app.get('/views/:controller/:subview', requiresLogin, function(req, res) {
		res.render(req.params.controller + '/' + req.params.subview);
	});
}