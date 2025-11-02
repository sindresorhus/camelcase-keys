import process from 'node:process';
import {promisify} from 'node:util';
import {execFile} from 'node:child_process';
import test from 'ava';
import camelcaseKeys from './index.js';

const execFilePromise = promisify(execFile);

test('main', t => {
	t.true(camelcaseKeys({'foo-bar': true}).fooBar);
});

test('exclude option', t => {
	t.true(camelcaseKeys({'--': true}, {exclude: ['--']})['--']);
	t.deepEqual(camelcaseKeys({'foo-bar': true}, {exclude: [/^f/]}), {'foo-bar': true});
});

test('deep option', t => {
	t.deepEqual(
		// eslint-disable-next-line camelcase
		camelcaseKeys({foo_bar: true, obj: {one_two: false, arr: [{three_four: true}]}}, {deep: true}),
		{fooBar: true, obj: {oneTwo: false, arr: [{threeFour: true}]}},
	);
});

test('stopPaths option', t => {
	t.deepEqual(
		// eslint-disable-next-line camelcase
		camelcaseKeys({foo_bar: true, obj: {one_two: false, arr: [{three_four: true}]}}, {deep: true, stopPaths: ['obj']}),
		// eslint-disable-next-line camelcase
		{fooBar: true, obj: {one_two: false, arr: [{three_four: true}]}},
	);

	t.deepEqual(
		// eslint-disable-next-line camelcase
		camelcaseKeys({foo_bar: true, obj: {one_two: false, arr: [{three_four: true}]}}, {deep: true, stopPaths: ['obj.arr']}),
		// eslint-disable-next-line camelcase
		{fooBar: true, obj: {oneTwo: false, arr: [{three_four: true}]}},
	);

	t.deepEqual(
		// eslint-disable-next-line camelcase
		camelcaseKeys({q_w_e: [[{foo_bar: 1}, {one_two: 2}, {foo_bar: 3, one_two: 4}]]}, {deep: true, stopPaths: ['q_w_e.foo_bar']}),
		{qWE: [[{fooBar: 1}, {oneTwo: 2}, {fooBar: 3, oneTwo: 4}]]},
	);

	t.deepEqual(
		// eslint-disable-next-line camelcase
		camelcaseKeys({a_b: 1, a_c: {c_d: 1, c_e: {e_f: 1}}}, {deep: true, stopPaths: ['a_c.c_e']}),
		// eslint-disable-next-line camelcase
		{aB: 1, aC: {cD: 1, cE: {e_f: 1}}},
	);
});

test('stopPaths works with arrays', t => {
	// Issue #65: stopPaths should work across array boundaries
	t.deepEqual(
		camelcaseKeys({
			foo: [
				{
					bar: {
						// eslint-disable-next-line camelcase
						baz_qux: 'value',
					},
				},
			],
		}, {deep: true, stopPaths: ['foo.bar']}),
		{
			foo: [
				{
					bar: {
						// eslint-disable-next-line camelcase
						baz_qux: 'value',
					},
				},
			],
		},
	);

	// StopPaths applies to all items in the array
	t.deepEqual(
		camelcaseKeys({
			// eslint-disable-next-line camelcase
			my_items: [
				// eslint-disable-next-line camelcase
				{nested_obj: {deep_value: 1}},
				// eslint-disable-next-line camelcase
				{nested_obj: {deep_value: 2}},
			],
		}, {deep: true, stopPaths: ['my_items.nested_obj']}),
		{
			myItems: [
				// eslint-disable-next-line camelcase
				{nestedObj: {deep_value: 1}},
				// eslint-disable-next-line camelcase
				{nestedObj: {deep_value: 2}},
			],
		},
	);

	// Top-level arrays work consistently with nested arrays
	t.deepEqual(
		camelcaseKeys([
			{
				// eslint-disable-next-line camelcase
				user_name: 'john',
				// eslint-disable-next-line camelcase
				user_meta: {
					// eslint-disable-next-line camelcase
					created_at: '2023',
				},
			},
			{
				// eslint-disable-next-line camelcase
				user_name: 'jane',
				// eslint-disable-next-line camelcase
				user_meta: {
					// eslint-disable-next-line camelcase
					created_at: '2024',
				},
			},
		], {deep: true, stopPaths: ['user_meta']}),
		[
			{
				userName: 'john',
				userMeta: {
					// eslint-disable-next-line camelcase
					created_at: '2023',
				},
			},
			{
				userName: 'jane',
				userMeta: {
					// eslint-disable-next-line camelcase
					created_at: '2024',
				},
			},
		],
	);
});

