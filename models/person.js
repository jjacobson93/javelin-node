
module.exports = function(sequelize, DataTypes) {
	var Person = sequelize.define('person', {
		student_id: DataTypes.INTEGER,
		last_name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				isAlpha: true,
				notEmpty: true,
				notNull: true
			}
		},
		first_name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				isAlpha: true,
				notEmpty: true,
				notNull: true
			}
		},
		sex: {
			type: DataTypes.ENUM('Male', 'Female'),
			allowNull: false,
			validate: {
				notNull: true
			}
		},
		grad_year: DataTypes.INTEGER,
		address: DataTypes.STRING,
		city: DataTypes.STRING,
		state: DataTypes.STRING,
		zip_code: DataTypes.STRING,
		home_phone: DataTypes.STRING,
		cell_phone: DataTypes.STRING,
		email: {
			type: DataTypes.STRING,
			allowNull: true,
			validate: {
				notNull: false,
				isEmail: true
			}
		},
		picture: DataTypes.BLOB
	}, {
		classMethods: {
			associate: function(models) {
				Person.hasOne(models.auth_user, { foreignKey: "person_id" });
				Person.hasMany(models.group, { foreignKey: "person_id", through: 'group_members' });
				Person.hasMany(models.section, { foreignKey: "person_id", through: models.enrollment });
				Person.hasMany(models.tutoring_attendance, { foreignKey: "person_id" });
			}
		}
	});

	return Person
}