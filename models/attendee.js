module.exports = function(sequelize, DataTypes) {
	var Attendee = sequelize.define('attendee', {
		attend_time: {
			type: DataTypes.DATE,
			defaultValue: sequelize.NOW,
			allowNull: false,
			validate: {
				isDate: true
			}
		}
	});

	return Attendee;
}