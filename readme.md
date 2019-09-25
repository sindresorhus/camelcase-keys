# camelcase-keys [![Build Status](https://travis-ci.org/sindresorhus/camelcase-keys.svg?branch=master)](https://travis-ci.org/sindresorhus/camelcase-keys)

> Convert object keys to camel case using [`camelcase`](https://github.com/sindresorhus/camelcase)


## Install

```
$ npm install camelcase-keys
```


## Usage

```js
const camelcaseKeys = require('camelcase-keys');

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
const camelcaseKeys = require('camelcase-keys');

const argv = require('minimist')(process.argv.slice(2));
//=> {_: [], 'foo-bar': true}

camelcaseKeys(argv);
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

Type: `Array<string | RegExp>`<br>
Default: `[]`

Exclude keys from being camel-cased.

##### stopPaths

Type: `string[]`<br>
Default: `[]`

Exclude children at the given object paths in dot notation from being camelCased.

When traversing object hierarchy we start with highest order object and follow one of it's properties to get some new value. While this value is another object, we can repeat that step and end up with another value until we reach the value we want to(that is part of hierarchy). If we follow finite amount of such steps and express each step as a string equal to the name of property we follow then concatenate elements of resulting tuple separating each pair of strings with dot symbol, we will get what we call object path in dot notation.

For example, when we write in javascipt `someObject.property1.property2`, we take top hierachy object `someObject`, follow property named `property1` to get a new object, then follow property named `property2` to get some value which is the value we get after traversing hierarchy. If we write down the steps taken as described, we will get `['property1', 'property2']` tuple, and then `property1.property2` string, which we call object path in dot notation.

```js
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

##### deep

Type: `boolean`<br>
Default: `false`

Recurse nested objects and objects in arrays.

##### pascalCase

Type: `boolean`<br>
Default: `false`

Uppercase the first character as in `bye-bye` → `ByeBye`.


## Related

- [snakecase-keys](https://github.com/bendrucker/snakecase-keys)
- [kebabcase-keys](https://github.com/mattiloh/kebabcase-keys)


---

<div align="center">
	<b>
		<a href="https://tidelift.com/subscription/pkg/npm-camelcase-keys?utm_source=npm-camelcase-keys&utm_medium=referral&utm_campaign=readme">Get professional support for this package with a Tidelift subscription</a>
	</b>
	<br>
	<sub>
		Tidelift helps make open source sustainable for maintainers while giving companies<br>assurances about security, maintenance, and licensing for their dependencies.
	</sub>
</div>
