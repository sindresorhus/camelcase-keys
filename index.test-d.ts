import {expectType} from 'tsd';
import camelcaseKeys = require('.');

const fooBarObject = {'foo-bar': true};
const camelFooBarObject = camelcaseKeys(fooBarObject);
expectType<{ fooBar: boolean }>(camelFooBarObject);

const fooBarArray = [{'foo-bar': true}];
const camelFooBarArray = camelcaseKeys(fooBarArray);
expectType<Array<{ fooBar: boolean }>>(camelFooBarArray);

expectType<Array<{[key in 'fooBar']: boolean}>>(camelcaseKeys([{'foo-bar': true}]));

expectType<string[]>(camelcaseKeys(['name 1', 'name 2']));

expectType<string[]>(camelcaseKeys(['name 1', 'name 2'], {deep: true}));

expectType<{[key in 'fooBar']: boolean}>(camelcaseKeys({'foo-bar': true}));
expectType<{[key in 'fooBar']: boolean}>(camelcaseKeys({'--foo-bar': true}));
expectType<{[key in 'fooBar']: boolean}>(camelcaseKeys({foo_bar: true}));
expectType<{[key in 'fooBar']: boolean}>(camelcaseKeys({'foo.bar': true}));
expectType<{[key in 'fooBar']: boolean}>(camelcaseKeys({'foo bar': true}));

expectType<{fooBar: {fooBar: {fooBar: {fooBar: boolean}}}}>(
	camelcaseKeys(
		{'foo-bar': {foo_bar: {'foo.bar': {'foo bar': true}}}},
		{deep: true}
	)
);

expectType<{[key in 'FooBar']: boolean}>(
	camelcaseKeys({'foo-bar': true}, {pascalCase: true})
);
expectType<{[key in 'FooBar']: boolean}>(
	camelcaseKeys({'--foo-bar': true}, {pascalCase: true})
);
expectType<{[key in 'FooBar']: boolean}>(
	camelcaseKeys({foo_bar: true}, {pascalCase: true})
);
expectType<{[key in 'FooBar']: boolean}>(
	camelcaseKeys({'foo.bar': true}, {pascalCase: true})
);
expectType<{[key in 'FooBar']: boolean}>(
	camelcaseKeys({'foo bar': true}, {pascalCase: true})
);
expectType<{FooBar: {FooBar: {FooBar: {FooBar: boolean}}}}>(
	camelcaseKeys(
		{'foo-bar': {foo_bar: {'foo.bar': {'foo bar': true}}}},
		{deep: true, pascalCase: true}
	)
);

expectType<{[key in 'fooBar' | 'foo_bar']: boolean}>(
	camelcaseKeys(
		{'foo-bar': true, foo_bar: true},
		{exclude: ['foo', 'foo_bar', /bar/] as const}
	)
);

expectType<{[key in 'fooBar']: boolean}>(
	camelcaseKeys({'foo-bar': true}, {stopPaths: ['foo']})
);

interface SomeObject {
	someProperty: string;
}

const someObject: SomeObject = {
	someProperty: 'hello'
};

expectType<SomeObject>(camelcaseKeys(someObject));
expectType<SomeObject[]>(camelcaseKeys([someObject]));

type SomeTypeAlias = {
	someProperty: string;
};

const objectWithTypeAlias = {
	someProperty: 'this should also work'
};

expectType<SomeTypeAlias>(camelcaseKeys(objectWithTypeAlias));
expectType<SomeTypeAlias[]>(camelcaseKeys([objectWithTypeAlias]));
