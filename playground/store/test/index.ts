import { createStore } from '../../../packages/biscuit-store';
import { adapter } from './adapter';

const { actions, store } = createStore({
    repo: {
        name: 'user',
        initial: { value: 0 },
    },
    states: {
        testAdd: 'test/add',
        testRemove: 'test/remove',
        testStep: {
            name: 'test/step',
            branch: true,
            initial: { name: '' },
        },
    },
    middleware: [adapter.connect],
});

export const testStore = store;
export const { testAdd, testRemove, testStep } = actions;