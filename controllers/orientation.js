var db = require('../models');
var _ = require('lodash');
var util = require('util');
var fs = require('fs');
var multiparty = require('multiparty');
var csv = require('csv');
var async = require('async');

exports.findCrews = function(req, res) {
	db.crew.findAll({
		include: [{
			model: db.person,
			as: 'crew_members',
		}],
		order: "crews.id"
	}, {
		transaction: req.t
	}).success(function(crews) {
		res.json(crews);
	}).error(function(err) {
		res.status(400).json({ message: err });
	});
};

exports.findCrew = function(req, res) {
	db.crew.find({
		where: { id: req.params.id },
		include: [{
			model: db.person,
			as: 'crew_members',
			attributes: ['id', 'last_name', 'first_name', 'grad_year']
		}],
		order: "crew_members.last_name"
	}, {
		transaction: req.t
	}).success(function(crew) {
		res.json(crew);
	}).error(function(err) {
		res.status(400).json({ message: err });
	});
};

exports.createCrew = function(req, res) {
	db.crew.create(req.body, {
		transaction: req.t
	}).success(function(crew) {
		if (req.body.people !== undefined && req.body.people.length > 0) {
				
			var memberIds = _.map(req.body.people, function(person) {
				return person.id;
			});

			db.person.findAll({ 
				where: { id: memberIds }
			}, {
				transaction: req.t
			}).success(function(people) {
				crew.setCrewMembers(people, {
					transaction: req.t
				}).success(function(members) {
					var crewClone = _.cloneDeep(crew.values);
					crewClone.crewMembers = members;
					res.status(201).json(crewClone);
				}).error(function(err) {
					res.status(400).json({ message: err });
				});
			}).error(function(err) {
				res.status(400).json({ message: err });
			});
		} else {
			res.status(201).json(crew);
		}
	}).error(function(err) {
		res.status(400).json({ message: err });
	});
};

exports.updateCrew = function(req, res) {
	db.crew.update(req.body, {
		id: req.params.id
	}, {
		returning: true,
		transaction: req.t
	}).success(function(crewsUpdated) {
		res.json(crewsUpdated);
	}).error(function(err) {
		res.status(400).json({ message: err });
	});
};

exports.deleteCrew = function(req, res) {
	db.crew.destroy({
		id: req.params.id
	}, {
		transaction: req.t
	}).success(function(affectedRows) {
		res.json({ affectedRows: affectedRows });
	});
};

exports.peopleNotInCrew = function(req, res) {
	var crewId = req.param('id');
	var query = {};

	// We might be searching by last_name/first_name
	if (req.query.search != undefined) {
		query.where = db.Sequelize.and(
			db.Sequelize.or(
				{ crew_id: { ne: crewId } },
				{ crew_id: null }
			),
			db.Sequelize.or(
				["last_name ILIKE ?", '%' + req.query.search + '%'],
				["first_name ILIKE ?", '%' + req.query.search + '%']
			)
		);
	} else {
		query.where = {
			crew_id: { ne: crewId }
		};
	}

	db.person.findAll(query, {
		transaction: req.t
	}).success(function(people) {
		res.send(people);
	}).error(function(err) {
		res.status(400).send({ message: err });
	});
};

exports.addMembersToCrew = function(req, res) {
	var crewId = req.param('id');
	var people = req.body.people;

	// Find crew
	db.crew.find({
		where: { id: crewId }
	}, {
		transaction: req.t
	}).success(function(crew) {
		if (crew) {
			// Crew is here, let's add people
			db.person.update({
				crew_id: crewId
			}, {
				id: people
			}, {
				returning: true,
				transaction: req.t
			}).success(function(people) {
				res.json(people);
			}).error(function(err) {
				res.status(400).json({ message: err });
			});
		} else {
			res.status(400).json({ message: util.format("Crew %d does not exist.", crewId) });
		}
	}).error(function(err) {
		res.status(400).json({ message: err });
	});
};

