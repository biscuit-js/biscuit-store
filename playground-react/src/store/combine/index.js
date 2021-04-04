import { createStore } from '@biscuit-store/core';

export const { actions, store } = createStore({
	name: 'combine',
	initial: { value: 0, data: 0 },
	combineActions: {
		first: (state) => {
			state.value += 1;
		},
		last: (state) => {
			state.value -= 1;
		},
	},
});

store.subscribe((current) => {
	// eslint-disable-next-line no-console
	console.log(current);
});
