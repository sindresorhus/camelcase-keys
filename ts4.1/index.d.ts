declare namespace camelcaseKeys {
	/**
	 * @internal
	 * Type-level camelization.
	 *
	 * It simulates `camelcase`'s behavior. Therefore.
	 *
	 * - Underscores `_`, hyphens `-`, periods `.`, and whitespaces ` ` are treated as word separators.
	 * - Leading and trailing separators are removed during preprocessing.
	 * - Consecutive separators work the same as one separator.
	 *
	 * @param S a union of string literal types to camelcase.
	 * @param PascalCase if true, the first word is also capitalized.
	 *
	 * @example
	 * ```
	 * type T1 = Camelize<"foo_bar-baz">;
	 * // => "fooBarBaz"
	 *
	 * type T2 = Camelize<"__foo_bar__" | "some type">;
	 * // => "fooBar" | "someType"
	 *
	 * type T3 = Camelize<string>;
	 * // => string
	 *
	 * type T4 = Camelize<"foo_bar", true>;
	 * // => "FooBar"
	 *
	 * type T5 = Camelize<"foo_bar", boolean>;
	 * // => "fooBar" | "FooBar"
	 * ```
	 */
	type Camelize<S extends string, PascalCase extends boolean = false> =
		S extends `_${infer S2}` ? Camelize<S2, PascalCase> :
		S extends `-${infer S2}` ? Camelize<S2, PascalCase> :
		S extends `.${infer S2}` ? Camelize<S2, PascalCase> :
		S extends ` ${infer S2}` ? Camelize<S2, PascalCase> :
		S extends `${infer S1}_${infer S2}` ? `${Camelize<S1, PascalCase>}${Camelize<S2, true>}` :
		S extends `${infer S1}-${infer S2}` ? `${Camelize<S1, PascalCase>}${Camelize<S2, true>}` :
		S extends `${infer S1}.${infer S2}` ? `${Camelize<S1, PascalCase>}${Camelize<S2, true>}` :
		S extends `${infer S1} ${infer S2}` ? `${Camelize<S1, PascalCase>}${Camelize<S2, true>}` :
		PascalCase extends true ? Capitalize<S> : S;

	/**
	 * @internal
	 * Digs a set of paths by one depth. Used for processing `stopPaths`.
	 *
	 * @param Path a union of string literal types, each of which is a "path" from the root.
	 * @param S a prefix word. A string literal type or `string`.
	 *
	 * @example
	 * ```
	 * type T1 = FilterPaths<"foo.bar" | "foo.baz" | "foo.bar.baz" | "other.path", "foo">;
	 * // => "bar" | "baz" | "bar.baz"
	 *
	 * type T2 = FilterPaths<string, "foo">;
	 * // => string
	 *
	 * type T3 = FilterPaths<"foo.bar" | "foo.baz" | "foo.bar.baz" | "other.path", string>;
	 * // => string
	 *
	 * type T3 = FilterPaths<"foo" | "bar", string>;
	 * // => never
	 * ```
	 */
	type FilterPaths<Path extends string, S extends string> =
		// We treat `string` as "indeterminate set of strings", so return `string` in this case.
		string extends Path ? string :
		// If `S` is indeterminate, we are not sure about the resulting set,
		// except when there is no path containing `.`.
		string extends S ?
		Path extends `${string}.${string}` ? string : never :
		// Otherwise, do a normal filtering.
		// If a path starts with `${S}.`, then return the suffix.
		// Otherwise return never (which means the candidate is rejected)
		Path extends `${S}.${infer Suffix}` ? Suffix : never;

	/**
	 * @internal
	 * Helper type to conditionally camelize a string.
	 *
	 * @param S a union of string literal types to camelcase.
	 * @param PascalCase if true, the first word is also capitalized.
	 * @param Exclude a union of string literal to exclude from camelization.
	 *
	 * @example
	 * ```
	 * type T1 = CamelcaseUnless<"foo_bar" | "bar_baz", false, never>;
	 * // => "fooBar" | "barBaz"
	 *
	 * type T2 = CamelcaseUnless<"foo_bar" | "bar_baz", false, "bar_baz">;
	 * // => "fooBar" | "bar_baz"
	 *
	 * type T1 = CamelcaseUnless<"foo_bar" | "bar_baz", false, string>;
	 * // => "foo_bar" | "fooBar" | "bar_baz" | "barBaz"
	 * ```
	 */
	type CamelCaseUnless<S extends string, PascalCase extends boolean, Exclude extends string> =
		// We treat `string` as "indeterminate set of strings", so return both cases in this case.
		string extends Exclude ? S | Camelize<S, PascalCase> :
		S extends Exclude ? S : Camelize<S, PascalCase>;

	/**
	 * @internal
	 * Compute return value of camelcaseKeys.
	 *
	 * @param T an object or array to camelcase its keys
	 * @param PascalCase capitalize the first word
	 * @param Deep recursively camelcase
	 * @param Exclude don't camelcase these keys
	 * @param StopPaths don't recursive into these paths
	 */
	type CamelcaseKeys<
		T,
		PascalCase extends boolean = false,
		Deep extends boolean = false,
		Exclude extends string = never,
		StopPaths extends string = never,
	> =
		// Array case
		T extends ReadonlyArray<any> ?
		{ [K in keyof T]: CamelcaseKeys<T[K], PascalCase, Deep, Exclude, StopPaths> } :
		// Object case
		T extends Record<string, any> ?
		{
			[K in keyof T as CamelCaseUnless<K & string, PascalCase, Exclude>]:
				Deep extends true ?
				K extends StopPaths ?
				T[K] :
				CamelcaseKeys<T[K], PascalCase, Deep, Exclude, FilterPaths<StopPaths, K & string>> :
				T[K];
		} :
		// Otherwise (e.g. number, string, null, undefined)
		T;

	/**
	 * @internal
	 * Helper type for `ExtractExcludes`. Used to turn `RegExp` into `string`.
	 */
	type ExtractExclude<T> = T extends string ? T : string;
	/**
	 * @internal
	 * Turn the `exclude` argument into a union type, which can be pased to `DeepCamelcaseKeys`.
	 *
	 * @param T an array of string or RegExp
	 *
	 * @example
	 * ```
	 * type T1 = ExtractExcludes<["foo", "bar"]>;
	 * // => "foo" | "bar"
	 * type T2 = ExtractExclude<["foo", "bar", string]>;
	 * // => string
	 * type T3 = ExtractExclude<["foo", "bar", RegExp]>;
	 * // => string
	 * ```
	 */
	type ExtractExcludes<T extends ReadonlyArray<string | RegExp>> = { [K in keyof T]: ExtractExclude<T[K]> }[number];
	/**
	 * @internal
	 * Turn null/undefined to another type. Helper for `DefaultValue`.
	 */
	type Default<T, U> = T extends null | undefined ? U : T;
	/**
	 * @internal
	 * Pick property type if it exists, fallback to default otherwise.
	 *
	 * @param T a record type
	 * @param K a key
	 * @param U a fallback type
	 *
	 * @example
	 * ```
	 * type T1 = DefaultValue<{ a: number }, "a", string>;
	 * // => number
	 * type T2 = DefaultValue<{ a?: number }, "a", string>;
	 * // => number | string
	 * type T3 = DefaultValue<{ a: undefined }, "a", string>;
	 * // => string
	 * type T4 = DefaultValue<{}, "a", string>;
	 * // => string
	 * ```
	 */
	type DefaultValue<T, K extends string, U> = T extends { [key in K]?: any } ? Default<T[K], U> : U;

	interface Options {
		/**
		Recurse nested objects and objects in arrays.

		@default false
		*/
		readonly deep?: boolean;

		/**
		Exclude keys from being camel-cased.

		@default []
		*/
		readonly exclude?: ReadonlyArray<string | RegExp>;

		/**
		Exclude children at the given object paths in dot-notation from being camel-cased. For example, with an object like `{a: {b: '🦄'}}`, the object path to reach the unicorn is `'a.b'`.

		@default []

		@example
		```
		camelcaseKeys({
			a_b: 1,
			a_c: {
				c_d: 1,
				c_e: {
					e_f: 1
				}
			}
		}, {
			deep: true,
			stopPaths: [
				'a_c.c_e'
			]
		}),
		// {
		// 	aB: 1,
		// 	aC: {
		// 		cD: 1,
		// 		cE: {
		// 			e_f: 1
		// 		}
		// 	}
		// }
		```
		*/
		readonly stopPaths?: ReadonlyArray<string>;

		/**
		Uppercase the first character as in `bye-bye` → `ByeBye`.

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
declare function camelcaseKeys<T>(
	input: T,
): camelcaseKeys.CamelcaseKeys<T>;

declare function camelcaseKeys<
	T,
	O extends camelcaseKeys.Options,
>(
	input: T,
	options: O,
): camelcaseKeys.CamelcaseKeys<
	T,
	camelcaseKeys.DefaultValue<O, "pascalCase", false>,
	camelcaseKeys.DefaultValue<O, "deep", false>,
	camelcaseKeys.ExtractExcludes<camelcaseKeys.DefaultValue<O, "exclude", []>>,
	camelcaseKeys.DefaultValue<O, "stopPaths", []>[number]
>;

export = camelcaseKeys;
