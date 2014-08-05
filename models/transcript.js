
module.exports = function(sequelize, DataTypes) {
	var Transcript = sequelize.define('transcript', {
		first_grade: DataTypes.STRING,
		second_grade: DataTypes.STRING,
		third_grade: DataTypes.STRING
	}, {
		classMethods: {
			associate: function(models) {
				Transcript.hasOne(models.enrollment, { foreignKey: "transcript_id" });
			}
		}
	});

	return Transcript;
}