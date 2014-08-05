
module.exports = function(app) {
	require('./globals')(app);
	require('./express')(app);
	require('./transactions')(app);
	require('./passport')(app);
	require('./middleware')(app);
	require('./routes')(app);
	require('./errors')(app);
};