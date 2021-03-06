import { createStore } from '@biscuit-store/core';

export const testStore = (name, value = 0) => {
	const { store, actions } = createStore({
		name,
		initial: { value },
		actions: {
			add: 'add/action',
			remove: 'remove/action',
		},
		strictMode: false,
	});

	return {
		store,
		add: actions.add,
		remove: actions.remove,
	};
};