import test from 'ava';
import camelcaseKeys from './';

test('camelcase keys', t => {
	t.ok(camelcaseKeys({'foo-bar': true}).fooBar);
	t.end();
});
