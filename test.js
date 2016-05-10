import test from 'ava';
import m from './';

test('main', t => {
	t.true(m({'foo-bar': true}).fooBar);
});

test('exclude', t => {
	t.true(m({'--': true}, {exclude: ['--']})['--']);
});
