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

test('excludePaths option', t => {
	t.deepEqual(
		// eslint-disable-next-line camelcase
		camelcaseKeys({foo_bar: true, obj: {one_two: false, arr: [{three_four: true}]}}, {deep: true, excludePaths: ['foo_bar', 'obj.arr.three_four']}),
		// eslint-disable-next-line camelcase
		{foo_bar: true, obj: {oneTwo: false, arr: [{three_four: true}]}}
	);

	t.deepEqual(
		// eslint-disable-next-line camelcase
		camelcaseKeys({q_w_e: [[{foo_bar: 1}, {one_two: 2}, {foo_bar: 3, one_two: 4}]]}, {deep: true, excludePaths: ['q_w_e.foo_bar']}),
		// eslint-disable-next-line camelcase
		{qWE: [[{foo_bar: 1}, {oneTwo: 2}, {foo_bar: 3, oneTwo: 4}]]}
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
