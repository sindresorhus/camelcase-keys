import mapObject from 'map-obj';
import camelCase from 'camelcase';
import QuickLru from 'quick-lru';

const has = (array, key) => array.some(element => {
	if (typeof element === 'string') {
		return element === key;
	}

	element.lastIndex = 0;

	return element.test(key);
});

const cache = new QuickLru({maxSize: 100_000});

// Reproduces behavior from `map-obj`.
const isObject = value =>
	typeof value === 'object'
		&& value !== null
		&& !(value instanceof RegExp)
		&& !(value instanceof Error)
		&& !(value instanceof Date);

const transform = (input, options = {}) => {
	if (!isObject(input)) {
		return input;
	}

	const {
		exclude,
		excludeChildren,
		pascalCase = false,
		stopPaths,
		deep = false,
		preserveConsecutiveUppercase = false,
		overrides,
	} = options;

	const stopPathsSet = new Set(stopPaths);

	const makeMapper = parentPath => (key, value) => {
		if (deep && isObject(value)) {
			const path = parentPath === undefined ? key : `${parentPath}.${key}`;

			if (!stopPathsSet.has(path)) {
				value = mapObject(value, makeMapper(path));
			}
		}

		if (
			(excludeChildren && has(excludeChildren, parentPath?.split('.').pop()))
			|| (exclude && has(exclude, key))
		) {
			return [key, value];
		}

		const overrideKey = overrides?.find(override => typeof override[0] === 'string' ? override[0] === key : override[0].test(key));
		if (overrideKey) {
			key = overrideKey ? overrideKey[1] : key;
			return [key, value];
		}

		const cacheKey = pascalCase ? `${key}_` : key;
		if (cache.has(cacheKey)) {
			key = cache.get(cacheKey);
		} else {
			const returnValue = camelCase(key, {pascalCase, locale: false, preserveConsecutiveUppercase});

			if (key.length < 100) { // Prevent abuse
				cache.set(cacheKey, returnValue);
			}

			key = returnValue;
		}

		return [key, value];
	};

	return mapObject(input, makeMapper(undefined));
};

export default function camelcaseKeys(input, options) {
	if (Array.isArray(input)) {
		return Object.keys(input).map(key => transform(input[key], options));
	}

	return transform(input, options);
}
