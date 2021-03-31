import { createStore } from '@biscuit-store/core';

export const testStore = (name, adapter) => {
	const { store, actions } = createStore({
		name,
		initial: { value: 0 },
		actions: {
			add: 'add/action',
			step: 'step/action',
			remove: 'remove/action',
		},
		middleware: [adapter.connect],
		strictMode: false,
	});

	return {
		store,
		add: actions.add,
		step: actions.step,
		remove: actions.remove,
	};
};