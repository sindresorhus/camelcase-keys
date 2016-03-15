import test from 'ava';
import fn from './';

test(t => {
	t.true(fn({'foo-bar': true}).fooBar);
});

test('exclude', t => {
	t.true(fn({'--': true}, ['--'])['--']);
});
