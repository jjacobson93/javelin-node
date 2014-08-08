var db = require('../models');
var csv = require('csv');
var async = require('async');
var crypto = require('crypto');
var fs = require('fs');
var _ = require('lodash');
var util = require('util');

// exports.findAll = function(req, res) {
// 	db.MODELNAME.findAll({}, { transaction: req.t }).success(function(people) {
// 		res.json(people);
// 	}).error(function(err) {
// 		res.status(400).json({ message: err });
// 	});
// };

// exports.findOne = function(req, res) {
// 	db.MODELNAME.find({
// 		where: { id: req.params.id }
// 	}, {
// 		transaction: req.t
// 	}).success(function(MODELNAME) {
// 		res.json(MODELNAME);
// 	}).error(function(err) {
// 		res.status(400).json({ message: err });
// 	});
// };

// exports.create = function(req, res) {
// 	db.MODELNAME.create(req.body, {
// 		transaction: req.t
// 	}).success(function(MODELNAME) {
// 		res.status(201).json(MODELNAME);
// 	}).error(function(err) {
// 		res.status(400).json({ message: err });
// 	});
// };

// exports.update = function(req, res) {
// 	db.MODELNAME.update(req.body, {
// 		id: req.params.id
// 	}, {
// 		returning: true,
// 		transaction: req.t
// 	}).success(function(peopleUpdated) {
// 		res.json(peopleUpdated);
// 	}).error(function(err) {
// 		res.status(400).json({ message: err });
// 	});
// };

// exports.delete = function(req, res) {
// 	db.MODELNAME.destroy({
// 		id: req.params.id
// 	}, {
// 		transaction: req.t
// 	}).success(function(affectedRows) {
// 		res.json({ affectedRows: affectedRows });
// 	});
// };

// function importTeachers(csvString, t, cb) {
// 	csv.parse(csvString, {
// 		skip_empty_lines: true,
// 		columns: true
// 	}, function(err, data) {
// 		if (!err) {
// 			// insert the teachers
// 			db.person.bulkCreate(_.map(data, function(teacher) {
// 				return {
// 					first_name: teacher.first_name,
// 					last_name: teacher.last_name,
// 					student_id: teacher.teacher_id,
// 					grad_year: 0
// 				}
// 			}), {
// 				transaction: t
// 			}).success(function(teachers) {
// 				cb(null, teachers);
// 			}).error(function(err) {
// 				cb(err);
// 			});
// 		} else {
// 			cb(err);
// 		}
// 	});
// };

// function importSections(csvString, t, cb) {
// 	csv.parse(csvString, {
// 		skip_empty_lines: true,
// 		columns: true,
// 	}, function(err, data) {
// 		if (!err) {

// 			db.section.bulkCreate(_.map(data, function(section) {
// 				return {
// 					period: section.period,
// 					code: section.section_id,
// 					instructor_id: section.teacher_id,
// 					course_id: section.course_id,
// 					room: section.room
// 				};
// 			}), {
// 				transaction: t
// 			}).success(function(sections) {
// 				cb(null, sections);
// 			}).error(function(err) {
// 				cb(err);
// 			});

// 		} else {
// 			cb(err);
// 		}
// 	});
// }

// function importCourses(csvString, t, cb) {
// 	csv.parse(csvString, {
// 		skip_empty_lines: true,
// 		columns: true,
// 	}, function(err, data) {
// 		if (!err) {

// 			db.course.bulkCreate(_.map(data, function(course) {
// 				return {
// 					code: course.course_id,
// 					name: course.course_title
// 				};
// 			}), {
// 				transaction: t
// 			}).success(function(courses) {
// 				cb(null, courses);
// 			}).error(function(err) {
// 				cb(err);
// 			});

// 		} else {
// 			cb(err);
// 		}
// 	});
// }


// exports.importAll = function(req, res) {
// 	var teacherCsvFile = req.files.teacherCsvFile;
// 	var courseCsvFile = req.files.courseCsvFile;
// 	var sectionCsvFile = req.files.sectionCsvFile;

// 	if (courseCsvFile) {
// 		// Read Courses
// 		fs.readFile(courseCsvFile.path, function(err, data) {
// 			if (!err) {
// 				// Import courses
// 				importCourses(data.toString(), req.t, function(err, courses) {
// 					if (!err) {
// 						if (sectionCsvFile) {
// 							// Read section
// 							fs.readFile(sectionCsvFile.toString(), function(err, sections) {
// 								if (!err) {
// 									// Import sections
// 									importSections(data.toString(), req.t, function(err, sections) {

// 										if (!err) {
// 											// Update each section with course_id
// 											async.each(sections, function(section, sectionCallback) {

// 												db.course.find({
// 													code: section.course_id
// 												}, {
// 													transaction: req.t
// 												}).success(function(course) {

// 												}).error(function(err) {

// 												});

// 											}, function(err, result) {
// 												if (err) {

// 												} else {
// 													res.status(400).send({ message: "Could not update sections." });
// 												}
// 											});

