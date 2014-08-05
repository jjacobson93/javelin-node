
module.exports = function(sequelize, DataTypes) {
	var TutoringSubject = sequelize.define('tutoring_subject', {
		title: DataTypes.STRING,
	}, {
		classMethods: {
			associate: function(models) {
				// TutoringSubject.belongsTo(models.department, { foreignKey: "department_id" });
				TutoringSubject.hasMany(models.tutoring_attendance);
			}
		}
	});

	return TutoringSubject;
}