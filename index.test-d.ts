import {expectType} from 'tsd';
import camelcaseKeys = require('.');

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
