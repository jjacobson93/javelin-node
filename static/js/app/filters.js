app.filter('moment', function() {
	return function(input, format) {
		var m = moment(input);
		if (!m.isValid()) return undefined;
		else if (format) return m.format(format);
		else return m;
	};
});