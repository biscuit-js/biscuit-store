import { createAdapter } from '@biscuit-store/adapter';
import { container } from '@biscuit-store/core';

const { action, connect, includeContext, race } = createAdapter();

const fn1 = async ({ payload }) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(payload);
		}, 1000);
	});
};

const fn2 = async ({ payload }) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(payload);
		}, 2000);
	});
};

includeContext(() => container.extract('test'));

action('step/action', ({ payload, state, fetch }) => {
	fetch.dispatch({ input: payload.value });
	return { ...state, ...payload };
});

race(
	'fetch/action',
	(result) => {
		// eslint-disable-next-line no-console
		console.log(result);
		return {};
	},
	[fn1, fn2]
);

export { connect };