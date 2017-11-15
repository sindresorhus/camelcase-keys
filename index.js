'use strict';
const mapObj = require('map-obj');
const camelCase = require('camelcase');
const QuickLru = require('quick-lru');

var has = function has(arr, key) {
	return arr.some(function (x) {
		return typeof x === 'string' ? x === key : x.test(key);
	});
};
var cache = new QuickLru({ maxSize: 100000 });

module.exports = function (input, opts) {
	opts = Object.assign({
		deep: false
	}, opts);

	var exclude = opts.exclude;

	return mapObj(input, function (key, val) {
		if (!(exclude && has(exclude, key))) {
			if (cache.has(key)) {
				key = cache.get(key);
			} else {
				var ret = camelCase(key);

				if (key.length < 100) {
					// Prevent abuse
					cache.set(key, ret);
				}

				key = ret;
			}
		}

		return [key, val];
	}, { deep: opts.deep });
};
