module.exports = {
	up: function(migration, DataTypes, done) {
		migration.addColumn(
			'sections',
			'instructor_id',
			DataTypes.INTEGER
		);

		migration.addColumn(
			'sections',
			'code',
			DataTypes.STRING
		);

		migration.addColumn(
			'sections',
			'room',
			DataTypes.STRING
		);

		done()
	}
}
