# camelcase-keys [![Build Status](https://travis-ci.org/sindresorhus/camelcase-keys.svg?branch=master)](https://travis-ci.org/sindresorhus/camelcase-keys)

> Convert object keys to camelCase using [`camelcase`](https://github.com/sindresorhus/camelcase)


## Install

```
$ npm install --save camelcase-keys
```


## Usage

```js
const camelcaseKeys = require('camelcase-keys');

camelcaseKeys({'foo-bar': true});
//=> {fooBar: true}


const argv = require('minimist')(process.argv.slice(2));
//=> {_: [], 'foo-bar': true}

camelcaseKeys(argv);
//=> {_: [], fooBar: true}
```


## API

### camelcaseKeys(input, [options])

#### input

Type: `Object`

Object to camelCase.

#### options

Type: `Object`

##### exclude

Type: `Array` of (`string`|`RegExp`)<br>
Default: `[]`

Exclude keys from being camelCased.


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
