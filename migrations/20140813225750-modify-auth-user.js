module.exports = {
  up: function(migration, DataTypes, done) {
    migration.changeColumn(
    	'auth_users',
    	'password',
    	{
    		type: DataTypes.STRING,
    		allowNull: true
    	}
    );

    migration.addColumn(
    	'auth_users',
    	'security_answer',
    	DataTypes.STRING
    );

    done()
  },
  down: function(migration, DataTypes, done) {
    migration.changeColumn(
    	'auth_users',
    	'password',
    	{
    		type: DataTypes.STRING,
    		allowNull: false
    	}
    );

    migration.removeColumn(
    	'auth_users',
    	'security_answer'
    );

    done()
  }
}
