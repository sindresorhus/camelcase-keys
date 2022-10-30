# camelcase-keys

> Convert object keys to camel case using [`camelcase`](https://github.com/sindresorhus/camelcase)

## Install

```sh
npm install camelcase-keys
```

## Usage

```js
import camelcaseKeys from 'camelcase-keys';

// Convert an object
camelcaseKeys({'foo-bar': true});
//=> {fooBar: true}

// Convert an array of objects
camelcaseKeys([{'foo-bar': true}, {'bar-foo': false}]);
//=> [{fooBar: true}, {barFoo: false}]

camelcaseKeys({'foo-bar': true, nested: {unicorn_rainbow: true}}, {deep: true});
//=> {fooBar: true, nested: {unicornRainbow: true}}

camelcaseKeys({a_b: 1, a_c: {c_d: 1, c_e: {e_f: 1}}}, {deep: true, stopPaths: ['a_c.c_e']}),
//=> {aB: 1, aC: {cD: 1, cE: {e_f: 1}}}

// Convert object keys to pascal case
camelcaseKeys({'foo-bar': true, nested: {unicorn_rainbow: true}}, {deep: true, pascalCase: true});
//=> {FooBar: true, Nested: {UnicornRainbow: true}}
```

```js
import {parseArgs} from 'node:util';
import camelcaseKeys from 'camelcase-keys';

const commandLineArguments = parseArgs();
//=> {_: [], 'foo-bar': true}

camelcaseKeys(commandLineArguments);
//=> {_: [], fooBar: true}
```

## API

### camelcaseKeys(input, options?)

#### input

Type: `object | object[]`

An object or array of objects to camel-case.

#### options

Type: `object`

##### exclude

Type: `Array<string | RegExp>`\
Default: `[]`

Exclude keys from being camel-cased.

##### stopPaths

Type: `string[]`\
Default: `[]`

Exclude children at the given object paths in dot-notation from being camel-cased. For example, with an object like `{a: {b: '🦄'}}`, the object path to reach the unicorn is `'a.b'`.

```js
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
/*
{
	aB: 1,
	aC: {
		cD: 1,
		cE: {
			e_f: 1
		}
	}
}
*/
```

##### deep

Type: `boolean`\
Default: `false`

Recurse nested objects and objects in arrays.

##### pascalCase

Type: `boolean`\
Default: `false`

Uppercase the first character as in `bye-bye` → `ByeBye`.

## Related

- [decamelize-keys](https://github.com/sindresorhus/decamelize-keys) - The inverse of this package
- [snakecase-keys](https://github.com/bendrucker/snakecase-keys)
- [kebabcase-keys](https://github.com/mattiloh/kebabcase-keys)
