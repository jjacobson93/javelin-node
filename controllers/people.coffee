db = require('../models')

exports.findAll = (req, res) ->
	query = {
		order: [[db.sequelize.col('people.last_name')], [db.sequelize.col('people.first_name')]]
	}
	
	if req.query.search == undefined
		for val, key in req.query
			if !query.where
				query.where = {}

			if (key != "created_at" and key != "updated_at" and key in db.person.rawAttributes)
				field = db.person.rawAttributes[key]
				query.where[key] = if field.type._typeName == 'VARCHAR' then { like: '%' + val + '%' }  else query.where[key] = val
				
	else
		query.where = db.Sequelize.or(
			["last_name ILIKE ?", '%' + req.query.search + '%'],
			["first_name ILIKE ?", '%' + req.query.search + '%']
		)

	query.include = {
		model: db.crew,
		attributes: ['room']
	}

	db.person.findAll(query, {
		transaction: req.t,
	})
	.success (people) ->
		res.json(people)
	.error (err) ->
		res.status(400).json({ message: err })

exports.findWithCrew = (req, res) ->
	db.sequelize.query 'SELECT "people".*, "crew"."room" AS "crew.room",
		"crew"."id" AS "crew.id" FROM "people"
		LEFT OUTER JOIN "crews" AS "crew" ON "people"."crew_id" = "crew"."id"
		WHERE "people"."grad_year"=\'9\' ORDER BY "people"."last_name", "people"."first_name"'
	.success (people) ->
		console.log(people)
		res.send(people)
	.error (err) ->
		res.end(error)


exports.findOne = (req, res) ->
	query = {
		where: { id: req.params.id },
		include: [
			{
				model: db.section,
				include: [ db.session, db.course ]
			},
			{
				model: db.auth_user,
				attributes: ['username']
			}
		]
	}

	db.person.find query, {
		transaction: req.t
	}
	.success (person) ->
		res.json(person)
	.error (err) ->
		res.status(400).json({ message: err })
	

exports.filterAll = (req, res) ->
	db.person.find req.query, {
		transaction: req.t
	}
	.success (people) ->
		res.json(people)
	.error (err) ->
		res.status(400).json({ message: err })
	

exports.create = (req, res) ->
	db.person.create req.body, {
		transaction: req.t
	}
	.success (person) ->
		res.status(201).json(person)
	.error (err) ->
		res.status(400).json({ message: err })

exports.update = (req, res) ->
	db.person.update req.body, {
		id: req.params.id
	}, {
		returning: true,
		transaction: req.t
	}
	.success (peopleUpdated) ->
		res.json(peopleUpdated)
	.error (err) ->
		res.status(400).json({ message: err })

exports.delete = (req, res) ->
	db.person.destroy {
		id: req.params.id
	}, {
		transaction: req.t
	}
	.success (affectedRows) ->
		res.json({ affectedRows: affectedRows })
