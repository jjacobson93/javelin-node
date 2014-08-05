
module.exports = function(sequelize, DataTypes) {
	var Crew = sequelize.define('crew', {
		room: DataTypes.STRING,
		score: DataTypes.ENUM('A', 'I', 'M')
	}, {
		classMethods: {
			associate: function(models) {
				Crew.hasMany(models.person, { as: 'crew_members' });
			}
		}
	});

	return Crew;
}