import { createStore, container } from '@biscuit-store/core';
import { connect } from './adapter';

async function Test() {
	return await new Promise((resolve) => {
		setTimeout(() => {
			resolve({ initialData: 10 });
		}, 200);
	});
}

const { actions, store } = createStore({
	name: 'test',
	initial: { value: 0, data: 'start', state: false, text: '' },
	actions: {
		start: 'start/action',
		step: 'step/action',
		fetch: 'fetch/action',
	},
	middleware: [connect],
	initialCall: Test,
});

container.include(actions);

export const testStore = store;
export const { start, step } = actions;