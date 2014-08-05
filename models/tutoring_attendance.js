
module.exports = function(sequelize, DataTypes) {
	var TutoringAttendance = sequelize.define('tutoring_attendance', {
		in_time: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW
		},
		out_time: {
			type: DataTypes.DATE,
		},
		voided: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		},
		tutoring_subject_id: {
			type: DataTypes.INTEGER,
			references: "tutoring_subjects",
			referencesKey: "id",
		},
		person_id: {
			type: DataTypes.INTEGER,
			references: "people",
			referencesKey: "id",
		}
	}, {
		classMethods: {
			associate: function(models) {
				TutoringAttendance.belongsTo(models.person, { as: "attendee" });
				TutoringAttendance.belongsTo(models.tutoring_subject);
			}
		}
	});

	return TutoringAttendance;
}