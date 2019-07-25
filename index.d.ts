declare namespace camelcaseKeys {
	interface Options {
		/**
		Recurse nested objects and objects in arrays.

		@default false
		*/
		readonly deep?: boolean;

		/**
		Exclude keys from being camelCased.

		@default []
		*/
		readonly exclude?: ReadonlyArray<string | RegExp>;

		/**
		Stop childs of paths from being camelCased.

		@default []

		@example
		```
		camelcaseKeys({a_b: 1, a_c: {c_d: 1, c_e: {e_f: 1}}}, {deep: true, stopPaths: ['a_c.c_e']}),
		//=> {aB: 1, aC: {cD: 1, cE: {e_f: 1}}}
		```
		*/
		readonly stopPaths?: string[];
	}
}

/**
Convert object keys to camel case using [`camelcase`](https://github.com/sindresorhus/camelcase).

@param input - Object or array of objects to camel-case.

@example
```
import camelcaseKeys = require('camelcase-keys');

// Convert an object
camelcaseKeys({'foo-bar': true});
//=> {fooBar: true}

// Convert an array of objects
camelcaseKeys([{'foo-bar': true}, {'bar-foo': false}]);
//=> [{fooBar: true}, {barFoo: false}]

camelcaseKeys({'foo-bar': true, nested: {unicorn_rainbow: true}}, {deep: true});
//=> {fooBar: true, nested: {unicornRainbow: true}}


import minimist = require('minimist');

const argv = minimist(process.argv.slice(2));
//=> {_: [], 'foo-bar': true}

camelcaseKeys(argv);
//=> {_: [], fooBar: true}
```
*/
declare function camelcaseKeys(
	input: ReadonlyArray<{[key: string]: unknown}>,
	options?: camelcaseKeys.Options
): Array<{[key: string]: unknown}>;
declare function camelcaseKeys(
	input: {[key: string]: unknown},
	options?: camelcaseKeys.Options
): {[key: string]: unknown};

export = camelcaseKeys;