test('preserveConsecutiveUppercase option only', t => {
	// eslint-disable-next-line camelcase
	t.true(camelcaseKeys({new_foo_BAR: true}, {preserveConsecutiveUppercase: true}).newFooBAR);
});

test('preserveConsecutiveUppercase and deep options', t => {
	t.deepEqual(
		// eslint-disable-next-line camelcase
		camelcaseKeys({p_FOO_bar: true, p_obj: {p_two: false, p_arr: [{p_THREE_four: true}]}}, {deep: true, preserveConsecutiveUppercase: true}),
		{pFOOBar: true, pObj: {pTwo: false, pArr: [{pTHREEFour: true}]}},
	);
});

test('pascalCase option only', t => {
	t.true(camelcaseKeys({'new-foo-bar': true}, {pascalCase: true}).NewFooBar);
});

test('pascalCase and deep options', t => {
	t.deepEqual(
		// eslint-disable-next-line camelcase
		camelcaseKeys({p_foo_bar: true, p_obj: {p_two: false, p_arr: [{p_three_four: true}]}}, {deep: true, pascalCase: true}),
		{PFooBar: true, PObj: {PTwo: false, PArr: [{PThreeFour: true}]}},
	);
});

test('handles nested arrays', t => {
	t.deepEqual(
		// eslint-disable-next-line camelcase
		camelcaseKeys({q_w_e: [['a', 'b']]}, {deep: true}),
		{qWE: [['a', 'b']]},
	);
});

test('accepts an array of objects', t => {
	t.deepEqual(
		// eslint-disable-next-line camelcase
		camelcaseKeys([{foo_bar: true}, {bar_foo: false}, {'bar-foo': 'false'}]),
		[{fooBar: true}, {barFoo: false}, {barFoo: 'false'}],
	);
});

test('different pascalCase option values', t => {
	// eslint-disable-next-line camelcase
	t.true(camelcaseKeys({foo_bar_UPPERCASE: true}).fooBarUppercase);
	// eslint-disable-next-line camelcase
	t.true(camelcaseKeys({foo_bar_UPPERCASE: true}, {pascalCase: true}).FooBarUppercase);

	t.deepEqual(
		camelcaseKeys({'p-foo-bar': true, 'p-obj': {'p-two': false, 'p-arr': [{'p-three-four': true}]}}, {deep: true, pascalCase: true}),
		{PFooBar: true, PObj: {PTwo: false, PArr: [{PThreeFour: true}]}},
	);
	t.deepEqual(
		camelcaseKeys({'p-foo-bar': true, 'p-obj': {'p-two': false, 'p-arr': [{'p-three-four': true}]}}, {deep: true}),
		{pFooBar: true, pObj: {pTwo: false, pArr: [{pThreeFour: true}]}},
	);
});

test('handle array of non-objects', t => {
	const input = ['name 1', 'name 2'];
	t.deepEqual(
		camelcaseKeys(input),
		input,
	);
});

test('handle array of non-objects with `deep` option', t => {
	const input = ['name 1', 'name 2'];
	t.deepEqual(
		camelcaseKeys(input, {deep: true}),
		input,
	);
});

test('handle null and undefined inputs gracefully', t => {
	// These should not throw errors and should return the input as-is
	t.is(camelcaseKeys(null), null);
	t.is(camelcaseKeys(undefined), undefined);
	t.is(camelcaseKeys(123), 123);
	t.is(camelcaseKeys('hello'), 'hello');
	t.is(camelcaseKeys(true), true);
	t.is(camelcaseKeys(false), false);

	// With options
	t.is(camelcaseKeys(null, {deep: true}), null);
	t.is(camelcaseKeys(undefined, {deep: true}), undefined);
	t.is(camelcaseKeys(123, {pascalCase: true}), 123);
	t.is(camelcaseKeys('hello', {deep: true}), 'hello');

	// Arrays with mixed null/undefined values
	// eslint-disable-next-line camelcase
	const mixedArray = [null, undefined, 'string', 123, true, {snake_case: 'value'}];
	const expected = [null, undefined, 'string', 123, true, {snakeCase: 'value'}];
	t.deepEqual(camelcaseKeys(mixedArray), expected);
	t.deepEqual(camelcaseKeys(mixedArray, {deep: true}), expected);
});

