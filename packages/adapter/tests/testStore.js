import { createStore } from '@biscuit-store/core';

export const testStore = (name, adapter) => {
    const { store, actions } = createStore({
        repo: {
            name,
            initial: { value: 0 },
        },
        states: {
            add: 'add/action',
            remove: 'remove/action',
        },
        middleware: [adapter.connect],
        strictMode: false,
    });

    return {
        store,
        add: actions.add,
        remove: actions.remove,
    };
};