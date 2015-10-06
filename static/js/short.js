(function(exports) {

	/**
	 * Absolute value
	 *
	 * @param {Number} x
	 * @return {Number} absolute value of x
	 */
	exports.abs = function(x) {
		return Math.abs(x);
	}

	/**
	 * Returns true if all elements of iterable are true
	 *
	 * @param {String|Array} iterable
	 * @return {Boolean}
	 */
	exports.all = function(iterable) {
		for (var i = 0; i < iterable.length; i++) {
			if (!iterable[i]) return false;
		};
		return true;
	}

	/**
	 * Returns true if any elements of iterable are true
	 *
	 * @param {String|Array} iterable
	 * @return {Boolean}
	 */
	exports.any = function(iterable) {
		for (var i = 0; i < iterable.length; i++) {
			if (iterable[i]) return true;
		};
		return false;
	}

	/**
	 * Return a binary string 
	 * 
	 * @param {Number} i
	 * @return {String} binary string
	 */
	exports.bin = function(i) {
		return i.toString(2);
	}

	/**
	 * Convert value to a Boolean
	 *
	 * @param {*} [x]
	 * @return {Boolean}
	 */
	exports.bool = function(x) {
		return !!x;
	}

	/**
	 * Return a string of one character from the character code
	 * 
	 * @param {Number} i
	 * @return {String} a character
	 */
	exports.chr = function(i) {
		return String.fromCharCode(i);
	}

	/**
	 * Deep clones an object
	 *
	 * @param {Object} o
	 * @return {Object} clone
	 */
	exports.clone = function(o) {
		return JSON.parse(JSON.stringify(o));
	}

	/**
	 * Returns the keys of an object. If no object is
	 * given, then it returns the keys of window/global
	 * 
	 * @param {Object} [o]
	 * @return {Array} array of keys
	 */
	exports.dir = function(o) {
		if (arguments.length == 1 && o != undefined) return Object.keys(o);
		if (arguments.length == 1 && o == undefined) return [];
		else return Object.keys((global != undefined) ? global : window);
	}

	/**
	 * Filters an Array or Object
	 *
	 * @param {Object|Array} o
	 * @param {Function} f
	 * @param {Object|Array} new array/object
	 */
	exports.filter = function(o, f) {
		return o.filter(f);
	}

	/**
	 * Converts a string to a float
	 *
	 * @param {String} [x]
	 * @return {Number} float
	 */
	exports.float = function(x) {
		return (x != undefined) ? parseFloat(x) : 0.0;
	}

	/**
	 * Converts an integer to a hexadecimal string
	 *	
	 * @param {Number} x
	 * @return {String} hexadecimal string
	 */
	exports.hex = function(x) {
		return x.toString(16);
	}

	/**
	 * Converts a string to an integer.
	 * Returns 0 if x is undefined.
	 * 
	 * @param {String} [x]
	 * @param {Number} [base]
	 * @return {Number} integer 
	 */
	exports.int = function(x, base) {
		return (x != undefined) ? parseInt(x, (base != undefined) ? base : 10) : 0;
	}

	/**
	 * Returns true if o is an instance of i
	 * 
	 * @param {Object} o
	 * @return {Boolean}
	 */
	exports.isinstance = function(o, i) {
		return o instanceof i;
	}

	/**
	 * Returns the last element of the array or string
	 * 
	 * @param {Array|String} a
	 * @return {*}
	 */
	exports.last = function(a) {
		return a[a.length - 1];
	}

	/**
	 * Returns the length of a string/array/object
	 *
	 * @param {String|Array|Object} o
	 * @return {Number} length
	 */
	exports.len = function(o) {
		return (typeof(o) == 'string' || o instanceof String || o instanceof Array) ? o.length : Object.keys(o).length;
	}

	/**
	 * Logs to the console (alias of console.log)
	 *
	 * @param {...*} [arguments]
	 * @return {undefined}
	 */
	exports.log = function() {
		return console.log.apply(console, arguments);
	}

	/**
	 * Maps an Array or Object
	 *
	 * @param {Object|Array} o
	 * @param {Function} f
	 * @param {Object|Array} new array/object
	 */
	exports.map = function(o, f) {
		return o.map(f);
	}

	/**
	 * Returns the max of an Array of numbers or of the arguments
	 *
	 * @param {...Number|Number[]} x
	 * @return {Number} max value
	 */
	exports.max = function(x) {
		if (arguments.length == 1) {
			if (arguments[0] instanceof Array)
				arguments = arguments[0];
		}
		return Math.max.apply(Math.max, arguments)
	}

	/**
	 * Returns the min of an Array of numbers or of the arguments
	 *
	 * @param {...Number|Number[]} x
	 * @return {Number} min value
	 */
	exports.min = function(x) {
		if (arguments.length == 1) {
			if (arguments[0] instanceof Array)
				arguments = arguments[0];
		}

		return Math.min.apply(Math.min, arguments);
	}

	/**
	 * Converts a Number to an octal string
	 *
	 * @param {Number} x
	 * @return {String} octal string
	 */
	exports.oct = function(x) {
		return x.toString(8);
	}

	/**
	 * Given a character, return the Unicode number representation
	 *
	 * @param {String} c
	 * @return {Number} unicode number
	 */
	exports.ord = function(c) {
		return c.charCodeAt();
	}

	/**
	 * Return x to the power of y.
	 * If z is present, return x to the power y, modulo z
	 *
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} [z]
	 * @return {Number}
	 */
	exports.pow = function(x, y, z) {
		if (z == undefined) return Math.pow(x,y);
		else return pow(x, y) % z;
	}

	/**
	 * Returns a range from start to stop with step steps.
	 * If one argument is given, stop = start.
	 *
	 * @param {Number} start=0
	 * @param {Number} [stop=start]
	 * @param {Number} [step]
	 * @return {Number[]}
	 */
	exports.range = function(start, stop, step){
		if (typeof stop=='undefined'){
			// one param defined
			stop = start;
			start = 0;
		};
		if (typeof step=='undefined'){
			step = 1;
		};
		if ((step>0 && start>=stop) || (step<0 && start<=stop)){
			return [];
		};
		var result = [];
		for (var i=start; step>0 ? i<stop : i>stop; i+=step){
			result.push(i);
		};
		return result;
	}

	/**
	 * Returns the reverse of an Array or String
	 * 
	 * @param {Array|String} seq
	 * @return {Array|String} reversed
	 */
	exports.reversed = function(seq) {
		if (seq instanceof Array) {
			return seq.reverse();
		}

		if (typeof(seq) == 'string' || seq instanceof String) {
			return seq.split('').reverse().join('');
		}
	}

	/**
	 * Rounds x to n digits. If n is undefined, n = 0.
	 *	
	 * @param {Number} x
	 * @param {Number} [n=0]
	 * @return {Number} rounded number
	 */
	exports.round = function(x, n) {
		return parseFloat(x.toFixed((n != undefined) ? n : 0));
	}

	/**
	 * Splits a given sequence into n parts
	 *
	 * @param {Array|String} a
	 * @param {Number} n
	 * @return {Array|String} out
	 */
	exports.split = function(a, n) {
		var len = a.length, out = [], i = 0;
		while (i < len) {
			var size = Math.ceil((len - i) / n--);
			out.push(a.slice(i, i += size));
		}
		return out;
	}

	/**
	 * Sums all the elements of seq. If start is given,
	 * the sum starts there.
	 *
	 * @param {Number[]} seq
	 * @param {Number} start
	 * @return {Number} sum
	 */
	exports.sum = function(seq, start) {
		return (seq && seq.length > 0) ? seq.slice(start).reduce(function(a, b) { return a + b }) : 0;
	}

	/**
	 * Returns a Array of (arguments.length)-sized Arrays,
	 * where the i-th element contains the i-th element
	 * from each sequence. The returned Array is truncated
	 * in length to the length of the shortest argument sequence
	 * 
	 * @param {...Array} [arguments]
	 * @return {Array} zipped 
	 */
	exports.zip = function() {
		var args = [].slice.call(arguments);
		var n = [];
		var s = (args.length == 0) ? [] : args.reduce(function(a,b) {
			return (a.length < b.length) ? a : b
		});

		for (var i = 0; i < s.length; i++) {
			n.push(args.map(function(a){return a[i]}));
		};

		return n;
	}

})(typeof exports === 'undefined' ? this : exports);