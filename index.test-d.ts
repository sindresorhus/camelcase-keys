import {expectType} from 'tsd';
import camelcaseKeys = require('.');

const fooBarObj = {'foo-bar': true}
const camelFooBarObj = camelcaseKeys(fooBarObj)
expectType<typeof fooBarObj>(camelFooBarObj)

const fooBarArr = [{'foo-bar': true}]
const camelFooBarArr = camelcaseKeys(fooBarArr)
expectType<typeof fooBarArr>(camelFooBarArr)

expectType<Array<{[key in 'foo-bar']: true}>>(camelcaseKeys([{'foo-bar': true}]));

expectType<{[key in 'foo-bar']: true}>(camelcaseKeys({'foo-bar': true}));

expectType<{[key in 'foo-bar']: true}>(
	camelcaseKeys({'foo-bar': true}, {deep: true}),
);

expectType<{[key in 'foo-bar']: true}>(
	camelcaseKeys({'foo-bar': true}, {deep: true, pascalCase: true}),
);

expectType<{[key in 'foo-bar']: true}>(
	camelcaseKeys({'foo-bar': true}, {exclude: ['foo', /bar/]}),
);

expectType<{[key in 'foo-bar']: true}>(
	camelcaseKeys({'foo-bar': true}, {stopPaths: ['foo']}),
);
