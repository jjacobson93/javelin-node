module.exports = function(sequelize, DataTypes) {
	var AuthRole = sequelize.define('auth_role', {
		name: DataTypes.STRING
	}, {
		classMethods: {
			associate: function(models) {
				AuthRole.hasMany(models.auth_user, { through: 'auth_role_assignment' });
			}
		}
	});

	return AuthRole;
}