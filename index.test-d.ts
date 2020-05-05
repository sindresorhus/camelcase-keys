import {expectType} from 'tsd';
import camelcaseKeys = require('.');


// Imagine our API responds with
// data that is snake_cased.
interface AnalyticsEventResponse {
	path: string;
	num_visits: number;
}

// On the client side, we might
// extend the interface whereby
// the keys are all camelized.
interface AnalyticsEvent extends Pick<AnalyticsEventResponse, 'path'> {
	numVisits: number;
}

const analyticsEventFromServer = {path: "/about", num_visits: 200};
const camelCasedAnalyticsEvent = camelcaseKeys<AnalyticsEvent>(analyticsEventFromServer);
expectType<AnalyticsEvent>(camelCasedAnalyticsEvent);

const analyticsEventsArray = [{path: "/about", num_visits: 24}, {path:"/pricing", numVisits: 100}];
const camelCasedEventsArray = camelcaseKeys<AnalyticsEvent[]>(analyticsEventsArray);
expectType<AnalyticsEvent[]>(camelCasedEventsArray);

expectType<Array<{[key in 'foo-bar']: true}>>(camelcaseKeys([{'foo-bar': true}]));

expectType<string[]>(camelcaseKeys(['name 1', 'name 2']));

expectType<string[]>(camelcaseKeys(['name 1', 'name 2'], {deep: true}));

expectType<{[key in 'foo-bar']: true}>(camelcaseKeys({'foo-bar': true}));

expectType<{[key in 'foo-bar']: true}>(
	camelcaseKeys({'foo-bar': true}, {deep: true}),
);

expectType<{[key in 'foo-bar']: true}>(
	camelcaseKeys({'foo-bar': true}, {deep: true, pascalCase: true}),
);

expectType<{[key in 'foo-bar']: true}>(
	camelcaseKeys({'foo-bar': true}, {exclude: ['foo', /bar/]}),
);

expectType<{[key in 'foo-bar']: true}>(
	camelcaseKeys({'foo-bar': true}, {stopPaths: ['foo']}),
);

interface SomeObject {
	someProperty: string;
}

const someObj: SomeObject = {
	someProperty: 'hello'
};

expectType<SomeObject>(camelcaseKeys(someObj));
expectType<SomeObject[]>(camelcaseKeys([someObj]));

type SomeTypeAlias = {
	someProperty: string;
}

const objectWithTypeAlias = {
	someProperty: 'this should also work'
};

expectType<SomeTypeAlias>(camelcaseKeys(objectWithTypeAlias));
expectType<SomeTypeAlias[]>(camelcaseKeys([objectWithTypeAlias]));
