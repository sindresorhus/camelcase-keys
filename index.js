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

	// Handle arrays directly
	if (Array.isArray(input)) {
		const result = [];
		isSeen.set(input, result);

		for (const item of input) {
			result.push(isObject(item) ? transform(item, options, isSeen, parentPath) : item);
		}

		return result;
	}

	// Pre-allocate the result object for circular reference handling
	const result = {};
	isSeen.set(input, result);

	const makeMapper = currentParentPath => (key, value) => {
		// Handle deep transformation
		if (deep && isObject(value)) {
			const path = currentParentPath === undefined ? key : `${currentParentPath}.${key}`;

			if (!stopPathsSet.has(path)) {
				// Handle arrays and objects recursively
				value = Array.isArray(value)
					? value.map(item => isObject(item) ? transform(item, options, isSeen, path) : item)
					: transform(value, options, isSeen, path);
			}
		}

		// Skip transformation for excluded keys
		// Only transform string keys (preserve symbols and numbers)
		if (typeof key === 'string' && !(exclude && has(exclude, key))) {
			const cacheKey = pascalCase ? `${key}_` : key;

			if (cache.has(cacheKey)) {
				key = cache.get(cacheKey);
			} else {
				const returnValue = camelCase(key, {pascalCase, locale: false, preserveConsecutiveUppercase});

				// Only cache reasonable length keys to prevent memory abuse
				if (key.length < 100) {
					cache.set(cacheKey, returnValue);
				}

				key = returnValue;
			}
		}

		return [key, value];
	};

	const mappedResult = mapObject(input, makeMapper(parentPath), {deep: false});

	// Copy properties to the pre-allocated result for circular reference handling
	Object.assign(result, mappedResult);

	// Preserve symbol keys (mapObject doesn't handle them)
	const symbols = Object.getOwnPropertySymbols(input);
	for (const symbol of symbols) {
		result[symbol] = deep && isObject(input[symbol])
			? transform(input[symbol], options, isSeen, parentPath)
			: input[symbol];
	}

	return result;
};

export default function camelcaseKeys(input, options) {
	const isSeen = new WeakMap();

	if (Array.isArray(input)) {
		// More efficient array handling - directly map the array
		return input.map((item, index) =>
			isObject(item)
				? transform(item, options, isSeen, String(index))
				: item);
	}

	return transform(input, options, isSeen);
}
