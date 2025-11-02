import type {CamelCase, PascalCase} from 'type-fest';

// Type that accepts both interfaces and type aliases
// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
type ObjectLike = {[key: string]: any};

type IsExcluded<K, Exclude extends readonly unknown[]> =
	Exclude extends readonly [infer First, ...infer Rest]
		? K extends First ? true : IsExcluded<K, Rest>
		: false;

type IsStopPath<Path extends string, StopPaths extends readonly string[]> =
	StopPaths extends readonly [infer First, ...infer Rest extends readonly string[]]
		? Path extends First ? true : IsStopPath<Path, Rest>
		: false;

type AppendPath<Base extends string, Key extends string> = Base extends '' ? Key : `${Base}.${Key}`;

type ApplyCase<K extends string, Pascal extends boolean, Preserve extends boolean> =
	Pascal extends true
		? PascalCase<K, {preserveConsecutiveUppercase: Preserve; splitOnNumbers: false}>
		: CamelCase<K, {preserveConsecutiveUppercase: Preserve; splitOnNumbers: false}>;

type TransformKey<K, Pascal extends boolean, Preserve extends boolean> =
	K extends `${infer Char extends '_' | '$'}${infer Rest}`
		? `${Char}${TransformKey<Rest, Pascal, Preserve>}`
		: K extends string ? ApplyCase<K, Pascal, Preserve> : K;

/**
Convert keys of an object to camelcase strings.

Note: Opaque types from `type-fest` may expose underlying primitive methods in the result type due to TypeScript's mapped type distribution. Runtime behavior is correct. Workaround: Use `result.key as OpaqueType` if needed.
*/
export type CamelCaseKeys<
	T extends ObjectLike | readonly unknown[],
	Deep extends boolean = false,
	IsPascalCase extends boolean = false,
	PreserveConsecutiveUppercase extends boolean = false,
	Exclude extends readonly unknown[] = readonly never[],
	StopPaths extends readonly string[] = readonly never[],
	Path extends string = '',
> = T extends readonly any[]
	? // Handle arrays
	{[K in keyof T]: ProcessArrayElement<T[K], Deep, IsPascalCase, PreserveConsecutiveUppercase, Exclude, StopPaths>}
	: T extends ObjectLike
		? // Handle objects
		{
			[K in keyof T as IsExcluded<K, Exclude> extends true
				? K
				: TransformKey<K, IsPascalCase, PreserveConsecutiveUppercase>
			]: ProcessValue<T[K], K & string, Path, Deep, IsPascalCase, PreserveConsecutiveUppercase, Exclude, StopPaths>;
		}
		: T; // Return non-objects as-is

// Process a value, checking if we should recurse
type ProcessValue<
	V,
	K extends string,
	Path extends string,
	Deep extends boolean,
	IsPascalCase extends boolean,
	PreserveConsecutiveUppercase extends boolean,
	Exclude extends readonly unknown[],
	StopPaths extends readonly string[],
> = IsStopPath<AppendPath<Path, K>, StopPaths> extends true
	? V // Stop recursion at this path
	: Deep extends true
		? V extends ObjectLike | readonly any[]
			? CamelCaseKeys<V, Deep, IsPascalCase, PreserveConsecutiveUppercase, Exclude, StopPaths, AppendPath<Path, K>>
			: V
		: V;

// Process array elements
type ProcessArrayElement<
	E,
	Deep extends boolean,
	IsPascalCase extends boolean,
	PreserveConsecutiveUppercase extends boolean,
	Exclude extends readonly unknown[],
	StopPaths extends readonly string[],
> = Deep extends true
	? E extends ObjectLike | readonly any[]
		? CamelCaseKeys<E, Deep, IsPascalCase, PreserveConsecutiveUppercase, Exclude, StopPaths>
		: E
	: E extends ObjectLike
		? CamelCaseKeys<E, false, IsPascalCase, PreserveConsecutiveUppercase, Exclude, StopPaths>
		: E;

