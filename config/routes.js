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
var authRolesCheck = policies.authRolesCheck;
var isUser = policies.isUser;
var isPerson = policies.isPerson;

module.exports = function(app) {
	app.get('/', function(req, res) {
		res.render('index');
	});

	app.post('/login', passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/',
		failureFlash: true
	}));

	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	app.post('/register', authUser.register);

	app.get('/views/login', function(req, res) {
		res.render('login');
	});

	app.get('/views/register', function(req, res) {
		res.render('register');
	});


	////////////////////////////////////////
	//			  CONTROLLERS 			  //
	////////////////////////////////////////

	// users
	app.get('/api/users/is_authenticated', authUser.isAuthenticated);
	app.get('/api/users/invitation/:key', authUser.findByInvitation);

	// All below this require login
	// app.all('*', requiresLogin);

	app.get('/api/users', requiresLogin, authRolesCheck(['admin']), authUser.findAll);
	app.get('/api/users/:id', requiresLogin, authRolesCheck(['student', 'staff', 'admin']), isUser, authUser.findOne);
	app.post('/api/users', requiresLogin, authRolesCheck(['admin']), authUser.create);

	app.post('/api/users/:id/resend-invite', requiresLogin, authRolesCheck(['admin']), authUser.resendInvitation);

	// people
	app.get('/api/people', requiresLogin, authRolesCheck(['staff', 'admin']), people.findAll);
	app.get('/api/people/non-users', requiresLogin, authRolesCheck(['admin']), people.findNonUsers);
	// app.get('/api/people/crews', requiresLogin, authRolesCheck(['staff', 'admin']), people.findWithCrew);
	app.get('/api/people/:id', requiresLogin, authRolesCheck(['student','staff', 'admin']), isPerson, people.findOne);
	// app.get('/api/people/:id/tutoring', requiresLogin, authRolesCheck(['student', 'staff', 'admin']), people.findTutoring);
	// app.get('/api/people/:id/attendance', requiresLogin, authRolesCheck(['student', 'staff', 'admin']), people.findAttendance);
	app.get('/api/people/filter', requiresLogin, authRolesCheck(['staff', 'admin']), people.filterAll);

	// app.post('/api/people', requiresLogin, authRolesCheck(['admin']), people.create);
	app.put('/api/people/:id', requiresLogin, authRolesCheck(['admin']), people.update);
	app.delete('/api/people/:id', requiresLogin, authRolesCheck(['admin']), people.delete);

	// groups
	app.get('/api/groups', requiresLogin, authRolesCheck(['student', 'staff','admin']), groups.findAll); // Find all or find some based on user
	app.get('/api/groups/:id', requiresLogin, authRolesCheck(['student', 'staff','admin']), groups.findOne); // STUDENT && BELONGS IN
	app.post('/api/groups/:id/members', requiresLogin, authRolesCheck(['staff', 'admin']), groups.addMembersToGroup);
	// app.delete('/api/groups/:id/members/:person_id', requiresLogin, authRolesCheck, orientation.removeMemberFromGroup);

	app.post('/api/groups', requiresLogin, authRolesCheck(['staff', 'admin']), groups.create);
	app.put('/api/groups/:id', requiresLogin, authRolesCheck(['staff', 'admin']), groups.update);
	app.delete('/api/groups/:id', requiresLogin, authRolesCheck(['staff', 'admin']), groups.delete);

	// events
	app.get('/api/events', requiresLogin, authRolesCheck(['student', 'staff', 'admin']), events.findAll);
	app.get('/api/events/:id', requiresLogin, authRolesCheck(['student', 'staff', 'admin']), events.findOne);

	app.post('/api/events', requiresLogin, authRolesCheck(['staff', 'admin']), events.create);
	app.put('/api/events/:id', requiresLogin, authRolesCheck(['staff', 'admin']), events.update);
	app.delete('/api/events/:id', requiresLogin, authRolesCheck(['staff', 'admin']), events.delete);

	app.get('/api/events/:id/attendance', requiresLogin, authRolesCheck(['staff', 'admin']), events.findAttendeesForEvent);
	app.post('/api/events/:id/attendance', requiresLogin, authRolesCheck(['staff', 'admin']), events.addAttendeesToEvent);
	// app.put('/api/events/:id/attendance', requiresLogin, authRolesCheck, events.setAttendanceForPeople);

	// departments
	// app.get('/api/departments', requiresLogin, authRolesCheck(['staff', 'admin']), departments.findAll);

	// tutoring
	app.get('/api/tutoring/subjects', requiresLogin, authRolesCheck(['tutor', 'staff', 'admin']), tutoring.findSubjects); 
	app.post('/api/tutoring/subjects', requiresLogin, authRolesCheck(['admin']), tutoring.createSubject);

	app.get('/api/tutoring/subjects/:id', requiresLogin, authRolesCheck(['tutor', 'staff', 'admin']), tutoring.findSubject);
	app.get('/api/tutoring/subjects/:id/not-checkedin', requiresLogin, authRolesCheck(['tutor', 'staff', 'admin']), tutoring.notCheckedInToSubject);
	app.post('/api/tutoring/subjects/:id', requiresLogin, authRolesCheck(['tutor', 'staff', 'admin']), tutoring.checkInToSubject);
	app.put('/api/tutoring/subjects/:id', requiresLogin, authRolesCheck(['tutor', 'staff', 'admin']), tutoring.checkOutFromSubject);

	// orientation
	app.get('/api/orientation/crews', requiresLogin, authRolesCheck(['student', 'staff', 'admin']), orientation.findCrews); // Find some or find all
	app.post('/api/orientation/crews', requiresLogin, authRolesCheck(['staff', 'admin']), orientation.createCrew);
	app.put('/api/orientation/crews/:id', requiresLogin, authRolesCheck(['staff', 'admin']), orientation.updateCrew);
	app.delete('/api/orientation/crews/:id', requiresLogin, authRolesCheck(['staff', 'admin']), orientation.deleteCrew);

	app.get('/api/orientation/crews/:id', requiresLogin, authRolesCheck(['student', 'staff', 'admin']), orientation.findCrew); // STUDENT && BELONGS IN
	app.get('/api/orientation/crews/:id/non-members', requiresLogin, authRolesCheck(['staff', 'admin']), orientation.peopleNotInCrew);
	app.post('/api/orientation/crews/:id/members', requiresLogin, authRolesCheck(['staff', 'admin']), orientation.addMembersToCrew);
	app.delete('/api/orientation/crews/:id/members/:person_id', requiresLogin, authRolesCheck(['staff', 'admin']), orientation.removeMemberFromCrew);

	// app.post('/api/orientation/import-leaders', requiresLogin, authRolesCheck, orientation.importCrewLeaders);
	// app.post('/api/orientation/organize-crews', requiresLogin, authRolesCheck, orientation.organizeCrews);

	// admin
	app.post('/api/admin/import-students', requiresLogin, authRolesCheck([]), admin.importAndCrew);

	// app.get('/api/tutoring/attendance', requiresLogin, authRolesCheck, tutoring.findAttendance);


	////////////////////////////////////////
	//				 VIEWS   			  //
	////////////////////////////////////////

	app.get('/:error(400|401|403|404)', function(req, res) {
		res.render(req.params.error);
	});

	app.get('/views/:controller', function(req, res) {
		res.render(req.params.controller);
	});

	app.get('/views/:controller/:subview', function(req, res) {
		res.render(req.params.controller + '/' + req.params.subview);
	});

	app.get('/emails/:template', function(req, res) {
		res.render('emails/' + req.params.template, {
			baseUrl: 'https://javelinwebapp.com',
			title: 'Welcome to Javelin!',
			invitation_key: '123456',
			person: {
				first_name: 'Jeremy',
				last_name: 'Jacobson'
			}
		});
	});
}