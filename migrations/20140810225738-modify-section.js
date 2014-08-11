module.exports = {
	up: function(migration, DataTypes, done) {
		// add altering commands here, calling 'done' when finished
		done()
	},
	down: function(migration, DataTypes, done) {
		migration.removeColumn(
			'sections',
			'instructor_id'
		);

		migration.removeColumn(
			'sections',
			'code'
		);

		migration.removeColumn(
			'sections',
			'room'
		);

		done()
	}
}
