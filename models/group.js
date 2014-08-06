
module.exports = function(sequelize, DataTypes) {
	var Group = sequelize.define('group', {
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		description: DataTypes.TEXT,
		permission: {
			type: DataTypes.ENUM('user', 'admin', 'teachers', 'all'),
			allowNull: false,
			validate: {
				isIn: [['user', 'admin', 'teachers', 'all']]
			}
		},
		is_smart: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
			allowNull: false
		},
		criteria: {
			type: DataTypes.TEXT
		}
	}, {
		classMethods: {
			associate: function(models) {
				Group.hasMany(models.person, { as: 'members', foreignKey: "group_id", through: models.group_member });
			}
		}
	});

	return Group;
}