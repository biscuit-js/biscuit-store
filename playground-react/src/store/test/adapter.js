import { createAdapter } from '@biscuit-store/adapter';
import { container } from '@biscuit-store/core';

const { action, connect, includeContext } = createAdapter();

includeContext(() => container.extract('test'));

action('step/action', ({ payload, state, fetch }) => {
	fetch.dispatch({ input: payload.value });
	return { ...state, ...payload };
});

action('fetch/action', ({ payload, state }) => {
	// eslint-disable-next-line no-console
	console.log(state);
	return {};
});

export { connect };