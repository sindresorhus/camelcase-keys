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
