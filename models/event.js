
module.exports = function(sequelize, DataTypes) {
	var Attendeee = sequelize.define('attendee', {
		attend_time: {
			type: DataTypes.DATE,
			defaultValue: sequelize.NOW,
			allowNull: false,
			validate: {
				notNull: true,
				isDate: true
			}
		}
	});

	var Event = sequelize.define('event', {
		title: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notNull: true,
				isAlpha: true
			}
		},
		notes: DataTypes.TEXT,
		location: DataTypes.TEXT,
		start_time: {
			type: DataTypes.DATE,
			allowNull: false,
			validate: {
				notNull: true,
				isDate: true
			}
		},
		end_time: {
			type: DataTypes.DATE,
			allowNull: false,
			validate: {
				notNull: true,
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
			validate: {
				isDate: true
			}
		}
	}, {
		classMethods: {
			associate: function(models) {
				Event.hasMany(models.person, { as: 'attendees', foreignKey: "event_id", through: Attendeee });
				models.person.hasMany(Event, { foreignKey: "person_id", through: Attendeee });
			}
		}
	});

	return Event;
}