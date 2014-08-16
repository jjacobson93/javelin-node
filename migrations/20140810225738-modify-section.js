module.exports = {
	up: function(migration, DataTypes, done) {
		migration.describeTable('sections').success(function(attributes) {
			if (!('instructor_id' in attributes)) {
				migration.addColumn(
					'sections',
					'instructor_id',
					DataTypes.INTEGER
				);
			}

			if (!('code' in attributes)) {
				migration.addColumn(
					'sections',
					'code',
					DataTypes.STRING
				);
			}

			if (!('room' in attributes)) {
				migration.addColumn(
					'sections',
					'room',
					DataTypes.STRING
				);
			}

			done()
		});
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
