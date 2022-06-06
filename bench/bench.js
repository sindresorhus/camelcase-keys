/* globals bench suite set */
import camelcaseKeysNpm from 'camelcase-keys';
import camelcaseKeys from '../index.js';
import fixture from './fixture.js';

suite('camelcaseKeys', () => {
	set('mintime', 1000);

	bench('npm', () => {
		camelcaseKeysNpm(fixture, {deep: true});
	});

	bench('master', () => {
		camelcaseKeys(fixture, {deep: true});
	});
});
