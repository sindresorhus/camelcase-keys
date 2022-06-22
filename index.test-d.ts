/* eslint-disable @typescript-eslint/naming-convention */
import {expectType, expectAssignable, expectNotType} from 'tsd';
import camelcaseKeys, {type CamelCaseKeys} from './index.js';

const fooBarObject = {'foo-bar': true};
const camelFooBarObject = camelcaseKeys(fooBarObject);
expectType<{fooBar: boolean}>(camelFooBarObject);

const fooBarArray = [{'foo-bar': true}];
const camelFooBarArray = camelcaseKeys(fooBarArray);
expectType<Array<{fooBar: boolean}>>(camelFooBarArray);

expectType<Array<{fooBar: boolean}>>(camelcaseKeys([{'foo-bar': true}]));

expectType<string[]>(camelcaseKeys(['name 1', 'name 2']));

expectType<string[]>(camelcaseKeys(['name 1', 'name 2'], {deep: true}));

expectType<readonly [{readonly fooBar: true}, {readonly fooBaz: true}]>(
	camelcaseKeys([{'foo-bar': true}, {'foo-baz': true}] as const),
);

expectType<{fooBar: boolean}>(camelcaseKeys({'foo-bar': true}));
expectType<{fooBar: boolean}>(camelcaseKeys({'--foo-bar': true}));
expectType<{fooBar: boolean}>(camelcaseKeys({foo_bar: true}));
expectType<{fooBar: boolean}>(camelcaseKeys({'foo bar': true}));

expectType<{readonly fooBar: true}>(camelcaseKeys({'foo-bar': true} as const));
expectType<{readonly fooBar: true}>(camelcaseKeys({'--foo-bar': true} as const));
expectType<{readonly fooBar: true}>(camelcaseKeys({foo_bar: true} as const));
expectType<{readonly fooBar: true}>(camelcaseKeys({'foo bar': true} as const));

expectType<{fooBar: {fooBar: {fooBar: boolean}}}>(
	camelcaseKeys({'foo-bar': {foo_bar: {'foo bar': true}}}, {deep: true}),
);

interface ObjectOrUndefined {
	foo_bar: {
		foo_bar:
		| {
			foo_bar: boolean;
		}
		| undefined;
	};
}

const objectOrUndefined: ObjectOrUndefined = {
	foo_bar: {
		foo_bar: {
			foo_bar: true,
		},
	},
};

expectType<{fooBar: {fooBar: {fooBar: boolean} | undefined}}>(
	camelcaseKeys(objectOrUndefined, {deep: true}),
);

expectType<{FooBar: boolean}>(
	camelcaseKeys({'foo-bar': true}, {pascalCase: true}),
);
expectType<{readonly FooBar: true}>(
	camelcaseKeys({'foo-bar': true} as const, {pascalCase: true}),
);
expectType<{FooBar: boolean}>(
	camelcaseKeys({'--foo-bar': true}, {pascalCase: true}),
);
expectType<{FooBar: boolean}>(
	camelcaseKeys({foo_bar: true}, {pascalCase: true}),
);
expectType<{FooBar: boolean}>(
	camelcaseKeys({'foo bar': true}, {pascalCase: true}),
);
expectType<{FooBar: {FooBar: {FooBar: boolean}}}>(
	camelcaseKeys(
		{'foo-bar': {foo_bar: {'foo bar': true}}},
		{deep: true, pascalCase: true},
	),
);

expectType<{fooBar: boolean; foo_bar: true}>(
	camelcaseKeys(
		{'foo-bar': true, foo_bar: true},
		{exclude: ['foo', 'foo_bar', /bar/] as const},
	),
);

expectType<{fooBar: boolean}>(
	camelcaseKeys({'foo-bar': true}, {stopPaths: ['foo']}),
);
expectType<{topLevel: {fooBar: {'bar-baz': boolean}}; fooFoo: boolean}>(
	camelcaseKeys(
		{'top-level': {'foo-bar': {'bar-baz': true}}, 'foo-foo': true},
		{deep: true, stopPaths: ['top-level.foo-bar'] as const},
	),
);

expectAssignable<Record<string, string>>(
	camelcaseKeys({} as Record<string, string>),
);

expectAssignable<Record<string, string>>(
	camelcaseKeys({} as Record<string, string>, {deep: true}),
);

interface SomeObject {
	someProperty: string;
}

