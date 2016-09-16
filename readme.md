camelcase-keys [![Build Status](https://travis-ci.org/sindresorhus/camelcase-keys.svg?branch=master)](https://travis-ci.org/sindresorhus/camelcase-keys)
========================================================================================================================================================

> Convert object keys to camelCase using [`camelcase`](https://github.com/sindresorhus/camelcase)

Install
-------

```
$ npm install --save camelcase-keys
```

Usage
-----

```js
const camelcaseKeys = require('camelcase-keys');

camelcaseKeys({'foo-bar': true});
//=> {fooBar: true}


const argv = require('minimist')(process.argv.slice(2));
//=> {_: [], 'foo-bar': true}

camelcaseKeys(argv);
//=> {_: [], fooBar: true}

camelcaseKeys({'foo-bar': {'bar-foo': true}}, {recurse: true});
//=> {fooBar: {barFoo: true}}

camelcaseKeys({'foo-bar': {'bar-foo': true}}, {recurse: false});
//=> {fooBar: {bar-foo: true}}
```

API
---

### camelcaseKeys(input, [options])

#### input

Type: `Object`

Object to camelCase.

#### options

Type: `Object`

##### exclude

Type: `Array` of (`string`|`RegExp`\)<br> Default: `[]`

Exclude keys from being camelCased.

##### recurse

Type: `Boolean` <br> Default: `false`

If true use a recursive algorithm to traverse the entire object graph otherwise only the first level keys are processed.

License
-------

MIT © [Sindre Sorhus](https://sindresorhus.com)
