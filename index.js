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

// Preserve numeric keys. The trim check excludes empty/whitespace strings,
// which Number() would incorrectly convert to 0.
const isNumericKey = key => key.trim() !== '' && !Number.isNaN(Number(key));

const cache = new QuickLru({maxSize: 100_000});

const isBuiltIn = value =>
	ArrayBuffer.isView(value)
	// Check for known built-in types
	|| value instanceof Date
	|| value instanceof RegExp
	|| value instanceof Error
	|| value instanceof Map
	|| value instanceof Set
	|| value instanceof WeakMap
	|| value instanceof WeakSet
	|| value instanceof Promise;

// Reproduces behavior from `map-obj`.
const isObject = value =>
	typeof value === 'object'
	&& value !== null
	&& !isBuiltIn(value);

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

		// Skip transformation for excluded keys, numeric keys
		// Only transform string keys (preserve symbols and numbers)
		if (typeof key === 'string' && !isNumericKey(key) && !(exclude && has(exclude, key))) {
			const cacheKey = pascalCase ? `${key}_` : key;

			if (cache.has(cacheKey)) {
				key = cache.get(cacheKey);
			} else {
				// Preserve leading `_` and `$` as they typically have semantic meaning
				// This should eventually be fixed in the `camelcase` package itself
				const leadingPrefix = key.match(/^[_$]*/)[0];
				const transformed = camelCase(key.slice(leadingPrefix.length), {pascalCase, locale: false, preserveConsecutiveUppercase});
				key = leadingPrefix + transformed;

				// Only cache reasonable length keys to prevent memory abuse
				if (key.length < 100) {
					cache.set(cacheKey, key);
				}
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
		return input.map(item =>
			isObject(item)
				? transform(item, options, isSeen, undefined)
				: item);
	}

	return transform(input, options, isSeen);
}
