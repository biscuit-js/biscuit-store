import { createStore } from '@biscuit-store/core';

const { actions, store } = createStore({
	name: 'test',
	initial: { value: 0, data: '', state: false, text: '' },
	actions: {
		start: 'start/action',
		step: 'step/action',
	},
});

export const testStore = store;
export const { start, step } = actions;