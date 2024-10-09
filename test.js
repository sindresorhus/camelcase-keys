import process from 'node:process';
import {promisify} from 'node:util';
import {execFile} from 'node:child_process';
import {Buffer} from 'node:buffer';
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

test('do not deep convert data', t => {
	const input = {foo: Buffer.from('foo')};
	t.true(camelcaseKeys(input, {deep: true}).foo instanceof Uint8Array);
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