// 										} else {
// 											res.status(400).send({ message: "Could not import sections." });
// 										}

// 								} else {
// 									res.status(400).send({ message: "Could not open sections." });
// 								}
// 							});

// 						} else {
// 							res.status(400).send({ message: "No sections file." });
// 						}
// 					} else {
// 						res.status(400).send({ message: "Error import courses" });
// 					}

// 				});
// 			} else {
// 				res.status(400).send({ message: "Could not open courses." });
// 			}
// 		});


// 	} else {
// 		res.status(400).send({ message: "No courses file." });
// 	}


// }


// exports.importStudents = function(req, res) {
// 	var csvFile = req.files.csvFile;
// 	// Make sure the csvFile is actually there
// 	if (csvFile) {
// 		// Read the file from the path
// 		fs.readFile(csvFile.path, function(err, data) {
// 			if (!err) {
// 				// Parse the CSV
// 				csv.parse(data.toString(), {
// 					skip_empty_lines: true,
// 					columns: true
// 				}, function(err, data) {
// 					if (!err) {
// 						var year = (new Date()).getFullYear();
// 						var checkedStudentIds = [];
// 						var checkedTeachers = [];
// 						var checkedCourses = [];
// 						var checkedSections = [];

// 						// Go through each line of the CSV file
// 						async.each(data, function(newPerson, cb) {
// 							var studentId = newPerson.student_id;
// 							var courseId = newPerson.course_id;
// 							var teacherHash = crypto.createHash('md5').update(newPerson.teacher_name).digest('hex');
// 							var sectionHash = crypto.createHash('md5').update(newPerson.course_id + newPerson.course_title + newPerson.period + newPerson.teacher_name).digest('hex');

// 							// Async waterfall different imports
// 							async.waterfall([

// 								// Import Students
// 								function(wcb) {

// 									// Check if we've already done this student
// 									if (studentId && !_.contains(checkedStudentIds, studentId)) {

// 										// Push it on the stack
// 										checkedStudentIds.push(studentId);

// 										db.person.find({
// 											where: { student_id: studentId }
// 										}, {
// 											transaction: req.t
// 										}).success(function(person) {
// 											var grade = parseInt(newPerson.grade);
// 											if (grade == 9) {
// 												newPerson.grad_year = year + 4;
// 											} else if (grade == 10) {
// 												newPerson.grad_year = year + 3;
// 											} else if (grade == 11) {
// 												newPerson.grad_year = year + 2;
// 											} else if (grade == 12) {
// 												newPerson.grad_year = year + 1;
// 											}

// 											newPerson.sex = (newPerson.sex == "M") ? "Male" : "Female";
											
// 											if (person) {
// 												person.updateAttributes({
// 													grad_year: newPerson.grad_year,
// 													address: newPerson.address,
// 													city: newPerson.city,
// 													state: newPerson.state,
// 													home_phone: newPerson.home_phone
// 												}, {
// 													transaction: req.t
// 												}).success(function(u) {
// 													wcb();
// 												}).error(function(err) {
// 													wcb(err);
// 												})
// 											} else {
// 												db.person.create({
// 													student_id: newPerson.student_id,
// 													last_name: newPerson.last_name,
// 													first_name: newPerson.first_name,
// 													grad_year: newPerson.grad_year,
// 													address: newPerson.address,
// 													city: newPerson.city,
// 													state: newPerson.state,
// 													zip_code: newPerson.zip_code,
// 													home_phone: newPerson.home_phone
// 												}, {
// 													transaction: req.t
// 												}).success(function(u) {
// 													wcb();
// 												}).error(function(err) {
// 													wcb(err);
// 												})
// 											}
// 										}).error(function(err) {
// 											wcb(err);
// 										});
// 									} else {
// 										wcb();
// 									}
// 								},

// 								// Import Teachers
// 								function(wcb) {

// 									// Check if we've already done this teacher
// 									if (teacherHash && !_.contains(checkedTeachers, teacherHash)) {

// 										// Push it on the stack
// 										checkedTeachers.push(teacherHash);

// 										db.teacher.findOrCreate({
// 											teacher_id: teacherHash
// 										}, {
// 											name: newPerson.teacher_name
// 										}, {
// 											transaction: req.t
// 										}).success(function(teacher) {
// 											wcb();
// 										}).error(function(err) {
// 											wcb(err);
// 										});
// 									} else {
// 										wcb();
// 									}
// 								},

// 								// Import courses
// 								function(wcb) {
// 									db.course.findOrCreate({
// 										code: courseId
// 									}, {
// 										name: newPerson.course_title
// 									}, {
// 										transaction: req.t
// 									}).success(function(course) {

// 											// Push it on the stack
// 											checkedSections.push(sectionHash);

// 											db.section.findOrCreate({
// 												code: sectionHash
// 											}, {
// 												course_id: course.id
// 											}, {
// 												transaction: req.t
// 											}).success(function(section) {

// 												// Find person again to add to section
// 												db.person.find({
// 													where: { student_id: studentId }
// 												}, {
// 													transaction: req.t
// 												}).success(function(person) {

