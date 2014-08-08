
module.exports = function(sequelize, DataTypes) {
	var Person = sequelize.define('person', {
		student_id: DataTypes.INTEGER,
		last_name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		first_name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		sex: {
			type: DataTypes.ENUM('Male', 'Female'),
			allowNull: true
		},
		grad_year: DataTypes.INTEGER,
		address: DataTypes.STRING,
		city: DataTypes.STRING,
		state: DataTypes.STRING,
		zip_code: DataTypes.STRING,
		home_phone: DataTypes.STRING,
		cell_phone: DataTypes.STRING,
		cell_provider: {
			type: DataTypes.ENUM('AT&T', 'Verizon', 'T-Mobile', 'Metro-PCS', 'Sprint', 'Other'),
			allowNull: true
		},
		email: {
			type: DataTypes.STRING,
			allowNull: true,
			validate: {
				isEmail: true
			}
		},
		notes: DataTypes.TEXT,
		picture: DataTypes.BLOB
	}, {
		classMethods: {
			associate: function(models) {
				Person.hasOne(models.auth_user, { foreignKey: "person_id" });
				Person.hasMany(models.group, { foreignKey: "person_id", through: models.group_member });
				Person.hasMany(models.section, { foreignKey: "person_id", through: models.enrollment });
				Person.hasMany(models.tutoring_attendance, { foreignKey: "person_id" });
				Person.hasMany(models.event, { foreignKey: "person_id", through: models.attendee });
			}
		}
	});

	return Person
}