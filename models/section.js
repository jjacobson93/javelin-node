
module.exports = function(sequelize, DataTypes) {
	var Section = sequelize.define('section', {
		course_section_number: DataTypes.INTEGER,
		period: DataTypes.INTEGER,
		code: DataTypes.STRING,
		room: DataTypes.STRING
	}, {
		classMethods: {
			associate: function(models) {
				Section.belongsTo(models.course, { foreignKey: "course_id" });
				Section.belongsTo(models.session, { foreignKey: "session_id" });
				Section.hasMany(models.person, { as: 'enrollees', foreignKey: "section_id", through: models.enrollment });
				Section.belongsTo(models.person, { as: 'instructor', foreignKey: "instructor_id" });
			}
		}
	});

	return Section;
};