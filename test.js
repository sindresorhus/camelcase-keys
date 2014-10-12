'use strict';
var test = require('ava');
var camelcaseKeys = require('./');

test(function (t) {
	t.assert(camelcaseKeys({'foo-bar': true}).fooBar);
	t.end();
});
