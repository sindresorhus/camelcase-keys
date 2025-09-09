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

const transform = (input, options = {}, isSeen = new WeakMap(), parentPath) => {
	if (!isObject(input)) {
		return input;
	}

	// Check for circular references
	if (isSeen.has(input)) {
		return isSeen.get(input);
	}

	const {
		exclude,
		pascalCase = false,
		stopPaths,
		deep = false,
		preserveConsecutiveUppercase = false,
	} = options;

	const stopPathsSet = new Set(stopPaths);

	// Pre-allocate the result object for circular reference handling
	const result = Array.isArray(input) ? [] : {};
	isSeen.set(input, result);

	const makeMapper = currentParentPath => (key, value) => {
		if (deep && isObject(value)) {
			const path = currentParentPath === undefined ? key : `${currentParentPath}.${key}`;

			if (!stopPathsSet.has(path)) {
				// Handle arrays and objects recursively
				value = Array.isArray(value)
					? value.map(item => isObject(item) ? transform(item, options, isSeen, path) : item)
					: transform(value, options, isSeen, path);
			}
		}

		if (!(exclude && has(exclude, key))) {
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
		}

		return [key, value];
	};

	const mappedResult = mapObject(input, makeMapper(parentPath));

	// Copy properties to the pre-allocated result for circular reference handling
	Object.assign(result, mappedResult);

	return result;
};

export default function camelcaseKeys(input, options) {
	const isSeen = new WeakMap();
	if (Array.isArray(input)) {
		return Object.keys(input).map(key => transform(input[key], options, isSeen));
	}

	return transform(input, options, isSeen);
}
