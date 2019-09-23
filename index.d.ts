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
		Uppercase the first character as in 'bye-bye → ByeBye'

		@default false
		*/
		readonly pascalCase?: boolean;
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

// Convert object keys to pascal case
camelcaseKeys({'foo-bar': true, nested: {unicorn_rainbow: true}}, {deep: true, pascalCase: true});
//=> {FooBar: true, Nested: {UnicornRainbow: true}}

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
