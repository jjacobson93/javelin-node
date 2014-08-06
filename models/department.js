
module.exports = function(sequelize, DataTypes) {
	var Department = sequelize.define('department', {
		name: {
			type: DataTypes.STRING,
			allowNull: false
		}
	}, {
		classMethods: {
			associate: function(models) {
				// Department.belongsTo(models.Course)	
			}
		}
	});

	return Department;
}