exports.removeMemberFromCrew = function(req, res) {
	var crewId = req.param('id');
	var personId = req.param('person_id');

	// Find crew
	db.crew.find({
		where: { id: crewId }
	}, {
		transaction: req.t
	}).success(function(crew) {
		if (crew) {
			// Find person
			db.person.find({
				where: { id: personId }
			}, {
				transaction: req.t
			}).success(function(person) {
				if (person) {
					// Remove person from crew
					crew.removeCrewMember(person, {
						transaction: req.t
					}).success(function(member) {
						res.json(member);
					}).error(function(err) {
						res.status(400).json({ message: err });
					});
				} else {
					res.status(400).json({ message: util.format("Person %d does not exist.", personId) });
				}
			}).error(function(err) {
				res.status(400).json({ message: err });
			});
		} else {
			res.status(400).json({ message: util.format("Crew %d does not exist.", crewId) });
		}
	}).error(function(err) {
		res.status(400).json({ message: err });
	});
};

exports.importCrewLeaders = function(req, res) {
	var csvFile = req.files.csvFile;
	// Make sure the csvFile is actually there
	if (csvFile) {
		// Read the file from the path
		fs.readFile(csvFile.path, function(err, data) {
			if (!err) {
				// Parse the CSV
				csv.parse(data.toString(), {
					skip_empty_lines: true,
					columns: function(line) {
						return _.map(line, function(col) {
							var newCol = col.toLowerCase()
							.replace(/[^\w\s]/gi, '')
							.trim()
							.split(' ').map(function(e, idx) {
								return e.toLowerCase();
							}).join('_');
							if (newCol == "email_address") return "email";
							else return newCol;
						})
					}
				}, function(err, data) {
					if (!err) {
						var year = (new Date()).getFullYear();
						db.person.bulkCreate(_.map(_.filter(data, function(p, i) {
							return p.timestamp != "";
						}), function(person, idx) {
							if (person.grade == "Freshmen") {
								person.grad_year = year + 4;
							} else if (person.grade == "Sophomore") {
								person.grad_year = year + 3;
							} else if (person.grade == "Junior") {
								person.grad_year = year + 2;
							} else if (person.grade == "Senior") {
								person.grad_year = year + 1;
							}

							if (person.cell_provider == "AT & T") person.cell_provider = "AT&T";
							if (!(person.cell_provider == 'AT&T' || person.cell_provider == 'Verizon' ||
								person.cell_provider ==  'T-Mobile' || person.cell_provider == 'Metro-PCS' ||
								person.cell_provider ==  'Sprint') && person.cell_provider != "") person.cell_provider = 'Other';
							else if (person.cell_provider == "") person.cell_provider = undefined;

							return {
								last_name: person.last_name.charAt(0).toUpperCase() + person.last_name.slice(1),
								first_name: person.first_name.charAt(0).toUpperCase() + person.first_name.slice(1),
								email: person.email,
								cell_phone: (person.cell_phone) ? person.cell_phone.replace(/\W/g, '') : undefined,
								cell_provider: person.cell_provider,
								grad_year: person.grad_year,
								notes: person.comments || undefined
							};
						}), {
							transaction: req.t
						}).success(function(people) {
							fs.unlink(csvFile.path, function(err) {
								res.send(people);
							});
						}).error(function(err) {
							res.status(400).json({ message: err });
						});
					} else {
						res.status(400).json({ message: util.format("Error reading CSV: %s", err.message) });
					}
				});
			} else {
				res.status(400).json({ message: util.format("Error reading file: %s", err.message) });
			}
		});
	} else {
		res.status(400).json({ message: "Invalid file" });
	}
};

