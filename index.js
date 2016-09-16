'use strict';
var mapObj = require('map-obj');
var camelCase = require('camelcase');

var has = function (arr, key) {
	return arr.some(function (pattern) {
		return typeof pattern === 'string' ? pattern === key : pattern.test(key);
	});
};

var mapObjectRecursive = function mapObjectRecursive(object, mappingFunction) {
	return mapObj(object, mapObjectRecursive._mapOrRecurse(mappingFunction));
};

mapObjectRecursive._mapOrRecurse = function mapOrRecurse(mappingFunction) {
	return function mappingOrRecursing(key, value, object) {
		// If `value` is a plain object, recurse.
		if (typeof value === 'object' &&
			!(value instanceof Array)) {
			var result = mappingFunction(key, value, object);
			return [result[0], mapObj(result[1], mappingOrRecursing)];
		}

		// Else invoke the mappingFunction.
		return mappingFunction(key, value, object);
	};
};

module.exports = function (input, options) {
	options = options || {};

	var exclude = options.exclude || [];

	var convert = function (key, val) {
		key = has(exclude, key) ? key : camelCase(key);
		return [key, val];
	};

	return options.recurse ? mapObjectRecursive(input, convert) : mapObj(input, convert);
};
