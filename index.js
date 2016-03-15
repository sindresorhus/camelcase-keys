'use strict';
var mapObj = require('map-obj');
var camelCase = require('camelcase');

module.exports = function (obj, options) {
	options = options || {};
	options.exclude = options.exclude || [];
	return mapObj(obj, function (key, val) {
		var k = options.exclude.indexOf(key) === -1 ? camelCase(key) : key;
		return [k, val];
	});
};
