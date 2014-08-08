
module.exports = function(sequelize, DataTypes) {
	var Course = sequelize.define('course', {
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		code: {
			type: DataTypes.STRING,
			allowNull: false
		}
	}, {
		classMethods: {
			associate: function(models) {
				Course.belongsTo(models.department, { foreignKey: "department_id" });
				Course.hasMany(models.section);
			}
		}
	});

	return Course;
}