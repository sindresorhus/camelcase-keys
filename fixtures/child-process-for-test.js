import process from 'node:process';
import camelcaseKeys from '../index.js';

const camelcaseKeysArgs = JSON.parse(process.argv[2]);

console.log(JSON.stringify(camelcaseKeys(...camelcaseKeysArgs)));