export type Options = {
	/**
	Exclude keys from being camel-cased.

	@default []

	For correct TypeScript types when using this option with a string array, add `as const` to the array.
	*/
	readonly exclude?: ReadonlyArray<string | RegExp>;

	/**
	Recurse nested objects and objects in arrays.

	@default false

	@example
	```
	import camelcaseKeys from 'camelcase-keys';

	const object = {
		'foo-bar': true,
		nested: {
			unicorn_rainbow: true
		}
	};

	camelcaseKeys(object, {deep: true});
	//=> {fooBar: true, nested: {unicornRainbow: true}}

	camelcaseKeys(object, {deep: false});
	//=> {fooBar: true, nested: {unicorn_rainbow: true}}
	```
	*/
	readonly deep?: boolean;

	/**
	Uppercase the first character: `bye-bye` → `ByeBye`

	@default false

	@example
	```
	import camelcaseKeys from 'camelcase-keys';

	camelcaseKeys({'foo-bar': true}, {pascalCase: true});
	//=> {FooBar: true}

	camelcaseKeys({'foo-bar': true}, {pascalCase: false});
	//=> {fooBar: true}
	````
	*/
	readonly pascalCase?: boolean;

	/**
	Preserve consecutive uppercase characters: `foo-BAR` → `FooBAR`

	@default false

	@example
	```
	import camelcaseKeys from 'camelcase-keys';

	camelcaseKeys({'foo-BAR': true}, {preserveConsecutiveUppercase: true});
	//=> {fooBAR: true}

	camelcaseKeys({'foo-BAR': true}, {preserveConsecutiveUppercase: false});
	//=> {fooBar: true}
	````
	*/
	readonly preserveConsecutiveUppercase?: boolean;

	/**
	Exclude children at the given object paths in dot-notation from being camel-cased. For example, with an object like `{a: {b: '🦄'}}`, the object path to reach the unicorn is `'a.b'`.

	@default []

	For correct TypeScript types when using this option, add `as const` to the array.

	@example
	```
	import camelcaseKeys from 'camelcase-keys';

	const object = {
		a_b: 1,
		a_c: {
			c_d: 1,
			c_e: {
				e_f: 1
			}
		}
	};

	camelcaseKeys(object, {
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

	When an object is inside an array, the path is specified without array indices. A `stopPath` will apply to all items in the array.

	```
	import camelcaseKeys from 'camelcase-keys';

	const object = {
		foo: [
			{
				bar: {
					baz_qux: 'value'
				}
			}
		]
	};

	camelcaseKeys(object, {
		deep: true,
		stopPaths: [
			'foo.bar'
		]
	}),
	// {
	// 	foo: [
	// 		{
	// 			bar: {
	// 				baz_qux: 'value'
	// 			}
	// 		}
	// 	]
	// }
	```
	*/
	readonly stopPaths?: readonly string[];
};

/**
Convert object keys to camel case using [`camelcase`](https://github.com/sindresorhus/camelcase).

@param input - Object or array of objects to camel-case.

@example
```
import camelcaseKeys from 'camelcase-keys';

// Convert an object
camelcaseKeys({'foo-bar': true});
//=> {fooBar: true}

// Convert an array of objects
camelcaseKeys([{'foo-bar': true}, {'bar-foo': false}]);
//=> [{fooBar: true}, {barFoo: false}]
```

@example
```
import {parseArgs} from 'node:util';
import camelcaseKeys from 'camelcase-keys';

const commandLineArguments = parseArgs();
//=> {_: [], 'foo-bar': true}

camelcaseKeys(commandLineArguments);
//=> {_: [], fooBar: true}
```
*/
export default function camelcaseKeys<
	T extends ObjectLike | readonly ObjectLike[],
	O extends Options = Options,
>(
	input: T,
	options?: O
): CamelCaseKeys<
	T,
	O['deep'] extends true ? true : false,
	O['pascalCase'] extends true ? true : false,
	O['preserveConsecutiveUppercase'] extends true ? true : false,
	O['exclude'] extends readonly unknown[] ? O['exclude'] : readonly never[],
	O['stopPaths'] extends readonly string[] ? O['stopPaths'] : readonly never[]
>;