// 													// Add enrollee
// 													section.addEnrollee(person, {
// 														transaction: req.t
// 													}).success(function(r) {
// 														wcb();
// 													}).error(function(err) {
// 														wcb(err);
// 													});

// 												}).error(function(err) {
// 													wcb(err);
// 												});

// 											}).error(function(err) {
// 												wcb(err);
// 											});

// 									}).error(function(err) {
// 										wcb(err);
// 									});
// 								}

// 							], function(err, result) {
// 								if (err) {
// 									cb(err);
// 								} else {
// 									cb(null, result);
// 								}
// 							}); // end async.waterfall()

// 						}, function(err) {
// 							if (err) {
// 								fs.unlink(csvFile.path, function(unlinkError) {
// 									console.error(err);
// 									res.status(400).json({ message: "Error importing students" });
// 								});
// 							} else {
// 								fs.unlink(csvFile.path, function(unlinkError) {
// 									res.send("OK");
// 								});
// 							}
// 						}); // end async.each()

// 					} else {
// 						fs.unlink(csvFile.path, function(unlinkError) {
// 							res.status(400).json({ message: util.format("Error reading CSV: %s", err.message) });
// 						});
// 					}
// 				});
// 			} else {
// 				fs.unlink(csvFile.path, function(unlinkError) {
// 					res.status(400).json({ message: util.format("Error reading file: %s", err.message) });
// 				});
// 			}
// 		});
// 	} else {
// 		res.status(400).json({ message: "Invalid file" });
// 	}
// };

function split(a, n) {
    var len = a.length,out = [], i = 0;
    while (i < len) {
        var size = Math.ceil((len - i) / n--);
        out.push(a.slice(i, i += size));
    }
    return out;
}

exports.importAndCrew = function(req, res) {
	var csvFile = req.files.csvFile;
	// Make sure the csvFile is actually there
	if (csvFile) {
		// Read the file from the path
		fs.readFile(csvFile.path, function(err, data) {
			if (!err) {
				// Parse the CSV
				csv.parse(data.toString(), {
					skip_empty_lines: true,
					columns: true
				}, function(err, data) {
					if (!err) {
						var studentsChecked = [];
						var sections = {};
						var numFreshmen = 0;

						async.each(data, function(p, cb) {
							db.person.findOrCreate({
								student_id: p.student_id
							}, {
								last_name: p.last_name,
								first_name: p.first_name,
								sex: ((p.sex=='M') ? 'Male' : 'Female'),
								grad_year: parseInt(p.grade),
								home_phone: p.home_phone,
								address: p.address,
								city: p.city,
								state: p.state,
								zip_code: p.zip_code
							}, {
								transaction: req.t
							}).success(function(newPerson) {
								if (newPerson.grad_year == 9) {
									numFreshmen += 1;
									var hash = crypto.createHash('md5').update(p.period + p.course_id + p.title + p.teacher_name).digest('hex');

									if (sections[hash]) {
										sections[hash].push(newPerson);
									} else {
										sections[hash] = [newPerson];
									}
								}

								cb();
							}).error(function(err) {
								cb(err);
							});

						}, function(err, result) {

							if (!err) {
								var crews = [];
								var tempList = [];
								var sectionKeys = Object.keys(sections);
								var avgCrewSize = 14;

								async.each(sectionKeys, function(key, cb) {
									var s = sections[key];
									console.log(_.map(s, function(p) { return p.id }));
									var numCrews = Math.ceil(s.length/avgCrewSize);

									if (s.length > 5) {
										var crewsForSection = split(s, numCrews);
										Array.prototype.push.apply(crews, crewsForSection);
									} else {
										Array.prototype.push.apply(tempList, s);
									}
									cb();
								}, function(err, result) {
									if (!err) {
										var numCrews = Math.round(tempList.length/avgCrewSize);
										var crewsForTempList = split(tempList, numCrews);
										Array.prototype.push.apply(crews, crewsForTempList);

										async.each(crews, function(crew, cb) {
											var personIds = _.map(crew, function(p) { return p.id });
											db.crew.create({}, {
												transaction: req.t
											}).success(function(newCrew) {
												db.person.update({
													crew_id: newCrew.id
												}, {
													id: personIds
												}, {
													transaction: req.t
												}).success(function(u) {
													console.log("Crew", newCrew.id, ":", personIds)

													cb();
												}).error(function(err) {
													cb(err);
												});
											}).error(function(err) {
												cb(err);
											});
										}, function(err, result) {
											if (!err) {
												res.send("OK");
											} else {
												res.status(400).send({message: err});
											}
										});
									} else {
										res.status(400).send({message: err});
									}
								});
							} else {
								res.status(400).send({message: err});
							}

						});
					} else {
						res.status(400).send({message: err});
					}

				});

			} else {
				res.status(400).json({ message: "Error reading file" });
			}
		});
	} else {
		res.status(400).json({ message: "Invalid file" });
	}
};