exports.organizeCrews = function(req, res) {
	if (req.query.simple) {

		db.person.findAll({
			where: { grad_year: 2018 }
		}).success(function(people) {
			var crewIdx = 1;

			// Loop through people and assign to crews
			async.each(people, function(person, cb) {
				
			});

		}).error(function(err) {
			res.status(400).json({ message: "Could not organize crews: " + err });
		});

	} else {
		res.status(400).json({ message: "Could not organize crews" });
	}


	// db.course.findAll({
	// 	where: { code: ['EN228', 'EN135', 'EN137'] }
	// }, {
	// 	transaction: req.t
	// }).success(function(courses) {
	// 	var numCrews = 0;
	// 	var crewIndex = 1;
	// 	var inCrews = [];
	// 	var tempList = [];

	// 	// Loop through courses
	// 	async.each(courses, function(course, courseCallback) {

	// 		// Find sections of course
	// 		course.getSections({
	// 			include: [{
	// 				model: db.person,
	// 				as: 'enrollees'
	// 			}]
	// 		}, {
	// 			transaction: req.t
	// 		}).success(function(sections) {
	// 			// Loop through sections
	// 			async.each(sections, function(section, sectionCallback) {
	// 				console.log("SECTION:", section.enrollees.length);

	// 				numCrews = Math.round(section.enrollees.length/10);
	// 				if (numCrews == 0 && section.enrollees.length >= 5) {
	// 					numCrews = 1;
	// 				} else if ((numCrews == 0 || numCrews == 1) && section.enrollees.length < 5) {
	// 					Array.prototype.push.apply(tempList, section.enrollees);
	// 				}

	// 				console.log("NUM CREWS:", numCrews);

	// 				if (numCrews != 0) {
	// 					// Go through all the students
	// 					async.whilst(function() {
	// 						return section.enrollees.length > 0;
	// 					}, function(studentCallback) {
	// 						var i = 0;
	// 						// Loop through crews
	// 						async.whilst(function() {
	// 							return (i < numCrews && section.enrollees && section.enrollees.length > 0);
	// 						}, function(crewCallback) {
	// 							// Get the next student
	// 							var student = section.enrollees.shift();
	// 							if (!_.contains(inCrews, student.id)) {
	// 								// Find or create new crew
	// 								db.crew.findOrCreate({
	// 									where: { id: crewIndex + i }
	// 								}, {}, {
	// 									transaction: req.t
	// 								}).success(function(crew) {
	// 									// Add to crew
	// 									student.setCrew(crew, {
	// 										transaction: req.t
	// 									}).success(function(crew) {
	// 										inCrews.push(student.id);
	// 										i += 1;
	// 										crewCallback();
	// 									}).error(function(err) {
	// 										i += 1;
	// 										crewCallback(err);
	// 									});
	// 								}).error(function(err) {
	// 									i += 1;
	// 									crewCallback(err);
	// 								});
	// 							} else {
	// 								i += 1;
	// 								crewCallback();
	// 							}
	// 						}, function(err) {
	// 							studentCallback(err);
	// 						}); // end crew loop

	// 					}, function(err) {
	// 						if (!err) crewIndex += numCrews;
	// 						sectionCallback(err);
	// 					}); // end student while
	// 				} else {
	// 					sectionCallback();
	// 				}

	// 			}, function(err) {
	// 				courseCallback(err);
	// 			});

	// 		}).error(function(err) {
	// 			courseCallback(err);
	// 		});

	// 	}, function(err) {
	// 		if (err) {
	// 			res.status(400).json({ message: err });
	// 		} else {
	// 			// Unload temp list
	// 			async.whilst(function() {
	// 				return (tempList && tempList.length > 0)
	// 			}, function(tempCallback) {
	// 				var student = tempList.shift();
	// 				if (!_.contains(inCrews, student.id)) {
	// 					// Get the crew with the lowest
	// 					db.crew.findAll({
	// 						attributes: ['crews.*', [db.sequelize.fn('COUNT', db.sequelize.col('crews.id')), 'crewCount']],
	// 						include: [{
	// 							model: db.person,
	// 							as: 'crew_members',
	// 							attributes: []
	// 						}],
	// 						order: [['crewCount']],
	// 						group: [["crews.id"], ["crew_members.id"]]
	// 					}, {
	// 						transaction: req.t
	// 					}).success(function(crews) {
	// 						if (crews) {
	// 							student.updateAttributes({
	// 								crew_id: crews[0]
	// 							}, {
	// 								transaction: req.t
	// 							}).success(function(crew) {
	// 								tempCallback();
	// 							}).error(function(err) {
	// 								tempCallback(err);
	// 							});
	// 						} else {
	// 							tempCallback();
	// 						}
	// 					}).error(function(err) {
	// 						tempCallback(err);
	// 					});

	// 				} else {
	// 					tempCallback();
	// 				}

	// 			}, function(err) {
	// 				if (!err) {
	// 					res.send("OK");
	// 				} else {
	// 					res.status(400).json({ message: err });
	// 				}
	// 			});
	// 		}
	// 	});

	// }).error(function(err) {
	// 	res.status(400).json({ message: err });
	// });
};