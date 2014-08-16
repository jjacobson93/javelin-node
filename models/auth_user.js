var bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
	var AuthUser = sequelize.define('auth_user', {
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				isEmail: true
			}
		},
		password: {
			type: DataTypes.STRING,
			set: function(password) {
				var salt = bcrypt.genSaltSync(13);
				var hash = bcrypt.hashSync(password, salt);
				return this.setDataValue('password', hash);
			}
		},
		invitation_expiration: {
			type: DataTypes.DATE
		},
		invitation_key: {
			type: DataTypes.STRING
		},
		active: {
			type: DataTypes.BOOLEAN,
			defaultValue: true
		},
		role: {
			type: DataTypes.ENUM('student', 'tutor', 'staff', 'admin', 'super')
		}
	}, {
		classMethods: {
			associate: function(models) {
				AuthUser.belongsTo(models.person, { foreignKey: "person_id" });
				AuthUser.hasMany(models.auth_role,  { as: 'roles', through: 'auth_role_assignment' });
			}
		},
		instanceMethods: {
			isValidPassword: function(password) {
				return bcrypt.compareSync(password, this.password);
			}
		}
	});

	return AuthUser;
}