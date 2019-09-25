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
		Exclude children at the given object paths in dot notation from being camelCased.

		When traversing object hierarchy we start with highest order object and follow one of it's properties to get some new value. While this value is another object, we can repeat that step and end up with another value until we reach the value we want to(that is part of hierarchy). If we follow finite amount of such steps and express each step as a string equal to the name of property we follow then concatenate elements of resulting tuple separating each pair of strings with dot symbol, we will get what we call object path in dot notation.

		For example, when we write in javascipt `someObject.property1.property2`, we take top hierachy object `someObject`, follow property named `property1` to get a new object, then follow property named `property2` to get some value which is the value we get after traversing hierarchy. If we write down the steps taken as described, we will get `['property1', 'property2']` tuple, and then `property1.property2` string, which we call object path in dot notation.

		@default []

		@example
		```
		camelcaseKeys({
			a_b: 1,
			a_c: {
				c_d: 1,
				c_e: {
					e_f: 1,
				},
			},
		}, {deep: true, stopPaths: ['a_c.c_e']}),
		// => {
		//	aB: 1,
		//	aC: {
		//		cD: 1,
		//		cE: {
		//			e_f: 1
		//		},
		//	},
		// }
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
