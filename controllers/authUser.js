exports.isAuthenticated = function(req, res) {
	res.send(req.isAuthenticated());
};