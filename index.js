'use strict';
const mapObj = require('map-obj');
const camelCase = require('camelcase');
const QuickLru = require('quick-lru');

const has = (array, key) => array.some(x => typeof x === 'string' ? x === key : x.test(key));
const cache = new QuickLru({maxSize: 100000});

const isObject = value =>
	typeof value === 'object' &&
	value !== null &&
	!(value instanceof RegExp) &&
	!(value instanceof Error) &&
	!(value instanceof Date);

const camelCaseConvert = (input, options) => {
	options = Object.assign({
		deep: false
	}, options);

	const {exclude, stopPaths, deep} = options;

	const stopPathsSet = stopPaths === undefined ? new Set() : new Set(stopPaths);

	const makeMapper = parentPath => (key, value) => {
		const path = parentPath === undefined ? key : `${parentPath}.${key}`;

		if (deep && isObject(value) && !stopPathsSet.has(path)) {
			value = mapObj(value, makeMapper(path));
		}

		if (!(exclude && has(exclude, key))) {
			if (cache.has(key)) {
				key = cache.get(key);
			} else {
				const ret = camelCase(key);

				if (key.length < 100) { // Prevent abuse
					cache.set(key, ret);
				}

				key = ret;
			}
		}

		return [key, value];
	};

	return mapObj(input, makeMapper(undefined));
};

module.exports = (input, options) => {
	if (Array.isArray(input)) {
		return Object.keys(input).map(key => camelCaseConvert(input[key], options));
	}

	return camelCaseConvert(input, options);
};

