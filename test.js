import test from 'ava';
import camelcaseKeys from '.';

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
		{fooBar: true, obj: {oneTwo: false, arr: [{threeFour: true}]}}
	);
});

test('stopPaths option', t => {
	t.deepEqual(
		// eslint-disable-next-line camelcase
		camelcaseKeys({foo_bar: true, obj: {one_two: false, arr: [{three_four: true}]}}, {deep: true, stopPaths: ['obj']}),
		// eslint-disable-next-line camelcase
		{fooBar: true, obj: {one_two: false, arr: [{three_four: true}]}}
	);

	t.deepEqual(
		// eslint-disable-next-line camelcase
		camelcaseKeys({foo_bar: true, obj: {one_two: false, arr: [{three_four: true}]}}, {deep: true, stopPaths: ['obj.arr']}),
		// eslint-disable-next-line camelcase
		{fooBar: true, obj: {oneTwo: false, arr: [{three_four: true}]}}
	);

	t.deepEqual(
		// eslint-disable-next-line camelcase
		camelcaseKeys({q_w_e: [[{foo_bar: 1}, {one_two: 2}, {foo_bar: 3, one_two: 4}]]}, {deep: true, stopPaths: ['q_w_e.foo_bar']}),
		{qWE: [[{fooBar: 1}, {oneTwo: 2}, {fooBar: 3, oneTwo: 4}]]}
	);

	t.deepEqual(
		// eslint-disable-next-line camelcase
		camelcaseKeys({a_b: 1, a_c: {c_d: 1, c_e: {e_f: 1}}}, {deep: true, stopPaths: ['a_c.c_e']}),
		// eslint-disable-next-line camelcase
		{aB: 1, aC: {cD: 1, cE: {e_f: 1}}}
	);
});

test('pascalCase option only', t => {
	t.true(camelcaseKeys({'new-foo-bar': true}, {pascalCase: true}).NewFooBar);
});

test('pascalCase and deep options', t => {
	t.deepEqual(
		// eslint-disable-next-line camelcase
		camelcaseKeys({p_foo_bar: true, p_obj: {p_two: false, p_arr: [{p_three_four: true}]}}, {deep: true, pascalCase: true}),
		{PFooBar: true, PObj: {PTwo: false, PArr: [{PThreeFour: true}]}}
	);
});

test('handles nested arrays', t => {
	t.deepEqual(
		// eslint-disable-next-line camelcase
		camelcaseKeys({q_w_e: [['a', 'b']]}, {deep: true}),
		{qWE: [['a', 'b']]}
	);
});

test('accepts an array of objects', t => {
	t.deepEqual(
		// eslint-disable-next-line camelcase
		camelcaseKeys([{foo_bar: true}, {bar_foo: false}, {'bar-foo': 'false'}]),
		[{fooBar: true}, {barFoo: false}, {barFoo: 'false'}]
	);
});

test('different pascalCase option values', t => {
	// eslint-disable-next-line camelcase
	t.true(camelcaseKeys({foo_bar_UPPERCASE: true}).fooBarUppercase);
	// eslint-disable-next-line camelcase
	t.true(camelcaseKeys({foo_bar_UPPERCASE: true}, {pascalCase: true}).FooBarUppercase);

	t.deepEqual(
		camelcaseKeys({'p-foo-bar': true, 'p-obj': {'p-two': false, 'p-arr': [{'p-three-four': true}]}}, {deep: true, pascalCase: true}),
		{PFooBar: true, PObj: {PTwo: false, PArr: [{PThreeFour: true}]}}
	);
	t.deepEqual(
		camelcaseKeys({'p-foo-bar': true, 'p-obj': {'p-two': false, 'p-arr': [{'p-three-four': true}]}}, {deep: true}),
		{pFooBar: true, pObj: {pTwo: false, pArr: [{pThreeFour: true}]}}
	);
});
