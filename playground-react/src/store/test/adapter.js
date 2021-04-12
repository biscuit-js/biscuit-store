import { createAdapter } from '@biscuit-store/adapter';
import { container } from '@biscuit-store/core';

const { action, connect, includeContext, all } = createAdapter();

const fn1 = async ({ payload }) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({ ...payload, type: 1 });
		}, 100);
	});
};

const fn2 = async ({ payload }) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({ ...payload, type: 2 });
		}, 200);
	});
};

includeContext(({ store }) => container.extract(store));

action('step/action', ({ payload, state, fetch }) => {
	fetch.dispatch({ input: payload.value });
	return { ...state, ...payload };
});

all(
	'fetch/action',
	(result) => {
		// eslint-disable-next-line no-console
		console.log('fetch', result);
		return {};
	},
	[fn1, fn2]
);

export { connect };