test('handle circular references', t => {
	// Simple self-reference
	const simple = {};
	simple.self = simple;

	const simpleResult = camelcaseKeys(simple, {deep: true});
	t.is(simpleResult.self, simpleResult);

	// With key transformation
	// eslint-disable-next-line camelcase
	const withSnakeCase = {some_key: 'value'};
	// eslint-disable-next-line camelcase
	withSnakeCase.self_ref = withSnakeCase;

	const snakeResult = camelcaseKeys(withSnakeCase, {deep: true});
	t.is(snakeResult.someKey, 'value');
	t.is(snakeResult.selfRef, snakeResult);

	// Nested circular reference
	// eslint-disable-next-line camelcase
	const nested = {outer_key: {inner_key: 'value'}};
	// eslint-disable-next-line camelcase
	nested.outer_key.back_ref = nested;

	const nestedResult = camelcaseKeys(nested, {deep: true});
	t.is(nestedResult.outerKey.innerKey, 'value');
	t.is(nestedResult.outerKey.backRef, nestedResult);

	// Multiple circular references
	const object1 = {name: 'object1'};
	const object2 = {name: 'object2'};
	// eslint-disable-next-line camelcase
	object1.other_obj = object2;
	// eslint-disable-next-line camelcase
	object2.other_obj = object1;
	// eslint-disable-next-line camelcase
	object1.self_ref = object1;

	const multiResult1 = camelcaseKeys(object1, {deep: true});
	const multiResult2 = multiResult1.otherObj;
	t.is(multiResult1.name, 'object1');
	t.is(multiResult2.name, 'object2');
	t.is(multiResult1.selfRef, multiResult1);
	t.is(multiResult2.otherObj, multiResult1);

	// Circular reference in array
	// eslint-disable-next-line camelcase
	const arrayCircular = {some_items: []};
	arrayCircular.some_items.push(arrayCircular);

	const arrayResult = camelcaseKeys(arrayCircular, {deep: true});
	t.is(arrayResult.someItems[0], arrayResult);

	// Without deep option should not cause issues
	const shallowCircular = {};
	shallowCircular.self = shallowCircular;

	t.notThrows(() => {
		const result = camelcaseKeys(shallowCircular, {deep: false});
		t.is(result.self, shallowCircular); // Points to original, not transformed
	});
});

test('use locale independent camel-case transformation', async t => {
	const input = {'user-id': 123};
	t.deepEqual(
		// Execute the library with Turkish locale.
		// A locale dependent implementation would return `{userİd: 123}`.
		// See https://github.com/sindresorhus/camelcase-keys/issues/81
		await runInTestProcess([input], {env: {...process.env, LC_ALL: 'tr'}}),
		{userId: 123},
	);
});

test('do not deep convert built-in types', t => {
	const date = new Date('2024-01-01');
	const regex = /test/;
	const typedArray = new Uint8Array([1, 2, 3]);

	// eslint-disable-next-line camelcase
	const result = camelcaseKeys({foo_date: date, foo_regex: regex, foo_buffer: typedArray}, {deep: true});

	t.is(result.fooDate, date);
	t.is(result.fooRegex, regex);
	t.is(result.fooBuffer, typedArray);
});

test('deep convert custom class instances', t => {
	class CustomClass {
		constructor() {
			// eslint-disable-next-line camelcase
			this.foo_bar = 'value';
		}
	}

	// eslint-disable-next-line camelcase
	const result = camelcaseKeys({my_obj: new CustomClass()}, {deep: true});

	t.is(result.myObj.fooBar, 'value');
});

test('preserve numeric string keys', t => {
	// Float strings should be preserved (issue #68)
	// eslint-disable-next-line @stylistic/quote-props
	t.deepEqual(camelcaseKeys({'4.2': 'foo'}), {'4.2': 'foo'});

	// Integer strings should be preserved
	// eslint-disable-next-line @stylistic/quote-props
	t.deepEqual(camelcaseKeys({'42': 'foo'}), {'42': 'foo'});

	// Negative numbers should be preserved
	t.deepEqual(
		camelcaseKeys({'-42': 'foo', '-4.2': 'bar'}),
		{'-42': 'foo', '-4.2': 'bar'},
	);

	// Scientific notation should be preserved
	t.deepEqual(
		camelcaseKeys({'1e5': 'foo'}),
		{'1e5': 'foo'},
	);

	// Special numeric values should be preserved
	t.deepEqual(
		camelcaseKeys({Infinity: 'foo'}),
		{Infinity: 'foo'},
	);

	// Keys starting with numbers but containing non-numeric characters should be transformed
	t.deepEqual(
		camelcaseKeys({'42-foo': 'value'}),
		{'42Foo': 'value'},
	);

	// With deep option
	// eslint-disable-next-line camelcase, @stylistic/quote-props
	t.deepEqual(camelcaseKeys({foo_bar: {'4.2': 'nested'}}, {deep: true}), {fooBar: {'4.2': 'nested'}});

	// In arrays
	// eslint-disable-next-line @stylistic/quote-props
	t.deepEqual(camelcaseKeys([{'4.2': 'foo'}, {42: 'bar'}]), [{'4.2': 'foo'}, {42: 'bar'}]);
});

