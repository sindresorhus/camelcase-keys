'use strict';
var mapObj = require('map-obj');
var camelCase = require('camelcase');

var has = function (arr, key) {
	return arr.some(function (pattern) {
		return typeof pattern === 'string' ? pattern === key : pattern.test(key);
	});
};

module.exports = function (input, options) {
	options = options || {};

	var exclude = options.exclude || [];

	return mapObj(input, function (key, val) {
		key = has(exclude, key) ? key : camelCase(key);
		return [key, val];
	});
};
