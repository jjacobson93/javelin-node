
module.exports = function(sequelize, DataTypes) {
	var Event = sequelize.define('event', {
		title: {
			type: DataTypes.STRING,
			allowNull: false
		},
		notes: DataTypes.TEXT,
		location: DataTypes.TEXT,
		start_time: {
			type: DataTypes.DATE,
			allowNull: false,
			validate: {
				isDate: true
			}
		},
		end_time: {
			type: DataTypes.DATE,
			allowNull: false,
			validate: {
				isDate: true
			}
		},
		is_all_day: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		},
		is_recurring: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		},
		end_recurring: {
			type: DataTypes.DATE,
			defaultValue: null,
			allowNull: true,
			validate: {
				isDate: true
			}
		}
	}, {
		classMethods: {
			associate: function(models) {
				Event.hasMany(models.person, { as: "attendees", foreignKey: "event_id", through: models.attendee });
			}
		}
	});

	return Event;
}