test('preserve leading underscores and dollar signs', t => {
	// Single leading underscore
	t.deepEqual(camelcaseKeys({_name: true}), {_name: true});
	// eslint-disable-next-line camelcase
	t.deepEqual(camelcaseKeys({_name_obj: 'value'}), {_nameObj: 'value'});
	// eslint-disable-next-line camelcase
	t.deepEqual(camelcaseKeys({_foo_bar: true}), {_fooBar: true});

	// Single leading dollar sign
	// eslint-disable-next-line camelcase
	t.deepEqual(camelcaseKeys({$foo_bar: true}), {$fooBar: true});
	t.deepEqual(camelcaseKeys({$element: true}), {$element: true});

	// Multiple leading underscores
	// eslint-disable-next-line camelcase
	t.deepEqual(camelcaseKeys({__foo_bar: 'value'}), {__fooBar: 'value'});
	// eslint-disable-next-line camelcase
	t.deepEqual(camelcaseKeys({___foo_bar: 'value'}), {___fooBar: 'value'});

	// Multiple leading dollar signs
	// eslint-disable-next-line camelcase
	t.deepEqual(camelcaseKeys({$$foo_bar: 'value'}), {$$fooBar: 'value'});

	// Mixed leading characters
	// eslint-disable-next-line camelcase
	t.deepEqual(camelcaseKeys({$_foo_bar: 'value'}), {$_fooBar: 'value'});
	// eslint-disable-next-line camelcase
	t.deepEqual(camelcaseKeys({_$foo_bar: 'value'}), {_$fooBar: 'value'});
	// eslint-disable-next-line camelcase
	t.deepEqual(camelcaseKeys({__$foo_bar: 'value'}), {__$fooBar: 'value'});

	// With pascalCase option
	// eslint-disable-next-line camelcase
	t.deepEqual(camelcaseKeys({_foo_bar: true}, {pascalCase: true}), {_FooBar: true});
	// eslint-disable-next-line camelcase
	t.deepEqual(camelcaseKeys({$foo_bar: true}, {pascalCase: true}), {$FooBar: true});

	// With deep option
	t.deepEqual(
		// eslint-disable-next-line camelcase
		camelcaseKeys({_outer_key: {$inner_key: 'value'}}, {deep: true}),
		{_outerKey: {$innerKey: 'value'}},
	);

	// In arrays
	t.deepEqual(
		// eslint-disable-next-line camelcase
		camelcaseKeys([{_foo_bar: true}, {$bar_foo: false}]),
		[{_fooBar: true}, {$barFoo: false}],
	);

	// With preserveConsecutiveUppercase option
	// eslint-disable-next-line camelcase
	t.deepEqual(camelcaseKeys({_foo_BAR: true}, {preserveConsecutiveUppercase: true}), {_fooBAR: true});
	// eslint-disable-next-line camelcase
	t.deepEqual(camelcaseKeys({$foo_BAR: true}, {preserveConsecutiveUppercase: true}), {$fooBAR: true});
});

/**
Executes the library with the given arguments and resolves with the parsed result.

Input and output is serialized via `JSON.stringify()` and `JSON.parse()`.
*/
const runInTestProcess = async (camelcaseKeysArgs, childProcessOptions = {}) => {
	const {stdout, stderr} = await execFilePromise(
		process.execPath,
		['./fixtures/child-process-for-test.js', JSON.stringify(camelcaseKeysArgs)],
		childProcessOptions,
	);

	if (stderr) {
		throw new Error(stderr);
	}

	try {
		return JSON.parse(stdout);
	} catch (error) {
		error.message = `Error parsing "${stdout}" as JSON: ${error.message}`;
		throw error;
	}
};
