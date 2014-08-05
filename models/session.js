
module.exports = function(sequelize, DataTypes) {
	var Session = sequelize.define('session', {
		name: {
			type: DataTypes.ENUM('Winter', 'Spring', 'Summer', 'Fall'),
			allowNull: false,
			validate: {
				notNull: true
			}
		},
		year: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				notNull: true
			}
		}
	});

	return Session;
}