import { createStore } from '@biscuit-store/core';

export const testStore = (name, adapter) => {
    const { store, actions } = createStore({
        repo: {
            name,
            initial: { value: 0 },
        },
        actions: {
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