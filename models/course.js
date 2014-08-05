
module.exports = function(sequelize, DataTypes) {
	var Course = sequelize.define('course', {
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notNull: true
			}
		},
		code: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notNull: true
			}
		}
	}, {
		classMethods: {
			associate: function(models) {
				Course.belongsTo(models.department, { foreignKey: "department_id" });
			}
		}
	});

	return Course;
}