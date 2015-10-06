module.exports = {
	up: function(migration, DataTypes, done) {
		migration.addColumn(
			'tutoring_attendances',
			'creator_id', {
				type: DataTypes.INTEGER,
				references: "people",
				referencesKey: "id"
			}
		);

		done()
	},
	down: function(migration, DataTypes, done) {
		migration.removeColumn(
			'tutoring_attendances',
			'creator_id'
		);

		done()
	}
}
