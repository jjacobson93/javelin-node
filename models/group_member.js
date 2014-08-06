module.exports = function(sequelize, DataTypes) {
	var GroupMember = sequelize.define('group_member', {});

	return GroupMember;
}