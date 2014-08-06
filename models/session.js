
module.exports = function(sequelize, DataTypes) {
	var Session = sequelize.define('session', {
		name: {
			type: DataTypes.ENUM('Winter', 'Spring', 'Summer', 'Fall'),
			allowNull: false
		},
		year: {
			type: DataTypes.INTEGER,
			allowNull: false
		}
	});

	return Session;
}