
module.exports = function(sequelize, DataTypes) {
	var Group = sequelize.define('group', {
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notNull: true
			}
		},
		description: DataTypes.TEXT,
		permission: {
			type: DataTypes.ENUM('user', 'admin', 'teachers', 'all'),
			allowNull: false,
			validate: {
				notNull: true,
				isIn: [['user', 'admin', 'teachers', 'all']]
			}
		},
		is_smart: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
			allowNull: false,
			validate: {
				notNull: true
			}
		},
		criteria: {
			type: DataTypes.TEXT
		}
	}, {
		classMethods: {
			associate: function(models) {
				Group.hasMany(models.person, { as: 'members', foreignKey: "group_id", through: 'group_members' });
			}
		}
	});

	return Group;
}