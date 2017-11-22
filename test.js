import test from 'ava';
import m from '.';

test('main', t => {
	t.true(m({'foo-bar': true}).fooBar);
});

test('exclude option', t => {
	t.true(m({'--': true}, {exclude: ['--']})['--']);
	t.deepEqual(m({'foo-bar': true}, {exclude: [/^f/]}), {'foo-bar': true});
});

test('deep option', t => {
	t.deepEqual(
		// eslint-disable-next-line camelcase
		m({foo_bar: true, obj: {one_two: false, arr: [{three_four: true}]}}, {deep: true}),
		{fooBar: true, obj: {oneTwo: false, arr: [{threeFour: true}]}}
	);
});

test('accepts an array of objects', t => {
	t.deepEqual(
		// eslint-disable-next-line camelcase
		m([{foo_bar: true}, {bar_foo: false}, {'bar-foo': 'false'}]),
		[{fooBar: true}, {barFoo: false}, {barFoo: 'false'}]
	);
});

test('deep array of objects', t => {
	t.deepEqual(
		// eslint-disable-next-line camelcase
		m({Prop: [{foo_bar: [{one_two: false}]}, {bar_foo: false}, {'bar-foo': 'false'}]}, {deep: true}),
		{prop: [{fooBar: [{oneTwo: false}]}, {barFoo: false}, {barFoo: 'false'}]}
	);
});
