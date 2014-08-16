module.exports = {
  up: function(migration, DataTypes, done) {
  	migration.addColumn(
		'auth_users',
		'invitation_expiration',
		DataTypes.DATE
	);
	
	migration.addColumn(
		'auth_users',
		'invitation_key',
		DataTypes.STRING
	);

	migration.addColumn(
		'auth_users',
		'active',
		DataTypes.BOOLEAN
	);

	done()
  },
  down: function(migration, DataTypes, done) {
    migration.removeColumn(
		'auth_users',
		'invitation_expiration'
	);
	
	migration.removeColumn(
		'auth_users',
		'invitation_key'
	);

	migration.removeColumn(
		'auth_users',
		'active'
	);

    done()
  }
}
