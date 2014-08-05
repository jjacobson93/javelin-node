
module.exports = function(sequelize, DataTypes) {
	var Enrollment = sequelize.define('enrollment', {
		is_instructor: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		}
	}, {
		classMethods: {
			associate: function(models) {
				Enrollment.belongsTo(models.transcript);
			}
		}
	});

	return Enrollment;
}