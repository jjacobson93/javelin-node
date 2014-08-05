var bcrypt = require('bcrypt');
// var orm = require('orm');

// module.exports = function(db) {
// 	return db.define('auth_user', {
// 		username: {
// 			type: "text",
// 			required: true
// 		},
// 		password: {
// 			type: "text",
// 			required: true
// 		}
// 	}, {
// 		methods: {
// 			isValidPassword: function(password) {
// 				return bcrypt.compareSync(password, this.password);
// 			}
// 		},
// 		validations: {
// 			username: orm.enforce.patterns.email("Invalid email address"),
// 		},
// 		hooks: {
// 			beforeSave: function() {
// 				if (this.)
// 			};
// 		}
// 	});
// };

module.exports = function(sequelize, DataTypes) {
	var AuthUser = sequelize.define('auth_user', {
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				isEmail: true,
				notNull: true
			}
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notNull: true
			},
			set: function(password) {
				var salt = bcrypt.genSaltSync(13);
				var hash = bcrypt.hashSync(password, salt);
				return this.setDataValue('password', hash);
			}
		}
	}, {
		classMethods: {
			associate: function(models) {
				AuthUser.belongsTo(models.person, { foreignKey: "person_id" });
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