'use strict';
var mapObj = require('map-obj');
var camelCase = require('camelcase');

module.exports = function (obj, exclude) {
	exclude = exclude || [];
	return mapObj(obj, function (key, val) {
		return [exclude.indexOf(key) > -1 ? key : camelCase(key), val];
	});
};
