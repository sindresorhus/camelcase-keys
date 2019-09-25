import {expectType} from 'tsd';
import camelcaseKeys = require('.');

expectType<Array<{[key: string]: unknown}>>(camelcaseKeys([{'foo-bar': true}]));
expectType<{[key: string]: unknown}>(camelcaseKeys({'foo-bar': true}));
expectType<{[key: string]: unknown}>(
	camelcaseKeys({'foo-bar': true}, {deep: true})
);
expectType<{[key: string]: unknown}>(
	camelcaseKeys({'foo-bar': true}, {deep: true, pascalCase: true})
);
expectType<{[key: string]: unknown}>(
	camelcaseKeys({'foo-bar': true}, {exclude: ['foo', /bar/]})
);
expectType<{[key: string]: unknown}>(
	camelcaseKeys({'foo-bar': true}, {stopPaths: ['foo']})
);
