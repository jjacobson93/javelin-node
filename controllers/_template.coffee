exports.findAll = (req, res) ->
	db.MODELNAME.findAll({}, {
		transaction: req.t
	}
	.success (people) ->
		res.json(people);
	.error (err) ->
		res.status(400).json({ message: err });

exports.findOne = (req, res) ->
	db.MODELNAME.find({
		where: { id: req.params.id }
	}, {
		transaction: req.t
	}
	.success (MODELNAME) ->
		res.json(MODELNAME);
	.error (err) ->
		res.status(400).json({ message: err });

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