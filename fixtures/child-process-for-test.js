'use strict';
const camelcaseKeys = require('.');

const camelcaseKeysArgs = JSON.parse(process.argv[2]);

console.log(JSON.stringify(camelcaseKeys(...camelcaseKeysArgs)));
