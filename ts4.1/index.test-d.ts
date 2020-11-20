import {expectType} from 'tsd';
import camelcaseKeys = require('..');

const fooBarObject = {'foo-bar': true};
const camelFooBarObject = camelcaseKeys(fooBarObject);
expectType<{ fooBar: boolean }>(camelFooBarObject);

const fooBarArray = [{'foo-bar': true}];
const camelFooBarArray = camelcaseKeys(fooBarArray);
expectType<{ fooBar: boolean }[]>(camelFooBarArray);

expectType<Array<{fooBar: true}>>(camelcaseKeys([{'foo-bar': true} as const]));

expectType<string[]>(camelcaseKeys(['name 1', 'name 2']));

expectType<string[]>(camelcaseKeys(['name 1', 'name 2'], {deep: true}));

expectType<{fooBar: true}>(camelcaseKeys({'foo-bar': true} as const));

let x = camelcaseKeys({'foo-bar': true}, { pascalCase: true });
expectType<{fooBar: true}>(
	camelcaseKeys({'foo-bar': true} as const, {deep: true}),
);

expectType<{FooBar: true}>(
	camelcaseKeys({'foo-bar': true} as const, {deep: true, pascalCase: true}),
);

expectType<{"foo-bar": true}>(
	camelcaseKeys({'foo-bar': true} as const, {exclude: ['foo', /bar/]}),
);

expectType<{fooBar: true}>(
	camelcaseKeys({'foo-bar': true} as const, {stopPaths: ['foo']}),
);

expectType<{fooBar: {'bar-baz': boolean}}>(
	camelcaseKeys({'foo-bar': {'bar-baz': true }}),
);

expectType<{fooBar: {barBaz: boolean}}>(
	camelcaseKeys({'foo-bar': {'bar-baz': true }}, { deep: true }),
);

expectType<{fooBar: {'bar-baz': boolean}}>(
	camelcaseKeys({'foo-bar': {'bar-baz': true }}, { deep: true, stopPaths: ['foo-bar'] as const }),
);

expectType<{foo: {bar: {'bar-baz': boolean}}}>(
	camelcaseKeys({'foo': {'bar': {'bar-baz': true }}}, { deep: true, stopPaths: ['foo.bar'] as const }),
);

expectType<{fooBar: {'bar-baz': boolean}}>(
	camelcaseKeys({'foo-bar': {'bar-baz': true }}, { deep: true, exclude: ['bar-baz'] as const }),
);

expectType<Record<string, string>>(
	camelcaseKeys({} as Record<string, string>),
);

expectType<Record<string, string>>(
	camelcaseKeys({} as Record<string, string>, { deep: true }),
);

interface SomeObject {
	someProperty: string;
}

const someObj: SomeObject = {
	someProperty: 'hello'
};

expectType<SomeObject>(camelcaseKeys(someObj));
expectType<SomeObject[]>(camelcaseKeys([someObj]));

type SomeTypeAlias = {
	someProperty: string;
}

const objectWithTypeAlias = {
	someProperty: 'this should also work'
};

expectType<SomeTypeAlias>(camelcaseKeys(objectWithTypeAlias));
expectType<SomeTypeAlias[]>(camelcaseKeys([objectWithTypeAlias]));
