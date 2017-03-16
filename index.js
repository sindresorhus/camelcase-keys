'use strict';
const mapObj = require('map-obj');
const camelCase = require('camelcase');

const has = (arr, key) => arr.some(x => typeof x === 'string' ? x === key : x.test(key));

module.exports = (input, opts) => {
	const fn = opts.camelCase || camelCase
	opts = Object.assign({
		exclude: [],
		deep: false
	}, opts);

	return mapObj(input, (key, val) => {
		key = has(opts.exclude, key) ? key : fn(key);
		return [key, val];
	}, {deep: opts.deep});
};