const someObject: SomeObject = {
	someProperty: 'hello',
};

expectType<SomeObject>(camelcaseKeys(someObject));
expectType<SomeObject[]>(camelcaseKeys([someObject]));

type SomeTypeAlias = {
	someProperty: string;
};

const objectWithTypeAlias = {
	someProperty: 'this should also work',
};

expectType<SomeTypeAlias>(camelcaseKeys(objectWithTypeAlias));
expectType<SomeTypeAlias[]>(camelcaseKeys([objectWithTypeAlias]));

// Using exported type
expectType<CamelCaseKeys<typeof fooBarArray>>(camelFooBarArray);

const arrayItems = [{fooBar: true}, {fooBaz: true}] as const;
expectType<CamelCaseKeys<typeof arrayItems>>(camelcaseKeys(arrayItems));

expectType<CamelCaseKeys<{'foo-bar': boolean}>>(
	camelcaseKeys({'foo-bar': true}),
);
expectType<CamelCaseKeys<{'--foo-bar': boolean}>>(
	camelcaseKeys({'--foo-bar': true}),
);
expectType<CamelCaseKeys<{foo_bar: boolean}>>(
	camelcaseKeys({foo_bar: true}),
);
expectType<CamelCaseKeys<{'foo bar': boolean}>>(
	camelcaseKeys({'foo bar': true}),
);

expectType<CamelCaseKeys<{readonly 'foo-bar': true}>>(
	camelcaseKeys({'foo-bar': true} as const),
);
expectType<CamelCaseKeys<{readonly '--foo-bar': true}>>(
	camelcaseKeys({'--foo-bar': true} as const),
);
expectType<CamelCaseKeys<{readonly foo_bar: true}>>(
	camelcaseKeys({foo_bar: true} as const),
);
expectType<CamelCaseKeys<{readonly 'foo bar': true}>>(
	camelcaseKeys({'foo bar': true} as const),
);

const nestedItem = {'foo-bar': {foo_bar: {'foo bar': true}}};
expectType<CamelCaseKeys<typeof nestedItem, true>>(
	camelcaseKeys(nestedItem, {deep: true}),
);

expectType<CamelCaseKeys<ObjectOrUndefined, true>>(
	camelcaseKeys(objectOrUndefined, {deep: true}),
);

expectType<CamelCaseKeys<{'foo-bar': boolean}, false, true>>(
	camelcaseKeys({'foo-bar': true}, {pascalCase: true}),
);
expectType<CamelCaseKeys<{readonly 'foo-bar': true}, false, true>>(
	camelcaseKeys({'foo-bar': true} as const, {pascalCase: true}),
);
expectType<CamelCaseKeys<{'--foo-bar': boolean}, false, true>>(
	camelcaseKeys({'foo-bar': true}, {pascalCase: true}),
);
expectType<CamelCaseKeys<{foo_bar: boolean}, false, true>>(
	camelcaseKeys({'foo-bar': true}, {pascalCase: true}),
);
expectType<CamelCaseKeys<{'foo bar': boolean}, false, true>>(
	camelcaseKeys({'foo-bar': true}, {pascalCase: true}),
);
expectType<CamelCaseKeys<typeof nestedItem, true, true>>(
	camelcaseKeys(nestedItem, {deep: true, pascalCase: true}),
);

const data = {'foo-bar': true, foo_bar: true};
const exclude = ['foo', 'foo_bar', /bar/] as const;

expectType<CamelCaseKeys<typeof data, false, false, typeof exclude>>(
	camelcaseKeys(data, {exclude}),
);

const nonNestedWithStopPathData = {'foo-bar': true, foo_bar: true};
expectType<
CamelCaseKeys<typeof nonNestedWithStopPathData, false, false, ['foo']>
>(camelcaseKeys({'foo-bar': true}, {stopPaths: ['foo']}));
const nestedWithStopPathData = {
	'top-level': {'foo-bar': {'bar-baz': true}},
	'foo-foo': true,
};
const stopPaths = ['top-level.foo-bar'] as const;
expectType<
CamelCaseKeys<
	typeof nestedWithStopPathData,
true,
false,
// eslint-disable-next-line @typescript-eslint/ban-types
[],
	typeof stopPaths
>
>(camelcaseKeys(nestedWithStopPathData, {deep: true, stopPaths}));

expectAssignable<CamelCaseKeys<Record<string, string>>>(
	camelcaseKeys({} as Record<string, string>),
);

