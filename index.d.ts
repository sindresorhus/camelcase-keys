// eslint-disable-next-line @typescript-eslint/ban-types
type EmptyTuple = [];

type Camelcase<S extends string> = S extends '_' | '-'
	? S
	: S extends `${infer First}${infer Rest}`
		? First extends '_' | '-'
			? Camelcase<Rest>
			: Uncapitalize<PascalCase<S>>
		: S;
type PascalCase<S extends string> = S extends '_' | '-'
	? S
	: S extends `${infer Left}-${infer Right}`
		? `${Capitalize<Lowercase<Left>>}${PascalCase<Right>}`
		: S extends `${infer Left}_${infer Right}`
			? `${Capitalize<Lowercase<Left>>}${PascalCase<Right>}`
			: S extends `${infer Left}.${infer Right}`
				? `${Capitalize<Lowercase<Left>>}${PascalCase<Right>}`
				: S extends `${infer Left} ${infer Right}`
					? `${Capitalize<Lowercase<Left>>}${PascalCase<Right>}`
					: Capitalize<S>;

type IsInclude<List extends readonly unknown[] | undefined, Target> =
	List extends undefined
		? false
		: List extends Readonly<EmptyTuple>
			? false
			: List extends readonly [infer First, ...infer Rest]
				? First extends Target
					? true
					: IsInclude<Rest, Target>
				: boolean;

type ConvertArray<
	T extends ReadonlyArray<Record<string, any>>,
	Deep extends boolean | undefined,
	IsPascalCase extends boolean | undefined,
	Exclude extends ReadonlyArray<string | RegExp> | undefined
> = T extends EmptyTuple
	? T
	: T extends [infer First, ...infer Rest]
		? [
			ConvertObject<First, Deep, IsPascalCase, Exclude>,
			...ConvertArray<
			Extract<Rest, ReadonlyArray<Record<string, any>>>,
			Deep,
			IsPascalCase,
			Exclude
			>
		]
		: Array<ConvertObject<T[number], Deep, IsPascalCase, Exclude>>;

type ConvertObject<
	T extends Record<string, any>,
	Deep extends boolean | undefined,
	IsPascalCase extends boolean | undefined,
	Exclude extends readonly unknown[] | undefined
> = {
	[P in keyof T & string as [IsInclude<Exclude, P>] extends [true]
		? P
		: [IsPascalCase] extends [true]
			? PascalCase<P>
			: Camelcase<P>]: [Deep] extends [true]
		? T[P] extends Record<string, any>
			? ConvertObject<T[P], Deep, IsPascalCase, Exclude>
			: T[P]
		: T[P];
};

declare namespace camelcaseKeys {
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
		readonly stopPaths?: readonly string[];

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
declare function camelcaseKeys<
	T extends ReadonlyArray<Record<string, any>>,
	Options extends camelcaseKeys.Options
>(
	input: T,
	options?: Options
): ConvertArray<T, Options['deep'], Options['pascalCase'], Options['exclude']>;

declare function camelcaseKeys<
	T extends readonly unknown[],
	Options extends camelcaseKeys.Options
>(input: T, options?: Options): T;

declare function camelcaseKeys<
	T extends Record<string, any>,
	Options extends camelcaseKeys.Options
>(
	input: T,
	options?: Options
): ConvertObject<T, Options['deep'], Options['pascalCase'], Options['exclude']>;

export = camelcaseKeys;
