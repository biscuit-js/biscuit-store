import { createStore } from '../../biscuit-store';

export const testStore = (name, adapter) => {
    const { store, actions } = createStore({
        name,
        initial: { value: 0 },
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