expectAssignable<CamelCaseKeys<Record<string, string>, true>>(
	camelcaseKeys({} as Record<string, string>, {deep: true}),
);

expectType<CamelCaseKeys<SomeObject>>(camelcaseKeys(someObject));
expectType<CamelCaseKeys<SomeObject[]>>(camelcaseKeys([someObject]));

expectType<CamelCaseKeys<SomeTypeAlias>>(camelcaseKeys(objectWithTypeAlias));
expectType<CamelCaseKeys<SomeTypeAlias[]>>(
	camelcaseKeys([objectWithTypeAlias]),
);

// Verify exported type `CamelcaseKeys`
// Mapping types and retaining properties of keys
// https://github.com/microsoft/TypeScript/issues/13224

type ObjectDataType = {
	foo_bar?: string;
	bar_baz?: string;
	baz: string;
};
type InvalidConvertedObjectDataType = {
	fooBar: string;
	barBaz: string;
	baz: string;
};
type ConvertedObjectDataType = {
	fooBar?: string;
	barBaz?: string;
	baz: string;
};

const objectInputData: ObjectDataType = {
	foo_bar: 'foo_bar',
	baz: 'baz',
};
expectType<ConvertedObjectDataType>(camelcaseKeys(objectInputData));
expectNotType<InvalidConvertedObjectDataType>(camelcaseKeys(objectInputData));

// Array
type ArrayDataType = ObjectDataType[];

const arrayInputData: ArrayDataType = [
	{
		foo_bar: 'foo_bar',
		baz: 'baz',
	},
];
expectType<ConvertedObjectDataType[]>(camelcaseKeys(arrayInputData));
expectNotType<InvalidConvertedObjectDataType[]>(camelcaseKeys(arrayInputData));

// Deep
type DeepObjectType = {
	foo_bar?: string;
	bar_baz?: string;
	baz: string;
	first_level: {
		foo_bar?: string;
		bar_baz?: string;
		second_level: {
			foo_bar: string;
			bar_baz?: string;
		};
	};
};
type InvalidConvertedDeepObjectDataType = {
	fooBar?: string;
	barBaz?: string;
	baz: string;
	first_level?: {
		fooBar?: string;
		barBaz?: string;
		second_level?: {
			fooBar: string;
			barBaz?: string;
		};
	};
};
type ConvertedDeepObjectDataType = {
	fooBar?: string;
	barBaz?: string;
	baz: string;
	firstLevel: {
		foo_bar?: string;
		bar_baz?: string;
		second_level: {
			foo_bar: string;
			bar_baz?: string;
		};
	};
};
const deepInputData: DeepObjectType = {
	foo_bar: 'foo_bar',
	baz: 'baz',
	first_level: {
		bar_baz: 'bar_baz',
		second_level: {
			foo_bar: 'foo_bar',
		},
	},
};
expectType<ConvertedDeepObjectDataType>(
	camelcaseKeys(deepInputData, {deep: false}),
);
expectNotType<InvalidConvertedDeepObjectDataType>(
	camelcaseKeys(deepInputData, {deep: false}),
);

// Exclude
type InvalidConvertedExcludeObjectDataType = {
	foo_bar?: string;
	bar_baz?: string;
	baz: string;
};
type ConvertedExcludeObjectDataType = {
	foo_bar?: string;
	barBaz?: string;
	baz: string;
};
const excludeInputData: ObjectDataType = {
	foo_bar: 'foo_bar',
	bar_baz: 'bar_baz',
	baz: 'baz',
};
expectType<ConvertedExcludeObjectDataType>(
	camelcaseKeys(excludeInputData, {
		exclude,
	}),
);
expectNotType<InvalidConvertedExcludeObjectDataType>(
	camelcaseKeys(excludeInputData, {
		exclude,
	}),
);

expectType<{
	funcFoo: () => 'foo';
	recordBar: {foo: string};
	promiseBaz: Promise<unknown>;
}>(
	camelcaseKeys({
		func_foo: () => 'foo',
		record_bar: {foo: 'bar'},
		promise_baz: new Promise(resolve => {
			resolve(true);
		}),
	}),
);

expectType<[
	() => 'foo',
	{foo: string},
	Promise<unknown>,
]>(
	camelcaseKeys([
		() => 'foo',
		{foo: 'bar'},
		new Promise(resolve => {
			resolve(true);
		}),
	]),
);
