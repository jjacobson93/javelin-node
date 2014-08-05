var express = require('express');
var app = express();
var http = require('http').Server(app);
var db = require('./models');
var errorHandler = require('./lib/errorHandler');

app.use('/static', express.static(__dirname + '/static'));

// Config
require('./config')(app);

// Set up DB
db.sequelize.sync({ force: true }).complete(function(err) {
	if (err) {
		throw err[0];
	} else {
		db.sequelize.transaction(function(t) {
			// var dropConstraint = 'ALTER TABLE tutoring_attendees DROP CONSTRAINT tutoring_attendees_tutoring_subject_id_person_id_key';
			// db.sequelize.query(dropConstraint).success(function() {
				// PERSON
				db.person.create({
					last_name: "Jacobson",
					first_name: "Jeremy",
					sex: "Male"
				}, {
					transaction: t
				}).success(function(person) {
					// USER
					db.auth_user.create({
						username: "jjacobson93@gmail.com",
						password: "testing123"
					}, {
						transaction: t
					}).success(function(user) {
						// SET PERSON
						user.setPerson(person, {
							transaction: t
						}).success(function(_person) {
							// DEPARTMENT
							db.department.create({
								name: "Computer Science"
							}, {
								transaction: t
							}).success(function(dept) {
								// COURSE
								db.course.create({
									name: "Intro to Computer Science",
									code: "CS150",
								}, {
									transaction: t
								}).success(function(course) {
									// SET DEPARTMENT
									course.setDepartment(dept, {
										transaction: t
									}).success(function(_dept) {
										// SESSION
										db.session.create({
											name: "Fall",
											year: 2014
										}, {
											transaction: t
										}).success(function(session) {
											// SECTION
											db.section.create({
												course_section_number: 1,
												period: 1
											}, {
												transaction: t
											}).success(function(section) {
												// SET SESSION
												section.setSession(session, {
													transaction: t
												}).success(function(_session) {
													// SET COURSE
													section.setCourse(course, {
														transaction: t
													}).success(function(_course) {
														// ADD ENROLLEE
														section.addEnrollee(person, {
															transaction: t
														}).success(function(_person) {
															// TRANSCRIPT
															db.transcript.create({
																first_grade: "A"
															}, {
																transaction: t
															}).success(function(transcript) {
																// SET ENROLLMENT
																transcript.setEnrollment(section).success(function(_section) {
																	// TUTORING SUBJECT
																	db.tutoring_subject.create({
																		title: "Computer Science",
																		department_id: dept.id
																	}, {
																		transaction: t
																	}).success(function(subject) {
																		// CREATE ATTENDANCE
																		db.tutoring_attendance.create({
																			person_id: person.id,
																			tutoring_subject_id: subject.id
																		}, {
																			transaction: t
																		}).success(function(attendance) {
																			console.log("DONE INIT");
																			t.commit();
																		}).error(function(err) {
																			console.log("ERROR:", err);
																			tb.rollback();
																		});


																		// // ADD ATTENDEE
																		// subject.addAttendee(person, {
																		// 	transaction: t
																		// }).success(function() {
																		// 	// CREATE PERSON
																		// 	db.person.create({
																		// 		last_name: "Fairweather",
																		// 		first_name: "Cristoffer",
																		// 		sex: "Male"
																		// 	}, {
																		// 		transaction: t
																		// 	}).success(function(cristoffer) {
																		// 		console.log("CREATED PERSON");
																		// 		// ADD ATTENDEE
																		// 		subject.addAttendee(cristoffer, {
																		// 			transaction: t
																		// 		}).success(function() {
																		// 			console.log("ADDED ATTENDEE");
																		// 			// Add ATTENDEE AGAIN
																		// 			db.tutoring_attendee.create({
																		// 				person_id: cristoffer.id,
																		// 				tutoring_subject_id: subject.id
																		// 			}, {
																		// 				transaction: t
																		// 			}).success(function() {
																		// 				console.log("ADDED ATTENDEE AGAIN");
																		// 				console.log("DONE INIT");
																		// 				t.commit();
																		// 			}).error(function(err) {
																		// 				t.rollback();
																		// 				console.log("ERROR:", err);
																		// 			});
																		// 		}).error(function(err) {
																		// 			t.rollback();
																		// 			console.log("ERROR:", err);
																		// 		});
																		// 	}).error(function(err) {
																		// 		t.rollback();
																		// 		console.log("ERROR:", err);
																		// 	});
																		// }).error(function(err) {
																		// 	t.rollback();
																		// 	console.log("ERROR:", err);
																		// });
																	}).error(function(err) {
																		t.rollback();
																		console.log("ERROR:", err);
																	});
																}).error(function(err) {
																	t.rollback();
																	console.log("ERROR:", err);
																});
															}).error(function(err) {
																t.rollback();
																console.log("ERROR:", err);
															});
														}).error(function(err) {
															t.rollback();
															console.log("ERROR:", err);
														});

													}).error(function(err) {
														t.rollback();
														console.log("ERROR:", err);
													});

												}).error(function(err) {
													t.rollback();
													console.log("ERROR:", err);
												});

											}).error(function(err) {
												t.rollback();
												console.log("ERROR:", err);
											});

										}).error(function(err) {
											t.rollback();
											console.log("ERROR:", err);
										});

									}).error(function(err) {
										t.rollback();
										console.log("ERROR:", err);
									});
								}).error(function(err) {
									t.rollback();
									console.log("ERROR:", err);
								});
									
							}).error(function(err) {
								t.rollback();
								console.log("ERROR:", err);
							});
						}).error(function(err) {
							t.rollback();
							console.log("ERROR:", err);
						});
					}).error(function(err) {
						t.rollback();
						console.log("ERROR:", err);
					});
				}).error(function(err) {
					t.rollback();
					console.log("ERROR:", err);
				});
			// }).error(function(err) {
			// 	t.rollback();
			// 	console.log("ERROR:", err);
			// });
		});

		// Start the server
		var server = http.listen(8080, function() {
			var address = server.address();

			console.log('Listening at %s:%d', address.address, address.port);
		});

		app.use(function(err, req, res, next) {
			res.status(500);
			console.log("GET IN THE FUCKING ERROR STATE");

			res.send("ERROR");
		});
	}
});