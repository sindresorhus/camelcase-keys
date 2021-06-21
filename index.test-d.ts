import {expectType} from 'tsd';
import camelcaseKeys = require('.');

const fooBarObject = {'foo-bar': true};
const camelFooBarObject = camelcaseKeys(fooBarObject);
expectType<{fooBar: boolean}>(camelFooBarObject);

const fooBarArray = [{'foo-bar': true}];
const camelFooBarArray = camelcaseKeys(fooBarArray);
expectType<Array<{fooBar: boolean}>>(camelFooBarArray);

expectType<Array<{fooBar: boolean}>>(camelcaseKeys([{'foo-bar': true}]));

expectType<string[]>(camelcaseKeys(['name 1', 'name 2']));

expectType<string[]>(camelcaseKeys(['name 1', 'name 2'], {deep: true}));

expectType<{fooBar: boolean}>(camelcaseKeys({'foo-bar': true}));
expectType<{fooBar: boolean}>(camelcaseKeys({'--foo-bar': true}));
expectType<{fooBar: boolean}>(camelcaseKeys({foo_bar: true}));
expectType<{fooBar: boolean}>(camelcaseKeys({'foo bar': true}));

expectType<{fooBar: true}>(camelcaseKeys({'foo-bar': true} as const));
expectType<{fooBar: true}>(camelcaseKeys({'--foo-bar': true} as const));
expectType<{fooBar: true}>(camelcaseKeys({foo_bar: true} as const));
expectType<{fooBar: true}>(camelcaseKeys({'foo bar': true} as const));

expectType<{fooBar: {fooBar: {fooBar: boolean}}}>(
	camelcaseKeys(
		{'foo-bar': {foo_bar: {'foo bar': true}}},
		{deep: true}
	)
);

expectType<{FooBar: boolean}>(
	camelcaseKeys({'foo-bar': true}, {pascalCase: true})
);
expectType<{FooBar: true}>(
	camelcaseKeys({'foo-bar': true} as const, {pascalCase: true})
);
expectType<{FooBar: boolean}>(
	camelcaseKeys({'--foo-bar': true}, {pascalCase: true})
);
expectType<{FooBar: boolean}>(
	camelcaseKeys({foo_bar: true}, {pascalCase: true})
);
expectType<{FooBar: boolean}>(
	camelcaseKeys({'foo bar': true}, {pascalCase: true})
);
expectType<{FooBar: {FooBar: {FooBar: boolean}}}>(
	camelcaseKeys(
		{'foo-bar': {foo_bar: {'foo bar': true}}},
		{deep: true, pascalCase: true}
	)
);

expectType<{[key in 'fooBar' | 'foo_bar']: boolean}>(
	camelcaseKeys(
		{'foo-bar': true, foo_bar: true},
		{exclude: ['foo', 'foo_bar', /bar/] as const}
	)
);

expectType<{fooBar: boolean}>(
	camelcaseKeys({'foo-bar': true}, {stopPaths: ['foo']})
);

expectType<Record<string, string>>(
	camelcaseKeys({} as Record<string, string>)
);

expectType<Record<string, string>>(
	camelcaseKeys({} as Record<string, string>, {deep: true})
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
